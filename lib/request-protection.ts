import { createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";

export function isSameOriginRequest(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export type RateDecision = {
  allowed: boolean;
  retryAfter: number;
  reason: "minute" | "day" | "capacity" | null;
  mode: "local" | "distributed";
  allowPaidProvider: boolean;
};

export const CHAT_RATE_POLICY = { minute: 30, day: 300, unknownMinute: 200, unknownDay: 2000 };
const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

// Both keys use the same Redis hash slot. One atomic script checks both windows
// before charging either; blocked attempts do not extend their expiry.
export const CHAT_RATE_SCRIPT = `
local minute = tonumber(redis.call('GET', KEYS[1]) or '0')
local day = tonumber(redis.call('GET', KEYS[2]) or '0')
if day >= tonumber(ARGV[2]) then
  return {0, math.max(1, redis.call('PTTL', KEYS[2])), 2}
end
if minute >= tonumber(ARGV[1]) then
  return {0, math.max(1, redis.call('PTTL', KEYS[1])), 1}
end
local m = redis.call('INCR', KEYS[1])
if m == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[3]) end
local d = redis.call('INCR', KEYS[2])
if d == 1 then redis.call('PEXPIRE', KEYS[2], ARGV[4]) end
return {1, 0, 0}
`;

type Environment = Record<string, string | undefined>;
type ProtectionOptions = {
  env?: () => Environment;
  fetcher?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
  capacity?: number;
  policy?: typeof CHAT_RATE_POLICY;
};

export function trustedVisitor(request: Request, env: Environment): string | null {
  // Never accept an arbitrary forwarded IP from a local/untrusted proxy.
  const ip = env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
  const version = ip && isIP(ip);
  if (!version) return null;
  return version === 6 ? new URL(`http://[${ip}]`).hostname : ip!;
}

function redisConfig(env: Environment) {
  try {
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN || !env.CHAT_RATE_LIMIT_SECRET || env.CHAT_RATE_LIMIT_SECRET.length < 32) return null;
    const url = new URL(env.UPSTASH_REDIS_REST_URL);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    return { url: url.origin, token: env.UPSTASH_REDIS_REST_TOKEN, secret: env.CHAT_RATE_LIMIT_SECRET };
  } catch { return null; }
}

function createLocalQuota(minuteLimit: number, dailyLimit: number, capacity: number) {
  const buckets = new Map<string, { minute: number; minuteEnd: number; day: number; dayEnd: number }>();
  return (key: string, now: number): RateDecision => {
    const base: RateDecision = { allowed: true, retryAfter: 0, reason: null, mode: "local", allowPaidProvider: false };
    for (const [id, bucket] of buckets) if (bucket.minuteEnd <= now && bucket.dayEnd <= now) buckets.delete(id);
    let bucket = buckets.get(key);
    if (!bucket && buckets.size >= capacity) return { ...base, allowed: false, retryAfter: 60, reason: "capacity" };
    if (!bucket) { bucket = { minute: 0, minuteEnd: now + MINUTE_MS, day: 0, dayEnd: now + DAY_MS }; buckets.set(key, bucket); }
    if (bucket.dayEnd <= now) { bucket.day = 0; bucket.dayEnd = now + DAY_MS; }
    if (bucket.minuteEnd <= now) { bucket.minute = 0; bucket.minuteEnd = now + MINUTE_MS; }
    if (bucket.day >= dailyLimit) return { ...base, allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.dayEnd - now) / 1000)), reason: "day" };
    if (bucket.minute >= minuteLimit) return { ...base, allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.minuteEnd - now) / 1000)), reason: "minute" };
    bucket.minute++; bucket.day++;
    return base;
  };
}

export function createChatProtection(options: ProtectionOptions = {}) {
  const { env = () => process.env, fetcher = fetch, now = Date.now, timeoutMs = 1500, capacity = 5000, policy = CHAT_RATE_POLICY } = options;
  const salt = randomBytes(32).toString("hex");
  const visitorQuota = createLocalQuota(policy.minute, policy.day, capacity);
  const unknownQuota = createLocalQuota(policy.unknownMinute, policy.unknownDay, 1);

  return async (request: Request): Promise<RateDecision> => {
    const settings = env();
    const ip = trustedVisitor(request, settings);
    const config = redisConfig(settings);
    // A stable private HMAC secret shares identities across server instances.
    // The process-local salt is used only when distributed settings are absent.
    const key = createHmac("sha256", config?.secret ?? salt).update(ip ?? "unknown").digest("hex");
    const local = (ip ? visitorQuota : unknownQuota)(key, now());
    if (!local.allowed) return local;
    if (!config) return local;

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Promise.race also bounds a stalled response body, not just HTTP headers.
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error("Rate limit timeout")); }, timeoutMs);
      });
      const remote = (async (): Promise<RateDecision> => {
        const response = await fetcher(config.url, {
          method: "POST", cache: "no-store", redirect: "error", signal: controller.signal,
          headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
          body: JSON.stringify(["EVAL", CHAT_RATE_SCRIPT, 2, `maceioia:chat:v1:{${key}}:minute`, `maceioia:chat:v1:{${key}}:day`, ip ? policy.minute : policy.unknownMinute, ip ? policy.day : policy.unknownDay, MINUTE_MS, DAY_MS]),
        });
        if (!response.ok) throw new Error("Rate limit unavailable");
        const payload: unknown = await response.json();
        const result = payload && typeof payload === "object" && "result" in payload ? payload.result : null;
        if (payload && typeof payload === "object" && "error" in payload) throw new Error("Rate limit error");
        if (!Array.isArray(result) || result.length !== 3 || !result.every(Number.isSafeInteger)) throw new Error("Invalid rate limit response");
        const [allowed, ttl, window] = result;
        if (!((allowed === 1 && ttl === 0 && window === 0) || (allowed === 0 && ttl > 0 && ttl <= DAY_MS && (window === 1 || window === 2)))) throw new Error("Invalid rate limit result");
        return { allowed: allowed === 1, retryAfter: Math.ceil(ttl / 1000), reason: window === 2 ? "day" : window === 1 ? "minute" : null, mode: "distributed", allowPaidProvider: allowed === 1 && ip !== null };
      })();
      return await Promise.race([remote, timeout]);
    } catch {
      // Do not log headers, tokens, identifiers, or the provider's response body.
      return local;
    } finally { clearTimeout(timer); }
  };
}

export const checkChatRate = createChatProtection();

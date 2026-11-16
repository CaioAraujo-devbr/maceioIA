import { createHash, randomBytes } from "node:crypto";
import { isIP } from "node:net";

/** Per-instance protection; a distributed limit/WAF is still needed at scale. */
export function createRateLimiter(limit = 30, windowMs = 60_000, capacity = 5_000) {
  const buckets = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()) => {
    for (const [id, bucket] of buckets) if (bucket.expires <= now) buckets.delete(id);
    const current = buckets.get(key);
    if (!current && buckets.size >= capacity) return { allowed: false, retryAfter: Math.max(1, Math.ceil(windowMs / 1000)) };
    const bucket = current ?? { count: 0, expires: now + windowMs };
    buckets.set(key, bucket);
    if (bucket.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.expires - now) / 1000)) };
    bucket.count++;
    return { allowed: true, retryAfter: 0 };
  };
}

export function isSameOriginRequest(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

const salt = randomBytes(16).toString("hex");
const limitVisitor = createRateLimiter();
const limitUnknown = createRateLimiter(200);

export function checkChatRate(request: Request) {
  // Only trust the forwarded IP that Vercel overwrites on its own platform.
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
  if (!ip || !isIP(ip)) return limitUnknown("unknown");
  return limitVisitor(createHash("sha256").update(salt + ip).digest("hex"));
}

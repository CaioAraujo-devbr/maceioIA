const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load-ts.cjs');
const { createChatProtection, trustedVisitor } = load('lib/request-protection.ts');
const { limitReply, MAX_REPLY_LENGTH } = load('lib/chat-limits.ts');
const settings = { VERCEL: '1', UPSTASH_REDIS_REST_URL: 'https://redis.example.com', UPSTASH_REDIS_REST_TOKEN: 'mock-token', CHAT_RATE_LIMIT_SECRET: 'a'.repeat(64) };
const req = (ip = '203.0.113.7') => new Request('https://maceio.example.com/api/chat', { headers: { 'x-vercel-forwarded-for': ip, 'x-forwarded-for': ip } });
const json = (result) => new Response(JSON.stringify({ result }));
const policy = { minute: 2, day: 3, unknownMinute: 2, unknownDay: 3 };

test('identidade: ignora headers fora da Vercel e IPs inválidos/encadeados', () => {
  assert.equal(trustedVisitor(req(), {}), null);
  for (const ip of ['unknown', '1.2.3.4, 5.6.7.8', '999.1.2.3', '']) assert.equal(trustedVisitor(req(ip), settings), null);
  assert.equal(trustedVisitor(req('2001:0db8:0:0:0:0:0:1'), settings), trustedVisitor(req('2001:db8::1'), settings));
});
test('sem configuração: nenhuma chamada externa e nenhum caminho pago liberado', async () => {
  let calls = 0;
  const check = createChatProtection({ env: () => ({}), fetcher: async () => { calls++; throw Error(); } });
  const result = await check(req());
  assert.equal(result.allowed, true); assert.equal(result.mode, 'local'); assert.equal(result.allowPaidProvider, false); assert.equal(calls, 0);
});
test('configuração parcial ou URL insegura cai no modo local', async () => {
  for (const overrides of [
    { CHAT_RATE_LIMIT_SECRET: '' }, { CHAT_RATE_LIMIT_SECRET: 'short' }, { UPSTASH_REDIS_REST_TOKEN: '' },
    { UPSTASH_REDIS_REST_URL: 'http://redis.example.com' }, { UPSTASH_REDIS_REST_URL: 'https://user:pass@redis.example.com' },
    { UPSTASH_REDIS_REST_URL: 'https://redis.example.com/?token=secret' }, { UPSTASH_REDIS_REST_URL: 'invalid' },
  ]) {
    const check = createChatProtection({ env: () => ({ ...settings, ...overrides }), fetcher: () => assert.fail('não deve chamar Redis') });
    assert.equal((await check(req())).mode, 'local');
  }
});
test('limites locais por minuto/dia não renovam no bloqueio e expiram', async () => {
  let time = 0;
  const check = createChatProtection({ env: () => ({ VERCEL: '1' }), now: () => time, policy });
  assert.equal((await check(req())).allowed, true); assert.equal((await check(req())).allowed, true);
  assert.equal((await check(req())).reason, 'minute');
  time = 60_000; assert.equal((await check(req())).allowed, true);
  const blocked = await check(req()); assert.equal(blocked.reason, 'day'); assert.equal(blocked.retryAfter, 86_340);
  assert.equal((await check(req('203.0.113.8'))).allowed, true);
  time = 86_400_000; assert.equal((await check(req())).allowed, true);
});
test('fallback tem memória limitada e não remove quotas ativas para aceitar novos IPs', async () => {
  const check = createChatProtection({ env: () => ({ VERCEL: '1' }), capacity: 1 });
  assert.equal((await check(req())).allowed, true);
  const result = await check(req('203.0.113.8')); assert.equal(result.allowed, false); assert.equal(result.reason, 'capacity');
});
test('sem IP confiável: quota compartilhada, sem confiar no x-forwarded-for', async () => {
  const check = createChatProtection({ env: () => ({}), policy });
  await check(req()); await check(req('203.0.113.8'));
  assert.equal((await check(req('203.0.113.9'))).allowed, false);
});
test('REST: uma operação atômica, hash estável entre instâncias e nenhuma mensagem/IP puro no corpo', async () => {
  const bodies = [];
  const fetcher = async (url, init) => {
    assert.equal(url, 'https://redis.example.com'); assert.equal(init.redirect, 'error'); assert.equal(init.cache, 'no-store');
    assert.equal(init.headers.Authorization, 'Bearer mock-token');
    const command = JSON.parse(init.body); assert.equal(command[0], 'EVAL'); assert.equal(command[2], 2);
    assert.match(command[3], /\{[0-9a-f]{64}\}:minute$/); assert.equal(command[4], command[3].replace(':minute', ':day'));
    assert.deepEqual(command.slice(5), [30, 300, 60000, 86400000]);
    assert.ok(!init.body.includes('203.0.113.7'));
    bodies.push(command); return json([1, 0, 0]);
  };
  const a = createChatProtection({ env: () => settings, fetcher });
  const b = createChatProtection({ env: () => settings, fetcher });
  assert.equal((await a(req())).allowPaidProvider, true); assert.equal((await b(req())).mode, 'distributed');
  assert.equal(bodies.length, 2); assert.equal(bodies[0][3], bodies[1][3]);
});
test('Redis recusando minuto ou dia é respeitado, sem liberar pelo fallback', async () => {
  for (const [remote, reason, retryAfter] of [[[0, 1501, 1], 'minute', 2], [[0, 3600000, 2], 'day', 3600]]) {
    const check = createChatProtection({ env: () => settings, fetcher: async () => json(remote) });
    const result = await check(req()); assert.equal(result.mode, 'distributed'); assert.equal(result.allowed, false);
    assert.equal(result.reason, reason); assert.equal(result.retryAfter, retryAfter); assert.equal(result.allowPaidProvider, false);
  }
});
test('instâncias distintas concorrem pela mesma quota distribuída (backend mock atômico)', async () => {
  const counts = new Map();
  const fetcher = async (_, init) => {
    const [, , , key, , max] = JSON.parse(init.body);
    const count = counts.get(key) || 0;
    if (count >= max) return json([0, 60000, 1]);
    counts.set(key, count + 1); return json([1, 0, 0]);
  };
  const results = await Promise.all(Array.from({ length: 8 }, () => createChatProtection({ env: () => settings, fetcher, policy })(req())));
  assert.equal(results.filter(x => x.allowed).length, 2);
});
test('sem IP válido, Redis usa a quota compartilhada e nunca libera provedor pago', async () => {
  const check = createChatProtection({ env: () => ({ ...settings, VERCEL: '' }), fetcher: async (_, init) => {
    assert.deepEqual(JSON.parse(init.body).slice(5, 7), [200, 2000]); return json([1, 0, 0]);
  } });
  const result = await check(req()); assert.equal(result.mode, 'distributed'); assert.equal(result.allowPaidProvider, false);
});
test('erros HTTP, rede, JSON e respostas inesperadas preservam somente o modo local', async () => {
  const mocks = [
    async () => { throw Error('network'); }, async () => new Response('denied', { status: 401 }), async () => new Response('', { status: 500 }),
    async () => new Response('{'), async () => new Response(JSON.stringify({ error: 'ERR Lua' })),
    ...[null, [], [1, 0], [1, -1, 0], [0, 0, 1], [0, 1, 3], [0, 86400001, 2], ['1', 0, 0]].map(value => async () => json(value)),
  ];
  for (const fetcher of mocks) {
    const check = createChatProtection({ env: () => settings, fetcher });
    const result = await check(req()); assert.equal(result.allowed, true); assert.equal(result.mode, 'local'); assert.equal(result.allowPaidProvider, false);
  }
});
test('timeout limita tanto conexão pendurada quanto corpo da resposta e cancela a requisição', async () => {
  for (const bodyHangs of [false, true]) {
    let signal;
    const check = createChatProtection({ env: () => settings, timeoutMs: 10, fetcher: (_, init) => {
      signal = init.signal;
      return bodyHangs ? Promise.resolve({ ok: true, json: () => new Promise(() => {}) }) : new Promise(() => {});
    } });
    const result = await check(req()); assert.equal(result.mode, 'local'); assert.equal(result.allowPaidProvider, false); assert.equal(signal.aborted, true);
  }
});
test('queda do serviço não reinicia contadores locais; recuperação restaura proteção distribuída', async () => {
  let down = false;
  const check = createChatProtection({ env: () => settings, policy, fetcher: async () => { if (down) throw Error(); return json([1, 0, 0]); } });
  assert.equal((await check(req())).mode, 'distributed'); down = true;
  assert.equal((await check(req())).mode, 'local');
  assert.equal((await check(req())).allowed, false);
  down = false; assert.equal((await check(req('203.0.113.8'))).mode, 'distributed');
});
test('resposta tem teto de caracteres e não quebra pares Unicode ao resumir', () => {
  assert.equal(limitReply('roteiro completo'), 'roteiro completo');
  for (const content of ['x'.repeat(20000), '🌴'.repeat(10000)]) {
    const text = limitReply(content); assert.ok(text.length <= MAX_REPLY_LENGTH); assert.ok(text.endsWith('parte do roteiro.'));
    assert.ok(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(text));
  }
});

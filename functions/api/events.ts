/** POST /api/events — records ONE aggregate counter increment in D1. Stores no personal data. */
interface Env { DB: D1Database }
const EVENTS = new Set(['tool_view', 'tool_success', 'tool_error']);
const CATEGORIES = new Set(['office', 'image', 'text', 'web-code']);
const SLUG = /^[a-z0-9-]{1,60}$/;
const json = (status: number, error: string) => new Response(JSON.stringify({ error }), { status, headers: { 'content-type': 'application/json' } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  let sameOrigin = false;
  try { sameOrigin = !!origin && new URL(origin).host === new URL(request.url).host; } catch { sameOrigin = false; }
  if (!sameOrigin) return json(403, 'forbidden');
  if (Number(request.headers.get('content-length') ?? 0) > 1024) return json(413, 'too_large');

  let body: unknown;
  try { body = await request.json(); } catch { return json(400, 'invalid_json'); }
  const { event, category, tool } = (body ?? {}) as Record<string, unknown>;
  if (typeof event !== 'string' || !EVENTS.has(event)) return json(400, 'invalid_event');
  if (typeof category !== 'string' || !CATEGORIES.has(category)) return json(400, 'invalid_category');
  if (typeof tool !== 'string' || !SLUG.test(tool)) return json(400, 'invalid_tool');

  const day = new Date().toISOString().slice(0, 10);
  try {
    await env.DB.prepare(
      'INSERT INTO daily_events (day, category, tool, event, count) VALUES (?1, ?2, ?3, ?4, 1) ON CONFLICT(day, category, tool, event) DO UPDATE SET count = count + 1'
    ).bind(day, category, tool, event).run();
  } catch (err) {
    console.error('events insert failed:', err instanceof Error ? err.message : 'unknown');
    return json(500, 'storage_error');
  }
  return new Response(null, { status: 204 });
};

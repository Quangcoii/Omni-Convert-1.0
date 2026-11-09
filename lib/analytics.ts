/** Aggregate, cookieless counters sent to /api/events (D1). Never send filenames or content. */
export type AnalyticsEvent = 'tool_view' | 'tool_success' | 'tool_error';
export function track(event: AnalyticsEvent, category: string, tool: string): void {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true' || typeof navigator === 'undefined') return;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === '1' || nav.globalPrivacyControl) return; // respect DNT / GPC
  try {
    navigator.sendBeacon('/api/events', new Blob([JSON.stringify({ event, category, tool })], { type: 'application/json' }));
  } catch (err) {
    console.warn('analytics send failed', err instanceof Error ? err.message : err);
  }
}

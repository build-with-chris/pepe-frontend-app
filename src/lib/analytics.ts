// Lädt PostHog erst, wenn du es aufrufst
let started = false;
export async function initAnalytics() {
  if (started) return;
  started = true;
  const { default: posthog } = await import('posthog-js');
  // Minimal starten – Pageview später manuell
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: 'https://eu.posthog.com',
    autocapture: false,
    capture_pageview: false,
    person_profiles: 'identified_only'
  });
  // Auf Idle den ersten Pageview feuern
  (window as any).requestIdleCallback
    ? (window as any).requestIdleCallback(() => posthog.capture('$pageview'))
    : setTimeout(() => posthog.capture('$pageview'), 800);
}
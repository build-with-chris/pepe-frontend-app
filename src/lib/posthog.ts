import posthog from 'posthog-js';
if (typeof window !== 'undefined') (window as any).posthog = posthog;

export function initPostHog() {
  // In Dev standardmäßig ausschalten (optional)
  const enableFromEnv = (import.meta.env.VITE_ENABLE_ANALYTICS ?? 'false') === 'true';
  const isProd = import.meta.env.MODE === 'production';
  // In Development nur aktivieren, wenn VITE_ENABLE_ANALYTICS=true gesetzt ist
  if (!isProd && !enableFromEnv) return;

  console.log("PostHog init KEY:", import.meta.env.VITE_POSTHOG_KEY);
  console.log("PostHog init HOST:", import.meta.env.VITE_POSTHOG_HOST);

  posthog.init(
    import.meta.env.VITE_POSTHOG_KEY,
    {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.posthog.com',
      autocapture: true,               // Klicks, Formular-Events etc.
      capture_pageview: false,         // Wir tracken Pageviews manuell (SPA)
      person_profiles: 'identified_only', // DSGVO-freundlicher
      session_recording: {
        // Session Replay
        maskAllInputs: true,
        maskTextSelector: '*[data-ph-no-capture="true"]'
      }
    }
  );
}

export default posthog;
// PostHog initialisation is delayed until first user interaction (pointer/keyboard)
// OR after a 4s timeout, whichever happens first. This keeps heavy work out of the
// critical path. Pageview is captured on idle after init.

let scheduled = false;
let started = false;

function onIdle(cb: () => void, fallbackMs = 800) {
  const w = typeof window !== 'undefined' ? (window as any) : undefined;
  if (w && 'requestIdleCallback' in w) {
    return w.requestIdleCallback(cb, { timeout: fallbackMs });
  }
  return setTimeout(cb, fallbackMs);
}

export async function initAnalytics(): Promise<void> {
  if (started) return;               // already fully started
  if (scheduled) return;             // already waiting for trigger
  scheduled = true;

  await new Promise<void>((resolve) => {
    const start = async () => {
      if (started) return resolve();
      started = true;
      try {
        const { default: posthog } = await import('posthog-js');
        posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
          api_host: 'https://eu.posthog.com',
          autocapture: false,
          capture_pageview: false,
          person_profiles: 'identified_only',
        });
        // Fire first pageview on idle to avoid blocking user timing
        onIdle(() => posthog.capture('$pageview'), 800);
      } catch {
        // swallow errors silently – analytics must never break UX
      } finally {
        resolve();
      }
    };

    const onInteract = () => {
      cleanup();
      start();
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      start();
    }, 4000);

    const cleanup = () => {
      document.removeEventListener('pointerdown', onInteract);
      document.removeEventListener('keydown', onInteract);
      clearTimeout(timeoutId);
    };

    // Listen for the **next** user interaction
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerdown', onInteract, { once: true, passive: true });
      document.addEventListener('keydown', onInteract, { once: true });
    }
  });
}
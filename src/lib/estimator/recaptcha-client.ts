import { ESTIMATOR_RECAPTCHA_ACTION } from '@/lib/estimator/constants';

interface GrecaptchaClient {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaClient;
  }
}

export async function executeEstimatorRecaptcha(): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    throw new Error('reCAPTCHA is not configured.');
  }

  await loadRecaptchaScript(siteKey);
  const grecaptcha = window.grecaptcha;

  if (!grecaptcha) {
    throw new Error('reCAPTCHA failed to load.');
  }

  await new Promise<void>((resolve) => {
    grecaptcha.ready(() => resolve());
  });

  return grecaptcha.execute(siteKey, { action: ESTIMATOR_RECAPTCHA_ACTION });
}

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA can only run in the browser.'));
  }

  if (window.grecaptcha) {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>('script[data-estimator-recaptcha="true"]');
  if (existing) {
    return waitForGrecaptcha();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.estimatorRecaptcha = 'true';
    script.onload = () => {
      void waitForGrecaptcha().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA.'));
    document.head.appendChild(script);
  });
}

function waitForGrecaptcha(): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    function tick() {
      if (window.grecaptcha) {
        resolve();
        return;
      }

      if (Date.now() - startedAt > 10_000) {
        reject(new Error('reCAPTCHA load timed out.'));
        return;
      }

      window.setTimeout(tick, 50);
    }

    tick();
  });
}

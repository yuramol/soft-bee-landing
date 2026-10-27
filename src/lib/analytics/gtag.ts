import { ConsentStatus, TrackEventParams } from './types';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '';
export const COOKIE_CONSENT_KEY = 'softbee_cookie_consent';

export function hasGaId(): boolean {
  return Boolean(GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-'));
}

export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
  } catch {
    // localStorage may be disabled/restricted in some browser contexts
  }
  return null;
}

export function setStoredConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, status);
    window.dispatchEvent(new Event('softbee_consent_update'));
  } catch {
    // ignore storage write errors
  }
}

export function subscribeToConsent(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('softbee_consent_update', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('softbee_consent_update', onStoreChange);
  };
}

/** Banner is analytics-only — never grant advertising consent from Accept. */
export function updateGtagConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') {
    return;
  }

  setStoredConsent(status);

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: status,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }
}

function canSendAnalytics(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    hasGaId() &&
    getStoredConsent() === 'granted'
  );
}

export function trackPageView(url: string): void {
  if (!canSendAnalytics()) {
    return;
  }

  window.gtag?.('event', 'page_view', {
    page_path: url,
    send_to: GA_MEASUREMENT_ID
  });
}

export function trackEvent(eventName: string, params: TrackEventParams = {}): void {
  if (!canSendAnalytics()) {
    return;
  }

  window.gtag?.('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID
  });
}

/** Track high-intent lead form submissions */
export function trackDiscussProjectSubmit(): void {
  trackEvent('generate_lead', {
    form_name: 'discuss_project',
    event_category: 'engagement',
    event_label: 'Discuss Project Submission'
  });
}

export function trackVacancySubmit(roleTitle?: string): void {
  trackEvent('generate_lead', {
    form_name: 'vacancy_application',
    role_title: roleTitle || 'General',
    event_category: 'recruitment',
    event_label: `Job Application: ${roleTitle || 'General'}`
  });
}

export function trackPartnershipSubmit(partnershipType?: string): void {
  trackEvent('generate_lead', {
    form_name: 'partnership',
    partnership_type: partnershipType || 'Partner',
    event_category: 'partnership',
    event_label: `Partnership Request: ${partnershipType || 'Partner'}`
  });
}

export function trackEstimationStart(): void {
  trackEvent('smart_estimation_start', {
    event_category: 'estimator',
    event_label: 'Started Smart Estimation'
  });
}

export function trackEstimationComplete(status: 'completed' | 'failed' = 'completed'): void {
  trackEvent('smart_estimation_complete', {
    estimator_status: status,
    event_category: 'estimator',
    event_label: `Smart Estimation Settled: ${status}`
  });
}

export function trackCtaClick(label: string, location: string): void {
  trackEvent('cta_click', {
    cta_label: label,
    cta_location: location,
    event_category: 'conversion',
    event_label: `${location} - ${label}`
  });
}

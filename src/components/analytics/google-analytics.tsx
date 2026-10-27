'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useSyncExternalStore } from 'react';

import {
  COOKIE_CONSENT_KEY,
  GA_MEASUREMENT_ID,
  getStoredConsent,
  hasGaId,
  subscribeToConsent,
  trackPageView
} from '@/lib/analytics';

interface GaPageviewTrackerProps {
  hasConsent: boolean;
}

function GaPageviewTracker({ hasConsent }: GaPageviewTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasGaId() || !hasConsent) {
      return;
    }

    const queryString = searchParams?.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    if (lastTrackedUrlRef.current === fullPath) {
      return;
    }

    lastTrackedUrlRef.current = fullPath;
    trackPageView(fullPath);
  }, [pathname, searchParams, hasConsent]);

  return null;
}

export function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => null);

  if (!hasGaId()) {
    return null;
  }

  const hasAnalyticsConsent = consent === 'granted';

  const consentInitScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    var savedConsent = null;
    try {
      savedConsent = localStorage.getItem('${COOKIE_CONSENT_KEY}');
    } catch(e) {}
    var analyticsConsent = savedConsent === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'default', {
      'analytics_storage': analyticsConsent,
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'wait_for_update': 500
    });
  `;

  const gaConfigScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      send_page_view: false
    });
  `;

  return (
    <>
      <script id='ga-consent-defaults' dangerouslySetInnerHTML={{ __html: consentInitScript }} />
      {hasAnalyticsConsent ? (
        <>
          <Script
            id='ga-gtag-cdn'
            strategy='afterInteractive'
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script id='ga-config-init' strategy='afterInteractive' dangerouslySetInnerHTML={{ __html: gaConfigScript }} />
          <Suspense fallback={null}>
            <GaPageviewTracker hasConsent={hasAnalyticsConsent} />
          </Suspense>
        </>
      ) : null}
    </>
  );
}

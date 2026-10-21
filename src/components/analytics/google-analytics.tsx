'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';

import { GA_MEASUREMENT_ID, hasGaId, trackPageView, COOKIE_CONSENT_KEY } from '@/lib/analytics';

function GaPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasGaId()) {
      return;
    }

    const queryString = searchParams?.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    if (lastTrackedUrlRef.current === fullPath) {
      return;
    }

    lastTrackedUrlRef.current = fullPath;
    trackPageView(fullPath);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!hasGaId()) {
    return null;
  }

  const consentInitScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    var savedConsent = null;
    try {
      savedConsent = localStorage.getItem('${COOKIE_CONSENT_KEY}');
    } catch(e) {}
    var initialConsent = savedConsent === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'default', {
      'analytics_storage': initialConsent,
      'ad_storage': initialConsent,
      'ad_user_data': initialConsent,
      'ad_personalization': initialConsent,
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
      <Script id='ga-gtag-cdn' strategy='afterInteractive' src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script id='ga-config-init' strategy='afterInteractive' dangerouslySetInnerHTML={{ __html: gaConfigScript }} />
      <Suspense fallback={null}>
        <GaPageviewTracker />
      </Suspense>
    </>
  );
}

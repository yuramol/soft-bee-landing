export type ConsentStatus = 'granted' | 'denied';

export interface ConsentPreferences {
  analytics_storage: ConsentStatus;
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
}

export type GtagConsentParams = Partial<ConsentPreferences> & {
  wait_for_update?: number;
};

export interface TrackEventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: 'js' | 'config' | 'event' | 'consent', targetOrDateOrAction: unknown, params?: unknown) => void;
  }
}

// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export interface BrowserData {
  appType?: string;
  device?: string;
  userAgent: string;
}

export interface LocaleData {
  country: string;
  language: string;
}

export interface PageData {
  custom?: { [key: string]: unknown };
  uri?: string;
}

export interface StoreData {
  groupId: string;
  id: string;
}

export interface ContextData {
  locale?: LocaleData;
  page?: PageData;
  store?: StoreData;
  campaign?: CampaignData;
  geo?: GeoData;
  browser?: BrowserData;
}

export interface BrowserDTO {
  app_type?: string;
  device?: string;
  user_agent: string;
}

export interface LocaleDTO {
  country?: string;
  language?: string;
}

export interface PageDTO {
  custom?: { [key: string]: unknown };
  uri?: string;
}

export interface StoreDTO {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  group_id?: string;
  id?: string;
}

export interface ContextDTO {
  context: {
    locale?: LocaleDTO;
    page?: PageDTO;
    store?: StoreDTO;
    campaign?: CampaignDTO;
    geo?: GeoDTO;
    browser?: BrowserDTO;
  };
}

export interface CampaignData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface CampaignDTO {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

interface GeoDTO {
  ip?: string;
  location?: {
    lat: number;
    lon: number;
  };
}

export interface GeoData {
  ip?: string;
  location?: LocationData;
}

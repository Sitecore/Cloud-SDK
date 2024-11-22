// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ArrayOfAtLeastOne } from '../filters/interfaces';

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
  uri: string;
}

export interface UserData {
  custom?: { [key: string]: unknown };
  groups?: string[];
  userId?: string;
  uuid?: string;
}

export interface StoreData {
  groupId: string;
  id: string;
}

export interface IdsData {
  [key: string]: ArrayOfAtLeastOne<string>;
}

export interface IdsDTO {
  [key: string]: ArrayOfAtLeastOne<string>;
}

export interface ContextData {
  locale?: LocaleData;
  page?: PageData;
  user?: UserData;
  store?: StoreData;
  campaign?: CampaignData;
  geo?: GeoData;
  browser?: BrowserData;
  ids?: IdsData;
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

export interface UserDTO {
  custom?: { [key: string]: unknown };
  groups?: string[];
  user_id?: string;
  uuid?: string;
}

export interface ContextDTO {
  context: {
    locale?: LocaleDTO;
    page?: PageDTO;
    store?: StoreDTO;
    campaign?: CampaignDTO;
    geo?: GeoDTO;
    user?: UserDTO;
    browser?: BrowserDTO;
    ids?: IdsDTO;
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

// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export interface LocaleData {
  country: string;
  language: string;
}

export interface PageData {
  custom?: { [key: string]: unknown };
  uri?: string;
}

export interface StoreData {
  groupId?: string;
  id?: string;
}

export interface ContextData {
  locale?: LocaleData;
  page?: PageData;
  store?: StoreData;
  campaign?: CampaignData;
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
  locale?: LocaleDTO;
  page?: PageDTO;
  store?: StoreDTO;
  campaign?: CampaignDTO;
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

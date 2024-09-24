// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export type WebPersonalizationSettings = { async: boolean; defer: boolean };

export interface BrowserSettings {
  webPersonalization?: boolean | Partial<WebPersonalizationSettings>;
}

export interface PersonalizeSettings {
  webPersonalization: false | WebPersonalizationSettings;
}

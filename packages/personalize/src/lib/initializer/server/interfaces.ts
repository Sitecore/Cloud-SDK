// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export interface ServerSettings {
  enablePersonalizeCookie?: boolean;
}

export interface PersonalizeSettings {
  enablePersonalizeCookie?: boolean;
  cookieSettings: {
    name: {
      guestId: string;
    };
  };
}

// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  interface Window {
    Engage: {
      getBrowserId?: () => string;
      versions?: {
        events?: string;
      };
    };
  }
}

export {};

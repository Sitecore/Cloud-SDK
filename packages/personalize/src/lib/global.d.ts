// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IWebExperiencesSettings } from "@sitecore-cloudsdk/engage-core";


/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  interface Window {
    Engage: {
      settings?: IWebExperiencesSettings;
      getBrowserId?: () => string;
      versions?: {
        personalize: string;
      };
    };
  }
}

export {};

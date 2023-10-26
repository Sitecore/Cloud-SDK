// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { init } from '@sitecore-cloudsdk/personalize';
import type { Personalize } from '@sitecore-cloudsdk/personalize';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';

// eslint-disable-next-line @typescript-eslint/naming-convention
const PersonalizeContext = createContext<Personalize | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PersonalizeProvider = ({ children }: { children: ReactNode }) => {
  /* eslint-enable @typescript-eslint/naming-convention */
  const [personalize, setPersonalize] = useState<Personalize>();

  const loadPersonalize = useCallback(async () => {
    const webPersonalizationSettings = getSettingFromUrlParams('webPersonalizationSettings')
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        parseWebPersonalizationConfig(getSettingFromUrlParams('webPersonalizationSettings')!)
      : null;

    if (webPersonalizationSettings?.baseURLOverride == 'undefined') {
      webPersonalizationSettings.baseURLOverride = undefined;
    }

    const temp = await init({

      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie: true,
      contextId: process.env.CONTEXT_ID || '',
      webPersonalization: false,
      siteId: process.env.SITE_ID || ''
    });

    setPersonalize(temp);
  }, []);

  useEffect(() => {
    loadPersonalize();
  }, [loadPersonalize]);

  return <PersonalizeContext.Provider value={personalize}>{children}</PersonalizeContext.Provider>;
};

export const usePersonalize = () => {
  const personalize = useContext(PersonalizeContext);
  return personalize;
};

function parseWebPersonalizationConfig(urlParamsString: string) {
  return urlParamsString ? JSON.parse(urlParamsString) : null;
}

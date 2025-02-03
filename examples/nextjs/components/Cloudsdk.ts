'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';
import '@sitecore-cloudsdk/search/browser';

type TriggerExperiences = Personalize & {
  triggerExperiences: () => void;
};

export function CloudSDKComponent() {
  const [personalizeInstance, setPersonalizeInstance] = useState<TriggerExperiences | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME as string,
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_CONTEXT_ID as string
    })
      .addEvents()
      .addSearch()
      .addPersonalize({ webPersonalization: true })
      .initialize();

    setPersonalizeInstance(window.scCloudSDK.personalize as TriggerExperiences);
  }, []);

  useEffect(() => {
    if (personalizeInstance) personalizeInstance.triggerExperiences();
  }, [pathname]);

  return null;
}

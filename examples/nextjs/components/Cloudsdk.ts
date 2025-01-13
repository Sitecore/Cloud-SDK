'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';
import '@sitecore-cloudsdk/search/browser';

export function CloudSDKComponent() {
  const pathName = usePathname();

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
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window?.scCloudSDK?.personalize && (window?.scCloudSDK.personalize as any).triggerExperiences();
  }, [pathName]);

  return null;
}

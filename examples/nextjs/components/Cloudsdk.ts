'use client';

import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';
import '@sitecore-cloudsdk/search-api-client/browser';

export function CloudSDKComponent() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME as string,
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_CONTEXT_ID as string
    })
      .addEvents()
      .addSearch()
      .addPersonalize({ webPersonalization: { language: 'en' } })
      .initialize();
  }, []);
  return null;
}

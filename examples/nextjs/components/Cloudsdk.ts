'use client';

import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';

export function CloudSDKComponent() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: 'spinair.com',
      sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1'
    })
      .addEvents()
      .initialize();
  }, []);
  return null;
}

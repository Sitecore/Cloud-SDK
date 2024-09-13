'use client';

import '@sitecore-cloudsdk/events/browser';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { useEffect } from 'react';

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

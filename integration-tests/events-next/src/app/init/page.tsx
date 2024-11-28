'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { event } from '@sitecore-cloudsdk/events/browser';

export default async function Page() {
  function initCloudSDKWithAddEvents() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: process.env.SITE_NAME as string,
      enableBrowserCookie: true
    })
      .addEvents()
      .initialize();
  }
  async function initCloudSDKWithoutAddEvents() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: process.env.SITE_NAME as string,
      enableBrowserCookie: true
    }).initialize();
    await event({ type: 'CUSTOM' });
  }
  return (
    <div>
      <h2>init</h2>
      <button
        type='button'
        data-testid='initCloudSDKWithAddEvents'
        onClick={initCloudSDKWithAddEvents}>
        initCloudSDKWithAddEvents
      </button>
      <br />
      <button
        type='button'
        data-testid='initCloudSDKWithoutAddEvents'
        onClick={initCloudSDKWithoutAddEvents}>
        initCloudSDKWithoutAddEvents
      </button>
    </div>
  );
}

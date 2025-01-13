'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import { getPageWidgetData } from '@sitecore-cloudsdk/search/browser';

export default async function Page() {
  async function initSearchWithEnableBrowserCookieTrue() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: 'TestSite',
      enableBrowserCookie: true
    })
      .addSearch({ userId: 'user123' })
      .addEvents()
      .initialize();
  }
  async function initSearchWithEnableBrowserCookieFalse() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: 'TestSite',
      enableBrowserCookie: false
    })
      .addSearch({ userId: 'user123' })
      .addEvents()
      .initialize();
  }

  function initSearchWithoutEvents() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: 'TestSite',
      enableBrowserCookie: true
    })
      .addSearch({ userId: 'user123' })
      .initialize();
  }

  async function initCloudSDKWithoutAddSearch() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: 'TestSite',
      enableBrowserCookie: true
    }).initialize();
    await getPageWidgetData('/test');
  }
  return (
    <div>
      <h1>init function</h1>
      <button
        type='button'
        data-testid='initSearchWithEnableBrowserCookieTrue'
        onClick={initSearchWithEnableBrowserCookieTrue}>
        init Search with <code>enableBrowserCookie=true</code>
      </button>
      <br />
      <button
        type='button'
        data-testid='initSearchWithEnableBrowserCookieFalse'
        onClick={initSearchWithEnableBrowserCookieFalse}>
        init Search with <code>enableBrowserCookie=false</code>
      </button>
      <br />
      <button
        type='button'
        data-testid='initSearchWithoutEvents'
        onClick={initSearchWithoutEvents}>
        initSearchWithoutEvents
      </button>
      <button
        type='button'
        data-testid='initCloudSDKWithoutAddSearch'
        onClick={initCloudSDKWithoutAddSearch}>
        initCloudSDKWithoutAddSearch
      </button>
    </div>
  );
}

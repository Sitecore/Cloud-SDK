'use client';

import { useState } from 'react';
import { CloudSDK, getBrowserId } from '@sitecore-cloudsdk/core/browser';

export default function Page() {
  const [bid, setBID] = useState('Click a button above to retrieve browser ID');

  function initCloudSDKWithEnableBrowserCookie(enableBrowserCookie: boolean) {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: process.env.SITE_NAME as string,
      enableBrowserCookie
    }).initialize();
  }
  function handleBrowserIdFromWindowClick() {
    setBID(getBrowserId() || '');
  }
  function handleBrowserIdFromCloudSDKClick() {
    setBID(window?.scCloudSDK.core.getBrowserId() || '');
  }
  return (
    <div>
      <h1>
        <code>Get Browser id</code>
      </h1>
      <div>
        <button
          type='button'
          data-testid='initCloudSDKWithEnableBrowserCookieTrue'
          onClick={() => initCloudSDKWithEnableBrowserCookie(true)}>
          init CloudSDK with <code>enableBrowserCookie=true</code>
        </button>
      </div>
      <div>
        <h3>
          Using <code>getBrowserId</code> from window
        </h3>
        <button
          data-testid='getBrowserIdFromWindow'
          onClick={handleBrowserIdFromWindowClick}>
          Get ID invoking method from window
        </button>
      </div>
      <div>
        <h3>
          Using <code>getBrowserId</code> from Cloud SDK
        </h3>
        <button
          data-testid='getBrowserIdFromCloudSDK'
          onClick={handleBrowserIdFromCloudSDKClick}>
          Get ID invoking method from CloudSDK
        </button>
      </div>
      <div>
        <h3>Browser id is</h3>
        <span
          id='display_id'
          data-testid='browserIdLabel'>
          {bid}
        </span>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CloudSDK, getGuestId } from '@sitecore-cloudsdk/core/browser';

export default function Page() {
  const [label, setLabel] = useState('');
  function initCloudSDKWithEnableBrowserCookie(enableBrowserCookie: boolean) {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: process.env.SITE_NAME as string,
      enableBrowserCookie
    }).initialize();
  }
  async function handleGuestIdFromWindowClick() {
    setLabel((await getGuestId()) || '');
  }

  async function handleGuestIdFromCloudSDKClick() {
    setLabel((await window.scCloudSDK.core.getGuestId()) || '');
  }

  return (
    <div>
      <h1 data-testid='getGuestIdPageTitle'>Get Guest Id</h1>
      <button
        type='button'
        data-testid='initCloudSDKWithEnableBrowserCookieTrue'
        onClick={() => initCloudSDKWithEnableBrowserCookie(true)}>
        init CloudSDK with <code>enableBrowserCookie=true</code>
      </button>
      <button
        data-testid='getGuestId'
        onClick={handleGuestIdFromWindowClick}>
        get guest id
      </button>
      <button
        data-testid='getGuestIdFromCloudSDK'
        onClick={handleGuestIdFromCloudSDKClick}>
        get guest id
      </button>
      <p data-testid='getGuestIdResponse'>{label}</p>
    </div>
  );
}

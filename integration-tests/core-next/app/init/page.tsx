'use client';

import { useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';

type InitSettings = {
  enableBrowserCookie?: boolean;
  contextId?: string;
};

export default function Page() {
  function initCloudSDKWithEnableBrowserCookie(settings: InitSettings) {
    CloudSDK({
      sitecoreEdgeContextId: settings?.contextId || (process.env.CONTEXT_ID as string),
      siteName: process.env.SITE_NAME as string,
      ...(settings?.enableBrowserCookie ? { enableBrowserCookie: true } : {}),
      ...(initDomainInputData ? { cookieDomain: initDomainInputData } : {})
    }).initialize();
  }
  const [initDomainInputData, setInitDomainInputData] = useState('');

  return (
    <div>
      <input
        style={{ width: '800px' }}
        type='text'
        value={initDomainInputData}
        onChange={(e) => setInitDomainInputData(e.target.value)}
        data-testid='initDomainInput'
      />
      <h1>init function</h1>
      <div>
        <h3>Init CloudSDK with browser cookie</h3>
        <button
          type='button'
          data-testid='initCloudSDKWithEnableBrowserCookieTrue'
          onClick={() => initCloudSDKWithEnableBrowserCookie({ enableBrowserCookie: true })}>
          init CloudSDK with <code>enableBrowserCookie=true</code>
        </button>
      </div>
      <div>
        <h3>Init CloudSDK without browser cookie</h3>
        <button
          type='button'
          data-testid='initCloudSDKWithEnableBrowserCookieFalse'
          onClick={() => initCloudSDKWithEnableBrowserCookie({ enableBrowserCookie: false })}>
          init CloudSDK with <code>enableBrowserCookie=false</code>
        </button>
      </div>
      <div>
        <h3>Init CloudSDK with browser cookie and wrong context id</h3>
        <button
          type='button'
          data-testid='initCloudSDKWithInvalidContextId'
          onClick={() =>
            initCloudSDKWithEnableBrowserCookie({ enableBrowserCookie: true, contextId: 'bad-context-id' })
          }>
          init CloudSDK with <code>enableBrowserCookie=true</code> and wrong context id
        </button>
      </div>
    </div>
  );
}

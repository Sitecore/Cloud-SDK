'use client';

import { useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { PACKAGE_VERSION as personalizeVersion } from '@sitecore-cloudsdk/personalize/browser';

export default function CreateCookie() {
  const [version, setVersion] = useState('Click a button above to retrieve version');

  return (
    <>
      <button
        type='button'
        data-testid='initPersonalizeWithCookieEnabled'
        onClick={async () => {
          CloudSDK({
            sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
            siteName: 'TestSite',
            enableBrowserCookie: true
          })
            .addPersonalize({ enablePersonalizeCookie: true })
            .initialize();
        }}>
        Request Personalize from Client with enablePersonalizeCookie set to true{' '}
      </button>
      <button
        type='button'
        data-testid='initPersonalizeWithoutCookieEnabled'
        onClick={async () => {
          CloudSDK({
            sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
            siteName: 'TestSite',
            enableBrowserCookie: true
          })
            .addPersonalize()
            .initialize();
        }}>
        Request Personalize from Client with enablePersonalizeCookie set to false{' '}
      </button>
      <legend>Retrieve Personalize Library Version</legend>
      <button
        data-testid='getVersionLibFromWindowPersonalize'
        onClick={() => personalizeVersion && setVersion(personalizeVersion)}>
        Get Personalize version from lib function
      </button>
      <button
        data-testid='getVersionLibFromPersonalize'
        onClick={() => {
          CloudSDK({
            sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
            siteName: 'TestSite',
            enableBrowserCookie: true
          })
            .addPersonalize()
            .initialize();

          setTimeout(() => {
            if (window.scCloudSDK.personalize?.version !== undefined) setVersion(window.scCloudSDK.personalize.version);
          }, 2000);
        }}>
        Get Personalize version from window
      </button>
      <h3>Version id is</h3>
      <span
        id='display_version_id'
        data-testid='versionLabel'>
        {version}
      </span>
    </>
  );
}

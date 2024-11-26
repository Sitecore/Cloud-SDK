'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import '@sitecore-cloudsdk/personalize/server';

export default function Init() {
  function handleInvalidContextId() {
    CloudSDK({ sitecoreEdgeContextId: ' ', siteName: '456' }).addPersonalize().initialize();
  }
  function handleUndefinedContextId() {
    CloudSDK({ siteName: '456' } as BrowserSettings);
  }
  function handleInvalidSiteName() {
    CloudSDK({ sitecoreEdgeContextId: '123', siteName: ' ' });
  }
  function handleUndefinedSiteName() {
    CloudSDK({ sitecoreEdgeContextId: '123' } as BrowserSettings);
  }
  function handleHappyPath() {
    CloudSDK({
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: process.env.SITE_NAME as string
    }).initialize();
  }
  function handleInvalidsitecoreEdgeUrl() {
    CloudSDK({ sitecoreEdgeContextId: '123', siteName: '456', sitecoreEdgeUrl: '_a' });
  }
  function handlEmptyStringsitecoreEdgeUrl() {
    CloudSDK({ sitecoreEdgeContextId: '123', siteName: '456', sitecoreEdgeUrl: '' });
  }

  function handlDifferentsitecoreEdgeUrl() {
    CloudSDK({
      sitecoreEdgeContextId: '72d5674b-1da5-47d8-5829-08db5ace6087',
      siteName: '456',
      sitecoreEdgeUrl: 'https://edge-platform-staging.sitecore-staging.cloud',
      enableBrowserCookie: true
    })
      .addPersonalize()
      .initialize();
  }

  async function initCloudSDKWithoutAddPersonalize() {
    CloudSDK({
      sitecoreEdgeContextId: '72d5674b-1da5-47d8-5829-08db5ace6087',
      siteName: '456',
      sitecoreEdgeUrl: 'https://edge-platform-staging.sitecore-staging.cloud',
      enableBrowserCookie: true
    }).initialize();
    await personalize({
      channel: '',
      currency: '',
      friendlyId: ''
    });
  }

  return (
    <div>
      <h1>Init personalize Page</h1>
      <fieldset>
        <legend>Context Id</legend>
        <div>
          <button
            data-testid='initInvalidSitecoreEdgeContextId'
            onClick={handleInvalidContextId}>
            Invalid context id
          </button>
          <button
            data-testid='initUndefinedSitecoreEdgeContextId'
            onClick={handleUndefinedContextId}>
            Undefined context id
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Context Id</legend>
        <div>
          <button
            data-testid='initInvalidSitecoreEdgesitecoreEdgeUrl'
            onClick={handleInvalidsitecoreEdgeUrl}>
            Invalid sitecoreEdgeUrl
          </button>
          <button
            data-testid='initEmptyStringSitecoreEdgesitecoreEdgeUrl'
            onClick={handlEmptyStringsitecoreEdgeUrl}>
            Empty Space sitecoreEdgeUrl
          </button>
          <button
            data-testid='initDifferentSitecoreEdgesitecoreEdgeUrl'
            onClick={handlDifferentsitecoreEdgeUrl}>
            Different sitecoreEdgeUrl
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Site Id</legend>
        <div>
          <button
            data-testid='initInvalidSiteName'
            onClick={handleInvalidSiteName}>
            Invalid site id
          </button>
          <button
            data-testid='initUndefinedSiteName'
            onClick={handleUndefinedSiteName}>
            Undefined site id
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Happy Path</legend>
        <div>
          <button
            data-testid='initHappyPath'
            onClick={handleHappyPath}>
            Happy Path
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Error messages</legend>
        <div>
          <button
            data-testid='initCloudSDKWithoutAddPersonalize'
            onClick={initCloudSDKWithoutAddPersonalize}>
            init CloudSDK without addPersonalize
          </button>
        </div>
      </fieldset>
    </div>
  );
}

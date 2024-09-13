import type { ServerSettings, BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import type { GetServerSidePropsContext } from 'next';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { CloudSDK as CloudSDKServer } from '@sitecore-cloudsdk/core/server';
import '@sitecore-cloudsdk/personalize/server';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';

export default function InitPersonalize({ serverResponse }: { serverResponse: string }) {
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
      siteName: process.env.SITE_ID as string
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
      <fieldset>
        <legend>Server Response</legend>
        <p data-testid='serverResponse'>{serverResponse}</p>
      </fieldset>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const isServerMode = context.query.serverSideTest;

  if (isServerMode !== 'true')
    return {
      props: {}
    };

  const attributeToTest = context.query.attribute;
  const testVariation = context.query.variation;

  let sitecoreEdgeContextId =
    attributeToTest === 'sitecoreEdgeContextId' ? (testVariation === 'invalid' ? ' ' : undefined) : '123';
  const siteName = attributeToTest === 'siteName' ? (testVariation === 'invalid' ? ' ' : undefined) : '456';
  const sitecoreEdgeUrl =
    attributeToTest === 'sitecoreEdgeUrl'
      ? testVariation === 'invalid' || testVariation === 'undefined'
        ? '_a'
        : 'https://edge-platform-staging.sitecore-staging.cloud'
      : undefined;

  let enableServerCookie;
  if (sitecoreEdgeUrl === 'https://edge-platform-staging.sitecore-staging.cloud') {
    sitecoreEdgeContextId = '72d5674b-1da5-47d8-5829-08db5ace6087';
    enableServerCookie = true;
  }
  try {
    await CloudSDKServer(context.req, context.res, {
      sitecoreEdgeContextId,
      siteName,
      sitecoreEdgeUrl,
      enableServerCookie
    } as ServerSettings)
      .addPersonalize()
      .initialize();

    return {
      props: {
        serverResponse: 'no errors'
      }
    };
  } catch (error) {
    return {
      props: {
        serverResponse: (error as Error).message
      }
    };
  }
}

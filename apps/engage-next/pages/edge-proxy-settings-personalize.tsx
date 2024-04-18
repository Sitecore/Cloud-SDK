// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings, ServerSettings } from '@sitecore-cloudsdk/core';
import type { GetServerSidePropsContext } from 'next';
import { init } from '@sitecore-cloudsdk/personalize/browser';
import { init as initServer } from '@sitecore-cloudsdk/personalize/server';

export default function EdgeProxySettings({ serverResponse }: { serverResponse: string }) {
  const handleInvalidContextId = async () => {
    await init({ sitecoreEdgeContextId: ' ', siteName: '456' });
  };
  const handleUndefinedContextId = async () => {
    await init({ siteName: '456' } as BrowserSettings);
  };
  const handleInvalidSiteName = async () => {
    await init({ sitecoreEdgeContextId: '123', siteName: ' ' });
  };
  const handleUndefinedSiteName = async () => {
    await init({ sitecoreEdgeContextId: '123' } as BrowserSettings);
  };
  const handleHappyPath = async () => {
    await init({ sitecoreEdgeContextId: process.env.CONTEXT_ID as string, siteName: process.env.SITE_ID as string });
  };
  const handleInvalidsitecoreEdgeUrl = async () => {
    await init({ sitecoreEdgeContextId: '123', siteName: '456', sitecoreEdgeUrl: '_a' });
  };
  const handlEmptyStringsitecoreEdgeUrl = async () => {
    await init({ sitecoreEdgeContextId: '123', siteName: '456', sitecoreEdgeUrl: '' });
  };

  const handlDifferentsitecoreEdgeUrl = async () => {
    await init({
      sitecoreEdgeContextId: '72d5674b-1da5-47d8-5829-08db5ace6087',
      siteName: '456',
      sitecoreEdgeUrl: 'https://edge-platform-staging.sitecore-staging.cloud',
      enableBrowserCookie: true
    });
  };

  return (
    <div>
      <h1>EdgeProxySettings Page</h1>
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
    await initServer(context.req, context.res, {
      sitecoreEdgeContextId,
      siteName,
      sitecoreEdgeUrl,
      enableServerCookie
    } as ServerSettings);

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

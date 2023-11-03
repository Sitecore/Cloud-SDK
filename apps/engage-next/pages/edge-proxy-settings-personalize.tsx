// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ISettingsParamsBrowser, ISettingsParamsServer } from '@sitecore-cloudsdk/core';
import { init } from '@sitecore-cloudsdk/personalize/browser';
import { init as initServer } from '@sitecore-cloudsdk/personalize/server';
import { GetServerSidePropsContext } from 'next';

export function EdgeProxySettings({ serverResponse }: { serverResponse: string }) {
  const handleInvalidContextId = async () => {
    await init({ sitecoreEdgeContextId: ' ', siteName: '456' });
  };
  const handleUndefinedContextId = async () => {
    await init({ siteName: '456' } as ISettingsParamsBrowser);
  };
  const handleInvalidSiteName = async () => {
    await init({ sitecoreEdgeContextId: '123', siteName: ' ' });
  };
  const handleUndefinedSiteName = async () => {
    await init({ sitecoreEdgeContextId: '123' } as ISettingsParamsBrowser);
  };
  const handleHappyPath = async () => {
    await init({ sitecoreEdgeContextId: process.env.CONTEXT_ID as string, siteName: process.env.SITE_ID as string });
  };
  const handleInvalidsitecoreEdgeUrl = async () => {
    await init({ sitecoreEdgeContextId: '123', siteName: '456', sitecoreEdgeUrl: '_a' });
  };
  const handlEmptyStringsitecoreEdgeUrl = async () => {
    await init({ sitecoreEdgeContextId: '123', siteName: '456', sitecoreEdgeUrl: ' ' });
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
      props: {},
    };

  const attributeToTest = context.query.attribute;
  const testVariation = context.query.variation;

  const sitecoreEdgeContextId =
    attributeToTest === 'sitecoreEdgeContextId' ? (testVariation === 'invalid' ? ' ' : undefined) : '123';
  const siteName = attributeToTest === 'siteName' ? (testVariation === 'invalid' ? ' ' : undefined) : '456';
  const sitecoreEdgeUrl =
    attributeToTest === 'sitecoreEdgeUrl' ? (testVariation === 'invalid' ? '_a' : ' ') : undefined;
  try {
    await initServer(
      {
        sitecoreEdgeContextId,
        siteName,
        sitecoreEdgeUrl,
      } as ISettingsParamsServer,
      context.req,
      context.res
    );

    return {
      props: {
        serverResponse: 'no errors',
      },
    };
  } catch (error) {
    return {
      props: {
        serverResponse: (error as Error).message,
      },
    };
  }
}

export default EdgeProxySettings;

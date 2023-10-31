// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ISettingsParamsBrowser, ISettingsParamsServer } from '@sitecore-cloudsdk/core';
import { init, initServer } from '@sitecore-cloudsdk/personalize';
import { GetServerSidePropsContext } from 'next';

export function EdgeProxySettings({ serverResponse }: { serverResponse: string }) {
  const handleInvalidContextId = async () => {
    await init({ contextId: ' ', siteId: '456' });
  };
  const handleUndefinedContextId = async () => {
    await init({ siteId: '456' } as ISettingsParamsBrowser);
  };
  const handleInvalidSiteId = async () => {
    await init({ contextId: '123', siteId: ' ' });
  };
  const handleUndefinedSiteId = async () => {
    await init({ contextId: '123' } as ISettingsParamsBrowser);
  };
  const handleHappyPath = async () => {
    await init({ contextId: process.env.CONTEXT_ID as string, siteId: process.env.SITE_ID as string });
  };

  return (
    <div>
      <h1>EdgeProxySettings Page</h1>
      <fieldset>
        <legend>Context Id</legend>
        <div>
          <button
            data-testid='initInvalidContextId'
            onClick={handleInvalidContextId}>
            Invalid context id
          </button>
          <button
            data-testid='initUndefinedContextId'
            onClick={handleUndefinedContextId}>
            Undefined context id
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Site Id</legend>
        <div>
          <button
            data-testid='initInvalidSiteId'
            onClick={handleInvalidSiteId}>
            Invalid site id
          </button>
          <button
            data-testid='initUndefinedSiteId'
            onClick={handleUndefinedSiteId}>
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

  const contextId = attributeToTest === 'contextid' ? (testVariation === 'invalid' ? ' ' : undefined) : '123';
  const siteId = attributeToTest === 'siteid' ? (testVariation === 'invalid' ? ' ' : undefined) : '456';

  try {
    await initServer(
      {
        contextId,
        siteId,
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

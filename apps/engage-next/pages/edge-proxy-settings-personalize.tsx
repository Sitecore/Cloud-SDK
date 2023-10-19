// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ISettingsParamsBrowser, ISettingsParamsServer } from '@sitecore-cloudsdk/engage-core';
import { init, initServer } from '@sitecore-cloudsdk/personalize';
import { GetServerSidePropsContext } from 'next';

export function EdgeProxySettings({ serverResponse }: { serverResponse: string }) {
  const handleInvalidContextId = async () => {
    await init({ clientKey: 'key', contextId: ' ', siteId: '456' });
  };
  const handleUndefinedContextId = async () => {
    await init({ clientKey: 'key', siteId: '456' } as ISettingsParamsBrowser);
  };
  const handleInvalidSiteId = async () => {
    await init({ clientKey: 'key', contextId: '123', siteId: ' ' });
  };
  const handleUndefinedSiteId = async () => {
    await init({ clientKey: 'key', contextId: '123' } as ISettingsParamsBrowser);
  };
  const handleHappyPath = async () => {
    await init({ clientKey: 'key', contextId: '123', siteId: '456' });
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
    initServer({
      clientKey: 'key',
      contextId,
      siteId,
      pointOfSale: 'spinair.com',
    } as ISettingsParamsServer);

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

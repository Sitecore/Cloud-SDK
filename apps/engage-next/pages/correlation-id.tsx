import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { personalize as personalizeServer } from '@sitecore-cloudsdk/personalize/server';
import type { GetServerSidePropsContext } from 'next';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';

export default function CorrelationID() {
  const sendPersonalizeFromAPIWithCorrelationID = async () => {
    await fetch(
      '/api/personalize?friendlyId=personalizeintegrationtest&timeout=2000&testID=sendPersonalizeFromAPIWithCorrelationID'
    );
  };

  const sendPersonalizeFromBrowserWithCorrelationID = async () => {
    const testID = 'sendPersonalizeFromBrowserWithCorrelationID';

    decorateAll(testID);
    await personalize({
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
    });
    resetAllDecorators();
  };

  return (
    <div>
      <div>
        <h1 data-testid='personalizePageTitle'>Correlation ID page</h1>
        <button
          type='button'
          data-testid='sendPersonalizeFromAPIWithCorrelationID'
          onClick={sendPersonalizeFromAPIWithCorrelationID}>
          Request Personalize From API With Correlation ID
        </button>
        <button
          type='button'
          data-testid='sendPersonalizeFromBrowserWithCorrelationID'
          onClick={sendPersonalizeFromBrowserWithCorrelationID}>
          Request Personalize From Browser With Correlation ID
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const testID = context.query.testID;

  if (testID === 'sendPersonalizeFromServerSidePropsWithCorrelationID') {
    await CloudSDK(context.req, context.res, {
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      siteName: process.env.SITE_ID as string
    })
      .addPersonalize()
      .initialize();

    decorateAll(testID as string);
    await personalizeServer(context.req, {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
    });
    resetAllDecorators();
  }

  return { props: {} };
}

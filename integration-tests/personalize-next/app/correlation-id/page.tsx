'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { decorateAll, resetAllDecorators } from '../../src/e2e-decorators/decorate-all';

export default function CorrelationID() {
  const sendPersonalizeFromAPIWithCorrelationID = async () => {
    await fetch(
      '/api/personalize?friendlyId=personalizeintegrationtest&timeout=2000&testID=requestPersonalizeFromAPIWithCorrelationID'
    );
  };

  const sendPersonalizeFromBrowserWithCorrelationID = async () => {
    const testID = 'sendPersonalizeFromBrowserWithCorrelationID';

    CloudSDK({
      siteName: 'spinair.com',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addPersonalize()
      .initialize();

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
          data-testid='requestPersonalizeFromAPIWithCorrelationID'
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

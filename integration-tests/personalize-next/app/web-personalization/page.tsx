'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';

export default function WebPersonalization() {
  const cid = process.env.CONTEXT_ID || '';
  const initializeWithoutWebPersonalization = () => {
    CloudSDK({ siteName: 'spinair.com', sitecoreEdgeContextId: cid })
      .addEvents()
      .addPersonalize({ webPersonalization: false })
      .initialize();
  };

  const initializeWithWebPersonalization = () => {
    CloudSDK({ siteName: 'spinair.com', sitecoreEdgeContextId: cid })
      .addEvents()
      .addPersonalize({ webPersonalization: true })
      .initialize();
  };

  const initializeWithDefaultWebPersonalization = () => {
    CloudSDK({ siteName: 'spinair.com', sitecoreEdgeContextId: cid })
      .addEvents()
      .addPersonalize({ webPersonalization: {} })
      .initialize();
  };

  const initializeWithProvidedWebPersonalization = () => {
    CloudSDK({ siteName: 'spinair.com', sitecoreEdgeContextId: cid })
      .addEvents()
      .addPersonalize({ webPersonalization: { async: false, defer: true } })
      .initialize();
  };
  const initializeWebPersonalizationWithoutEvents = () => {
    CloudSDK({ siteName: 'spinair.com', sitecoreEdgeContextId: cid })
      .addPersonalize({ webPersonalization: true })
      .initialize();
  };

  return (
    <div>
      <h1 data-testid='webPersonalizationPage'>WebPersonalization Page</h1>
      <button
        type='button'
        data-testid='initializeWithoutWebPersonalization'
        onClick={initializeWithoutWebPersonalization}>
        Initialize without webPersonalization
      </button>
      <button
        type='button'
        data-testid='initializeWithWebPersonalization'
        onClick={initializeWithWebPersonalization}>
        Initialize with webPersonalization
      </button>
      <button
        type='button'
        data-testid='initializeWithDefaultWebPersonalization'
        onClick={initializeWithDefaultWebPersonalization}>
        Initialize with default webPersonalization
      </button>
      <button
        type='button'
        data-testid='initializeWithProvidedWebPersonalization'
        onClick={initializeWithProvidedWebPersonalization}>
        Initialize with provided webPersonalization
      </button>
      <button
        type='button'
        data-testid='initializeWebPersonalizationWithoutEvents'
        onClick={initializeWebPersonalizationWithoutEvents}>
        Initialize webPersonalization without events
      </button>
    </div>
  );
}

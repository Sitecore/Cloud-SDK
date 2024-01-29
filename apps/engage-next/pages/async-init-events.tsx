import { init, pageView } from '@sitecore-cloudsdk/events/browser';
import { init as initPersonalize } from '@sitecore-cloudsdk/personalize/browser';
import React from 'react';

const AsyncInitEvents = () => {
  const eventData = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'async-init-events',
  };

  const pageViewWithoutInit = async () => {
    await pageView(eventData);
  };

  const pageViewWithInit = async () => {
    init({
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    await pageView(eventData);
  };

  const sendEventWithoutAwaitingInitFunctions = async () => {
    initPersonalize({
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    init({
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    await pageView(eventData);
  };

  return (
    <div>
      <button
        onClick={pageViewWithInit}
        data-testid='sendEventWithoutAwait'>
        pageViewWithInit
      </button>
      <button
        onClick={pageViewWithoutInit}
        data-testid='sendEventWithoutInit'>
        pageViewWithoutInit
      </button>
      <button
        onClick={sendEventWithoutAwaitingInitFunctions}
        data-testid='sendEventWithoutAwaitingInitFunctions'>
        sendEventWithoutAwaitingInitFunctions
      </button>
    </div>
  );
};

export default AsyncInitEvents;

import React, { useState } from 'react';
import { init, personalize } from '@sitecore-cloudsdk/personalize/browser';
import { init as initEvents } from '@sitecore-cloudsdk/events/browser';

export default function AsyncInitPersonalize() {
  const [responseBody, setResponseBody] = useState('');
  const personalizeData = {
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
    page: 'async-init-personalize',
  };

  const personalizeWithoutInit = async () => {
    await personalize(personalizeData);
  };

  const personalizeWithInit = async () => {
    init({
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    const response = await personalize(personalizeData);
    setResponseBody(JSON.stringify(response));
  };

  const sendPersonalizeWithoutAwaitingInitFunctions = async () => {
    initEvents({
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    init({
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    const response = await personalize(personalizeData);
    setResponseBody(JSON.stringify(response));
  };

  return (
    <div>
      <button
        onClick={personalizeWithoutInit}
        data-testid='sendPersonalizeWithoutInit'>
        personalizeWithoutInit
      </button>
      <button
        onClick={personalizeWithInit}
        data-testid='sendPersonalizeWithoutAwait'>
        personalizeWithInit
      </button>
      <button
        onClick={sendPersonalizeWithoutAwaitingInitFunctions}
        data-testid='sendPersonalizeWithoutAwaitingInitFunctions'>
        sendPersonalizeWithoutAwaitingInitFunctions
      </button>
      <label htmlFor='response'>EP Response:</label>
      <input
        type='text'
        id='response'
        name='response'
        data-testid='response'
        value={responseBody}
        onChange={() => {
          // not needed
        }}
      />
    </div>
  );
}

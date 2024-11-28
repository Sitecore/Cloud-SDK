'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { identity, IdentityData } from '@sitecore-cloudsdk/events/browser';

export default function Page() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: process.env.SITE_NAME as string,
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addEvents()
      .initialize();
  }, []);

  const [identityDataInput, setIdentityDataInput] = useState('');

  const sendIdentityEvent = async () => {
    const identityData: IdentityData = JSON.parse(identityDataInput);
    await identity(identityData);
  };

  const sendIdentityEventWithExceedExtensionData = async () => {
    const extensionData = Array.from(Array(52).keys()).reduce((acc, _, i) => ({ ...acc, [`test_${i}`]: `${i}` }), {});
    await identity({ extensionData, identifiers: [{ id: '', provider: '' }] });
  };

  return (
    <div>
      <h2>identity event</h2>
      <textarea
        style={{ width: '1000px' }}
        value={identityDataInput}
        onChange={(e) => setIdentityDataInput(e.target.value)}
        data-testid='identityDataInput'
        rows={4}
        cols={40}
      />
      <br />
      <button
        data-testid='sendIdentityEvent'
        onClick={sendIdentityEvent}>
        Send identity event
      </button>
      <br />
      <button
        data-testid='sendIdentityEventWithExceedExtensionData'
        onClick={sendIdentityEventWithExceedExtensionData}>
        Send identity event with exceed ExtensionData
      </button>
    </div>
  );
}

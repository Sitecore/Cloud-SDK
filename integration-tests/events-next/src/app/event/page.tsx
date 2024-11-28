'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { event, EventData } from '@sitecore-cloudsdk/events/browser';

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

  const [eventDataInput, setEventDataInput] = useState('');

  const sendCustomEvent = async () => {
    const eventData: EventData = JSON.parse(eventDataInput);
    await event(eventData);
  };

  const sendCustomEventWithExceedExtensionData = async () => {
    const extensionData = Array.from(Array(52).keys()).reduce((acc, _, i) => ({ ...acc, [`test_${i}`]: `${i}` }), {});
    await event({ type: 'CUSTOM', extensionData });
  };

  return (
    <div>
      <h2>custom event</h2>
      <textarea
        style={{ width: '1000px' }}
        value={eventDataInput}
        onChange={(e) => setEventDataInput(e.target.value)}
        data-testid='eventDataInput'
        rows={4}
        cols={40}
      />
      <br />
      <button
        data-testid='sendCustomEvent'
        onClick={sendCustomEvent}>
        Send custom event
      </button>
      <br />
      <button
        data-testid='sendCustomEventWithExceedExtensionData'
        onClick={sendCustomEventWithExceedExtensionData}>
        Send custom event with exceed ExtensionData
      </button>
    </div>
  );
}

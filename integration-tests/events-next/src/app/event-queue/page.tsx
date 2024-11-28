'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import { addToEventQueue, clearEventQueue, type EventData, processEventQueue } from '@sitecore-cloudsdk/events/browser';

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

  const addEventToQueue = async () => {
    const eventData: EventData = JSON.parse(eventDataInput);
    await addToEventQueue(eventData);
  };

  const processEventFromQueue = async () => {
    await processEventQueue();
  };

  const clearEventsFromQueue = async () => {
    await clearEventQueue();
  };

  return (
    <div>
      <h2>event queue</h2>
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
        data-testid='addEventToQueue'
        onClick={addEventToQueue}>
        Add event to queue
      </button>
      <br />
      <button
        data-testid='processEventFromQueue'
        onClick={processEventFromQueue}>
        Process event from queue
      </button>
      <br />
      <button
        data-testid='clearEventsFromQueue'
        onClick={clearEventsFromQueue}>
        clear event queue
      </button>
    </div>
  );
}

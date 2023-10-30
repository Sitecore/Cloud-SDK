// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { INestedObject } from '@sitecore-cloudsdk/engage-utils';
import { addToEventQueue, processEventQueue, clearEventQueue } from '@sitecore-cloudsdk/events';

export function EventToQueue() {
  const addEventToQueue = () => {
    const eventAttributes = new URLSearchParams(window.location.search);
    const extensionDataNested = eventAttributes.get('nested')
      ? JSON.parse(eventAttributes.get('nested') as string)
      : {};
    const topLevelAttributes = eventAttributes.get('topLevelAttributes')
      ? JSON.parse(eventAttributes.get('topLevelAttributes') as string)
      : {};
    const type = eventAttributes.get('type') ?? '';

    const multipleEvents = getParamsFromUrl('addMultiToQueue');

    eventAttributes.delete('addMultiToQueue');

    const event = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN'
    };

    eventAttributes.delete('nested');
    eventAttributes.delete('type');
    eventAttributes.delete('topLevelAttributes');

    Object.entries(topLevelAttributes).forEach(([key, value]: [string, unknown]) => {
      event[key as keyof typeof event] = value as string;
    });

    const extensionDataExt: Record<string, unknown> = {};
    eventAttributes.forEach((value, key) => {
      extensionDataExt[key as keyof typeof extensionDataExt] = value;
    });

    const extensionData: INestedObject = {};
    if (extensionDataNested && Object.keys(extensionDataNested).length)
      extensionData.nested = { ...extensionDataNested };
    if (Object.keys(extensionDataExt).length) Object.assign(extensionData, extensionDataExt);

    if (multipleEvents && multipleEvents.length > 0) {
      addMultipleEventsToQueue(type, extensionData, parseInt(multipleEvents));
    }

    addToEventQueue(type, event, extensionData);
  };

  function addMultipleEventsToQueue(type: string, extensionData: INestedObject, multipleEvents: number) {
    for (let index = 1; index < multipleEvents; index++) {
      const eventTwo = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: `testEvent${index}`
      };
      addToEventQueue(type, eventTwo, extensionData);
    }
  }

  function addInputTypeEventQueue(type: string) {
    const event = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN'
    };

    addToEventQueue(type, event);
  }

  const getParamsFromUrl = (parameter: string) => {
    return new URLSearchParams(window.location.search).get(parameter);
  };

  const sendEventsFromQueue = () => {
    processEventQueue();
  };

  const clearQueue = () => {
    clearEventQueue();
  };

  return (
    <div>
      <h1 data-testid='addCustomEventToQueuePageTitle'>Add Custom Event To Queue</h1>
      <div>
        <button
          data-testid='addEventToQueue'
          onClick={addEventToQueue}>
          Add Event to Queue
        </button>
        <input
          type='text'
          id='typeInput'
          data-testid='typeInput'></input>
        <button
          data-testid='addInputTypeEventQueue'
          onClick={() => {
            addInputTypeEventQueue((document.getElementById('typeInput') as HTMLInputElement).value);
          }}>
          Add Given Type Event to Queue
        </button>
        <button
          data-testid='sendEventsFromQueue'
          onClick={sendEventsFromQueue}>
          Send Events from Queue
        </button>
        <button
          data-testid='clearQueue'
          onClick={clearQueue}>
          Clear Event Queue
        </button>
      </div>
    </div>
  );
}

export default EventToQueue;

import { processEventQueue } from './processEventQueue';
import { EventAttributesInput } from '../events/common-interfaces';
import * as init from '../../lib/initializer/browser/initializer';
import * as core from '@sitecore-cloudsdk/core';
import * as eventQueue from './eventStorage';
import { addToEventQueue } from './addToEventQueue';
import { CustomEvent } from '../events/custom-event/custom-event';

jest.mock('../events/custom-event/custom-event');
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('processEventQueue', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const sendAllEventsSpy = jest.spyOn(eventQueue.eventQueue, 'sendAllEvents');
  const enqueueEventSpy = jest.spyOn(eventQueue.eventQueue, 'enqueueEvent');

  const settingsParams: core.SettingsParamsBrowser = {
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeContextId: '123',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not send any event if queue is empty', async () => {
    await init.init(settingsParams);
    processEventQueue();

    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
  });

  it('should send all events that are in the queue', async () => {
    const eventData: EventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };

    await init.init(settingsParams);
    addToEventQueue('TEST_TYPE', { ...eventData });
    processEventQueue();

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenCalledTimes(2);
  });
});

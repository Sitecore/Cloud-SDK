import { addToEventQueue } from './addToEventQueue';
import * as core from '@sitecore-cloudsdk/core';
import * as eventQueue from './eventStorage';
import * as initializerModule from '../initializer/browser/initializer';
import { EventData } from '../events/custom-event/custom-event';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const eventData: EventData = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  channel: 'WEB',
  currency: 'EUR',
  language: 'EN',
  page: 'races',
  type: 'TEST_TYPE',
};

describe('addToEventQueue', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should add an event to the queue with the correct payload', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getSettings').mockReturnValueOnce({} as core.Settings);
    jest.spyOn(core, 'getBrowserId').mockReturnValueOnce('id');

    const enqueueEventSpy = jest.spyOn(eventQueue.eventQueue, 'enqueueEvent');

    await addToEventQueue(eventData);

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getSettingsSpy = jest.spyOn(core, 'getSettings');

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await addToEventQueue(eventData)).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});

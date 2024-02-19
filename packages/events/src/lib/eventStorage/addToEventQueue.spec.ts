import { addToEventQueue } from './addToEventQueue';
import { EventAttributesInput } from '../events/common-interfaces';
import * as core from '@sitecore-cloudsdk/core';
import * as eventQueue from './eventStorage';
import * as initializerModule from '../initializer/browser/initializer';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const eventData: EventAttributesInput = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  channel: 'WEB',
  currency: 'EUR',
  language: 'EN',
  page: 'races',
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

    await addToEventQueue('TEST_TYPE', { ...eventData });

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getSettingsSpy = jest.spyOn(core, 'getSettings');

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await addToEventQueue('TEST_TYPE', { ...eventData })).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});

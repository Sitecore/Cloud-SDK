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

    const eventData: EventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };

    await addToEventQueue('TEST_TYPE', { ...eventData });

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
  });
});

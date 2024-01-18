import { addToEventQueue } from './addToEventQueue';
import { EventAttributesInput } from '../events/common-interfaces';
import * as init from '../../lib/initializer/browser/initializer';
import * as core from '@sitecore-cloudsdk/core';
import * as eventQueue from './eventStorage';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('addToEventQueue', () => {
  const settingsParams: core.SettingsParamsBrowser = {
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeContextId: '123',
  };

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should add an event to the queue with the correct payload', async () => {
    const enqueueEventSpy = jest.spyOn(eventQueue.eventQueue, 'enqueueEvent');

    const eventData: EventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };

    await init.init(settingsParams);
    addToEventQueue('TEST_TYPE', { ...eventData });

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
  });
});

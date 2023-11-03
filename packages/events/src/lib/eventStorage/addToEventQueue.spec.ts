import { addToEventQueue } from './addToEventQueue';
import { IEventAttributesInput } from '../events/common-interfaces';
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
  const getDependenciesSpy = jest.spyOn(init, 'getDependencies');

  const settingsParams: core.ISettingsParamsBrowser = {
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.ICdpResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should add an event to the queue with the correct payload', async () => {
    const enqueueEventSpy = jest.spyOn(eventQueue.EventQueue.prototype, 'enqueueEvent');

    const eventData: IEventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    await init.init(settingsParams);
    addToEventQueue('TEST_TYPE', { ...eventData });
    expect(getDependenciesSpy).toHaveBeenCalledTimes(1);
    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
  });
});

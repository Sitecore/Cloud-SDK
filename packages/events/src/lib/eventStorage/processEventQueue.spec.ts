import { processEventQueue } from './processEventQueue';
import { IEventAttributesInput } from '../events/common-interfaces';
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
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.ICdpResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const getDependenciesSpy = jest.spyOn(init, 'getDependencies');
  const sendAllEventsSpy = jest.spyOn(eventQueue.EventQueue.prototype, 'sendAllEvents');
  const enqueueEventSpy = jest.spyOn(eventQueue.EventQueue.prototype, 'enqueueEvent');

  const settingsParams: core.ISettingsParamsBrowser = {
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should not send any event if queue is empty', async () => {
    await init.init(settingsParams);
    processEventQueue();
    expect(getDependenciesSpy).toHaveBeenCalledTimes(1);
    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
  });

  it('should send all events that are in the queue', async () => {
    // const eventQueueSpy = jest.spyOn(eventQueue.EventQueue.prototype, 'enqueueEvent');
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
    processEventQueue();
    expect(CustomEvent).toHaveBeenCalledTimes(2);
  });
});

import { clearEventQueue } from './clearEventQueue';
import * as init from '../../lib/initializer/browser/initializer';
import * as core from '@sitecore-cloudsdk/engage-core';
import * as eventQueue from './eventStorage';

jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('clearEventQueue', () => {
  const getDependenciesSpy = jest.spyOn(init, 'getDependencies');

  const settingsParams: core.ISettingsParamsBrowser = {
    contextId: '123',
    cookieDomain: 'cDomain',
    siteId: '456',
  };
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.ICdpResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should clear the queue', async () => {
    const clearQueueSpy = jest.spyOn(eventQueue.EventQueue.prototype, 'clearQueue');

    await init.init(settingsParams);
    clearEventQueue();
    expect(getDependenciesSpy).toHaveBeenCalledTimes(1);
    expect(clearQueueSpy).toHaveBeenCalledTimes(1);
  });
});

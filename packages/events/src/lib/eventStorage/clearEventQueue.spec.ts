import { clearEventQueue } from './clearEventQueue';
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
describe('clearEventQueue', () => {
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

  it('should clear the queue', async () => {
    const clearQueueSpy = jest.spyOn(eventQueue.eventQueue, 'clearQueue');

    await init.init(settingsParams);
    clearEventQueue();

    expect(clearQueueSpy).toHaveBeenCalledTimes(1);
  });
});

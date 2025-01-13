import type * as core from '@sitecore-cloudsdk/core/internal';
import * as initializerModule from '../initializer/browser/initializer';
import { clearEventQueue } from './clearEventQueue';
import * as eventQueue from './eventStorage';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
describe('clearEventQueue', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should clear the queue', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const clearQueueSpy = jest.spyOn(eventQueue.eventQueue, 'clearQueue');

    await clearEventQueue();

    expect(clearQueueSpy).toHaveBeenCalledTimes(1);
  });
});

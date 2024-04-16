import * as core from '@sitecore-cloudsdk/core';
import * as initializerModule from '../initializer/browser/initializer';
import { getGuestId } from './getGuestId';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('getGuestId', () => {
  const getGuestIdSpy = jest.spyOn(core, 'getGuestId');
  const id = 'test_id';
  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

  const getSettingsSpy = jest.spyOn(core, 'getSettings');
  const getSettingsWrapperSpy = jest.spyOn(core, 'handleGetSettingsError');

  const awaitInitSpy = jest.spyOn(initializerModule, 'awaitInit');

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getGuestIdFromCore with the correct parameters and resolve with guestId', async () => {
    awaitInitSpy.mockResolvedValueOnce();
    getSettingsSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: 'https://localhost',
    });

    getGuestIdSpy.mockResolvedValueOnce('guestID');

    const guestID = await getGuestId();
    expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(guestID).toBe('guestID');
    expect(getSettingsWrapperSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', async () => {
    awaitInitSpy.mockResolvedValue();
    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await getGuestId()).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});

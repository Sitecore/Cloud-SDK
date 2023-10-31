import { getGuestId } from './getGuestId';
import * as core from '@sitecore-cloudsdk/core';
import * as EventSettings from '../../lib/initializer/browser/initializer';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('getGuestId', () => {
  const getDependenciesSpy = jest.spyOn(EventSettings, 'getDependencies');
  const getGuestIdSpy = jest.spyOn(core, 'getGuestId');

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.ICdpResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getGuestIdFromCore with the correct parameters and resolve with guestId', async () => {
    getDependenciesSpy.mockReturnValueOnce({
      id: '_id',
      settings: {
        clientKey: 'key',
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'name',
          cookiePath: '/'
        },
        includeUTMParameters: true,
        targetURL: 'https://domain',
      },
    } as any);

    getGuestIdSpy.mockResolvedValueOnce('guestID');

    const guestID = await getGuestId();
    expect(getDependenciesSpy).toHaveBeenCalledTimes(1);
    expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(guestID).toBe('guestID');
  });

  it('should throw error if settings have not been configured properly', async () => {
    expect(() => getGuestId()).toThrow(
      '[IE-0006] You must first initialize the "events" module. Run the "init" function.'
    );
  });
});

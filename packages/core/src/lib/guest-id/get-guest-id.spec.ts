import * as fetchGuestIdFromEdgeProxyModule from './fetch-guest-id-from-edge-proxy';
import * as initializerModule from '../initializer/browser/initializer';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import { getGuestId } from './get-guest-id';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('getGuestId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getGuestIdFromCore with the correct parameters and resolve with guestId', async () => {
    const id = 'test_id';
    const getGuestIdSpy = jest.spyOn(fetchGuestIdFromEdgeProxyModule, 'fetchGuestIdFromEdgeProxy');
    const getCookieValueClientSideSpy = jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValueOnce(id);
    const getSettingsSpy = jest.spyOn(initializerModule, 'getCloudSDKSettings').mockReturnValue({
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        names: { browserId: 'bid_name', guestId: 'gid_name' },
        path: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: ''
    });

    getGuestIdSpy.mockResolvedValueOnce('guestID');

    const guestID = await getGuestId();
    expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(guestID).toBe('guestID');
    expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
  });
});

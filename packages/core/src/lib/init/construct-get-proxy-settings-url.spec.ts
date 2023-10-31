import { TARGET_URL } from '../consts';
import { constructGetProxySettingsUrl } from './construct-get-proxy-settings-url';
describe('constructBrowserIdUrl', () => {
  it('should correctly create the URL for retrieving the browser ID and Client Key from EDGE events proxy', () => {
    const contextId = '83d8199c-2837-4c29-a8ab-1bf234fea2d1';
    const result = constructGetProxySettingsUrl(contextId);
    expect(result).toBe(
      `${TARGET_URL}/events/v1.2/browser/create.json?sitecoreContextId=83d8199c-2837-4c29-a8ab-1bf234fea2d1&client_key=`
    );
  });
});

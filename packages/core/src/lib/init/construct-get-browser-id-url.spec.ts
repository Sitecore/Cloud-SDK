import { SITECORE_EDGE_URL } from '../consts';
import { constructGetBrowserIdUrl } from './construct-get-browser-id-url';
describe('constructGetBrowserIdUrl', () => {
  it('should correctly create the URL for retrieving the browser Id from EDGE events proxy', () => {
    const sitecoreEdgeContextId = '83d8199c-2837-4c29-a8ab-1bf234fea2d1';
    const result = constructGetBrowserIdUrl(SITECORE_EDGE_URL, sitecoreEdgeContextId);
    expect(result).toBe(
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?sitecoreContextId=83d8199c-2837-4c29-a8ab-1bf234fea2d1&client_key=`
    );
    expect(result).toBe(
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?sitecoreContextId=83d8199c-2837-4c29-a8ab-1bf234fea2d1&client_key=`
    );
  });
});

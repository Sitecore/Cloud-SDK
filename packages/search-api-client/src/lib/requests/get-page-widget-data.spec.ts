import * as getSettingsModule from '../initializer/browser/initializer';
import * as sendPostRequestModule from './post-request';
import { Context } from '../request-entities/context/context';
import { getPageWidgetData } from './get-page-widget-data';
import { init } from '../initializer/browser/initializer';

describe('getPageWidgetData function', () => {
  const settings = {
    siteName: 'siteName',
    sitecoreEdgeContextId: 'sitecoreEdgeContextId.com'
  };
  const sendPostRequestSpy = jest.spyOn(sendPostRequestModule, 'sendPostRequest');
  sendPostRequestSpy.mockImplementation(async () => {
    return {} as unknown as sendPostRequestModule.SearchEndpointResponse;
  });

  const getSettingsSpy = jest.spyOn(getSettingsModule, 'getSettings');
  getSettingsSpy.mockReturnValue(settings);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should construct the request and call sendPostRequest with context`, async () => {
    const contextRequestData = new Context({ page: { uri: '/test' } });

    const expectedBody = JSON.stringify(contextRequestData.toDTO());

    init(settings);
    await getPageWidgetData('/test');

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });
});

import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages } from '../../consts';
import * as getSettingsModule from '../../init/browser/initializer';
import { init } from '../../init/browser/initializer';
import { Context } from '../../request-entities/context/context';
import * as sendPostRequestModule from '../post-request';
import { getPageWidgetData } from './get-page-widget-data';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsBrowser: jest.fn()
  };
});

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

  it(`should construct the request and call sendPostRequest with context using new init`, async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser').mockReturnValue(settings as any);

    const contextRequestData = new Context({ page: { uri: '/test' } });

    const expectedBody = JSON.stringify(contextRequestData.toDTO());

    await getPageWidgetData('/test');

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });

  it('should throw an error if context is missing page property', async () => {
    const context = new Context({});

    await expect(getPageWidgetData(context)).rejects.toThrow(ErrorMessages.MV_0006);
  });
  it('should construct the request and call sendPostRequest with context when page is properly passed', async () => {
    const context = new Context({ page: { uri: '/test' } });
    const expectedBody = JSON.stringify(context.toDTO());

    await getPageWidgetData(context);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });
});

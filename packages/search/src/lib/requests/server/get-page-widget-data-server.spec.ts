import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages } from '../../consts';
import { Context } from '../../request-entities/context/context';
import * as sendPostRequestModule from '../post-request';
import { getPageWidgetDataServer } from './get-page-widget-data-server';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn()
  };
});

describe('getPageWidgetDataServer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const sendPostRequestSpy = jest.spyOn(sendPostRequestModule, 'sendPostRequest');
  sendPostRequestSpy.mockImplementation(async () => {
    return {} as unknown as sendPostRequestModule.SearchEndpointResponse;
  });

  it(`should construct the request and call sendPostRequest`, async () => {
    const newSettings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: ''
    };

    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);

    const contextRequestData = new Context({ page: { uri: '/test' } });

    const expectedBody = JSON.stringify(contextRequestData.toDTO());

    await getPageWidgetDataServer('/test');

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, newSettings);
  });

  it('should throw an error if context is missing page property', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    const context = new Context({});

    await expect(getPageWidgetDataServer(context)).rejects.toThrow(ErrorMessages.MV_0006);
  });

  it('should construct the request and call sendPostRequest with context when page is properly passed', async () => {
    const settings = {
      siteName: 'siteName',
      sitecoreEdgeContextId: 'sitecoreEdgeContextId,com',
      sitecoreEdgeUrl: 'asd'
    };

    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(settings as any);

    const context = new Context({ page: { uri: '/test' } });
    const expectedBody = JSON.stringify(context.toDTO());

    await getPageWidgetDataServer(context);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });
});

import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { WidgetItem } from '../../request-entities/widgets/widget-item';
import { WidgetRequestData } from '../../request-entities/widgets/widget-request-data';
import * as sendPostRequestModule from '../post-request';
import { getWidgetDataServer } from './get-widget-data-server';

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

describe('getWidgetDataServer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const sendPostRequestSpy = jest.spyOn(sendPostRequestModule, 'sendPostRequest');
  sendPostRequestSpy.mockImplementation(async () => {
    return {} as unknown as sendPostRequestModule.SearchEndpointResponse;
  });

  it(`should construct the response and call sendPostRequest`, async () => {
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

    const validWidgetItem = {
      entity: 'test',
      widgetId: 'test'
    };

    const widget1 = new WidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
    const widgetRequest = new WidgetRequestData([widget1]);

    const expectedBody = JSON.stringify(widgetRequest.toDTO());

    await getWidgetDataServer(widgetRequest);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, newSettings);
  });
});

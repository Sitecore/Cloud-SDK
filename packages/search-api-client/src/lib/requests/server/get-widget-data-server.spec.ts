import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as getSettingsModule from '../../init/server/initializer';
import * as sendPostRequestModule from '../post-request';
import { WidgetItem } from '../../request-entities/widgets/widget-item';
import { WidgetRequestData } from '../../request-entities/widgets/widget-request-data';
import { getWidgetDataServer } from './get-widget-data-server';
import { initServer } from '../../init/server/initializer';

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

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined
    },
    headers: {
      get: () => '',
      host: ''
    },
    ip: undefined,
    url: ''
  };

  const res = {
    cookies: {
      set() {
        return 'test';
      }
    }
  };
  const sendPostRequestSpy = jest.spyOn(sendPostRequestModule, 'sendPostRequest');
  sendPostRequestSpy.mockImplementation(async () => {
    return {} as unknown as sendPostRequestModule.SearchEndpointResponse;
  });

  it(`should construct the response and call sendPostRequest`, async () => {
    const settings = {
      siteName: 'siteName',
      sitecoreEdgeContextId: 'sitecoreEdgeContextId,com',
      userId: 'userId'
    };

    jest.spyOn(getSettingsModule, 'getSettings').mockReturnValue(settings);

    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    const widget1 = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    const widgetRequest = new WidgetRequestData([widget1]);

    const expectedBody = JSON.stringify(widgetRequest.toDTO());

    await initServer(req, res, settings);

    await getWidgetDataServer(widgetRequest);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });
  it(`should construct the response and call sendPostRequest using new init`, async () => {
    const newSettings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        names: { browserId: 'bid_name', guestId: 'gid_name' },
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
      rfkId: 'test'
    };

    const widget1 = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    const widgetRequest = new WidgetRequestData([widget1]);

    const expectedBody = JSON.stringify(widgetRequest.toDTO());

    await getWidgetDataServer(widgetRequest);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, newSettings);
  });
});

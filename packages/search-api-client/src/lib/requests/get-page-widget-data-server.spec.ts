import * as getSettingsModule from '../initializer/server/initializer';
import * as sendPostRequestModule from './post-request';
import { Context } from '../request-entities/context/context';
import { getPageWidgetDataServer } from './get-page-widget-data-server';
import { initServer } from '../initializer/server/initializer';

describe('getWidgetData function', () => {
  const settings = {
    siteName: 'siteName',
    sitecoreEdgeContextId: 'sitecoreEdgeContextId,com',
    userId: 'userId'
  };

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

  const getSettingsSpy = jest.spyOn(getSettingsModule, 'getSettings');
  getSettingsSpy.mockReturnValue(settings);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should construct the request and call sendPostRequest`, async () => {
    const contextRequestData = new Context({ page: { uri: '/test' } });

    const expectedBody = JSON.stringify(contextRequestData.toDTO());

    await initServer(req, res, settings);

    await getPageWidgetDataServer('/test');

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });
});

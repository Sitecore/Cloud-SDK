import * as getSettingsModule from '../initializer/server/initializer';
import * as sendPostRequestModule from './post-request';

import { WidgetItem } from '../request-entities/widgets/widget-item';
import { WidgetRequestData } from '../request-entities/widgets/widget-request-data';
import { getWidgetDataServer } from './get-widget-data-server';
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

  it(`should construct the response and call sendPostRequest`, async () => {
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
});

import * as getSettingsModule from '../initializer/browser/initializer';
import * as sendPostRequestModule from './post-request';

import { Context } from '../request-entities/context/context';
import { WidgetItem } from '../request-entities/widgets/widget-item';
import { WidgetRequestData } from '../request-entities/widgets/widget-request-data';
import { getWidgetData } from './get-widget-data';
import { init } from '../initializer/browser/initializer';

describe('getWidgetData function', () => {
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

  it(`should construct the response and call sendPostRequest without context`, async () => {
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    const widget1 = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    const widgetRequest = new WidgetRequestData([widget1]);

    const expectedBody = JSON.stringify(widgetRequest.toDTO());

    init(settings);
    await getWidgetData(widgetRequest);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });

  it(`should construct the response and call sendPostRequest with context`, async () => {
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    const widget1 = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    const widgetRequest = new WidgetRequestData([widget1]);

    const contextRequestData = new Context({ locale: { country: 'us', language: 'en' } });

    const expectedBody = JSON.stringify({ ...contextRequestData.toDTO(), ...widgetRequest.toDTO() });

    init(settings);
    await getWidgetData(widgetRequest, contextRequestData);

    expect(sendPostRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendPostRequestSpy).toHaveBeenCalledWith(expectedBody, settings);
  });
});

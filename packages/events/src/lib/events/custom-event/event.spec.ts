import { event } from './event';
import { CustomEvent, CustomEventInput } from './custom-event';
import { sendEvent } from '../send-event/sendEvent';
import * as core from '@sitecore-cloudsdk/core';
import * as initializerModule from '../../initializer/browser/initializer';

jest.mock('../../initializer/browser/initializer');
jest.mock('./custom-event');

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('eventServer', () => {
  let eventData: CustomEventInput;
  const type = 'CUSTOM_TYPE';
  const extensionData = { extKey: 'extValue' };
  const id = 'test_id';
  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

  const getSettingsSpy = jest.spyOn(core, 'getSettings');

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };
  });

  it('should send a custom event to the server', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

    await event(type, eventData, extensionData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData: {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      },
      extensionData: {
        extKey: 'extValue',
      },
      id,
      sendEvent,
      settings: {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
          cookiePath: '/',
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: '',
      },
      type: 'CUSTOM_TYPE',
    });

    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await event(type, eventData, extensionData)).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});

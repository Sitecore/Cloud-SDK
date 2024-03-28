import { event } from './event';
import { CustomEvent, EventData } from './custom-event';
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
  let eventData: EventData;
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
      extensionData: {
        extKey: 'extValue',
      },
      language: 'EN',
      page: 'races',
      type: 'CUSTOM_TYPE',
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

    await event(eventData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
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
    });

    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await event(eventData)).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});

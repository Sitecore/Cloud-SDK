import { initServer } from './initializer';
import { IEventAttributesInput } from '../events/common-interfaces';
import { CustomEvent, IdentityEvent, PageViewEvent } from '../events';
import { EventApiClient } from '../cdp/EventApiClient';
import packageJson from '../../../package.json';
import { ICdpResponse, ISettingsParamsServer } from '@sitecore-cloudsdk/engage-core';
import { IMiddlewareNextResponse } from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../consts';

jest.mock('../events');

import * as core from '@sitecore-cloudsdk/engage-core';

jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('initializer', () => {
  const eventApiClient = new EventApiClient(core.TARGET_URL, '123', '456');
  const id = 'test_id';
  let mockRequest = {
    cookies: {
      get: () => 'test_id',
      set: () => undefined,
    },
    headers: {
      get: () => '',
    },
    ip: undefined,
  };
  const settingsParams: ISettingsParamsServer = {
    contextId: '123',
    cookieDomain: 'cDomain',
    siteId: '456',
  };
  const settingsObj: core.ISettings = {
    contextId: '123',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
      cookieTempValue: 'bid_value'
    },
    siteId: '456',
  };

  afterEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      cookies: {
        get: () => 'test_id',
        set: () => undefined,
      },
      headers: {
        get: () => '',
      },
      ip: undefined,
    };
  });

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
      host: '',
    },
    ip: undefined,
    url: '',
  };
  const res: IMiddlewareNextResponse = {
    cookies: {
      set() {
        return 'test';
      },
    },
  };

  it('should return an object with available functionality', async () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as ICdpResponse) });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValue(id);
    jest.spyOn(core, 'createSettings').mockResolvedValue(settingsObj);

    const eventsServer = await initServer(settingsParams);
    const eventData: IEventAttributesInput = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    expect(typeof eventsServer.version).toBe('string');
    expect(eventsServer.version).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(typeof eventsServer).toBe('object');
    expect(typeof eventsServer.handleCookie).toBe('function');
    expect(typeof eventsServer.event).toBe('function');
    expect(typeof eventsServer.identity).toBe('function');

    eventsServer.event('TEST_TYPE', { ...eventData }, mockRequest);
    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData,
      id,
      settings: { ...settingsObj },
      type: 'TEST_TYPE',
    });

    const identityEventData = {
      ...eventData,
      city: 'city',
      country: 'gr',
      email: 'email@gmail.com',
      identifiers: [
        {
          id: 'email@gmail.com',
          provider: 'email',
        },
      ],
    };
    eventsServer.identity(identityEventData, mockRequest);
    expect(IdentityEvent).toHaveBeenCalledTimes(1);
    expect(IdentityEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData: identityEventData,
      id,
      settings: { ...settingsObj },
    });

    const newMock = { ...mockRequest, headers: { host: 'localhost:3000' } } as any;
    eventsServer.pageView(eventData, newMock);
    expect(typeof eventsServer.pageView).toBe('function');

    expect(PageViewEvent).toHaveBeenCalledTimes(1);
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData,
      id,
      searchParams: '',
      settings: { ...settingsObj },
    });

    const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

    await eventsServer.handleCookie(req, res);

    expect(handleServerCookieSpy).not.toHaveBeenCalled();
  });

  it('should call Page View with all the correct values when different urls are passed', async () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as ICdpResponse) });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValue(id);
    jest.spyOn(core, 'createSettings').mockResolvedValue(settingsObj);

    const eventsServer = await initServer({ ...settingsParams, enableServerCookie: true });
    const eventData: IEventAttributesInput = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    // Page View Test
    const newMock = { ...mockRequest, url: ' ' };
    eventsServer.pageView(eventData, newMock);
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData,
      id,
      searchParams: '',
      settings: { ...settingsObj },
    });
    newMock.url = 'https://tddadadaest/api/pageview-event?channel=WEB&currency=EUR&pointOfSale=spinair.com';
    eventsServer.pageView(eventData, newMock);
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData,
      id,
      searchParams: '?channel=WEB&currency=EUR&pointOfSale=spinair.com',
      settings: { ...settingsObj },
    });

    newMock.url = '/api/pageview-event?channel=WEB&currency=EUR&pointOfSale=spinair.com';
    eventsServer.pageView(eventData, newMock);
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData,
      id,
      searchParams: '?channel=WEB&currency=EUR&pointOfSale=spinair.com',
      settings: { ...settingsObj },
    });

    const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

    await eventsServer.handleCookie(req, res, 100);

    expect(handleServerCookieSpy).toHaveBeenCalledTimes(1);
    expect(handleServerCookieSpy).toHaveBeenCalledWith(req, res, settingsObj, 100);
  });

  it('should not call handleCookie if enableServerCookie is false', async () => {
    jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValue(id);
    jest.spyOn(core, 'createSettings').mockResolvedValue(settingsObj);

    const eventsServer = await initServer({ ...settingsParams, enableServerCookie: false });

    const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

    await eventsServer.handleCookie(req, res, 100);

    expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);
  });
  it('should not call handleCookie if enableServerCookie is undefined', async () => {
    jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValue(id);
    jest.spyOn(core, 'createSettings').mockResolvedValue(settingsObj);

    const eventsServer = await initServer(settingsParams);

    const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

    await eventsServer.handleCookie(req, res, 100);

    expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);
  });
});

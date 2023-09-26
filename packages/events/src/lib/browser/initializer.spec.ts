import { init } from './initializer';
import { CustomEvent, IdentityEvent, IIdentityEventAttributesInput, PageViewEvent } from '../events';
import { IEventAttributesInput } from '../events/common-interfaces';
import { EventApiClient } from '../cdp/EventApiClient';
import { EventQueue } from '../eventStorage/eventStorage';

import * as GetBrowserId from '../../../../engage-core/src/lib/init/get-browser-id';
import * as CreateCookie from '../../../../engage-core/src/lib/cookie/create-cookie';
import * as CookieExists from '../../../../engage-utils/src/lib/cookies/cookie-exists';
import * as CreateSettings from '../../../../engage-core/src/lib/settings/create-settings';
import * as UpdatePointOfSale from '../../../../engage-core/src/lib/settings/update-point-of-sale';
import * as InferCore from '../../../../engage-core/src/lib/infer/infer';
import * as GetGuestId from '../../../../engage-core/src/lib/init/get-guest-id';

jest.mock('../../../../engage-core/src/lib/infer/infer');
jest.mock('../../../../engage-core/src/lib/init/get-guest-id');
jest.mock('../eventStorage/eventStorage');
jest.mock('../events');
// jest.mock('../events/identity-event');

const settingsParams: ISettingsParamsBrowser = {
  clientKey: 'key',
  cookieDomain: 'cDomain',
  targetURL: 'https://domain',
};

import packageJson from '../../../package.json';
import { API_VERSION, ICdpResponse, ISettingsParamsBrowser } from '@sitecore-cloudsdk/engage-core';
import { LIBRARY_VERSION } from '../consts';

describe('initializer', () => {
  const { window } = global;
  const id = 'test_id';
  const eventApiClient = new EventApiClient('https://domain', API_VERSION);
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as ICdpResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  jest.spyOn(CreateCookie, 'createCookie').mock;
  const settingsObj = {
    clientKey: 'key',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
      forceServerCookieMode: false,
    },
    includeUTMParameters: true,
    targetURL: 'https://domain',
  };
  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  it('should try to create a cookie if it does not exist', () => {
    jest.spyOn(CreateCookie, 'createCookie').mock;
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(false);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });

    init(settingsParams);

    expect(CreateCookie.createCookie).toHaveBeenCalledTimes(1);
  });

  it('should not try to create a cookie if it already exists', () => {
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });

    init(settingsParams);

    expect(CreateCookie.createCookie).toHaveBeenCalledTimes(0);
  });
  it('should return an object with available functionality', async () => {
    const eventData: IEventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue(settingsObj);

    const events = await init(settingsParams);

    expect(typeof events.version).toBe('string');
    expect(events.version).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(typeof events.pageView).toBe('function');
    expect(typeof events.event).toBe('function');
    expect(typeof events.identity).toBe('function');
    expect(typeof events.getGuestId).toBe('function');

    expect(typeof events.updatePointOfSale).toBe('function');
    expect(typeof events.addToEventQueue).toBe('function');
    expect(typeof events.processEventQueue).toBe('function');
    expect(typeof events.clearEventQueue).toBe('function');
    expect(typeof events.form).toBe('function');

    events.addToEventQueue('TEST_TYPE', { ...eventData });
    events.processEventQueue();
    events.clearEventQueue();
    expect(EventQueue).toHaveBeenCalledTimes(1);

    events.pageView(eventData);
    expect(PageViewEvent).toHaveBeenCalledTimes(1);
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData,
      id,
      infer: expect.any(InferCore.Infer),
      searchParams: '',
      settings: { ...settingsObj },
    });

    events.event('TEST_TYPE', { ...eventData });
    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData: { ...eventData },
      id,
      infer: expect.any(InferCore.Infer),
      settings: { ...settingsObj },
      type: 'TEST_TYPE',
    });

    events.getGuestId();
    expect(GetGuestId.getGuestId).toBeCalledTimes(1);

    events.form('1234', 'SUBMITTED', 'spinair.com');
    expect(CustomEvent).toBeCalledTimes(2);
    expect(CustomEvent).toHaveBeenLastCalledWith({
      eventApiClient,
      eventData: { pointOfSale: 'spinair.com' },
      extensionData: { formId: '1234', interactionType: 'SUBMITTED' },
      id,
      infer: expect.objectContaining({
        language: expect.any(Function),
        pageName: expect.any(Function),
      }),
      settings: { ...settingsObj },
      type: 'FORM',
    });
  });

  it('should invoke enqueueEvent when addToEventQueue is called', async () => {
    const enqueueEventSpy = jest.spyOn(EventQueue.prototype, 'enqueueEvent');
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    const eventData: IEventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    const events = await init(settingsParams);

    events.addToEventQueue('TEST_TYPE', { ...eventData });

    expect(EventQueue).toHaveBeenCalledTimes(1);
    expect(EventQueue).toHaveBeenCalledWith(sessionStorage, eventApiClient, expect.any(InferCore.Infer));
    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
    expect(enqueueEventSpy).toHaveBeenCalledWith({
      eventData: eventData,
      extentionData: undefined,
      id: 'test_id',
      settings: {
        clientKey: 'key',
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'name',
          cookiePath: '/',
          forceServerCookieMode: false,
        },
        includeUTMParameters: true,
        targetURL: 'https://domain',
      },
      type: 'TEST_TYPE',
    });
  });

  it('should invoke sendAllEvents when processEventQueue is called', async () => {
    const sendAllEventsSpy = jest.spyOn(EventQueue.prototype, 'sendAllEvents');
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    const eventData: IEventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    const events = await init(settingsParams);

    events.addToEventQueue('TEST_TYPE1', { ...eventData });
    events.addToEventQueue('TEST_TYPE2', { ...eventData });
    events.processEventQueue();

    expect(EventQueue).toHaveBeenCalledTimes(1);
    expect(EventQueue).toHaveBeenCalledWith(sessionStorage, eventApiClient, expect.any(InferCore.Infer));
    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
  });

  it('should invoke clearQueue when clearEventQueue is called', async () => {
    const clearQueueSpy = jest.spyOn(EventQueue.prototype, 'clearQueue');
    const events = await init(settingsParams);
    events.clearEventQueue();

    expect(EventQueue).toHaveBeenCalledTimes(1);
    expect(clearQueueSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an object with available functionality when calling CustomEvent', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    const eventData: IEventAttributesInput = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue(settingsObj);

    const events = await init(settingsParams);

    events.event('TEST_TYPE', { ...eventData });
    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData: { ...eventData },
      id,
      infer: expect.any(InferCore.Infer),
      settings: { ...settingsObj },
      type: 'TEST_TYPE',
    });
  });

  it('should return an object with available functionality when calling identity', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    const eventData: IIdentityEventAttributesInput = {
      channel: 'WEB',
      city: '',
      country: '',
      currency: 'EUR',
      dob: undefined,
      email: 'sitecore@gmail.com',
      firstName: '',
      gender: '',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      lastName: '',
      mobile: '',
      page: 'identity',
      phone: '',
      pointOfSale: 'spinair.com',
      postalCode: '',
      state: '',
      street: [''],
      title: '',
    };

    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue(settingsObj);

    const events = await init(settingsParams);

    events.identity({ ...eventData, identifiers: [{ id: 'id', provider: 'email' }] });
    expect(IdentityEvent).toHaveBeenCalledTimes(1);
    expect(IdentityEvent).toHaveBeenCalledWith({
      eventApiClient,
      eventData: { ...eventData, identifiers: [{ id: 'id', provider: 'email' }] },
      id,
      infer: expect.any(InferCore.Infer),
      settings: { ...settingsObj },
    });
  });

  it('should invoke get browser id method when calling the getBrowserId method', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);

    const events = await init(settingsParams);
    events.getBrowserId();
    expect(GetBrowserId.getBrowserId).toHaveBeenCalledTimes(2);
  });

  it('should return the browser id when calling the getBrowserId method', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);

    const events = await init(settingsParams);
    events.getBrowserId();
    expect(GetBrowserId.getBrowserId).toHaveReturnedWith(id);
  });

  it('should return the browser id when calling the getBrowserId method from the window Engage property', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window.Engage = { test: 'test' } as any;
    expect(global.window.Engage).toBeDefined();
    await init(settingsParams);
    if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
    expect(GetBrowserId.getBrowserId).toHaveBeenCalledTimes(2);
  });

  it('should return the browser id when calling the getBrowserId method from the window while Engage property is missing from the window', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window.Engage = undefined as any;
    expect(global.window.Engage).toBeUndefined();
    await init(settingsParams);
    if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
    expect(GetBrowserId.getBrowserId).toHaveBeenCalledTimes(2);
  });

  it('adds method to get ID to window Engage property when engage is on window', async () => {
    await init(settingsParams);
    expect(global.window.Engage).toBeDefined();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    global.window.Engage = { test: 'test' } as any;
    expect((global.window.Engage as any).test).toEqual('test');
    /* eslint-enable @typescript-eslint/no-explicit-any */
    expect(global.window.Engage?.getBrowserId).toBeDefined;
  });

  it('should throw error if window is undefined', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window;

    await expect(async () => {
      await init(settingsParams);
    }).rejects.toThrowError(
      // eslint-disable-next-line max-len
      `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
    );
  });

  it('should invoke updatePointOfSale when updatePointOfSale is called', async () => {
    const updatePointOfSaleSpy = jest.spyOn(UpdatePointOfSale, 'updatePointOfSale');

    const events = await init(settingsParams);
    events.updatePointOfSale('newPointOfSale');

    expect(updatePointOfSaleSpy).toHaveBeenCalledTimes(1);
    expect(updatePointOfSaleSpy).toHaveBeenCalledWith('newPointOfSale', {
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      pointOfSale: 'newPointOfSale',
      targetURL: 'https://domain',
    });
  });
  it('should add the library version to window.Engage object', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window.Engage = undefined as any;
    expect(global.window.Engage).toBeUndefined();
    await init(settingsParams);
    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({ events: LIBRARY_VERSION });
  });
  it('should expand the window.Engage object', async () => {
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window.Engage = { test: 'test', versions: { testV: '1.0.0' } } as any;
    await init(settingsParams);
    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({
      events: LIBRARY_VERSION,
      testV: '1.0.0',
    });
  });
});

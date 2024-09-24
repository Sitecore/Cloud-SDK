import * as getCdnUrl from '../../web-personalization/get-cdn-url';
import * as internal from '@sitecore-cloudsdk/core/internal';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import { PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import { addPersonalize, sideEffects } from './initializer';
import { PackageInitializer } from '@sitecore-cloudsdk/core/internal';
import debug from 'debug';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
    // eslint-disable-next-line @typescript-eslint/naming-convention
  };
});
jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PackageInitializer: jest.fn()
  };
});

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn())
  };
});

describe('sideEffects', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const debugMock = debug as unknown as jest.Mock;
  it('should add the library properties to window.scCloudSDK object and inject the script', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce('https://test');
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue('test');
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { names: { browserId: 'bid' } } } as any;
    });
    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects({ webPersonalization: { async: true, defer: false } });
    expect(global.window.scCloudSDK.personalize).toBeDefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
    expect(global.window.scCloudSDK.personalize.settings).toEqual({ async: true, defer: false });
    expect(appendScriptWithAttributesMock).toHaveBeenCalledWith({ async: true, src: 'https://test' });
    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('personalizeClient library initialized');
  });
  it('should not inject the script if the getCdnUrl returns null', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce(null);
    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    await sideEffects({ webPersonalization: { async: true, defer: false } });
    expect(appendScriptWithAttributesMock).not.toHaveBeenCalled();
  });
  it('should not add the settings properties to window.scCloudSDK object and not inject the script', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce(null);
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue('test');
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { names: { browserId: 'bid' } } } as any;
    });
    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects({ webPersonalization: false });
    expect(global.window.scCloudSDK.personalize).toBeDefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
    expect(global.window.scCloudSDK.personalize.settings).toBeUndefined();
    expect(appendScriptWithAttributesMock).not.toHaveBeenCalled();
    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('personalizeClient library initialized');
  });

  it(`should not add the following methods: 
    \`pageView\`, \`identity\`, \`form\`, \`event\`, \`addToEventQueue\`, \`processEventQueue\` and \`clearEventQueue\` 
    to window.scCloudSDK.personalize object`, async () => {
    expect(global.window.scCloudSDK).toStrictEqual({
      personalize: {
        version: PACKAGE_VERSION
      }
    });
    await sideEffects({ webPersonalization: false });
    expect(global.window.scCloudSDK.personalize.pageView).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.identity).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.form).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.event).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.addToEventQueue).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.processEventQueue).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.clearEventQueue).toBeUndefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
  });

  it(`should add the following methods:
    \`pageView\`, \`identity\`, \`form\`, \`event\`, \`addToEventQueue\`, \`processEventQueue\` and \`clearEventQueue\`
    to window.scCloudSDK.personalize object`, async () => {
    expect(global.window.scCloudSDK).toStrictEqual({
      personalize: {
        version: PACKAGE_VERSION
      }
    });
    await sideEffects({ webPersonalization: { async: true, defer: true } });
    expect(global.window.scCloudSDK.personalize.pageView).toBeDefined();
    expect(global.window.scCloudSDK.personalize.identity).toBeDefined();
    expect(global.window.scCloudSDK.personalize.form).toBeDefined();
    expect(global.window.scCloudSDK.personalize.event).toBeDefined();
    expect(global.window.scCloudSDK.personalize.addToEventQueue).toBeDefined();
    expect(global.window.scCloudSDK.personalize.processEventQueue).toBeDefined();
    expect(global.window.scCloudSDK.personalize.clearEventQueue).toBeDefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
  });
});

describe('addPersonalize', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should run the addPersonalize function', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any);

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [],
      settings: { webPersonalization: false },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
  it('should run the addPersonalize function and set webPersonalizetion to false if false is provided', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: false });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [],
      settings: { webPersonalization: false },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });

  it('should run the addPersonalize function and use default values for web personalize when true', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: true });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }],
      settings: { webPersonalization: { async: true, defer: false } },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
  it(`should run the addPersonalize function and use async
     default values for web personalize when not provided`, async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: { defer: true } });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }],
      settings: { webPersonalization: { async: true, defer: true } },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
  it(`should run the addPersonalize function and use defer
     default values for web personalize when not provided`, async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: { async: false } });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }],
      settings: { webPersonalization: { async: false, defer: false } },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
  it('should run the addPersonalize function and use provided values for web personalize when object', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: { async: false, defer: true } });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }],
      settings: { webPersonalization: { async: false, defer: true } },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
  it('should run the addPersonalize function and use provided values for web personalize when object', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: {} });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }],
      settings: { webPersonalization: { async: true, defer: false } },
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
});

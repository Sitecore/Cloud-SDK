import debug from 'debug';
import { PackageInitializer } from '@sitecore-cloudsdk/core/internal';
import * as core from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_VERSION } from '../../consts';
import { addEvents, awaitInit, sideEffects } from './initializer';
import * as initModule from './initializer';

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
  const debugMock = debug as unknown as jest.Mock;
  it('should add the library properties to window.scCloudSDK object', async () => {
    const eventProperties = [
      'pageView',
      'identity',
      'form',
      'event',
      'addToEventQueue',
      'processEventQueue',
      'clearEventQueue',
      'version'
    ];

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects();
    expect(global.window.scCloudSDK.events.version).toEqual(PACKAGE_VERSION);
    eventProperties.forEach((property) => {
      expect((window.scCloudSDK.events as any)[property]).toBeDefined();
    });

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('eventsClient library initialized');
  });
});

describe('addEvents', () => {
  it('should run the addEvents function', async () => {
    const fakeThis = {};

    const result = addEvents.call(fakeThis as any);

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({ sideEffects });
    expect(result).toEqual(fakeThis);
  });
});

describe('awaitInit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw error if initState promise is null', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/namespace
    initModule.initState = null;
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce(null as any);
    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0014);
  });

  it('should not throw if initState is a Promise', async () => {
    const getEnabledPackageSpy = jest
      .spyOn(core, 'getEnabledPackageBrowser')
      .mockReturnValueOnce({ initState: Promise.resolve() } as any);

    await initModule.awaitInit();

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });
});

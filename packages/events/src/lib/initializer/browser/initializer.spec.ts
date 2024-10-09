import debug from 'debug';
import * as core from '@sitecore-cloudsdk/core/internal';
import { PackageInitializer } from '@sitecore-cloudsdk/core/internal';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import { EVENTS_NAMESPACE, PACKAGE_VERSION } from '../../consts';
import { addEvents, sideEffects } from './initializer';

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
  it('should add the library properties to window.Engage object', async () => {
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue('test');
    jest.spyOn(core, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { name: { browserId: 'bid' } } } as any;
    });

    global.window.Engage = undefined as any;
    expect(global.window.Engage).toBeUndefined();

    await sideEffects();

    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({ events: PACKAGE_VERSION });
    expect(global.window.Engage.getBrowserId).toEqual(expect.any(Function));

    const bid = (global.window.Engage as any).getBrowserId();

    expect(bid).toBe('test');

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('eventsClient library initialized');
  });
});

describe('addPersonalize', () => {
  it('should run the addPersonalize function', async () => {
    const fakeThis = {};

    const result = addEvents.call(fakeThis as any);

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({ sideEffects });
    expect(result).toEqual(fakeThis);
  });
});

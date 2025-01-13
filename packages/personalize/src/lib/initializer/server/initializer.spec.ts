import debug from 'debug';
import { PackageInitializerServer } from '@sitecore-cloudsdk/core/internal';
import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, PACKAGE_NAME, PERSONALIZE_NAMESPACE } from '../../consts';
import * as createPersonalizeCookieModule from './createPersonalizeCookie';
import * as initializerModule from './initializer';
import { verifyPersonalizePackageExistence } from './initializer';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PackageInitializerServer: jest.fn(),
    cloudSKDRequest: {},
    cloudSKDResponse: {},
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn()
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const debugMock = debug as unknown as jest.Mock;
  it('should run the side effects, debug the status and call createPersonalizeCookie if conditions met', async () => {
    jest
      .spyOn(coreInternalModule, 'getCloudSDKSettingsServer')
      .mockReturnValue({ cookieSettings: { enableServerCookie: true, name: 'bid' } } as any);

    jest
      .spyOn(coreInternalModule, 'getEnabledPackageServer')
      .mockReturnValue({ settings: { cookieSettings: { name: 'gid' }, enablePersonalizeCookie: true } } as any);

    const createPersonalizeCookieSpy = jest
      .spyOn(createPersonalizeCookieModule, 'createPersonalizeCookie')
      .mockImplementation(jest.fn());

    await initializerModule.sideEffects();

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('personalizeServer library initialized');
    expect(createPersonalizeCookieSpy).toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('should run the side effects, debug the status and NOT call createPersonalizeCookie if conditions not met', async () => {
    jest
      .spyOn(coreInternalModule, 'getCloudSDKSettingsServer')
      .mockReturnValue({ cookieSettings: { enableServerCookie: false, name: 'bid' } } as any);

    jest
      .spyOn(coreInternalModule, 'getEnabledPackageServer')
      .mockReturnValue({ settings: { cookieSettings: { name: 'gid' }, enablePersonalizeCookie: true } } as any);

    const createPersonalizeCookieSpy = jest
      .spyOn(createPersonalizeCookieModule, 'createPersonalizeCookie')
      .mockImplementation(jest.fn());

    await initializerModule.sideEffects();

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('personalizeServer library initialized');
    expect(createPersonalizeCookieSpy).not.toHaveBeenCalled();
  });
});

describe('addPersonalize', () => {
  it('should run the addPersonalize function', async () => {
    const fakeThis = {};
    const result = initializerModule.addPersonalize.call(fakeThis as any);

    expect(PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(PackageInitializerServer).toHaveBeenCalledWith({
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        enablePersonalizeCookie: false
      },
      sideEffects: initializerModule.sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
});

describe('verifyPersonalizePackageExistence', () => {
  it('should not throw an error when the package is enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(true as any);

    expect(() => verifyPersonalizePackageExistence()).not.toThrow();
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });

  it('should throw an error when the package is not enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(false as any);

    expect(() => verifyPersonalizePackageExistence()).toThrow(ErrorMessages.IE_0017);
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });
});

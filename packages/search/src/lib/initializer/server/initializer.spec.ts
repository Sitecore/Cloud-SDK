import debug from 'debug';
import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, PACKAGE_NAME, SEARCH_NAMESPACE } from '../../consts';
import { addSearch, sideEffects, verifySearchPackageExistence } from './initializer';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PackageInitializerServer: jest.fn()
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
  it('should run the side effects and debug the status', async () => {
    await sideEffects();

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(SEARCH_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('searchServer library initialized');
  });
});

describe('addSearch', () => {
  const pkgDeps = [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }];
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should run the addSearch function without settings', async () => {
    const fakeThis = {};
    const result = addSearch.call(fakeThis as any);

    expect(coreInternalModule.PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(coreInternalModule.PackageInitializerServer).toHaveBeenCalledWith({ dependencies: pkgDeps, sideEffects });
    expect(result).toEqual(fakeThis);
  });
});

describe('verifySearchPackageExistence', () => {
  it('should not throw an error when the package is enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(true as any);

    expect(() => verifySearchPackageExistence()).not.toThrow();
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });

  it('should throw an error when the package is not enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(false as any);

    expect(() => verifySearchPackageExistence()).toThrow(ErrorMessages.IE_0019);
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });
});

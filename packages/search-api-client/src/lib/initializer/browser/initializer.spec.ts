import debug from 'debug';
import { PackageInitializer } from '@sitecore-cloudsdk/core/internal';
import * as core from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, SEARCH_NAMESPACE } from '../../consts';
import * as initModule from './initializer';

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
  it('should run the side effects for the library', async () => {
    await initModule.sideEffects();

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(SEARCH_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('searchClient library initialized');
  });
});

describe('addSearch', () => {
  const pkgDeps = [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }];
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should run the addSearch function without settings', async () => {
    const fakeThis = {};

    const result = initModule.addSearch.call(fakeThis as any);

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({ dependencies: pkgDeps, sideEffects: initModule.sideEffects });
    expect(result).toEqual(fakeThis);
  });
  it('should run the addSearch function with settings', async () => {
    const fakeThis = {};
    const mockSettings = { userId: '123' };

    const result = initModule.addSearch.call(fakeThis as any, mockSettings);

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: pkgDeps,
      settings: mockSettings,
      sideEffects: initModule.sideEffects
    });
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

    const getEnabledPackageSpy = jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce(undefined);
    await expect(async () => {
      await initModule.awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0018);

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });

  it('should not throw if initState is a Promise', async () => {
    const getEnabledPackageSpy = jest
      .spyOn(core, 'getEnabledPackageBrowser')
      .mockReturnValueOnce({ initState: Promise.resolve() } as any);

    await initModule.awaitInit();

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });
});

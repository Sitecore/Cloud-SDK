import { addSearch, sideEffects } from './initializer';
import { PackageInitializerServer } from '@sitecore-cloudsdk/core/internal';
import { SEARCH_NAMESPACE } from '../../consts';
import debug from 'debug';

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

    expect(PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(PackageInitializerServer).toHaveBeenCalledWith({ dependencies: pkgDeps, sideEffects });
    expect(result).toEqual(fakeThis);
  });

  it('should run the addSearch function with settings', async () => {
    const fakeThis = {};
    const mockSettings = { userId: '123' };

    const result = addSearch.call(fakeThis as any, mockSettings);

    expect(PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(PackageInitializerServer).toHaveBeenCalledWith({
      dependencies: pkgDeps,
      settings: mockSettings,
      sideEffects
    });
    expect(result).toEqual(fakeThis);
  });
});

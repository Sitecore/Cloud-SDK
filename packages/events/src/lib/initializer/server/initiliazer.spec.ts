import debug from 'debug';
import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { PackageInitializerServer } from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_NAME } from '../../consts';
import { addEvents, sideEffects, verifyEventsPackageExistence } from './initializer';

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
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('eventsServer library initialized');
  });
});

describe('addEvents', () => {
  it('should run the addEvents function', async () => {
    const fakeThis = {};
    const result = addEvents.call(fakeThis as any);

    expect(PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(PackageInitializerServer).toHaveBeenCalledWith({ sideEffects });
    expect(result).toEqual(fakeThis);
  });
});

describe('verifyEventsPackageExistence', () => {
  it('should not throw an error when the package is enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(true as any);

    expect(() => verifyEventsPackageExistence()).not.toThrow();
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });

  it('should throw an error when the package is not enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(false as any);

    expect(() => verifyEventsPackageExistence()).toThrow(ErrorMessages.IE_0015);
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });
});

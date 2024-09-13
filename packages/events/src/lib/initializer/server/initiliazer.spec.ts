import { addEvents, sideEffects } from './initializer';
import { EVENTS_NAMESPACE } from '../../consts';
import { PackageInitializerServer } from '@sitecore-cloudsdk/core/internal';
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

import * as coreModule from '@sitecore-cloudsdk/core/browser';
import { getBrowserId } from './getBrowserId';

jest.mock('@sitecore-cloudsdk/core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getBrowserId: jest.fn()
  };
});

describe('getBrowserId', () => {
  it('should call getBrowserId from core', async () => {
    const coreGetBrowserIdSpy = jest.spyOn(coreModule, 'getBrowserId').mockReturnValueOnce('test');

    const result = getBrowserId();

    expect(result).toBe('test');

    expect(coreGetBrowserIdSpy).toHaveBeenCalledTimes(1);
  });
});

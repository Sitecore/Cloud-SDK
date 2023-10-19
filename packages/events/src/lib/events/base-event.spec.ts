import { BaseEvent } from './base-event';
import * as core from '@sitecore-cloudsdk/engage-core';

jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('BaseEvent', () => {
  const id = 'test_id';
  const infer = new core.Infer();
  describe('pointOfSale', () => {
    const settings: core.ISettings = {
      clientKey: 'key',
      contextId: '123',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteId: '456',
    };
    const eventData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: '',
    };

    it('should throw error if pointOfSale is not provided', () => {
      const posError = '[MV-0003] "pointOfSale" is required.';
      expect(() => new BaseEvent(eventData, settings, id, infer)).toThrowError(posError);
    });
  });
});

import { ISettings } from '@sitecore-cloudsdk/engage-core';
import { BaseEvent } from './base-event';
import * as InferCore from '../../../../engage-core/src/lib/infer/infer';

jest.mock('../../../../engage-core/src/lib/infer/infer');
describe('BaseEvent', () => {
  const id = 'test_id';
  const infer = new InferCore.Infer();
  describe('pointOfSale', () => {
    const settings: ISettings = {
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
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

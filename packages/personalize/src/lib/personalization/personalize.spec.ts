import * as core from '@sitecore-cloudsdk/core';
import { Personalizer } from './personalizer';
import { personalize } from './personalize';
jest.mock('./personalizer');

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('personalize', () => {
  const { window } = global;
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  const id = 'test_id';

  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

  jest.spyOn(core, 'createCookie').mock;

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });
  const eventData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
    page: 'races',
    pointOfSale: 'spinair.com',
  };

  it('should return an object with available functionality', async () => {
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

    personalize(eventData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(Personalizer).toHaveBeenCalledTimes(1);
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });
});

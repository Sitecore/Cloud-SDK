import * as core from '@sitecore-cloudsdk/core';
import { Personalizer } from './personalizer';
import { personalize } from './personalize';
import * as init from '../initializer/client/initializer';
import { CallFlowEdgeProxyClient } from './callflow-edge-proxy-client';
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

  jest.spyOn(core, 'createCookie').mock;
  const settingsObj: core.ISettings = {
    contextId: '123',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
    },
    siteId: '456',
  };
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
    jest.spyOn(init, 'getDependencies').mockReturnValueOnce({
      callFlowEdgeProxyClient: new CallFlowEdgeProxyClient(settingsObj),
      id: 'mitsos',
      settings: settingsObj,
    });

    expect(typeof personalize).toBe('function');

    personalize(eventData);
    expect(init.getDependencies).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(Personalizer).toHaveBeenCalledTimes(1);
  });
});

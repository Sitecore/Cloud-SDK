import * as core from '@sitecore-cloudsdk/core';
import { Personalizer } from './personalizer';
import { personalizeServer } from './personalizeServer';
import * as init from '../initializer/server/initializer';
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
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
      host: '',
    },
    ip: undefined,
    url: '',
  };

  const eventData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
    page: 'races',
    pointOfSale: 'spinair.com',
  };

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
  });

  it('should return an object with available functionality', async () => {
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest');

    jest.spyOn(init, 'getServerDependencies').mockReturnValueOnce({
      callFlowEdgeProxyClient: new CallFlowEdgeProxyClient(settingsObj),
      settings: settingsObj,
    });

    expect(typeof personalizeServer).toBe('function');

    personalizeServer(eventData, req);
    expect(init.getServerDependencies).toHaveBeenCalledTimes(1);
    expect(getBrowserIdFromRequestSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
  });
});

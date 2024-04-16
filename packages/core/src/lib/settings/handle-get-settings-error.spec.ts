import * as getSettingsServer from '../init/init-core-server';
import { ErrorMessages } from '../consts';
import { handleGetSettingsError } from './handle-get-settings-error';

describe('handleGetSettingsError', () => {
  const getSettingsServerSpy = jest.spyOn(getSettingsServer, 'getSettingsServer');
  const settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid settings object', () => {
    getSettingsServerSpy.mockReturnValue(settings);
    const result = handleGetSettingsError(getSettingsServer.getSettingsServer, 'does not matter in this case');
    expect(result).toBe(settings);
  });

  it('should throw the corresponding error passed as an argument when getSettingsServer throws an error', () => {
    getSettingsServerSpy.mockImplementation(() => {
      throw new Error(ErrorMessages.IE_0008);
    });
    expect(() => handleGetSettingsError(getSettingsServer.getSettingsServer, 'error message to throw')).toThrow(
      'error message to throw'
    );
  });
});

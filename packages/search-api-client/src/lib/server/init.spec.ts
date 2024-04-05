import { init, getSettings } from './init';
import * as validateSettingsModule from '../utils/validateSettings';
import { ServerSettings } from '../types';
import { ErrorMessages } from '../const';

jest.mock('../utils/validateSettings', () => ({
  validateSettings: jest.fn().mockImplementation(() => true),
}));

describe('Initialization and Settings Retrieval on server search-api-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when settings are not initialized', () => {
    expect(getSettings).toThrow(ErrorMessages.IE_0010);
  });

  it('initializes the search-api-client with provided settings', () => {
    const mockSettings = {
      siteName: 'TestSite',
      sitecoreEdgeContextId: 'abc123',
      userId: 'user123',
    };

    init(mockSettings);

    expect(validateSettingsModule.validateSettings).toHaveBeenCalledWith(mockSettings);

    const retrievedSettings = getSettings();
    expect(retrievedSettings).toEqual(mockSettings);
    expect;
  });

  it('throws an error if required settings are missing', () => {
    const mockValidateSettingsWithError = validateSettingsModule.validateSettings as jest.Mock;
    mockValidateSettingsWithError.mockImplementationOnce(() => {
      throw new Error(`Validation failed: ${ErrorMessages.MV_0005}`);
    });

    const incompleteSettings = {
      siteName: 'TestSite',
      sitecoreEdgeContextId: 'abc123',
    };

    expect(() => init(incompleteSettings as ServerSettings)).toThrow(`Validation failed: ${ErrorMessages.MV_0005}`);
  });
});

import * as validateSettingsModule from '../utils/validateSettings';
import { getSettings, init } from './init';
import { BrowserSettings } from '../types';
import { ErrorMessages } from '../const';

jest.mock('../utils/validateSettings', () => ({
  validateSettings: jest.fn().mockImplementation(() => true),
}));

describe('Browser Initialization and Settings Retrieval', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when settings are not initialized', () => {
    expect(getSettings).toThrow(ErrorMessages.IE_0009);
  });

  it('initializes the search-api-client with provided settings and retrieves them', () => {
    const mockSettings = {
      siteName: 'TestSite',
      sitecoreEdgeContextId: 'abc123',
      userId: 'user123',
    };

    init(mockSettings);
    expect(validateSettingsModule.validateSettings).toHaveBeenCalledWith(mockSettings);

    const retrievedSettings = getSettings();
    expect(retrievedSettings).toEqual(mockSettings);
  });

  it('allows re-initialization with new settings', () => {
    const initialSettings = {
      siteName: 'InitialSite',
      sitecoreEdgeContextId: 'initialID',
      userId: 'initialUser',
    };
    const newSettings = {
      siteName: 'NewSite',
      sitecoreEdgeContextId: 'newID',
      userId: 'newUser',
    };

    init(initialSettings);
    init(newSettings);

    expect(validateSettingsModule.validateSettings).toHaveBeenCalledWith(newSettings);

    const updatedSettings = getSettings();
    expect(updatedSettings).toEqual(newSettings);
  });

  it('throws an error if validateSettings fails due to missing required settings', () => {
    const mockValidateSettingsWithError = validateSettingsModule.validateSettings as jest.Mock;
    mockValidateSettingsWithError.mockImplementationOnce(() => {
      throw new Error(`Validation failed`);
    });

    const incompleteSettings = {
      siteName: 'TestSite',
      userId: 'user123',
    };

    expect(() => init(incompleteSettings as BrowserSettings)).toThrow(`Validation failed`);
  });
});

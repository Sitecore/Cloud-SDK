import * as loadPlugins from '../load-plugins';
import { ISettingsParamsBrowserPersonalize, init } from '../../initializer/client/initializer';

describe('load plugins', () => {
  const { window } = global;
  const settingsInput: ISettingsParamsBrowserPersonalize = {
    clientKey: 'key',
    cookieDomain: 'cDomain',
    pointOfSale: 'test_pos',
    targetURL: 'https://domain',
    webPersonalization: true,
  };
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    global.window ??= Object.create(window);
  });
  it('should add the web experience settings to the window object', async () => {
    const expectedSettings = {
      /* eslint-disable @typescript-eslint/naming-convention */
      client_key: settingsInput.clientKey,
      pointOfSale: settingsInput.pointOfSale,
      targetURL: settingsInput.targetURL,
      web_flow_config: { async: true, defer: false },
      web_flow_target: 'https://d35vb5cccm4xzp.cloudfront.net',
    };
    await init(settingsInput);
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(global.window.Engage).toBeDefined();
    expect(global.window.Engage?.settings).toEqual(expectedSettings);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when asyncScriptLoading is true', async () => {
    settingsInput.webPersonalization = {
      asyncScriptLoading: true,
    };
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when asyncScriptLoading is false', async () => {
    settingsInput.webPersonalization = {
      asyncScriptLoading: false,
    };
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when deferScriptLoading is true', async () => {
    settingsInput.webPersonalization = {
      deferScriptLoading: true,
    };
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when deferScriptLoading is false', async () => {
    settingsInput.webPersonalization = {
      deferScriptLoading: false,
    };
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when asyncScriptLoading is true and deferScriptLoading is true', async () => {
    settingsInput.webPersonalization = {
      asyncScriptLoading: true,
      deferScriptLoading: true,
    };
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when asyncScriptLoading is false and deferScriptLoading is false', async () => {
    settingsInput.webPersonalization = {
      asyncScriptLoading: false,
      deferScriptLoading: false,
    };
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should add webflow plugin when webPersonalization is empty object (will load default values)', async () => {
    settingsInput.webPersonalization = {};
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('1 plugins loaded');
  });

  it('should not add webflow plugin when webPersonalization is false', async () => {
    settingsInput.webPersonalization = false;
    const result = await loadPlugins.loadPlugins(settingsInput);
    expect(result).toEqual('0 plugins loaded');
  });
});

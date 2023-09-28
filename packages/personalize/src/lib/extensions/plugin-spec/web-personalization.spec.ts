import webExperiencesPlugin, {
  IWebExperiencesSettings,
  IWebPersonalizationConfig,
} from '../plugins/web-personalization';

import * as appendScriptWithAttributesModule from '../../utils/appendScriptWithAttributes';
import { ISettingsParamsBrowserPersonalize, init } from '../../initializer/client/initializer';

describe('webExperiencesPlugin', () => {
  const { window } = global;
  const webFlowTarget = 'https://d35vb5cccm4xzp.cloudfront.net';
  const appendScriptWithAttributesSpy = jest.spyOn(appendScriptWithAttributesModule, 'appendScriptWithAttributes');
  let expectedSettings: IWebExperiencesSettings;
  const settingsParams: ISettingsParamsBrowserPersonalize = {
    clientKey: 'key',
    cookieDomain: 'cDomain',
    pointOfSale: 'test_pos',
    targetURL: 'https://domain',
  };
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  beforeEach(() => {
    expectedSettings = {
      /* eslint-disable @typescript-eslint/naming-convention */
      client_key: 'key',
      pointOfSale: 'test_pos',
      targetURL: 'https://domain',
      web_flow_config: { async: false, defer: false },
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });
  it('should add the web flow settings to the window when calling initPersonalize', async () => {
    settingsParams.webPersonalization = true;
    settingsParams.pointOfSale = 'test_pos';
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    await init(settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should add the web flow settings to the window when calling initPersonalize when passing different object', async () => {
    settingsParams.webPersonalization = { test: true } as IWebPersonalizationConfig;
    settingsParams.pointOfSale = 'test_pos';
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    await init(settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should add the web flow settings to the window when calling webExperiencesPlugin with boolean flag as true', async () => {
    settingsParams.pointOfSale = 'test_pos';
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;
    const pluginSettings = true;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should return web_flow_config correct values when pass only asyncScriptLoading as false', async () => {
    const pluginSettings = { asyncScriptLoading: false };
    expectedSettings.web_flow_config = { async: false, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should return web_flow_config correct values when pass only deferScriptLoading as false', async () => {
    const pluginSettings = { deferScriptLoading: false };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should return web_flow_config correct values when pass deferScriptLoading as false and asyncScriptLoading as undefined', async () => {
    const pluginSettings = { asyncScriptLoading: undefined, deferScriptLoading: false };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return web_flow_config correct values when pass asyncScriptLoading as false and deferScriptLoading as undefined', async () => {
    const pluginSettings = { asyncScriptLoading: false, deferScriptLoading: undefined };
    expectedSettings.web_flow_config = { async: false, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return web_flow_config correct values when pass asyncScriptLoading and deferScriptLoading as undefined', async () => {
    const pluginSettings = { asyncScriptLoading: undefined, deferScriptLoading: undefined };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return web_flow_target value equal to the baseURLOverride parameter when passed', async () => {
    const pluginSettings = { baseURLOverride: 'customSetWebFlowTarget' };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = 'customSetWebFlowTarget';

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return default values when webPersonalization is an empty object ', async () => {
    const pluginSettings = {};
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webExperiencesPlugin(pluginSettings, settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should invoke the appropriate method to attach webExperiences script on the window document', async () => {
    const expectedAttributes = {
      async: true,
      src: `${webFlowTarget}/web-flow-libs/key/web-version.min.js`,
    };
    webExperiencesPlugin(true, settingsParams);
    expect(appendScriptWithAttributesSpy).toHaveBeenCalledWith(expectedAttributes);
  });

  it('should throw error if pointOfSale is undefined', async () => {
    delete settingsParams.pointOfSale;

    expect(() => webExperiencesPlugin(true, settingsParams)).toThrowError('[MV-0003] "pointOfSale" is required.');
  });
  it('should throw error if bad pointOfSale', async () => {
    settingsParams.pointOfSale = ' ';
    expect(() => webExperiencesPlugin(true, settingsParams)).toThrowError('[MV-0009] "pointOfSale" cannot be empty.');
  });
});

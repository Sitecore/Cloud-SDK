import * as appendScriptWithAttributesModule from '../utils/appendScriptWithAttributes';
import { ISettingsParamsBrowserPersonalize, init } from '../initializer/client/initializer';
import {
  ISettings,
  IWebExperiencesSettings,
  IWebPersonalizationConfig,
  TARGET_URL,
} from '@sitecore-cloudsdk/engage-core';
import { webPersonalization } from './web-personalization';


test('webExperiencesPlugin', () => {
  const { window } = global;
  const webFlowTarget = 'https://d35vb5cccm4xzp.cloudfront.net';
  const appendScriptWithAttributesSpy = jest.spyOn(appendScriptWithAttributesModule, 'appendScriptWithAttributes');
  let expectedSettings: IWebExperiencesSettings;
  const settingsParams: ISettingsParamsBrowserPersonalize = {
    contextId: 'key',
    cookieDomain: 'cDomain',
    siteId: '465',
  };

  const webPersonalizationSettings: ISettings = {
    contextId: '132',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 720,
      cookieName: 'bid_key',
      cookieTempValue: 'bid_value'
    },
    siteId: '456',
  };

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  beforeEach(() => {
    expectedSettings = {
      /* eslint-disable @typescript-eslint/naming-convention */
      client_key: '',
      pointOfSale: 'test_pos',
      targetURL: TARGET_URL,
      web_flow_config: { async: false, defer: false },
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  it('should add the web flow settings to the window when calling initPersonalize', async () => {
    settingsParams.webPersonalization = true;
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    await init(settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should add the web flow settings to the window when calling initPersonalize when passing different object', async () => {
    settingsParams.webPersonalization = { test: true } as IWebPersonalizationConfig;
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    await init(settingsParams);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should add the web flow settings to the window when calling webExperiencesPlugin with boolean flag as true', async () => {
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;
    const pluginSettings = true;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should return web_flow_config correct values when pass only asyncScriptLoading as false', async () => {
    const pluginSettings = { asyncScriptLoading: false };
    expectedSettings.web_flow_config = { async: false, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should return web_flow_config correct values when pass only deferScriptLoading as false', async () => {
    const pluginSettings = { deferScriptLoading: false };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should return web_flow_config correct values when pass deferScriptLoading as false and asyncScriptLoading as undefined', async () => {
    const pluginSettings = { asyncScriptLoading: undefined, deferScriptLoading: false };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return web_flow_config correct values when pass asyncScriptLoading as false and deferScriptLoading as undefined', async () => {
    const pluginSettings = { asyncScriptLoading: false, deferScriptLoading: undefined };
    expectedSettings.web_flow_config = { async: false, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return web_flow_config correct values when pass asyncScriptLoading and deferScriptLoading as undefined', async () => {
    const pluginSettings = { asyncScriptLoading: undefined, deferScriptLoading: undefined };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return web_flow_target value equal to the baseURLOverride parameter when passed', async () => {
    const pluginSettings = { baseURLOverride: 'customSetWebFlowTarget' };
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = 'customSetWebFlowTarget';

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });

  it('should return default values when webPersonalization is an empty object ', async () => {
    const pluginSettings = {};
    expectedSettings.web_flow_config = { async: true, defer: false };
    expectedSettings.web_flow_target = webFlowTarget;

    webPersonalization(pluginSettings, webPersonalizationSettings);
    expect(global.window.Engage.settings).toEqual(expectedSettings);
  });
  it('should invoke the appropriate method to attach webExperiences script on the window document', async () => {
    const expectedAttributes = {
      async: true,
      src: `${webFlowTarget}/web-flow-libs//web-version.min.js`,
    };
    webPersonalization(true, webPersonalizationSettings);
    expect(appendScriptWithAttributesSpy).toHaveBeenCalledWith(expectedAttributes);
  });
});

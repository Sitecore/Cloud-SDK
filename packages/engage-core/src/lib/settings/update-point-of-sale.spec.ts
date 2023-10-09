import { ISettingsParamsBrowser, IWebExperiencesSettings } from './interfaces';
import { updatePointOfSale } from './update-point-of-sale';

describe('updatePointOfSale', () => {
  const { window } = global;

  let settings: ISettingsParamsBrowser;
  let expectedSettings: IWebExperiencesSettings;
  beforeEach(() => {
    settings = {
      clientKey: 'key',
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      forceServerCookieMode: true,
      includeUTMParameters: false,
      targetURL: 'https://api',
    };

    expectedSettings = {
      /* eslint-disable @typescript-eslint/naming-convention */
      client_key: 'key',
      pointOfSale: '',
      targetURL: 'https://domain',
      web_flow_config: { async: true, defer: false },
      web_flow_target: 'test_webflow',
      /* eslint-enable @typescript-eslint/naming-convention */
    };
  });
  afterEach(() => {
    global.window ??= Object.create(window);
  });

  it('should update point of sale with the new value', () => {
    updatePointOfSale('spinair.com', settings);
    expect(settings.pointOfSale).toEqual('spinair.com');
  });

  it('should update point of sale with the new value in settings and in global window when exists', () => {
    global.window.Engage = { settings: expectedSettings } as any;

    updatePointOfSale('spinair.com', settings);
    expect(settings.pointOfSale).toEqual('spinair.com');
    expect(global.window.Engage?.settings?.pointOfSale).toEqual('spinair.com');
  });
  it('should throw error when providing empty string', () => {
    expectedSettings.pointOfSale = 'spinair.com';
    global.window.Engage = { settings: expectedSettings } as any;

    expect(() => {
      updatePointOfSale('', settings);
    }).toThrowError('[MV-0009] "pointOfSale" cannot be empty.');
    expect(settings.pointOfSale).toBeUndefined();
    expect(global.window.Engage?.settings?.pointOfSale).toEqual('spinair.com');
    expect(global.window.Engage?.settings).toEqual(expectedSettings);
  });

  it('should throw error when providing empty space string', () => {
    expectedSettings.pointOfSale = 'spinair.com';
    global.window.Engage = { settings: expectedSettings } as any;

    expect(() => {
      updatePointOfSale('   ', settings);
    }).toThrowError('[MV-0009] "pointOfSale" cannot be empty.');
    expect(settings.pointOfSale).toBeUndefined();
    expect(global.window.Engage?.settings?.pointOfSale).toEqual('spinair.com');
    expect(global.window.Engage?.settings).toEqual(expectedSettings);
  });
});

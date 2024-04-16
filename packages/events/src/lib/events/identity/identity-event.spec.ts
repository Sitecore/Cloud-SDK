/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-comment-style */
import * as core from '@sitecore-cloudsdk/core';
import * as sendEvent from '../send-event/sendEvent';
import * as utils from '@sitecore-cloudsdk/utils';
import { IdentityData, IdentityEvent } from './identity-event';
import { BaseEvent } from '../base-event';
import { MAX_EXT_ATTRIBUTES } from '../consts';

jest.mock('../base-event');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('Test Identity', () => {
  let data: IdentityData;
  let settingsMock: core.Settings;
  const id = 'test_id';

  const isShortISODateStringSpy = jest.spyOn(utils, 'isShortISODateString');

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    data = {
      channel: 'WEB',
      currency: 'EUR',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      page: 'identity',
    };

    settingsMock = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('No changes are made to undefined properties', () => {
    data.email = 'Sitecore@gmail.com';
    expect(
      () =>
        new IdentityEvent({
          id,
          identityData: data,
          sendEvent: sendEvent.sendEvent,
          settings: settingsMock,
        })
    ).not.toThrow(`[MV-0003] "identifiers" is required.`);

    expect(data.city).toEqual(undefined);
    expect(data.country).toEqual(undefined);
    expect(data.firstName).toEqual(undefined);
    expect(data.lastName).toEqual(undefined);
    expect(data.phone).toEqual(undefined);
    expect(data.mobile).toEqual(undefined);
    expect(data.state).toEqual(undefined);
    expect(data.street).toEqual(undefined);
    expect(data.title).toEqual(undefined);
    expect(data.identifiers.length).toBe(1);
  });

  it('should not change anything when street is empty array', () => {
    data.street = [];

    new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });
    expect(data.street).toEqual([]);
  });

  it('should not change anything when street is an array with empty string', () => {
    data.street = [''];
    new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });
    expect(data.street).toEqual(['']);
  });

  it('should change the street to Title Case when one value is provided', () => {
    data.street = ['gennimata'];

    new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });
    expect(data.street).toEqual(['gennimata']);
  });

  it('should change the street array to Title Case with 2 values', () => {
    data.street = ['gennimata', 'ntourma'];

    new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });
    expect(data.street).toEqual(['gennimata', 'ntourma']);
  });

  it('Should throw error when the Identifiers array is empty', () => {
    data = {
      channel: 'WEB',
      currency: 'EUR',
      identifiers: [],
      language: 'EN',
      page: 'identity',
    };

    expect(() => {
      new IdentityEvent({
        id,
        identityData: data,
        sendEvent: sendEvent.sendEvent,
        settings: settingsMock,
      });
    }).toThrow(`[MV-0003] "identifiers" is required.`);
  });

  it('Should throw error when an invalid email parameter is passed', () => {
    data = {
      channel: 'WEB',
      currency: 'EUR',
      email: ' email@example.com',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      page: 'identity',
    };

    expect(() => {
      new IdentityEvent({
        id,
        identityData: data,
        sendEvent: sendEvent.sendEvent,
        settings: settingsMock,
      });
    }).toThrow('[IV-0003] Incorrect value for "email". Set the value to a valid email address.');
  });

  it('should not throw error when the identifiers has object', () => {
    expect(() => {
      new IdentityEvent({
        id,
        identityData: data,
        sendEvent: sendEvent.sendEvent,
        settings: settingsMock,
      });
    }).not.toThrow(`[MV-0003] "identifiers" is required.`);
  });

  it('Should make all values to Title Case', () => {
    data = {
      channel: 'WEB',
      city: 'thessaloniki',
      country: 'gr',
      currency: 'EUR',
      dob: undefined,
      email: 'Sitecore@gmail.com',
      firstName: 'giorgos',
      gender: 'male',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      lastName: 'stavrou',
      mobile: '6911111111',
      page: 'identity',
      phone: '2310111111',
      postalCode: '',
      state: 'macedonia',
      street: ['gennimata'],
      title: 'mr',
    };

    const expectedData = {
      channel: 'WEB',
      city: 'Thessaloniki',
      country: 'GR',
      currency: 'EUR',
      dob: undefined,
      email: 'sitecore@gmail.com',
      firstname: 'Giorgos',
      gender: 'male',
      identifiers: [
        {
          expiry_date: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      lastname: 'Stavrou',
      mobile: '+6911111111',
      page: 'identity',
      phone: '+2310111111',
      postal_code: '',
      state: 'Macedonia',
      street: ['Gennimata'],
      title: 'Mr',
      type: 'IDENTITY',
    };

    new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });

    expect(data.email).not.toEqual(expectedData.email);
    expect(data.city).not.toEqual(expectedData.city);
    expect(data.country).not.toEqual(expectedData.country);
    expect(data.firstName).not.toEqual(expectedData.firstname);
    expect(data.lastName).not.toEqual(expectedData.lastname);
    expect(data.phone).not.toEqual(expectedData.phone);
    expect(data.mobile).not.toEqual(expectedData.mobile);
    expect(data.state).not.toEqual(expectedData.state);
    expect(data.street).not.toEqual(expectedData.street);
    expect(data.title).not.toEqual(expectedData.title);
    expect(data.identifiers).not.toBe(expectedData.identifiers);
    expect(data.identifiers.length).toEqual(1);
  });

  it('should send the event with the identity type', async () => {
    data = {
      channel: 'WEB',
      city: 'city',
      country: 'gr',
      currency: 'EUR',
      dob: undefined,
      email: 'email@gmail.com',
      firstName: 'firstName',
      gender: 'male',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      lastName: 'lastName',
      mobile: '6911111111',
      page: 'identity',
      phone: '2310111111',
      postalCode: '12345',
      state: 'macedonia',
      street: ['street'],
      title: 'mr',
    };

    const expectedData = {
      city: 'city',
      country: 'gr',
      dob: undefined,
      email: 'email@gmail.com',
      firstname: 'firstName',
      gender: 'male',
      identifiers: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          expiry_date: undefined,
          id: '',
          provider: 'email',
        },
      ],
      lastname: 'lastName',
      mobile: '6911111111',
      phone: '2310111111',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      postal_code: '12345',
      state: 'macedonia',
      street: ['street'],
      title: 'mr',
      type: 'IDENTITY',
    };

    const sendEventSpy = jest.spyOn(sendEvent, 'sendEvent');
    const identity = new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });
    identity.send();

    expect(sendEventSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedData),
      expect.objectContaining(settingsMock)
    );
    expect(sendEventSpy).toHaveBeenCalledTimes(1);
  });

  it('Should check if attributeCheckAndValidation is called when IdentityEvent is Created', () => {
    const attributeCheckAndValidationSpy = jest.spyOn(IdentityEvent.prototype as any, 'validateAttributes');
    new IdentityEvent({
      id,
      identityData: data,
      sendEvent: sendEvent.sendEvent,
      settings: settingsMock,
    });

    expect(attributeCheckAndValidationSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if dob has invalid date format', () => {
    isShortISODateStringSpy.mockReturnValueOnce(false);
    data.dob = '2022-1-1T00:00.000Z';

    expect(() => {
      new IdentityEvent({
        id,
        identityData: data,
        sendEvent: sendEvent.sendEvent,
        settings: settingsMock,
      }).send();
    }).toThrow(`[IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.`);
  });

  it('Should throw an error if expiry date has invalid date format', () => {
    isShortISODateStringSpy.mockReturnValueOnce(false);
    data.identifiers[0].expiryDate = '2022-1-1T00:00.000Z';

    expect(() => {
      new IdentityEvent({
        id,
        identityData: data,
        sendEvent: sendEvent.sendEvent,
        settings: settingsMock,
      }).send();
    }).toThrow(`[IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601.`);
  });

  it('should send a identity event with an ext property containing extension data when passed', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const sendEventSpy = jest.spyOn(sendEvent, 'sendEvent');

    const identityData = {
      channel: 'WEB',
      city: 'city',
      country: 'gr',
      currency: 'EUR',
      email: 'email@gmail.com',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
    };

    const extensionData = { test: { a: { b: 'b' }, c: 11 }, testz: 22 };
    const settings: core.Settings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };
    new IdentityEvent({
      id,
      identityData: { ...identityData, extensionData },
      sendEvent: sendEvent.sendEvent,
      settings,
    }).send();

    const expectedAttributes = { ext: { test_a_b: 'b', test_c: 11, testz: 22 } };

    expect(sendEventSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedAttributes),
      expect.objectContaining(settings)
    );
  });

  it('should throw an error when more than 50 ext attributes are passed', () => {
    const extErrorMessage =
      '[IV-0005] "extensionData" supports maximum 50 attributes. Reduce the number of attributes.';
    const identityData = {
      channel: 'WEB',
      city: 'city',
      country: 'gr',
      currency: 'EUR',
      email: 'email@gmail.com',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
    };
    const settings: core.Settings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };
    const extensionData: { [key: string]: string } = {};

    for (let i = 0; i < 51; i++) {
      extensionData[`key${i}`] = `value${i}`;
    }

    expect(() => {
      new IdentityEvent({
        id,
        identityData: { ...identityData, extensionData },
        sendEvent: sendEvent.sendEvent,
        settings,
      }).send();
    }).toThrow(extErrorMessage);
  });

  it('should not throw an error when no more than 50 ext attributes are passed', () => {
    const extErrorMessage =
      '[IV-0005] "extensionData" supports maximum 50 attributes. Reduce the number of attributes.';
    const identityData = {
      channel: 'WEB',
      city: 'city',
      country: 'gr',
      currency: 'EUR',
      email: 'email@gmail.com',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
    };
    const settings: core.Settings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };
    const extensionData: { [key: string]: string } = {};
    for (let i = 0; i < MAX_EXT_ATTRIBUTES; i++) {
      extensionData[`key${i}`] = `value${i}`;
    }

    expect(() => {
      new IdentityEvent({
        id,
        identityData: { ...identityData, extensionData },
        sendEvent: sendEvent.sendEvent,
        settings,
      }).send();
    }).not.toThrow(extErrorMessage);
  });

  it('should not call flatten object method when no extension data is passed', () => {
    const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
    const identityData = {
      channel: 'WEB',
      city: 'city',
      country: 'gr',
      currency: 'EUR',
      email: 'email@gmail.com',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
    };
    const settings: core.Settings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    new IdentityEvent({
      id,
      identityData,
      sendEvent: sendEvent.sendEvent,
      settings,
    }).send();

    expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
  });

  it('should send a custom event without ext attribute if extensionData is an empty object', () => {
    const sendEventSpy = jest.spyOn(sendEvent, 'sendEvent');
    const identityData = {
      channel: 'WEB',
      city: 'city',
      country: 'gr',
      currency: 'EUR',
      email: 'email@gmail.com',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
    };

    const settings: core.Settings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    const extensionData = {};

    new IdentityEvent({
      id,
      identityData: { ...identityData, extensionData },
      sendEvent: sendEvent.sendEvent,
      settings,
    }).send();

    expect(BaseEvent).toHaveBeenCalled();
    expect(BaseEvent).toHaveBeenCalledWith(
      {
        channel: 'WEB',
        currency: 'EUR',
        language: undefined,
        page: undefined,
      },
      'test_id'
    );

    expect(sendEventSpy).toHaveBeenCalledWith(
      expect.not.objectContaining({ ext: {} }),
      expect.objectContaining(settings)
    );
  });
});

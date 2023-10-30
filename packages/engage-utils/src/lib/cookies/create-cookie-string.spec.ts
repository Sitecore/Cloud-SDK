import { createCookieString } from './create-cookie-string';
import { DAILY_SECONDS } from './consts';
import { ICookieProperties } from './interfaces';

describe('createCookieString', () => {
  const cookieMaxAge = 365 * DAILY_SECONDS;

  it('should produce and return a string with provided parameters No SameSite no Security', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=None`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'None',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });
  it('should produce and return a string with provided parameters', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=None; Secure`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'None',
      secure: true,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with the Same Site Lax and Security false', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Lax`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'Lax',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with the Same Site Strict and Security true', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Strict; Secure`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'Strict',
      secure: true,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string without secure property', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Strict`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'Strict',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string without secure property', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Strict; Secure`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'Strict',
      secure: true,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with secure property to false and Max-Age as cookie Max Age', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Lax`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'Lax',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with secure property to false and Max-Age as cookie Max Age', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Strict`;
    const options: ICookieProperties = {
      maxAge: cookieMaxAge,
      sameSite: 'Strict',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  // With domain
  it('should create a cookie string with domain property equal to localhost', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Strict; Domain=localhost`;
    const options: ICookieProperties = {
      domain: 'localhost',
      maxAge: cookieMaxAge,
      sameSite: 'Strict',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with domain property equal to empty string ', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=Strict`;
    const options: ICookieProperties = {
      domain: '',
      maxAge: cookieMaxAge,
      sameSite: 'Strict',
      secure: false,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with all the valid properties', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=None; Secure; Domain=localhost`;
    const options: ICookieProperties = {
      domain: 'localhost',
      maxAge: cookieMaxAge,
      sameSite: 'None',
      secure: true,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });

  it('should create a cookie string with all the valid properties and when using getDefaultCookieAttributes function', () => {
    const expectedString = `cookieName=cookieValue; Max-Age=${cookieMaxAge}; SameSite=None; Secure; Path=/; Domain=localhost`;
    const options: ICookieProperties = {
      domain: 'localhost',
      maxAge: 365 * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true,
    };
    expect(createCookieString('cookieName', 'cookieValue', options)).toEqual(expectedString);
  });
});

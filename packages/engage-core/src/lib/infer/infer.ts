// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * A class that includes all the inferrer functionality of the library
 */
export class Infer {
  /**
   * Returns the uppercase language code of the current web page's root HTML element, using the "lang" attribute.
   * If unavailable or invalid, an undefined is returned.
   * @returns - Language attribute or undefined
   */
  language() {
    return window.document.documentElement.lang.length > 1
      ? new Intl.Locale(window.document.documentElement.lang).language.toLocaleUpperCase()
      : undefined;
  }

  /**
   * Returns the name of the current page extracted from the URL's pathname.
   * If it's the home page, it returns 'Home Page'.
   * @returns - Home Page if root or pathname
   */
  pageName() {
    return window.location.pathname === '/' ? 'Home Page' : (window.location.pathname.split('/').pop() as string);
  }
}

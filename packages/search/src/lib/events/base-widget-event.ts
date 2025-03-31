// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type { BaseSearchEventParams } from './interfaces';

export abstract class BaseSearchEvent {
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;
  protected country?: string;
  protected referrer?: string;
  protected pathname: string;

  constructor({ page, currency, language, channel, pathname, referrer, country }: BaseSearchEventParams) {
    this._validate(currency, language, country);
    this.page = page;
    this.currency = currency;
    this.language = language;
    this.country = country;
    this.channel = channel;
    this.pathname = pathname;
    this.referrer = referrer;
  }
  /**
   * @returns search context object in its DTO format.
   */
  protected _searchContextToDTO() {
    return {
      context: {
        page: {
          ...(this.country && { locale_country: this.country.toLowerCase() }),
          ...(this.currency && { locale_currency: this.currency.toLowerCase() }),
          ...(this.language && { locale_language: this.language.toLowerCase() }),
          ...(this.referrer && { referrer: this.referrer }),
          uri: this.pathname
        }
      }
    };
  }

  /**
   * Validates currency and language codes.
   * @param currency - three-letter currency code in the ISO 4217 format.
   * @param language - two-letter language code in the ISO 639-1 format.
   * @param country - two-letter country code in the ISO 639-1 format.
   * @throws - {@link ErrorMessages.IV_0015} | {@link ErrorMessages.IV_0011} | {@link ErrorMessages.IV_0010}
   */
  private _validate(currency?: string, language?: string, country?: string): void {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (country !== undefined && country.length !== 2) throw new Error(ErrorMessages.IV_0010);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.IV_0011);
  }

  /**
   * Abstract method to be implemented by subclasses for specific DTO mappings.
   */
  abstract toDTO(): NestedObject;
}

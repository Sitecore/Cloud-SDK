// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { isValidLocation } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../../consts';
import type {
  BrowserData,
  CampaignData,
  ContextData,
  ContextDTO,
  GeoData,
  LocaleData,
  LocationData,
  PageData,
  StoreData,
  UserData
} from './interfaces';

export class Context {
  private _campaign?: CampaignData;
  private _locale?: LocaleData;
  private _page?: PageData;
  private _store?: StoreData;
  private _geo?: GeoData;
  private _user?: UserData;
  private _browser?: BrowserData;

  /**
   * @param context - {@link ContextData} The context object.
   */
  constructor(context: ContextData) {
    this._validateContext(context);

    this._campaign = context.campaign;
    this._locale = context.locale;
    this._page = context.page;
    this._store = context.store;
    this._geo = context.geo;
    this._browser = context.browser;
    this._user = context.user;
  }

  /**
   * Sets the campaign data.
   * @param campaign - {@link CampaignData} The new value to set.
   */
  set campaign(campaign: CampaignData) {
    this._campaign = campaign;
  }

  /**
   * @returns The campaign data {@link CampaignData}.
   */
  get campaign(): CampaignData | undefined {
    return this._campaign;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeCampaign(): void {
    this._campaign = undefined;
  }

  /**
   * Sets the locale data.
   * @param locale - The new value to set. {@link LocaleData}
   *
   */
  set locale(locale: LocaleData) {
    this._validateContextLocale(locale);

    this._locale = locale;
  }

  /**
   * @returns the locale data. {@link LocaleData}
   */
  get locale(): LocaleData | undefined {
    return this._locale;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeLocale(): void {
    this._locale = undefined;
  }

  /**
   * Sets the page data.
   * @param page - The new value to set {@link PageData}.
   */
  set page(page: PageData) {
    this._validatePage(page);

    this._page = page;
  }

  /**
   * @returns The page data {@link PageData}.
   */
  get page(): PageData | undefined {
    return this._page;
  }

  /**
   * Sets the page data to undefined
   */
  removePage(): void {
    this._page = undefined;
  }

  /**
   * Validate context locale object.
   *
   * @param locale - the locale object {@link LocaleData}.
   * @throws - {@link ErrorMessages.IV_0010} | {@link ErrorMessages.IV_0011}.
   */
  private _validateContextLocale(locale?: LocaleData): void {
    if (!locale) return;

    if (locale.country.length !== 2) throw new Error(ErrorMessages.IV_0010);
    if (locale.language.length !== 2) throw new Error(ErrorMessages.IV_0011);
  }

  /**
   * Sets the store data.
   * @param store - The new value to set.
   *
   */
  set store(store: StoreData) {
    this._store = store;
  }

  /**
   * @returns The store data {@link StoreData}.
   */
  get store(): StoreData | undefined {
    return this._store;
  }

  /**
   * Sets the store data to undefined
   */
  removeStore(): void {
    this._store = undefined;
  }

  /**
   * Sets the geo data.
   * @param geo - The new value to set {@link GeoData}.
   *
   */
  set geo(geo: GeoData) {
    if (geo.location) this._validateLocation(geo.location);

    this._geo = geo;
  }

  /**
   * @returns The geo data.
   */
  get geo(): GeoData | undefined {
    return this._geo;
  }

  /**
   * Sets the geo data to undefined
   */
  removeGeo(): void {
    this._geo = undefined;
  }

  /**
   * Validate location object.
   *
   * @param location - the location object {@link LocationData}.
   * @throws - {@link ErrorMessages.IV_0012} | {@link ErrorMessages.IV_0013}.
   */
  private _validateLocation(location: LocationData) {
    const result = isValidLocation(location);

    if (!result.latitude) throw new Error(ErrorMessages.IV_0012);

    if (!result.longitude) throw new Error(ErrorMessages.IV_0013);
  }

  /**
   * Sets the user data.
   * @param user - The new value to set {@link UserData}.
   */
  set user(user: UserData | undefined) {
    this._validateUser(user);
    this._user = user;
  }

  /**
   * @returns The user data {@link UserData}.
   */
  get user(): UserData | undefined {
    return this._user;
  }

  /** Simply removes the user data from the context */
  removeUser(): void {
    this._user = undefined;
  }

  /**
   * Validate user object, which is part of the context object.
   * We need to ensure that the user object has `userId` or `uuid`, but not neither.
   * @param user - The user object to validate {@link UserData}.
   */
  private _validateUser(user?: UserData): void {
    if (typeof user !== 'undefined' && !user.userId && !user.uuid) throw new Error(ErrorMessages.MV_0013);
  }

  /**
   * Sets the browser data
   */
  set browser(browser: BrowserData) {
    this._browser = browser;
  }

  /**
   * @returns The browser data {@link BrowserData}.
   */
  get browser(): BrowserData | undefined {
    return this._browser;
  }

  /**
   * Sets the browser dta to undefined.
   */
  removeBrowser(): void {
    this._browser = undefined;
  }

  /**
   * Validate context object {@link ContextData}.
   * @throws - {@link ErrorMessages.MV_0009} | {@link ErrorMessages.IV_0012} | {@link ErrorMessages.IV_0013}
   */
  private _validateContext(context: ContextData): void {
    this._validateContextLocale(context.locale);
    this._validateUser(context.user);
    this._validatePage(context.page);

    if (context.store && ((context.store.groupId && !context.store.id) || (!context.store.groupId && context.store.id)))
      throw new Error(ErrorMessages.MV_0009);

    if (context.geo && context.geo.location) this._validateLocation(context.geo.location);
  }

  /**
   * Validate the `page` object which required a `uri` property.
   * @param page - The page object to validate {@link PageData}.
   * @throws - {@link ErrorMessages.IV_0025}.
   */
  private _validatePage(page?: PageData): void {
    if (!page) return;
    if (!page.uri || typeof page.uri !== 'string' || !page.uri.trim()) throw new Error(ErrorMessages.IV_0025);
  }

  /**
   * Map context object to DTO.
   * @returns The DTO representation of the filter {@link ContextDTO}.
   */
  toDTO(): ContextDTO {
    /* eslint-disable @typescript-eslint/naming-convention */
    const dto: ContextDTO = {
      context: {
        page: this._page
      }
    };

    if (this._browser)
      dto.context.browser = {
        app_type: this._browser.appType,
        device: this._browser.device,
        user_agent: this._browser.userAgent
      };

    if (this._locale)
      dto.context.locale = {
        country: this._locale.country.toLowerCase(),
        language: this._locale.language.toLowerCase()
      };

    if (this._store)
      dto.context.store = {
        group_id: this._store && this._store.groupId,
        id: this._store && this._store.id
      };

    if (this._geo?.ip)
      dto.context.geo = {
        ip: this._geo.ip
      };

    if (this._user?.userId || this._user?.uuid)
      dto.context.user = {
        custom: this._user.custom,
        groups: this._user.groups,
        user_id: this._user.userId,
        uuid: this._user.uuid
      };

    if (this._geo?.location)
      dto.context.geo = {
        ...dto.context.geo,
        location: { lat: this._geo.location.latitude, lon: this._geo.location.longitude }
      };

    if (this._campaign)
      dto.context.campaign = {
        utm_campaign: this._campaign.campaign,
        utm_content: this._campaign.content,
        utm_medium: this._campaign.medium,
        utm_source: this._campaign.source,
        utm_term: this._campaign.term
      };

    return dto;
  }
}

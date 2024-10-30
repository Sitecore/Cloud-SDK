// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { isValidHttpURL, isValidLocation } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../../consts';
import type {
  BrowserData,
  CampaignData,
  ContextData,
  ContextDTO,
  GeoData,
  IdsData,
  LocaleData,
  LocationData,
  PageData,
  StoreData,
  UserData
} from './interfaces';

/**
 * Create context object.
 * @param context - The context object.
 * @returns the validated and mapped context object
 */
export class Context {
  private _campaign?: CampaignData;
  private _locale?: LocaleData;
  private _page?: PageData;
  private _store?: StoreData;
  private _geo?: GeoData;
  private _user?: UserData;
  private _browser?: BrowserData;
  private _ids?: IdsData;

  /**
   * @param context - The context object.
   * @returns the validated and mapped context object
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
    this._ids = context.ids;
  }

  /**
   * Gets the user data.
   * @returns The user data.
   */
  get user(): UserData | undefined {
    return this._user;
  }

  /**
   * Sets the user data.
   * @param user - The new value to set.
   */
  set user(user: UserData | undefined) {
    this._validateUser(user);
    this._user = user;
  }

  /** Simply removes the user data from the context */
  removeUser() {
    this._user = undefined;
  }

  /**
   * Sets the locale data.
   * @param locale - The new value to set.
   *
   */
  set locale(locale: LocaleData) {
    this._validateContextLocale(locale);

    this._locale = locale;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeLocale() {
    this._locale = undefined;
  }
  /**
   * Sets the browser data
   */
  set browser(browser: BrowserData) {
    this._browser = browser;
  }

  /**
   * Sets the geo data.
   * @param geo - The new value to set.
   *
   */
  set geo(geo: GeoData) {
    if (geo.location) this._validateLocation(geo.location);

    this._geo = geo;
  }

  /**
   * Sets the campaign data.
   * @param campaign - The new value to set.
   *
   */
  set campaign(campaign: CampaignData) {
    this._campaign = campaign;
  }
  /**
   * Sets the browser dta to undefined.
   */
  removeBrowser() {
    this._browser = undefined;
  }

  /**
   * Sets the geo data to undefined
   */
  removeGeo() {
    this._geo = undefined;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeCampaign() {
    this._campaign = undefined;
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
   * Sets the store data to undefined
   */
  removeStore() {
    this._store = undefined;
  }
  /**
   * Sets the ids data.
   * @param ids -New value for ids {@Link IdsData}
   */
  set ids(ids: IdsData) {
    this._ids = ids;
  }
  /**
   * Unset the value for ids.
   */
  removeIds() {
    this._ids = undefined;
  }

  /**
   * Validate context locale object.
   */
  private _validateContextLocale(locale?: LocaleData): void {
    if (!locale) return;

    if (locale.country.length !== 2) throw new Error(ErrorMessages.MV_0006);
    if (locale.language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

  /**
   * Validate user object, which is part of the context object.
   * We need to ensure that the user object has `userId` or `uuid`, but not neither.
   * @param user - The user object to validate.
   */
  private _validateUser(user?: UserData): void {
    if (typeof user !== 'undefined' && !user.userId && !user.uuid) throw new Error(ErrorMessages.MV_0013);
  }

  /**
   * Validate context object.
   */
  private _validateContext(context: ContextData): void {
    this._validateContextLocale(context.locale);
    this._validateUser(context.user);

    if (
      context.page &&
      context.page.custom &&
      ((Object.keys(context.page.custom).length && (!context.page.uri || !isValidHttpURL(context.page.uri))) ||
        (!Object.keys(context.page.custom).length && context.page.uri && isValidHttpURL(context.page.uri)))
    )
      throw new Error(ErrorMessages.MV_0008);

    if (context.store && ((context.store.groupId && !context.store.id) || (!context.store.groupId && context.store.id)))
      throw new Error(ErrorMessages.MV_0009);

    if (context.geo && context.geo.location) this._validateLocation(context.geo.location);
  }

  private _validateLocation(location: LocationData) {
    const result = isValidLocation(location);

    if (!result.latitude) throw new Error(ErrorMessages.IV_0012);

    if (!result.longitude) throw new Error(ErrorMessages.IV_0013);
  }

  /**
   * Map context object to DTO.
   * @returns The DTO representation of the filter.
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
    if (this._ids && Object.keys(this._ids).length > 0) dto.context.ids = this._ids;
    /* eslint-enable @typescript-eslint/naming-convention */

    return dto;
  }
}

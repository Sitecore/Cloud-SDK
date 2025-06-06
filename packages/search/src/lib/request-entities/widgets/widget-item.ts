// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type { WidgetItemDTO } from './interfaces';

export class WidgetItem {
  protected _entity: string;
  protected _widgetId: string;
  protected _sources?: ArrayOfAtLeastOne<string>;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param widgetId - The widget's item id.
   * @param sources - The widget's sources.
   */
  constructor(entity: string, widgetId: string, sources?: ArrayOfAtLeastOne<string>) {
    this._validateWidgetId(widgetId);
    this._validateEntity(entity);

    this._entity = entity;
    this._widgetId = widgetId;
    this._sources = sources;
  }

  /**
   * Sets the entity for the WidgetItem.
   * This method updates the `entity` property of WidgetItem instance.
   *
   * @param entity - The entity to set.
   */
  set entity(entity: string) {
    this._validateEntity(entity);
    this._entity = entity;
  }

  /**
   * @returns The entity property of the WidgetItem.
   */
  get entity(): string {
    return this._entity;
  }

  /**
   * @returns The sources property of the WidgetItem.
   */
  get sources(): ArrayOfAtLeastOne<string> | undefined {
    return this._sources;
  }

  /**
   * Sets the sources for the WidgetItem.
   * This method updates the `sources` property within the WidgetItem instance.
   * The sources are used to define specific search criteria or filters.
   * @param sources - The array of sources {@link ArrayOfAtLeastOne} that specifies the search criteria.
   */

  set sources(sources: ArrayOfAtLeastOne<string>) {
    this._sources = sources;
  }

  resetSources(): void {
    this._sources = undefined;
  }
  /**
   *
   * @param entity - the string to validate
   * @throws - {@link ErrorMessages.MV_0010}
   */
  private _validateEntity(entity: string): void {
    if (!entity || entity.trim().length === 0) throw new Error(ErrorMessages.MV_0010);
  }

  /**
   * Sets the id for the WidgetItem.
   * This method updates the `widgetId` property of WidgetItem instance.
   *
   * @param widgetId - The widgetId to set.
   * @throws - {@link ErrorMessages.MV_0011}
   */
  set widgetId(widgetId: string) {
    this._validateWidgetId(widgetId);
    this._widgetId = widgetId;
  }

  /**
   * @returns The id property of the WidgetItem.
   */
  get widgetId(): string {
    return this._widgetId;
  }

  /**
   *
   * @param widgetId - the string to validate
   * @throws - {@link ErrorMessages.MV_0011}
   */
  private _validateWidgetId(widgetId: string): void {
    if (!widgetId || widgetId.trim().length === 0) throw new Error(ErrorMessages.MV_0011);
  }

  /**
   *
   * @param errorMessage - {@link ErrorMessages}
   * @param num - the number to validate
   */
  protected _validateNumberInRange1To100(errorMessage: ErrorMessages, num?: number): void {
    if (num === undefined || (num >= 1 && num <= 100)) return;

    throw new Error(errorMessage);
  }

  /**
   *
   * @param errorMessage - The error message {@link ErrorMessages}
   * @param range - min and max range
   * @param num - number to test
   */
  protected _validateNumberInRange(
    errorMessage: ErrorMessages,
    range: { min: number; max: number },
    num?: number
  ): void {
    if (num === undefined || (num >= range.min && num <= range.max)) return;

    throw new Error(errorMessage);
  }

  protected _validateStringLengthInRange1To100(errorMessage: ErrorMessages, str?: string) {
    if (str === undefined || (str.trim().length >= 1 && str.length <= 100)) return;

    throw new Error(errorMessage);
  }

  protected _validatePositiveInteger(error: ErrorMessages, num?: number) {
    if (num === undefined || num >= 0) return;

    throw new Error(error);
  }

  protected _validateNonEmptyString(errorMessage: ErrorMessages, str?: string) {
    if (str === undefined || str.trim().length >= 1) return;

    throw new Error(errorMessage);
  }

  /**
   * Tests if passed string is defined, is not empty string and does not contain whitespaces.
   * @param errorMessage - Error Message {@link ErrorMessages}
   * @param string - the string to test
   * @returns void
   * @throws Error when failed
   */
  protected _validateNonEmptyNoWhitespaceString(errorMessage: ErrorMessages, string?: string) {
    if (string && !string.includes(' ')) return;

    throw new Error(errorMessage);
  }

  /**
   * Maps the widget item to its DTO format {@link WidgetItemDTO}.
   */
  toDTO(): WidgetItemDTO {
    return {
      entity: this._entity,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rfk_id: this._widgetId,
      ...(this._sources && { sources: this._sources })
    };
  }
}

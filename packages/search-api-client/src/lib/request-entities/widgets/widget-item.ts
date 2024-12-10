// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { WidgetItemDTO } from './interfaces';

export class WidgetItem {
  protected _entity: string;
  protected _widgetId: string;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param widgetId - The widget's item id.
   *
   */
  constructor(entity: string, widgetId: string) {
    this._validateWidgetId(widgetId);
    this._validateEntity(entity);

    this._entity = entity;
    this._widgetId = widgetId;
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
  get entity() {
    return this._entity;
  }

  private _validateEntity(entity: string) {
    if (!entity || entity.trim().length === 0) throw new Error(ErrorMessages.MV_0010);
  }

  /**
   * Sets the id for the WidgetItem.
   * This method updates the `widgetId` property of WidgetItem instance.
   *
   * @param widgetId - The entity to set.
   */
  set widgetId(widgetId: string) {
    this._validateWidgetId(widgetId);
    this._widgetId = widgetId;
  }

  /**
   * @returns The id property of the WidgetItem.
   */
  get widgetId() {
    return this._widgetId;
  }

  private _validateWidgetId(widgetId: string) {
    if (!widgetId || widgetId.trim().length === 0) throw new Error(ErrorMessages.MV_0011);
  }

  protected _validateNumberInRange1To100(errorMessage: ErrorMessages, num?: number) {
    if (num === undefined || (num >= 1 && num <= 100)) return;

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
   * Maps the widget item to its DTO format.
   */
  toDTO(): WidgetItemDTO {
    return {
      entity: this._entity,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rfk_id: this._widgetId
    };
  }
}

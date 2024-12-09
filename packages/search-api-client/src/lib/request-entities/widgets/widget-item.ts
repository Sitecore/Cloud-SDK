// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { WidgetItemDTO } from './interfaces';

export class WidgetItem {
  protected _entity: string;
  protected _rfkId: string;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   *
   */
  constructor(entity: string, rfkId: string) {
    this._validateRfkId(rfkId);
    this._validateEntity(entity);

    this._entity = entity;
    this._rfkId = rfkId;
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
   * Sets the rfkid for the WidgetItem.
   * This method updates the `rfkid` property of WidgetItem instance.
   *
   * @param rfkid - The entity to set.
   */
  set rfkid(rfkid: string) {
    this._validateRfkId(rfkid);
    this._rfkId = rfkid;
  }

  /**
   * @returns The rfkid property of the WidgetItem.
   */
  get rfkid() {
    return this._rfkId;
  }

  private _validateRfkId(rfkId: string) {
    if (!rfkId || rfkId.trim().length === 0) throw new Error(ErrorMessages.MV_0011);
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
      rfk_id: this._rfkId
    };
  }
}

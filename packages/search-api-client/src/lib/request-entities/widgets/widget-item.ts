// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { WidgetItemDTO, WidgetItemSearch } from './interfaces';
import { ErrorMessages } from '../../const';

export class WidgetItem {
  protected entity: string;
  protected rfkId: string;
  private _search?: WidgetItemSearch;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   *
   */
  constructor(entity: string, rfkId: string) {
    this._validate(entity, rfkId);

    this.entity = entity;
    this.rfkId = rfkId;
  }

  private _validate(entity: string, rfkId: string) {
    if (!entity || entity.trim().length === 0) throw new Error(ErrorMessages.MV_0009);

    if (!rfkId || rfkId.trim().length === 0) throw new Error(ErrorMessages.MV_0010);
  }

  /**
   * Sets the search limit for the WidgetItem.
   * This method updates the `limit` property of the search configuration within the WidgetItem instance.
   * The limit is used to specify the maximum number of results to be returned, useful for controlling pagination.
   *
   * @param limit - The number to set as the search limit, which must be between 1 and 100, inclusive.
   * @throws Error If the limit is less than 1 or greater than 100, indicating an invalid range.
   */
  set limit(limit: number) {
    if (limit < 1 || limit > 100) throw new Error(ErrorMessages.IV_0007);

    this._search = {
      ...this._search,
      limit
    };
  }

  /**
   * Sets the search offset for the WidgetItem.
   * Updates the offset property to manage pagination. Throws an error if the offset value is less than 0.
   * @param offset - The non-negative integer to set as the search offset.
   * @throws Error If the offset is less than 0.
   */
  set offset(offset: number) {
    if (offset < 0) throw new Error(ErrorMessages.IV_0008);
    this._search = {
      ...this._search,
      offset
    };
  }

  /**
   * Sets the search content for the WidgetItem.
   * This method updates the `content` property of the search configuration within the WidgetItem instance.
   * The fields is used to define specific search criteria or filters.
   * @param fields - The array fields that specifies the search criteria.
   */
  set content(value: object | string[]) {
    this._search = {
      ...this._search,
      content: Array.isArray(value) ? { fields: value } : {}
    };
  }

  /**
   * Maps the widget item to its DTO format.
   */
  toDTO(): WidgetItemDTO {
    return {
      entity: this.entity,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rfk_id: this.rfkId,
      search: this._search
    };
  }
}

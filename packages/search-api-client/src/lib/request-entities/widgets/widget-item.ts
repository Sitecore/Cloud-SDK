// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../const';
import type { WidgetItemDTO } from './interfaces';

export class WidgetItem {
  protected entity: string;
  protected rfkId: string;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   *
   */
  constructor(entity: string, rfkId: string) {
    this.validate(entity, rfkId);

    this.entity = entity;
    this.rfkId = rfkId;
  }

  private validate(entity: string, rfkId: string) {
    if (!entity || entity.trim().length === 0) throw new Error(ErrorMessages.MV_0009);

    if (!rfkId || rfkId.trim().length === 0) throw new Error(ErrorMessages.MV_0010);
  }

  toDTO(): WidgetItemDTO {
    return {
      entity: this.entity,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rfk_id: this.rfkId
    };
  }
}

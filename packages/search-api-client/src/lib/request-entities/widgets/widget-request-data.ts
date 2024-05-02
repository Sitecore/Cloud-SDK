// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../const';
import type { WidgetDTO } from './interfaces';
import type { WidgetItem } from './widget-item';

export class WidgetRequestData {
  private widgetItems: WidgetItem[];

  /**
   * Creates and holds the functionality of the widget request data.
   * @param widgetItems - Array of {@link WidgetItem} instances.
   */
  constructor(widgetItems: WidgetItem[]) {
    this.validateWidgetItems(widgetItems);

    this.widgetItems = widgetItems;
  }

  private validateWidgetItems(widgetItems: WidgetItem[]) {
    if (widgetItems.length === 0) throw new Error(ErrorMessages.MV_0011);
  }

  /**
   * Maps the widget items to their DTO format.
   */
  toDTO(): WidgetDTO {
    return {
      widget: {
        items: this.widgetItems.map((widgetItem) => widgetItem.toDTO())
      }
    };
  }
}

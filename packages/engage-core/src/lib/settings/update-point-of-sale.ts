// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettingsParamsBrowser, ISettingsParamsServer } from './interfaces';

/**
 * A function that updates Point of sale in init settings object and in the Window.Engage object
 */
export function updatePointOfSale(pointOfSale: string, settings: ISettingsParamsBrowser | ISettingsParamsServer): void {
  if (pointOfSale && pointOfSale.trim().length > 0) {
    if (window && window['Engage'] && window['Engage'].settings) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      window['Engage'].settings.pointOfSale = pointOfSale;
    }
    settings.pointOfSale = pointOfSale;
  } else {
    throw new Error('[MV-0009] "pointOfSale" cannot be empty.');
  }
}

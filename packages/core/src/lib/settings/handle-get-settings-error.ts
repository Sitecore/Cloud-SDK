// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Settings } from './interfaces';

export function handleGetSettingsError(getSettingsFn: () => Settings, newError: string) {
  try {
    return getSettingsFn();
  } catch {
    throw new Error(newError);
  }
}

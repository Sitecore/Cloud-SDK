// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export const getSettingFromUrlParams = (setting: string) => {
  const paramsStr = decodeURIComponent(window.location.search);
  const urlParams = new URLSearchParams(paramsStr);
  return urlParams.get(setting);
};

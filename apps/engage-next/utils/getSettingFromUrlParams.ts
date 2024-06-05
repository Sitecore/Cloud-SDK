export const getSettingFromUrlParams = (setting: string) => {
  const paramsStr = decodeURIComponent(window.location.search);
  const urlParams = new URLSearchParams(paramsStr);
  return urlParams.get(setting);
};

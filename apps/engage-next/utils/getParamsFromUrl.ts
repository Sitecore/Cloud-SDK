// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export const getParamsFromUrl = (parameter: string) => {
  return new URLSearchParams(window.location.search).get(parameter);
};

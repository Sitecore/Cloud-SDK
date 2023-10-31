// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export function isISODateString(date: string) {
  try {
    const convertedDate = new Date(date).toISOString();

    return convertedDate === date;
  } catch (_) {
    return false;
  }
}

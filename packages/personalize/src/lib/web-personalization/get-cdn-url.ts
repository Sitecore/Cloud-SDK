// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export async function getCdnUrl(sitecoreEdgeContextId: string, sitecoreEdgeUrl: string): Promise<string | null> {
  // eslint-disable-next-line max-len
  const requestUrl = `${sitecoreEdgeUrl}/v1/personalize/cdn-url?sitecoreContextId=${sitecoreEdgeContextId}&client_key=`;

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) return null;

    return await response.text();
  } catch (error) {
    return null;
  }
}

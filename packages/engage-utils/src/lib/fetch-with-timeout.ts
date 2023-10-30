// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Fetches data from the specified URL within the given timeout period.
 *
 * @param url - The URL to fetch data from.
 * @param timeout - The time in milliseconds to wait before timing out the request.
 * @param fetchOptions - The options to pass to the fetch API.
 * @returns - A Promise that resolves to the fetched data, or null if the request was aborted or timed out.
 * @throws  - If the timeout value is invalid.
 */
export async function fetchWithTimeout(
  url: string,
  timeout: number,
  fetchOptions: {
    [key: string]: unknown;
  }
): Promise<null | unknown> {
  if (!Number.isInteger(timeout) || timeout < 0)
    throw new Error(
      '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.'
    );

  const abortController = new AbortController();
  const signal = abortController.signal;

  const timeoutHandler = setTimeout(() => {
    abortController.abort();
  }, timeout);

  return fetch(url, { ...fetchOptions, signal })
    .then((response) => {
      clearTimeout(timeoutHandler);
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      if (error.name === 'AbortError')
        throw new Error('[IE-0002] Timeout exceeded. The server did not respond within the allotted time.');

      return null;
    });
}

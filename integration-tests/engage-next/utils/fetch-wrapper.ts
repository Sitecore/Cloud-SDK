export const capturedFetch: unknown[] = [];
export const capturedRequestBody: unknown[] = [];

const originalFetch = globalThis.fetch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.fetch = function (input: RequestInfo | URL, init?: any): Promise<Response> {
  if (init?.headers?.['User-Agent']) capturedFetch.push(init.headers['User-Agent']);
  capturedRequestBody.push(init.body);

  return originalFetch(input, init);
};

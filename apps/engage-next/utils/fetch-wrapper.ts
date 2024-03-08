export const capturedFetch: unknown[] = [];

const originalFetch = global.fetch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = function (input: RequestInfo | URL, init?: any): Promise<Response> {
  if (init?.headers?.['User-Agent']) capturedFetch.push(init.headers['User-Agent']);

  return originalFetch(input, init);
};

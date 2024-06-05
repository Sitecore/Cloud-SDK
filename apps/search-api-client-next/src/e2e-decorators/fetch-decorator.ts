const originalFetch = globalThis.fetch;

export function decorateFetch(testID: string | null) {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (typeof input === 'string' && !input.includes('/search?')) return originalFetch(input, init);

    await originalFetch(`http://localhost:4300/api/save-e2e-data`, {
      body: JSON.stringify({ init, testID: testID ?? 'not_defined', url: input }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });

    return originalFetch(input, init);
  };
}

export function resetFetch() {
  globalThis.fetch = originalFetch;
}

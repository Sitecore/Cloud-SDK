const originalFetch = globalThis.fetch;

export function decorateFetch(testID: string | null) {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (typeof input === 'string' && !input.includes('/search?')) return originalFetch(input, init);

    await originalFetch(`http://localhost:4300/api/save-e2e-data`, {
      body: JSON.stringify({ url: input, init, testID: testID ?? 'not_defined' }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    return originalFetch(input, init);
  };
}

export function resetFetch() {
  globalThis.fetch = originalFetch;
}

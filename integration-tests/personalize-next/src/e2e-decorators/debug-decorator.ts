import debug from 'debug';

const originalDebug = debug.log;

export function decorateDebug(testID: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug.log = async (...args: any): Promise<Response> => {
    await fetch(`http://localhost:4400/api/save-e2e-data?type=logs`, {
      body: JSON.stringify({ args: [...args], testID: testID ?? 'not_defined' }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });

    return originalDebug(...args);
  };
}

export function resetDebug() {
  debug.log = originalDebug;
}

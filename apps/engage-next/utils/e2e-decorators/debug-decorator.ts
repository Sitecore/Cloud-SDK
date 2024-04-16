import debug from 'debug';

const originalDebug = debug.log;

export function decorateDebug(testID: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug.log = async (...args: any): Promise<Response> => {
    await fetch(`http://localhost:4200/api/save-e2e-data?type=logs`, {
      body: JSON.stringify({ args: [...args], testID: testID ?? 'not_defined' }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    return originalDebug(...args);
  };
}

export function resetDebug() {
  debug.log = originalDebug;
}

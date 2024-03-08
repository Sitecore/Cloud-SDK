import debug from 'debug';

// Capture all debug library logs in this array
export const capturedDebugLogs: unknown[] = [];
const originalDebugLog = debug.log;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
debug.log = function (...args: any) {
  capturedDebugLogs.push(...args);
  originalDebugLog.apply(this, args);
};

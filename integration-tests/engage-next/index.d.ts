/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export const ReactComponent: any;
  export default content;
}

declare global {
  /* eslint-disable @typescript-eslint/naming-convention */
  interface Window {
    includeUTMParameters: boolean;
    get: unknown;
  }
}

export {};

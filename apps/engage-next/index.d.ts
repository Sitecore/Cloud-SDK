// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

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
    Engage: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [x: string]: any;
      settings?: {
        targetURL: string;
        client_key: string;
        web_flow_config: {
          async: boolean;
          defer: boolean;
        };
        web_flow_target?: string;
      };
      getBrowserId?: () => string;
      versions?: {
        events?: string;
        personalize?: string;
      };
    };
    includeUTMParameters: boolean;
    get: unknown;
  }
}

export {};

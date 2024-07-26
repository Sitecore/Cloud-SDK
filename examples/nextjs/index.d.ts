// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export const ReactComponent: any;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

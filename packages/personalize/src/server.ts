// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export { initServer as init } from './lib/initializer/server/initializer';
export { personalizeServer as personalize } from './lib/personalization/personalizeServer';
export { LIBRARY_VERSION } from './lib/consts';

export type { IPersonalizerInput } from './lib/personalization/personalizer';

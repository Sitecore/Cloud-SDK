// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export { initServer as init } from './lib/init/server/initializer';
export { personalizeServer as personalize } from './lib/personalization/personalizeServer';
export { PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from './lib/consts';
export type { PersonalizeData } from './lib/personalization/personalizer';
import './lib/initializer/server/initializer';

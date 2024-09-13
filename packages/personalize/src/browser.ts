// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export { init } from './lib/init/client/initializer';
export { personalize } from './lib/personalization/personalize';
export { PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from './lib/consts';
export type { PersonalizeData } from './lib/personalization/personalizer';
import './lib/initializer/browser/initializer';

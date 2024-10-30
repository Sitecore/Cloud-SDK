// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import * as steps from './steps';

type AvailableSteps = Array<keyof typeof steps>;

export function loadSteps(stepsToLoad: AvailableSteps) {
  stepsToLoad.forEach((step) => {
    steps[step]();
  });
}

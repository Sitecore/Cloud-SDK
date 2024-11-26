import { decorateDebug, resetDebug } from './debug-decorator';
import { decorateFetch, resetFetch } from './fetch-decorator';

export function decorateAll(testID: string | null) {
  decorateDebug(testID);
  decorateFetch(testID);
}

export function resetAllDecorators() {
  resetDebug();
  resetFetch();
}

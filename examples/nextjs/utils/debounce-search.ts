// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { SearchEndpointResponse } from 'packages/search/src/lib/requests/post-request';
import type { ProductItem } from '../components/search/Product';
import type { SuggestionItem } from '../components/search/Suggestion';

export function debounceSearch(fn: Fn, timeout: number): DebounceReturn {
  let timer: NodeJS.Timeout;

  return {
    call: async (query: string) => {
      clearTimeout(timer);

      if (query.length === 0) return Promise.resolve(null);

      return new Promise((resolve) => {
        timer = setTimeout(async () => {
          const result = await fn(query);

          if (!result || !result.widgets[0]) return resolve(null);

          resolve({
            content: result.widgets[0].content,
            suggestions: result.widgets[0].suggestion?.trending_searches
          });
        }, timeout);
      });
    },
    cancel: () => clearTimeout(timer)
  };
}

export type GetWidgetDataResponse = SearchEndpointResponse & {
  widgets: { content: ProductItem[]; suggestion: SuggestionResult }[];
};

type Fn = (query: string) => Promise<GetWidgetDataResponse>;

interface SuggestionResult {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  trending_searches?: SuggestionItem[];
}

export interface SearchResults {
  content?: ProductItem[];
  suggestions?: SuggestionItem[];
}

interface DebounceReturn {
  call: (query: string) => Promise<SearchResults | null>;
  cancel: () => void;
}

// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { SearchEndpointResponse } from 'packages/search/src/lib/requests/post-request';
import type { ProductItem } from '../components/search/Product';

export function DebounceSearch(fn: Fn, timeout: number): DebounceReturn {
  let timer: NodeJS.Timeout;

  return {
    call: async (query: string) => {
      clearTimeout(timer);

      if (query.length === 0) return Promise.resolve([]);

      return new Promise((resolve) => {
        timer = setTimeout(async () => {
          const result = await fn(query);

          if (!result) return resolve([]);

          resolve(result.widgets[0].content);
        }, timeout);
      });
    },
    cancel: () => clearTimeout(timer)
  };
}

export type GetWidgetDataResponse = SearchEndpointResponse & { widgets: { content: ProductItem[] }[] };

type Fn = (query: string) => Promise<GetWidgetDataResponse>;

interface DebounceReturn {
  call: (query: string) => Promise<ProductItem[]>;
  cancel: () => void;
}

import type { ProductItem } from '../components/search/Product';

export type ApiResponseWithContent = {
  widgets: { content: ProductItem[] }[];
};

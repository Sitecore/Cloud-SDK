import type { SearchEndpointResponse } from 'packages/search/src/lib/requests/post-request';
import type { RecommendedProduct } from '../components/Products';

export type ApiResponseWithContent = SearchEndpointResponse & { content: RecommendedProduct[] };

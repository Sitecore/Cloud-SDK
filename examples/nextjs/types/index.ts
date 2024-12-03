import type { SearchEndpointResponse } from 'packages/search-api-client/src/lib/requests/post-request';
import type { RecommendedProduct } from '../components/Products';

export type ApiResponseWithContent = SearchEndpointResponse & { content: RecommendedProduct[] };

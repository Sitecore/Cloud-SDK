'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@sitecore-cloudsdk/events/browser';
import {
  ComparisonFacetFilter,
  Context,
  FacetOptions,
  getWidgetData,
  SearchEndpointResponse,
  SearchEventEntity,
  SearchSortOptions,
  SearchWidgetItem,
  widgetFacetClick,
  widgetItemClick,
  WidgetRequestData,
  widgetView
} from '@sitecore-cloudsdk/search/browser';
import { withAuthGuard } from '../../components/AuthGuard';
import FacetCheckbox from '../../components/FacetCheckbox';
import PaginationLoadMore from '../../components/Listing/PaginationLoadMore';
import Sort from '../../components/Listing/Sort';
import { ProductItem } from '../../components/search/Product';
import { useCart } from '../../context/Cart';

type FacetClickFilterType = {
  displayName: string;
  facetPosition: number;
  name: string;
  title: string;
  value: string;
  valuePosition: number;
};

interface SelectedFacets {
  [key: string]: string[];
}

type WidgetItem = SearchEndpointResponse['widgets'][number];
type WidgetItemFacets = SearchEndpointResponse['widgets'][number]['facet'];

const PAGE_SIZE = 12;
const QUERY_PARAM = 'q';
const PAGE_PARAM = 'p';

const SearchResultsPage = () => {
  const router = useRouter();
  const cart = useCart();
  const { get } = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchData, setSearchData] = useState<WidgetItem>();
  const [facets, setFacets] = useState<WidgetItemFacets>();
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacets>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(PAGE_SIZE);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [sort, setSort] = useState<string>();
  const pathName = usePathname();

  const setPageQueryParam = (): void => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) {
      queryParams.delete(PAGE_PARAM);
    } else {
      queryParams.set(PAGE_PARAM, currentPage.toString());
    }
    router.push(`${pathName}?${queryParams.toString()}`);
  };

  const clearFilters = (): void => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key] of searchParams) {
      if ([QUERY_PARAM, PAGE_PARAM].includes(key)) {
        continue;
      }
      params.delete(key);
    }
    setProducts([]);
    router.push(`${pathName}?${params.toString()}`);
  };

  const setFilterQueryParams = (facetName: string, facetOption: string): void => {
    const params = new URLSearchParams(searchParams.toString());

    const existingValue = params.get(facetName);
    if (existingValue) {
      const currentValues = existingValue.split(',');
      const index = currentValues.indexOf(facetOption);
      index !== -1 ? currentValues.splice(index, 1) : currentValues.push(facetOption);
      currentValues.length ? params.set(facetName, currentValues.join(',')) : params.delete(facetName);
    } else {
      params.set(facetName, facetOption);
    }
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    setProducts([]);
    setCurrentPage(1);
    setSort(sort);
  };

  const updateSelectedFacets = () => {
    const params = new URLSearchParams(searchParams.toString());

    const selected: SelectedFacets = {};
    for (const param of params) {
      if ([QUERY_PARAM, PAGE_PARAM].includes(param[0])) {
        continue;
      }
      selected[param[0]] = param[1].split(',');
    }

    setSelectedFacets(selected);
  };

  const isFacetSelected = (facetName: string, value: string): boolean => {
    return !!selectedFacets[facetName]?.includes(value);
  };

  const getSortArgs = () => {
    const result = { choices: true } as SearchSortOptions;
    if (sort) {
      result.value = [{ name: sort }];
    }
    return result;
  };

  const getRequestData = (): SearchWidgetItem => {
    const filters = [];
    for (const [key, values] of searchParams) {
      if ([QUERY_PARAM, PAGE_PARAM].includes(key)) {
        continue;
      }

      const filter = {
        name: key,
        filter: {
          type: 'or',
          values: values.split(',').map((value: string) => {
            if (key !== 'price') return new ComparisonFacetFilter('eq', value);
            return value;
          })
        }
      };
      filters.push(filter);
    }

    return new SearchWidgetItem('product', 'rfkid_7', {
      content: {},
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      sort: getSortArgs(),
      facet: {
        all: true,
        ...(filters.length && { types: filters })
      } as FacetOptions,
      ...(query && { query: { keyphrase: query } })
    });
  };

  const generateFacetClickFilters = function () {
    const facetClickFilters: FacetClickFilterType[] = [];
    if (!facets || !selectedFacets) return;
    for (const key of Object.keys(selectedFacets)) {
      const values = selectedFacets[key];
      const filterIndex = facets.findIndex((item) => item.name === key);
      if (filterIndex === -1) continue;
      const currentFilter = facets[filterIndex];

      for (const value of values) {
        facetClickFilters.push({
          displayName: currentFilter.label,
          title: currentFilter.label,
          facetPosition: filterIndex,
          name: key,
          value,
          valuePosition: facets[filterIndex].value.findIndex((item) =>
            key === 'price' ? item.id === value : item.text === value
          )
        });
      }
    }
    return facetClickFilters;
  };

  const searchParams = useSearchParams();
  const query = get('q') as string;

  const populateData = async function () {
    const searchWidget = getRequestData();

    const response = (await getWidgetData(
      new WidgetRequestData([searchWidget]),
      new Context({ locale: { language: 'EN', country: 'us' } })
    )) as SearchEndpointResponse;

    const widget = response.widgets[0];

    if (!widget) return console.warn('No search results found');

    setSearchData(widget);
    setFacets(widget.facet);
    setProducts(products.concat(widget.content as ProductItem[]));
    widgetView({
      request: {},
      entities: products?.map((product: ProductItem) => ({ entity: 'product', id: product.id })) as SearchEventEntity[],
      pathname: '/search',
      widgetId: 'rfkid_7'
    });
  };

  useEffect(() => {
    setProductLoading(true);
    setPageQueryParam();
    populateData().finally(() => {
      setLoading(false);
      setProductLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, currentPage, sort, searchParams]);

  useEffect(() => {
    const facetClickFilters = generateFacetClickFilters();
    if (!facetClickFilters) return;
    widgetFacetClick({
      request: {
        ...(query && { keyword: query })
      },
      filters: [...facetClickFilters],
      pathname: '/search',
      widgetId: 'rfkid_7'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacets]);

  useEffect(() => {
    updateSelectedFacets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facets]);

  if (loading || !searchData) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/3 mb-6'></div>
          <div className='flex gap-8'>
            <div className='w-[24%] h-[600px] bg-gray-200 rounded'></div>
            <div className='flex-1 space-y-6'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='h-40 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>{query ? `Search Results for "${query}"` : 'All Products'}</h2>
        {products?.length > 0 && (
          <p className='text-gray-600'>
            Showing {products.length} results out of {searchData.total_item}
          </p>
        )}
        {searchData.sort?.choices && (
          <Sort
            sortingOptions={searchData.sort.choices}
            selectedSort={sort as string}
            setSort={handleSortChange}
          />
        )}
      </div>
      <div className='flex w-full gap-8'>
        <div className='w-[24%]'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='p-4 border-b border-gray-200'>
              <h3 className='font-semibold text-gray-900'>Filters</h3>
              {Object.keys(selectedFacets).length > 0 && (
                <button
                  onClick={() => clearFilters()}
                  className='text-sm text-red-600 hover:text-red-700 mt-2'>
                  Clear all filters
                </button>
              )}
            </div>
            <div className='divide-y divide-gray-200'>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {facets?.map((facet, facetPosition: number) => (
                <div
                  key={`facet-${facetPosition}`}
                  className='py-4'>
                  <h4 className='px-4 text-sm font-medium text-gray-900 mb-2'>{facet.label}</h4>
                  {facet.value.length > 0 && (
                    <div className='space-y-1'>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {facet.value.map((value) => (
                        <FacetCheckbox
                          key={`facetValue-${value.id}`}
                          label={value.text}
                          count={value.count}
                          checked={isFacetSelected(facet.name, facet.name === 'price' ? value.id : value.text)}
                          onChange={() => {
                            setProducts([]);
                            setCurrentPage(1);
                            setFilterQueryParams(facet.name, facet.name === 'price' ? value.id : value.text);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-1 relative'>
          {productLoading ? <div className='absolute inset-0 flex justify-center bg-white bg-opacity-75'></div> : null}
          <div className='grid grid-cols-1 gap-6'>
            {products?.map((item: ProductItem, index: number) => (
              <div
                key={item.id}
                className='product-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200'
                onClick={() => {
                  widgetItemClick({
                    request: {},
                    pathname: '/search',
                    widgetId: 'rfkid_7',
                    entity: { entity: 'product', id: item.id },
                    itemPosition: index + 1
                  });
                }}>
                <div className='flex p-6'>
                  <div className='flex-shrink-0 mr-6'>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      width={120}
                      height={120}
                      className='rounded-lg object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <span className='text-sm text-gray-500'>{item.brand}</span>
                        <Link href={`/product/${item.id}`}>
                          <h2 className='text-xl font-semibold text-gray-900 mt-1'>{item.name}</h2>
                        </Link>
                        <span>{item.id}</span>
                        <p className='text-lg font-medium text-red-600 mt-2'>€ {item.price}</p>
                      </div>
                      <button
                        onClick={() => cart.addProductItem(item, 1)}
                        className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {searchData.total_item && (
          <PaginationLoadMore
            pages={Math.ceil(searchData.total_item / perPage)}
            current={currentPage}
            totalItems={searchData.total_item}
            currentItems={products.length}
            setCurrentPage={setCurrentPage}
            loading={productLoading}
          />
        )}
      </div>
    </div>
  );
};

export default withAuthGuard(SearchResultsPage);

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@sitecore-cloudsdk/events/browser';
import {
  Context,
  getWidgetData,
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
import { useCart } from '../../context/Cart';
import type { ApiResponseWithContent } from '../../types';

type SelectedFacetsType = {
  [facetName: string]: {
    facetPosition: number;
    facetLabel: string;
    values: {
      id: string;
      position: number;
      text: string;
    }[];
  };
};

type CheckboxFacetChangeType = {
  facetPosition: number;
  facetName: string;
  facetLabel: string;
  valueId: string;
  valueText: string;
  valuePosition: number;
  isChecked: boolean;
};

type FacetClickFilterType = {
  displayName: string;
  facetPosition: number;
  name: string;
  title: string;
  value: string;
  valuePosition: number;
};

const PAGE_SIZE = 12;

const SearchResultsPage = () => {
  const router = useRouter();
  const cart = useCart();
  const { get } = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchData, setSearchData] = useState<any>({});
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacetsType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(PAGE_SIZE);
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState<string>();

  const setPageQuery = (currentPage: number): void => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) {
      queryParams.delete('p');
    } else {
      queryParams.set('p', currentPage as any);
    }
    router.push(`${window.location.pathname}?${queryParams.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    setProducts([]);
    setCurrentPage(1);
    setSort(sort);
  };

  const handleFacetChange = ({
    facetName,
    facetLabel,
    facetPosition,
    valueId,
    valueText,
    valuePosition,
    isChecked
  }: CheckboxFacetChangeType) => {
    setSelectedFacets((prev) => {
      const newFacets = { ...prev };
      if (!newFacets[facetName]) {
        newFacets[facetName] = {
          facetPosition: facetPosition,
          facetLabel: facetLabel,
          values: []
        };
      }
      if (isChecked) {
        if (!newFacets[facetName].values.find((facet) => facet.id === valueId)) {
          newFacets[facetName].values = [
            ...newFacets[facetName].values,
            { id: valueId, text: valueText, position: valuePosition }
          ];
        }
      } else {
        newFacets[facetName].values = newFacets[facetName]?.values.filter((facet) => facet.id !== valueId);
      }
      if (newFacets[facetName].values.length === 0) {
        delete newFacets[facetName];
      }
      return newFacets;
    });
  };

  const isFacetSelected = (facetName: string, value: string): boolean => {
    return selectedFacets[facetName]?.values.some((facet) => facet.id === value) || false;
  };

  const getSortArgs = () => {
    const result = { choices: true } as any;
    if (sort) {
      result.value = [{ name: sort }];
    }
    return result;
  };

  const getRequestData = (): SearchWidgetItem => {
    const facetTypes = Object.entries(selectedFacets).map(([key, facet]) => ({
      name: key,
      filter: {
        type: 'or',
        values: facet.values.map((f) => f.id)
      }
    }));
    return new SearchWidgetItem('product', 'rfkid_7', {
      content: {},
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      sort: getSortArgs(),
      facet: {
        all: true,
        ...(facetTypes.length && { types: facetTypes as any })
      },
      ...(query && { query: { keyphrase: query } })
    });
  };

  const generateFacetClickFilters = function () {
    return Object.entries(selectedFacets).reduce((prev, [key, facet]) => {
      const facetList = facet.values.map(
        (value): FacetClickFilterType => ({
          displayName: facet.facetLabel,
          facetPosition: facet.facetPosition,
          name: key,
          title: key,
          value: value.text,
          valuePosition: value.position
        })
      );
      return [...prev, ...facetList];
    }, [] as any);
  };

  const searchParams = useSearchParams();
  const query = get('q') as string;

  const populateData = async function () {
    const searchWidget = getRequestData();

    const { widgets } = (await getWidgetData(
      new WidgetRequestData([searchWidget]),
      new Context({ locale: { language: 'EN', country: 'us' } })
    )) as ApiResponseWithContent;

    const response = widgets[0] as unknown as ApiResponseWithContent;

    if (!response) return console.warn('No search results found');

    setSearchData(response);
    setProducts(products.concat(response.content as any));
    widgetView({
      request: {},
      entities: response.content?.map((product) => ({ entity: 'product', id: product.id })),
      pathname: '/search',
      widgetId: 'rfkid_7'
    });
  };

  useEffect(() => {
    setProductLoading(true);
    populateData().finally(() => {
      setLoading(false);
      setProductLoading(false);
    });
  }, [query, currentPage]);

  useEffect(() => {
    setPageQuery(currentPage);
  }, [currentPage]);

  useEffect(() => {
    populateData().finally(() => {
      setLoading(false);
      setProductLoading(false);
    });
  }, [sort]);

  useEffect(() => {
    setProductLoading(true);
    populateData().finally(() => {
      setLoading(false);
      setProductLoading(false);
    });
    const facetClickFilters = generateFacetClickFilters();
    widgetFacetClick({
      request: {
        ...(query && { keyword: query })
      },
      filters: [...facetClickFilters],
      pathname: '/search',
      widgetId: 'rfkid_7'
    });
  }, [selectedFacets]);

  if (loading) {
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
        <Sort
          sortingOptions={searchData.sort.choices}
          selectedSort={sort as string}
          setSort={handleSortChange}
        />
      </div>
      <div className='flex w-full gap-8'>
        <div className='w-[24%]'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='p-4 border-b border-gray-200'>
              <h3 className='font-semibold text-gray-900'>Filters</h3>
              {Object.keys(selectedFacets).length > 0 && (
                <button
                  onClick={() => setSelectedFacets({})}
                  className='text-sm text-red-600 hover:text-red-700 mt-2'>
                  Clear all filters
                </button>
              )}
            </div>
            <div className='divide-y divide-gray-200'>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {searchData.facet?.map((facet: any, facetPosition: number) => (
                <div
                  key={`facet-${facetPosition}`}
                  className='py-4'>
                  <h4 className='px-4 text-sm font-medium text-gray-900 mb-2'>{facet.label}</h4>
                  {facet.value.length > 0 && (
                    <div className='space-y-1'>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {facet.value.map((value: any, valuePosition: number) => (
                        <FacetCheckbox
                          key={`facetValue-${value.id}`}
                          label={value.text}
                          count={value.count}
                          checked={isFacetSelected(facet.name, value.id)}
                          onChange={(checked) => {
                            setProducts([]);
                            setCurrentPage(1);
                            handleFacetChange({
                              facetPosition: facetPosition,
                              facetName: facet.name,
                              facetLabel: facet.label,
                              valueId: value.id,
                              valueText: value.text,
                              valuePosition: valuePosition,
                              isChecked: checked
                            });
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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products?.map((item: any, index: number) => (
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
                        <h2 className='text-xl font-semibold text-gray-900 mt-1'>{item.name}</h2>
                        <span>{item.id}</span>
                        <p className='text-lg font-medium text-red-600 mt-2'>€ {item.price}</p>
                      </div>
                      <button
                        onClick={() =>
                          cart.addProductItem(
                            {
                              id: item.id,
                              title: item.name,
                              price: parseFloat(item.price) || 0,
                              imageUrl: item.image_url,
                              slug: item.sku
                            },
                            1
                          )
                        }
                        className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
                        Add to Cart
                      </button>
                    </div>
                    {item.description && <p className='text-gray-600 mt-3 text-sm line-clamp-2'>{item.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <PaginationLoadMore
          pages={Math.ceil(searchData.total_item / perPage)}
          current={currentPage}
          totalItems={searchData.total_item}
          currentItems={products.length}
          setCurrentPage={setCurrentPage}
          loading={productLoading}
        />
      </div>
    </div>
  );
};

export default withAuthGuard(SearchResultsPage);

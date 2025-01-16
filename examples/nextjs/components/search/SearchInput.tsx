'use client';

import { type Dispatch, type SetStateAction, useRef } from 'react';
import { Context, getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/browser';
import { DebounceSearch, GetWidgetDataResponse } from '../../utils/debounce-search';
import { ProductItem } from './Product';

export function SearchInput({
  search,
  setSearch,
  setSearchPreviewProducts,
  handleSearchKeyDown
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setSearchPreviewProducts: Dispatch<SetStateAction<ProductItem[]>>;
  handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const handleSearchChange = async (q: string) => {
    try {
      const previewProducts = await debouncedSearch.current.call(q);

      setSearchPreviewProducts(previewProducts);
    } catch (error) {
      setSearchPreviewProducts([]);
    }
  };

  const fetchRecommendations = async (query: string) => {
    const searchWidgetItem = new SearchWidgetItem('product', 'rfkid_6', {
      content: {},
      limit: 6,
      query: { keyphrase: query }
    });

    const result = (await getWidgetData(
      new WidgetRequestData([searchWidgetItem]),
      new Context({ locale: { language: 'EN', country: 'us' } })
    )) as GetWidgetDataResponse;

    return result;
  };

  const debouncedSearch = useRef(DebounceSearch(fetchRecommendations, 300));

  return (
    <div className='relative w-[15rem] '>
      <input
        value={search}
        onFocus={() => {
          handleSearchChange(search);
        }}
        onChange={async (e) => {
          const inputValue = e.target.value;

          setSearch(inputValue);
          handleSearchChange(inputValue);
        }}
        onKeyDown={handleSearchKeyDown}
        className='border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500'
        placeholder='Search'
      />
      {search.length === 0 ? (
        <svg
          className='absolute top-2 right-3 text-gray-400'
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#2c3e50'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path
            stroke='none'
            d='M0 0h24v24H0z'
            fill='none'
          />
          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
          <path d='M21 21l-6 -6' />
        </svg>
      ) : (
        <svg
          onClick={() => {
            setSearch('');
            setSearchPreviewProducts([]);
          }}
          className='absolute top-2 right-3 text-gray-400 cursor-pointer'
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#2c3e50'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path
            stroke='none'
            d='M0 0h24v24H0z'
            fill='none'
          />
          <path d='M18 6l-12 12' />
          <path d='M6 6l12 12' />
        </svg>
      )}
    </div>
  );
}

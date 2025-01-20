import React from 'react';
import { useSearch } from '../../context/Search';
import { Product } from './Product';
import { Suggestion } from './Suggestion';

export function Preview() {
  const { searchResults } = useSearch();

  if (searchResults === null || (!searchResults.content && !searchResults.suggestions)) return null;

  return (
    <div
      id='preview'
      className='absolute p-4 bg-white border border-gray-200 mt-1 rounded-md shadow-lg text-sm top-14 left-1/2 -translate-x-1/2 w-[80rem]  z-10'>
      {searchResults.suggestions?.length && searchResults.suggestions.length > 0 ? (
        <div className='mb-8'>
          <h3 className='text-xl mb-4'> Trending Searches</h3>
          <div className='grid grid-cols-2 gap-4'>
            {searchResults.suggestions.map((item, index) => (
              <Suggestion
                item={item}
                index={index}
                key={index}
              />
            ))}
          </div>
        </div>
      ) : null}
      {searchResults.content?.length && searchResults.content.length > 0 ? (
        <div>
          <h3 className='text-xl mb-4'> Products</h3>
          <div className='grid grid-cols-2 gap-4'>
            {searchResults.content.map((item, index) => (
              <Product
                item={item}
                index={index}
                key={index}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

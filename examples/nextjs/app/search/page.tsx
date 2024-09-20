'use client';

import products from '../../products.json';
import { Suspense } from 'react';
import Image from 'next/image';
import { withAuthGuard } from '../../components/AuthGuard';

async function getSearchResults(query: string) {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));
}

async function SearchResults({ query }: { query: string }) {
  const results = await getSearchResults(query);

  if (results.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-36'>
        <p className='text-4xl text-slate-500'>
          No results found.{' '}
          <span
            role='img'
            aria-label='sad face'
            className='text-4xl ml-2'>
            😞
          </span>
        </p>
        <p className='pt-3 text-slate-400'>Please try a different search term.</p>
      </div>
    );
  }

  return (
    <ul className='space-y-4'>
      {results.map((result) => (
        <li
          key={result.id}
          className='bg-white p-4 rounded-lg shadow flex items-center'>
          <div className='flex-shrink-0 mr-4'>
            <Image
              src={result.imageUrl}
              alt={result.title}
              width={100}
              height={100}
              className='rounded-lg object-cover'
            />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-blue-600'>{result.title}</h2>
            <p className='text-gray-600 mt-2'>{result.price}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SearchSkeleton() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='bg-gray-100 p-4 rounded-lg animate-pulse flex items-center'>
          <div className='flex-shrink-0 mr-4 w-[100px] h-[100px] bg-gray-200 rounded-lg'></div>
          <div className='flex-grow'>
            <div className='h-5 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchResultsPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || '';

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <h1 className='text-3xl font-bold mb-6'>Search Results for "{query}"</h1>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

export default withAuthGuard(SearchResultsPage);

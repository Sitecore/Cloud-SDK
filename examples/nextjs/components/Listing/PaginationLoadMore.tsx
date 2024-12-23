import React from 'react';

function PaginationLoadMore({
  pages,
  current,
  totalItems,
  currentItems,
  setCurrentPage,
  loading
}: {
  pages: number;
  current: number;
  totalItems: number;
  currentItems: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}) {
  return (
    <div className='load-more-wrapper flex flex-col items-center justify-center my-4'>
      <div className='mb-4'>
        {
          <p className='text-gray-600'>
            Showing {currentItems} results out of {totalItems}
          </p>
        }
      </div>
      {pages !== current && (
        <button
          className='rounded bg-red-600 hover:bg-red-500 font-medium text-white px-5 py-2.5 me-2 mb-2 btn-load-more'
          onClick={() => setCurrentPage(current + 1)}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

export default PaginationLoadMore;

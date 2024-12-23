import React from 'react';

const addSeparator = (current: number, page: number, offset: number) => {
  return Math.abs(page - current) > offset ? '...' : null;
};

const generatePagination = (pages: number, current: number): { value: number; isSelected: boolean }[] => {
  const maxNumberOfElements = 3;
  const firstPage = 1;
  const lastPage = pages;
  const offset = Math.ceil(maxNumberOfElements / 2);
  const offsetLeft = [...Array(offset).keys()]
    .map((value) =>
      Math.abs(value - current) <= firstPage || Math.abs(value - current) === current ? null : Math.abs(value - current)
    )
    .reverse();
  const offsetRight = [...Array(offset).keys()].map((value) =>
    current + value >= lastPage || current + value === current ? null : current + value
  );

  const pagination = [
    firstPage,
    addSeparator(current, firstPage, offset),
    ...offsetLeft,
    current !== firstPage && current !== lastPage ? current : null,
    ...offsetRight,
    addSeparator(current, lastPage, offset),
    lastPage
  ];

  return pagination
    .filter((item) => item !== null)
    .map((item) => {
      return {
        value: item as number,
        isSelected: item === current
      };
    });
};

function Pagination({
  pages,
  current,
  setCurrentPage
}: {
  pages: number;
  current: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const pagination = generatePagination(pages, current);

  return (
    <nav className='pagination-wrapper m-4 flex justify-end '>
      <ul className='flex items-center gap-2'>
        {pagination.map((page, index) => (
          <li key={index}>
            {typeof page.value === 'number' ? (
              <button
                className={`
                  hover:bg-red-500 text-white
                ${page.isSelected ? 'font-bold text-white bg-red-600' : 'cursor-pointer bg-red-400'} p-2 w-10 h-10 
                ${typeof page.value === 'number' ? 'rounded ' : null}
                `}
                onClick={() => setCurrentPage(page.value)}>
                {page.value}
              </button>
            ) : (
              <div>{page.value}</div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;

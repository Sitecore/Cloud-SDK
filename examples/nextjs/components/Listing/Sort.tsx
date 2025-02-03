import React from 'react';

function Sort({
  sortingOptions,
  selectedSort,
  setSort
}: {
  sortingOptions: { name: string; label: string }[];
  selectedSort: string;
  setSort: (string: string) => void;
}) {
  return (
    <div className='sorting-wrapper flex items-center gap-2'>
      <label htmlFor='sorter'>Sort by:</label>
      <select
        className='border p-1 rounded-md'
        name='sorter'
        value={selectedSort}
        onChange={(e) => setSort(e.target.value)}>
        {sortingOptions.map((option) => (
          <option
            key={option.name}
            value={option.name}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Sort;

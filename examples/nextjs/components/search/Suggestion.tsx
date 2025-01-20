import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { widgetSuggestionClick } from '@sitecore-cloudsdk/search/browser';
import { useSearch } from '../../context/Search';

export function Suggestion({ item, index }: { item: SuggestionItem; index: number }) {
  const { updateSearch, searchWidgetId } = useSearch();
  const pathname = usePathname();

  const handleClick = () => {
    updateSearch(item.text);
    widgetSuggestionClick({ request: { keyword: item.text }, pathname, widgetId: searchWidgetId });
  };

  return (
    <Link
      href={`/search?q=${item.text}`}
      onClick={handleClick}>
      <div
        key={index}
        className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full hover:shadow-md'>
        <p className='text-lg font-medium mt-2 text-black underline'>{item.text}</p>
      </div>
    </Link>
  );
}

export interface SuggestionItem {
  text: string;
  freq: number;
}

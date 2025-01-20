'use client';

import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';
import { SearchResults } from '../utils/debounce-search';

const contextDefaultValues: SearchContext = {
  search: '',
  updateSearch: () => null,
  searchResults: null,
  updateSearchResults: () => null,
  searchWidgetId: ''
};

const SearchContext = createContext<SearchContext>(contextDefaultValues);

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const { get } = useSearchParams();
  const [search, setSearch] = useState(get('q') ?? '');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const searchWidgetId = 'rfkid_6';

  return (
    <SearchContext.Provider
      value={{
        search,
        updateSearch: (q: string) => {
          setSearch(q);
        },
        searchResults,
        updateSearchResults: (results: SearchResults | null) => {
          setSearchResults(results);
        },
        searchWidgetId
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};

interface SearchContext {
  updateSearch: (q: string) => void;
  search: string;
  searchResults: SearchResults | null;
  updateSearchResults: (results: SearchResults | null) => void;
  searchWidgetId: string;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

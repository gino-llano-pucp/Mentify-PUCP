import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import ToolbarHeader from './ToolbarHeader';
import SearchBar from './SearchBar';
import ResultsContainer from './ResultsContainer';
import PaginationControl from './PaginationControl';

const DataList = ({ estado, fetchData, renderItem, noResultsText, showToolbarHeader = true, ListRenderer }) => {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSearchPages, setTotalSearchPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (filter === '') {
      if (!data[page]) {
        fetchDataList(page, filter);
      }
    } else {
      if (!searchResults[page]) {
        fetchDataList(page, filter);
      }
    }
  }, [page, filter]);

  useEffect(() => {
    console.log("data es: ", data);
  }, [data])

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchDataList = async (pageNum, search='') => {
    setLoading(true);
    try {
      const result = await fetchData(pageNum, search);
      console.log("retorna: ", result);
      if (result) {
        if (search === '') {
          setData(prev => ({
            ...prev,
            [pageNum]: result.items,
          }));
          setTotalPages(result.totalPages);
        } else {
          setSearchResults(prev => ({
            ...prev,
            [pageNum]: result.items,
          }));
          setTotalSearchPages(result.totalPages);
        }
      } else {
        setData({});
        setSearchResults({});
      }
    } catch (error) {
      setData({});
      setSearchResults({});
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    setFilter(searchValue);
    if (searchValue) {
      setPage(1);
      fetchDataList(1, searchValue);
    }
  }, 500), []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    setFilter('');
    setSearchResults({});
    setPage(1);
    fetchDataList(1);
  };

  const displayedData = filter ? searchResults[page] || [] : data[page] || [];
  const displayedTotalPages = filter ? totalSearchPages : totalPages;

  return (
    <section className='flex flex-col w-full h-full gap-6'>
      {showToolbarHeader && (
        <ToolbarHeader>
          <SearchBar 
            filtro={searchValue}
            clearSearch={clearSearch}
            handleSearchChange={handleSearchChange}
          />
        </ToolbarHeader>
      )}
      <main>
        <ResultsContainer
            estado={estado}
            loading={loading}
            displayedObjects={displayedData}
            renderItem={renderItem}
            noResultsText={noResultsText}
            ListRenderer={ListRenderer}
        />
        <PaginationControl
          totalPages={displayedTotalPages}
          page={page}
          handlePageChange={handlePageChange}
        />
      </main>
    </section>
  );
};

export default DataList;

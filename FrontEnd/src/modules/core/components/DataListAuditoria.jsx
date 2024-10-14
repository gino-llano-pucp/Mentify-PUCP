import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import ToolbarHeader from './ToolbarHeader';
import SearchBar from './SearchBar';
import ResultsContainer from './ResultsContainer';
import PaginationControl from './PaginationControl';

const DataListAuditoria = ({ page, setPage, data, noResultsText, ListRenderer, loading, totalPages }) => {

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <section className='flex flex-col w-full h-full gap-6'>
      <main>
        <ResultsContainer
            loading={loading}
            displayedObjects={data}
            noResultsText={noResultsText}
            ListRenderer={ListRenderer}
        />
        <PaginationControl
          totalPages={totalPages}
          page={page}
          handlePageChange={handlePageChange}
        />
      </main>
    </section>
  );
};

export default DataListAuditoria;

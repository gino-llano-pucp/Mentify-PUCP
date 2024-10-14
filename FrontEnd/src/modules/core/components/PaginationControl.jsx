import { Pagination } from '@nextui-org/react';
import React from 'react'

const PaginationControl = ({ totalPages, page, handlePageChange }) => {
    if (totalPages <= 1) return null;
  
    return (
      <div className='flex items-center justify-center w-full px-2 py-2 mt-auto'>
        <Pagination
          isCompact
          loop
          showControls
          showShadow
          size='md'
          color='primary'
          initialPage={1}
          page={page}
          total={totalPages}
          onChange={handlePageChange}
        />
      </div>
    );
}

export default PaginationControl
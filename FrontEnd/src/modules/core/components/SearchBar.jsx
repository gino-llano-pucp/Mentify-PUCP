import React from 'react'
import SearchInput from './SearchInput'

const SearchBar = ({ filtro, clearSearch, handleSearchChange }) => {
  return (
    <div className='flex flex-row items-end w-full gap-2'>
        <div className='flex flex-col w-3/5 gap-1'>
            {/* <span className='text-base font-semibold'>Nombre del tipo de tutoría</span> */}
            <SearchInput
              placeholder={'Ingresa el nombre'}
              value={filtro}
              clearSearch={clearSearch}
              onChange={handleSearchChange}
            />
          </div>
    </div>
  )
}

export default SearchBar
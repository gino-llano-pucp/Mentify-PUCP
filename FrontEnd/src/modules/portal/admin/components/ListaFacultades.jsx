'use client';
import { CircularProgress, Pagination } from '@nextui-org/react';
import React from 'react';
import FacultadCard from './FacultadCard';

const ListaFacultades = ({ filteredFacultades, handlePageChange, page, totalPages, loading, update, session }) => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Facultades...</div>
          </div>
        ) : filteredFacultades.length > 0 ? (
          filteredFacultades.map((facultad) => (
            <FacultadCard key={facultad.id_facultad} facultad={facultad} page={page} update={update} session={session}/>
          ))
        ) : (
          <div>No se encontraron facultades que coincidan con la búsqueda.</div>
        )}
      </div>
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default ListaFacultades;

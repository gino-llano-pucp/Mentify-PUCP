import { CircularProgress, Pagination } from '@nextui-org/react';
import React from 'react';
import UnidadAcademicaCard from './UnidadAcademicaCard';

const ListaUnidadesAcademicas = ({ filteredUnidadesAcademicas, handlePageChange, page, totalPages, loading, update, session, filtro }) => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Unidades Académicas...</div>
          </div>
        ) : filteredUnidadesAcademicas.length > 0 ? (
          filteredUnidadesAcademicas.map((unidad) => (
            <UnidadAcademicaCard
              key={unidad.id_unidad_academica}
              unidad={unidad}
              update={update}
              page={page}
              session={session}
              filtro={filtro}
            />
          ))
        ) : (
          <div>No se encontraron Unidades Académicas que coincidan con la búsqueda.</div>
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

export default ListaUnidadesAcademicas;

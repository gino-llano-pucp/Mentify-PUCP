import { CircularProgress, Pagination } from '@nextui-org/react';
import React from 'react';
import UnidadAcademicaCard from './UnidadAcademicaCard';

const ListaAProcesarUnidadesAcademicas = ({ filteredUnidadesAcademicas, handlePageChange, page, totalPages, update, session }) => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-wrap w-full gap-4'>
        {filteredUnidadesAcademicas.length > 0 ? (
          filteredUnidadesAcademicas.map((unidad) => (
            <UnidadAcademicaCard
              key={unidad.id_unidad_academica}
              unidad={unidad}
              update={update}
              page={page}
              session={session}
              eliminar_carga={true}
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
            className={filteredUnidadesAcademicas.length === 0 ? 'hidden' : ''}
            page={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListaAProcesarUnidadesAcademicas;

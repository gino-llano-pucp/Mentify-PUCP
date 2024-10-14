import { CircularProgress, Pagination } from "@nextui-org/react";
import SolicitudCard from './SolicitudCard';
import React from "react";

export const ListadoSolicitudes = ({filteredSolicitudes, handlePageChange, page, totalPages, loading, update, filtro, session, statusFilterEstado}) => {
  console.log(statusFilterEstado)  
  return (
        <div className='flex flex-col h-[85%]'>
          <div className='flex flex-wrap w-full gap-4'>
            {loading ? (
              <div className='flex flex-row items-center gap-3'>
                <CircularProgress aria-label='Loading...' />
                <div>Cargando Solicitudes...</div>
              </div>
            ) : filteredSolicitudes.length > 0 ? (
                filteredSolicitudes.map((solicitud) => (
                <SolicitudCard key={solicitud.id_solicitud?solicitud.id_solicitud:solicitud.idAlumno} solicitud={solicitud} update={update} page={page} filtro={filtro} session={session} />
              ))
            ) :
            filteredSolicitudes.length === 0 && filtro===''?
            (
              <div>{`No hay solicitudes de Asignación de Tutor `}
                {statusFilterEstado==='Todos'?'':`en estado ${statusFilterEstado}`}
                {` registradas para el Tipo de Tutoría seleccionado`}.</div>
            ):
            (
              <div>No se encontraron solicitudes que coincidan con la búsqueda.</div>

            )
          }
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
  }
  
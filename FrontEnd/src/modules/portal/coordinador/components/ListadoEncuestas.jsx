import { CircularProgress, Pagination } from "@nextui-org/react";
import React from "react";
import EncuestaCard from "./EncuestaCard";

export const ListadoEncuesta = ({filteredSolicitudes, handlePageChange, page, totalPages, loading}) => { 
  return (
        <div className='flex flex-col h-[85%]'>
          <div className='flex flex-wrap w-full gap-4'>
            {loading ? (
              <div className='flex flex-row items-center gap-3'>
                <CircularProgress aria-label='Loading...' />
                <div>Cargando Solicitudes de Encuestas...</div>
              </div>
            ) : filteredSolicitudes.length > 0 ? (
                filteredSolicitudes.map((solicitud) => (
                <EncuestaCard key={solicitud.id_encuesta_maestra} solicitud={solicitud}/>
              ))
            ) : (
              <div>No se encontraron encuestas que coincidan con la búsqueda o no hay encuestas.</div>
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
  }
  
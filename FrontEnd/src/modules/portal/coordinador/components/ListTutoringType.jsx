import { CircularProgress, Pagination } from "@nextui-org/react";
import { TutoringTypeCard } from "./TutoringTypeCard";
import React from "react";

export const ListTutoringType = ({filteredTutoringType, handlePageChange, page, totalPages, loading, update, filtro, session}) => {
  return (
        <div className='flex flex-col h-full'>
          <div className='flex flex-wrap w-full gap-4'>
            {loading ? (
              <div className='flex flex-row items-center gap-3'>
                <CircularProgress aria-label='Loading...' />
                <div>Cargando Tipos de Tutoría...</div>
              </div>
            ) : filteredTutoringType.length > 0 ? (
                filteredTutoringType.map((tutoringType) => (
                <TutoringTypeCard key={tutoringType.id} tutoringType={tutoringType} update={update} page={page} filtro={filtro} session={session}/>
              ))
            ) : 
            
            filteredTutoringType.length===0&&filtro===''?
            (
              <div>No hay tipos de tutoria registrados. Para registrar Tipos de Tutoría puede utilizar la opción Agregar.</div>
            )
            :
            (
              <div>No se encontraron Tipos de Tutoría que coincidan con la búsqueda.</div>
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

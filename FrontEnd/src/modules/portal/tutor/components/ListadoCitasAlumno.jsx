import { CircularProgress, Pagination } from '@nextui-org/react'
import React from 'react'
import { StudentCard } from '../../coordinador/components/StudentCard'
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import CitaAlumnoCard from './CitaAlumnoCard';


export const ListadoCitasAlumno = ({filteredCitas, handlePageChange, page, totalPages, loading, functionSpecified, session}) => {
    console.log(filteredCitas)
    return (
    <div className='flex flex-col h-[85%]'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Citas...</div>
          </div>
        ) : filteredCitas.length > 0 ? (
            filteredCitas.map((cita) => (
            <CitaAlumnoCard
            cita={cita} requestDetails={true} functionSpecified={functionSpecified} session={session}
            />

          ))
        ) : (
          <div>No se encontraron citas que coincidan con la búsqueda o no hay citas registradas.</div>
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
  )
}
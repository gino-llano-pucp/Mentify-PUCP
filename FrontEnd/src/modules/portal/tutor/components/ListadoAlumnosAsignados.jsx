import { CircularProgress, Pagination } from '@nextui-org/react'
import React from 'react'
import { StudentCard } from '../../coordinador/components/StudentCard'
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';

export const ListadoAlumnosAsignados = ({filteredStudents, handlePageChange, page, totalPages, loading}) => {
    
    return (
    <div className='flex flex-col h-[85%]'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Usuarios...</div>
          </div>
        ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
            <StudentCard
            student={student} requestDetails={true}
            />

          ))
        ) : (
          <div>No se encontraron alumnos que coincidan con la búsqueda o no hay alumnos.</div>
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
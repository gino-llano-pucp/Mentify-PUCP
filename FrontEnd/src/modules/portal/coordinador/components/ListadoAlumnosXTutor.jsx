import { UserCard } from './UserTypeCard'
import { CircularProgress, Pagination } from '@nextui-org/react'
import React from 'react'
import { AlumnoTipoTutoriaCard } from './AlumnoTipoTutoriaCard'

export const ListadoAlumnosXTutor = ({filteredStudents, handlePageChange, page, totalPages, loading, update, tutor, setUpdate, updateNow, filtro, session}) => {
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
            <AlumnoTipoTutoriaCard 
              key={student.id_student}
              student={student}
              update={update}
              page={page}
              setUpdate={setUpdate}
              updateNow={updateNow}
              tutor={tutor}
              filtro={filtro}
              session={session}
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
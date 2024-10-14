import { UserCard } from './UserTypeCard'
import { CircularProgress, Pagination } from '@nextui-org/react'
import React from 'react'

export const ListaUsuarios = ({filteredUsers, handlePageChange, page, totalPages, loading, update, setUpdate, updateNow, filtro, session}) => {
  return (
    <div className='flex flex-col h-[85%]'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Usuarios...</div>
          </div>
        ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              users={user}
              update={update}
              page={page}
              setUpdate={setUpdate}
              updateNow={updateNow}
              filtro={filtro}
              session={session}
            />
            
          ))
        ) :
        filteredUsers.length===0&&filtro===''?
        (
          <div>No hay Usuarios asignados. Para asignar Alumnos y Tutores puede utilizar las opciones Agregar Usuario y Cargar.</div>
        )
        :
        (
          <div>No se encontraron usuarios que coincidan con la búsqueda.</div>
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
  )
}

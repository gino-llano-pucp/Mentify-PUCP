import UserCard from '@/modules/core/components/UserCard'
import { CircularProgress, Pagination } from '@nextui-org/react'
import { jwtDecode } from 'jwt-decode';

export const ListadoUsuarios = ({filteredUsers, handlePageChange, page, totalPages, loading, userName, update, filtro, session}) => {
  const decoded = jwtDecode(session.accessToken);
  const rolesArray = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles].filter(Boolean);
 
  const filteredRoles = rolesArray.filter(role => 
    role === 'Coordinador de Facultad' || role === 'Administrador'
  );
  
  const result = filteredRoles.includes('Coordinador de Facultad')
    ? 'Coordinador de Facultad'
    : (filteredRoles.includes('Administrador') ? 'Administrador' : null);

  console.log(result)

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
              queVaEliminar={userName}
              key={user.id_usuario}
              users={user}
              Eliminar={true}
              componentName='Cargar Usuarios'
              update={update}
              page={page}
              myRol={result}
              filtro={filtro}
              session={session}
            />
            
          ))
        ) : (
          <div>No se encontraron usuarios que coincidan con la búsqueda.</div>
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

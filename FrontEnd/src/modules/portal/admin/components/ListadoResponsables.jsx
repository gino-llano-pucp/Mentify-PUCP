import { CircularProgress, Pagination } from '@nextui-org/react'
import ResponsableTutoriaCard from './ResponsableTutoriaCard'

export const ListadoResponsables = ({filteredUsers, loading, userName, update, session, totalPages, currentPage, handlePageChange}) => {
    
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
                        <ResponsableTutoriaCard
                            queVaEliminar={userName}
                            users={user}
                            Eliminar={true}
                            componentName='Cargar Usuarios'
                            update={update}
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
                    //initialPage={1}
                    className={filteredUsers.length === 0 ? 'hidden' : ''}
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
            )}
        </div>
    )
}
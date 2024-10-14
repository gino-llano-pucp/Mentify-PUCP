import { CircularProgress } from '@nextui-org/react'
import DerivacionCard from './DerivacionCard'
import React from 'react';

export const ListadoDerivaciones = ({userToShow, loading, userName, update}) => {

    return (
        <div className='flex flex-col h-[85%]'>
            <div className='flex flex-wrap w-full gap-4'>
                {loading ? (
                    <div className='flex flex-row items-center gap-3'>
                        <CircularProgress aria-label='Loading...' />
                        <div>Cargando Derivaciones...</div>
                    </div>
                ) : userToShow.length > 0 ? (
                    userToShow.map((user) => (
                        <DerivacionCard
                            users={user}
                            key={user.id_derivacion}
                            update={update}
                        />
                ))
                ) : (
                <div>No se encontraron derivaciones.</div>
                )}
            </div>
        </div>
    )
}
import { CircularProgress } from '@nextui-org/react'
import React from 'react'

const LoadingResults = () => {
  return (
    <div className='flex flex-row items-center gap-3'>
        <CircularProgress aria-label='Loading...' />
        <div>Cargando...</div>
    </div>
  )
}

export default LoadingResults
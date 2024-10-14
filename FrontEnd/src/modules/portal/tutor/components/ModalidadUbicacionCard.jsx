import CopyToClipboard from '@/modules/core/components/CopyToClipboard'
import { Cloud, MapPin, Users, Video } from 'lucide-react'
import React from 'react'

const ModalidadUbicacionCard = ({modalidad, ubicacion}) => {
  return (
    <div className='flex flex-col gap-2'>
        <div className='flex flex-row gap-2'>
            {modalidad === 'virtual' ? (
                <Video size={16}/>
            ) : (
                <Users size={16}/>
            )}
            <span className='text-sm capitalize'>{modalidad}</span>
        </div>
        <div className='flex flex-row gap-2 w-48'>
            <span className='flex flex-shrink-0'>
                {modalidad === 'virtual' ? (
                    <Cloud size={16}/>
                ) : (
                    <MapPin size={16}/>
                )}
            </span>
            <CopyToClipboard text={ubicacion}/>
            {/* <span className='text-sm truncate'>{ubicacion}</span> */}
        </div>
    </div>
  )
}

export default ModalidadUbicacionCard
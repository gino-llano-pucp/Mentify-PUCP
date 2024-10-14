import React from 'react'
import { useInstitucion } from '../../states/InstitutionContext';
import Image from 'next/image';

const SidebarInstitution = () => {
    const { institucion } = useInstitucion();

    if (!institucion) return null;

    return (
        <div className='flex flex-row gap-2 items-center w-[150px] justify-center p-2 border-1 border-gray-300 rounded-xl cursor-pointer transition duration-200 ease-in-out hover:bg-gray-100'>
            <div className='flex-shrink-0'>
                <div className='relative w-8 h-8 overflow-hidden rounded-full'>
                    <Image
                        src={`data:image/jpeg;base64,${institucion?.logo}`}
                        alt="Institution Logo"
                        fill={true}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
            <span className='font-medium text-base truncate'>{institucion.siglas}</span>
        </div>
    )
}

export default SidebarInstitution
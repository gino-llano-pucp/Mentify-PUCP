import Image from 'next/image'
import React from 'react'

const LogoInstitucion = ({image}) => {
    if (image == null) return;
    
  return (
    <div className='flex-shrink-0'>
        <div className='relative w-20 h-20 overflow-hidden rounded-full md:w-28 md:h-28 '>
            <Image
                src={image}
                alt="Institution Logo"
                fill={true}
                style={{ objectFit: 'cover' }}
            />
        </div>
    </div>
  )
}

export default LogoInstitucion
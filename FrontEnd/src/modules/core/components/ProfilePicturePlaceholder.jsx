import Image from 'next/image'
import React from 'react'

const ProfilePicturePlaceholder = ({src, alt, width, height}) => {
    const widthClass = `w-${width}`;
    const heightClass = `h-${height}`;

  return (
    <div className='flex-shrink-0'>
        <div className={`relative ${widthClass} ${heightClass} overflow-hidden rounded-full`}>
            <Image
                src={src || '/profile-pic.webp'}
                alt={alt || 'Profile Picture'}
                fill={true}
                style={{ objectFit: 'cover' }}
            />
        </div>
    </div> 
  )
}

export default ProfilePicturePlaceholder
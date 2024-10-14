import React from 'react';
import Image from 'next/image';

const LeftPanel = () => {
  return (
    <aside className='flex-shrink-0 h-screen lg:w-3/5 xl:w-3/4'>
      <div className='relative w-full h-full overflow-hidden '>
        <Image
          src='/login-image.png'
          alt='Mentify Campus (Imagen Referencial)'
          fill={true}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </aside>
  );
};
export default LeftPanel;

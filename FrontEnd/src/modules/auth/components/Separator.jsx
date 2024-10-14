import React from 'react';

const Separator = ({ text }) => {
  return (
    <div className='relative'>
      <div className='absolute inset-0 flex items-center'>
        <span className='w-full border-t'></span>
      </div>
      <div className='relative flex justify-center text-xs uppercase'>
        <span className='px-2 bg-background text-muted-foreground'>{text}</span>
      </div>
    </div>
  );
};

export default Separator;

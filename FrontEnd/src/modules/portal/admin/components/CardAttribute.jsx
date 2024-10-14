import { cn } from '@/modules/core/lib/utils';
import React from 'react';

const CardAttribute = ({ icon, text, className }) => {
  return (
    <div className={cn('flex flex-row w-full gap-3', className)}>
      {icon}
      <span className='text-sm'>{text}</span>
    </div>
  );
};

export default CardAttribute;

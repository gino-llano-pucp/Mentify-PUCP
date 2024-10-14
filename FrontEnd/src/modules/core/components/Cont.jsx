'use client';
import { SearchForm } from '@/modules/core/components/SearchForm';
import { CirclePlus } from 'lucide-react';
import UseLink from '@/modules/core/components/Uselink';

export function Cont({ label, input, componentId, componentName }) {
  /* const pathname = usePathname();
  const isInclude = pathname.includes(url); */
  return (
    <div className='flex flex-row w-full'>
      <div className='w-full'>
        <SearchForm label={label} input={input} />
      </div>
      <div className='flex items-end'>
        {/* // boton nuevo */}
        <UseLink
          variant='btContent'
          className='flex items-center justify-center ml-4'
          icon={<CirclePlus className='mr-2 size-5' />}
          text='Nuevo'
          componentId={componentId}
          componentName={componentName}
        />
      </div>
    </div>
  );
}

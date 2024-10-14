import { Input } from '@nextui-org/react';
import { SearchIcon } from 'lucide-react';
import React from 'react';

const SearchInput = ({ placeholder, value, clearSearch, onChange }) => {
  return (
    <Input
      isClearable
      value={value}
      onChange={onChange}
      onClear={clearSearch}
      radius='lg'
      classNames={{
        label: 'text-black/50 dark:text-white/90',
        input: [
          'bg-transparent',
          'text-black/90 dark:text-white/90 text-sm',
          'placeholder:text-default-700/50 dark:placeholder:text-white/60'
        ],
        innerWrapper: 'bg-transparent',
        inputWrapper: [
          'shadow-md',
          'bg-default-200/50',
          'dark:bg-default/60',
          'backdrop-blur-xl',
          'backdrop-saturate-200',
          'hover:bg-default-200/70',
          'dark:hover:bg-default/70',
          'group-data-[focused=true]:bg-default-200/50',
          'dark:group-data-[focused=true]:bg-default/60',
          '!cursor-text'
        ]
      }}
      placeholder={placeholder}
      startContent={
        <SearchIcon className='text-black/50 mb-0.5 w-4 h-4 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0' />
      }
    />
  );
};

export default SearchInput;

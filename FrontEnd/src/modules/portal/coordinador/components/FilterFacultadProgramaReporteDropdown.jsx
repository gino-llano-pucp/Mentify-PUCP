'use client';
import {
  SelectItem,
  Select,
  select,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const FilterFacultadProgramaReporteDropdown = ({ statusFilter, setStatusFilter, isFullLength}) => {
  const statusOptions = [
    { uid: 0, name: 'Todos' },
    { uid: 1, name: 'Solo Facultades' },
    { uid: 2, name: 'Solo Programas' }
  ];
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Todos']));

const selectedValue = React.useMemo(()=>{
    const selectedId = Array.from(selectedKeys).join(', ');
    const selectedItem = statusOptions.find((type) => String(type.uid) === selectedId);
    return {
      uid: selectedItem ? selectedItem.uid : 0,
      name: selectedItem ? selectedItem.name : 'Todos',
    };
},[selectedKeys]);

useEffect(() => {
  setStatusFilter(selectedValue)
}, [selectedKeys]);

  return (
    <Dropdown className='min-w-28 w-full'>
      <DropdownTrigger className='hidden sm:flex md'>
        <Button endContent={<ChevronDownIcon size={16} />}
        variant='flat'
        //className={`min-w-28 + {w-28}`}
        className={isFullLength?"flex justify-between text-gray-700 w-full":"flex justify-between text-gray-700 min-w-60"}
        >
        {selectedValue.name}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        aria-label='Table Columns'
        //closeOnSelect={true}
        selectedKeys={selectedKeys}
        selectionMode='single'
        onSelectionChange={setSelectedKeys}
        className='min-w-35 w-35'
      >
        {statusOptions.map((status) => (
          <DropdownItem key={status.uid} className='capitalize'>
            {status.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterFacultadProgramaReporteDropdown;

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

const FilterFrequencyDropdown = ({ statusFilter, setStatusFilter }) => {
  const statusOptions = [
    //{ uid: 0, name: 'Todos' },
    { uid: 1, name: 'Diaria' },
    { uid: 2, name: 'Semanal' },
    { uid: 3, name: 'Mensual' }
  ];
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Tutores']));

const selectedValue = React.useMemo(()=>{
    const selectedId = Array.from(selectedKeys).join(', ');
    const selectedItem = statusOptions.find((type) => String(type.uid) === selectedId);
    return {
      uid: selectedItem ? selectedItem.uid : 1,
      name: selectedItem ? selectedItem.name : 'Diaria',
    };
},[selectedKeys]);

useEffect(() => {
  setStatusFilter(selectedValue)
}, [selectedKeys]);

  return (
    <Dropdown className='min-w-28'>
      <DropdownTrigger className='hidden sm:flex md'>
        <Button endContent={<ChevronDownIcon size={16} />} variant='flat' className='min-w-28 w-28'>
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

export default FilterFrequencyDropdown;

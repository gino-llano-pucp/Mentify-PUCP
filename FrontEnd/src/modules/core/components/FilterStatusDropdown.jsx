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

const FilterStatusDropdown = ({ statusFilter, setStatusFilter, fetch, filtro, setPage }) => {
  const statusOptions = [
    { uid: 'Activo', name: 'Activo' },
    { uid: 'Inactivo', name: 'Inactivo' }
  ];

  
  // Estado para mantener el valor seleccionado
  const [buttonLabel, setButtonLabel] = useState('Estado');
  
  // Efecto para cambiar el nombre del filter dropdown para que se muestre el nombre del filtro
  useEffect(() => {
    if(fetch){
      if(setPage){
        setPage(1)
      }
      fetch(1,filtro)
    }
    if (statusFilter.size > 1) {
      setButtonLabel('Todos');
    } else if (statusFilter.size === 1) {
      const selectedStatus = statusOptions.find(option => statusFilter.has(option.uid));
      setButtonLabel(selectedStatus ? selectedStatus.name : 'Estado');
    } else {
      setButtonLabel('Estado');
    }
  }, [statusFilter]);

  return (
    <Dropdown className='min-w-28'>
      <DropdownTrigger className='flex md'>
        <Button endContent={<ChevronDownIcon size={16} />} variant='flat' className='min-w-28 w-28'>
          {buttonLabel}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        aria-label='Table Columns'
        closeOnSelect={false}
        selectedKeys={statusFilter}
        selectionMode='multiple'
        onSelectionChange={setStatusFilter}
        className='min-w-28 w-28'
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

export default FilterStatusDropdown;

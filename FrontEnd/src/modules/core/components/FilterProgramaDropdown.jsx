'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';

/*
  No cambiar la lógica de este filtro:
  - Aquí se pasa a StatusFilter la data de selectedValue que contiene el id y nombre del programa
  - Si es 'Todos', el id será un array con todos los ids: [1, 10, 40, 20]
*/

export default function FilterProgramaDropdown({ setStatusFilter, fetch, isFullLength, session, filterFacultadPrograma}) {
  const [types, setType] = useState();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Todos']));
  const [allIds, setAllIds] = useState([]);

  const fetchType = async () => {
    if (session?.accessToken) {
      const data = await fetch(session);
      console.log(data);
      if (data) {
        setType(data);
        setAllIds(data.map(type => type.id).filter(id => id !== 0));
        
      }
    } else {
      console.error('No access token available');
    }
  };

  useEffect(() => {
    fetchType();
  }, []);

  useEffect(() => {
    setSelectedKeys([{ id: 0, nombre: 'Todos' }]);
  }, [filterFacultadPrograma]);
  
  const selectedValue = React.useMemo(() => {
    if (types === undefined ) {
      return { id: 0, nombre: 'Todos' }; // Valor por defecto cuando types es undefined
    }
    console.log(types);
    const selectedId = Array.from(selectedKeys).join(', ');
    const selectedItem = types.find(type => String(type.id) === selectedId);
    return {
      id: selectedItem ? selectedItem.id : 0,
      nombre: selectedItem ? selectedItem.nombrePrograma : 'Todos',
    };
  }, [selectedKeys, types]);

  useEffect(() => {
    if (types === undefined) {
      return
    }
    if (selectedValue.id === 0) {
      console.log(allIds);
      setStatusFilter(allIds);
    } else {
      console.log(selectedValue);
      setStatusFilter(selectedValue);
    }
  }, [selectedValue]);

  return (
    <Dropdown className='w-full' isDisabled={filterFacultadPrograma.uid===1}>
      <DropdownTrigger>
        <Button
          endContent={<ChevronDownIcon size={16} />}
          variant='flat'
          className={isFullLength?"flex justify-between text-gray-700 min-w-60":"flex justify-between text-gray-700 min-w-60"}
        >
          {selectedValue.nombre}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        className={isFullLength?"box-border w-full max-h-[400px] overflow-y-auto min-w-60":"box-border min-w-60 max-h-[400px] overflow-y-auto"}
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyContent='No hay Programas registrados'
      >
        {types ? types.map(data => (
          <DropdownItem key={data.id}>{data.nombrePrograma}</DropdownItem>
        )) : null}
      </DropdownMenu>
    </Dropdown>
  );
}

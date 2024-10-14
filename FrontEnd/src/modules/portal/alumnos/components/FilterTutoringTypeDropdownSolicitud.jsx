'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';

/*
  No cambiar la lógica de este filtro:
  - Aquí se pasa a StatusFilter la data de selectedValue que contiene el id y nombre de la tutoría
  - Si es 'Todos', el id será un array con todos los ids: [1, 10, 40, 20]
*/

export default function FilterTutoringTypeDropdownSolicitud({ setStatusFilter, fetch, isFullLength, session,doRefresh, setDoRefresh }) {
  const [types, setType] = useState();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Todos']));
  const [allIds, setAllIds] = useState([]);

  const fetchType = async () => {
    
    const data = await fetch(session.accessToken);
    console.log(data);
    if (data) {
      setType(data);
      setAllIds(data.map(type => type.id).filter(id => id !== 0));
    }
  };

  useEffect(() => {
    if(session&&doRefresh)  
      fetchType();
    setDoRefresh(false)
  }, [session,doRefresh]);
  
  const selectedValue = React.useMemo(() => {
    if (types === undefined) {
      return { id: 0, nombre: 'Todos' }; // Valor por defecto cuando types es undefined
    }
    console.log(types);
    const selectedId = Array.from(selectedKeys).join(', ');
    const selectedItem = types.find(type => String(type.id) === selectedId);
    return {
      id: selectedItem ? selectedItem.id : 0,
      nombre: selectedItem ? selectedItem.nombreTutoria : 'Todos',
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
    <Dropdown className='w-full' >
      <DropdownTrigger>
      <Button
        endContent={<ChevronDownIcon size={16} />}
        variant='flat'
        className={isFullLength ? "flex justify-between text-gray-700 w-full truncate" : "flex justify-between text-gray-700 min-w-60 w-60 truncate max-w-xs"}
      >
        <span className="truncate">{selectedValue.nombre}</span>
      </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        className={isFullLength?"box-border w-full max-h-[400px] overflow-y-auto":"box-border w-60 min-w-60 max-h-[400px] overflow-y-auto"}
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyContent='No hay Tipos de Tutoría registradas'
      >
        {types ? types.map(data => (
          <DropdownItem key={data.id}>{data.nombreTutoria}</DropdownItem>
        )) : null}
      </DropdownMenu>
    </Dropdown>
  );
}

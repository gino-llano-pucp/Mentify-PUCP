'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';

export default function FilterStatusSolicitude({setStatusFilter, session}) {
  const [types, setType] = useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Todos']));

  useEffect(() => {
    const fetchType = async () => {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/estadoSolicitud/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error('Failed to fetch faculties');
        return;
      }
      const data = await response.json();
      console.log(data)
      data.unshift({nombre:'Todos'})
      setType(data);
    };

    fetchType();
  }, []);

  useEffect(() => {
    /*
    if (props.idFacultad && facultades) {
      let index = facultades.findIndex((facultad) => facultad && facultad.id_facultad === props.idFacultad);
      if (index !== -1 && facultades[index]) setSelectedKeys(new Set([`${facultades[index].nombre}`]));
    }*/
  }, [types]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  useEffect(() => {
    setStatusFilter(selectedValue)
  }, [selectedKeys]);

  return (
    <Dropdown className='w-full'>
      <DropdownTrigger>
        <Button
          endContent={<ChevronDownIcon size={16} />}
          variant='flat'
          className='flex justify-between text-gray-700 min-w-44 w-44'
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        className='box-border w-44 min-w-44'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyContent='No hay facultades registradas'
      >
        {types.map((facultad) => (
          <DropdownItem key={facultad.nombre}>{facultad.nombre}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
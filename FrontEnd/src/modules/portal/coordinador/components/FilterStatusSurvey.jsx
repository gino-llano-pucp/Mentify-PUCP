'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';

export default function FilterStatusSurvey({setStatus, session}) {
  const [statusSurvey, setStatusSurvey] = useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Todos']));

  useEffect(() => {
    const fetchStatusSurvey = async () => {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/EstadoEncuestaMaestra/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error('No se pudo obtener los estados de las encuestas');
        return;
      }
      const data = await response.json();
      console.log(data)
      data.unshift({nombre:'Todos'})
      setStatusSurvey(data);
    };

    fetchStatusSurvey();
  }, []);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  useEffect(() => {
    setStatus(selectedValue)
  }, [selectedKeys]);

  return (
    <Dropdown className='min-w-44'>
      <DropdownTrigger>
        <Button
          endContent={<ChevronDownIcon size={16} />}
          variant='flat'
          className='flex justify-between text-gray-700 min-w-44 w-full'
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
        {statusSurvey.map((status) => (
          <DropdownItem key={status.nombre}>{status.nombre}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

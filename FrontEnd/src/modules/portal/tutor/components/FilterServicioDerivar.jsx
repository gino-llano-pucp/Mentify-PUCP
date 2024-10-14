'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';

export default function FilterServicioDerivar({setStatusFilter, setSelectedKeys, selectedKeys, puedoEditar, session}) {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/unidadAcademica/listar-todos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error('Failed to fetch unidades academicas');
        return;
      }
      const data = await response.json();
      console.log(data)

      const filteredData = data.unidades.filter((unidad) => unidad.esActivo === 1);

      setServicios(filteredData);
    };

    fetchServicios();
  }, []);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  useEffect(() => {
    setStatusFilter(selectedValue)
  }, [selectedKeys]);

  return (
    <Dropdown className='min-w-44'>
      <DropdownTrigger>
        <Button
          endContent={<ChevronDownIcon size={16} />}
          variant='flat'
          className='flex justify-between text-gray-700 min-w-60 w-96'
          isDisabled={!puedoEditar}
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        className='box-border min-w-[400px] max-h-[200px] overflow-y-auto'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyContent='No hay unidades académicas registradas'
      >
        {servicios.map((unidadAcademica) => (
          <DropdownItem key={unidadAcademica.nombre}>{unidadAcademica.nombre}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
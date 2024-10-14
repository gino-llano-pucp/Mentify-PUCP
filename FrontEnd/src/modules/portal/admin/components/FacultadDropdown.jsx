'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';
import { useFacultad } from '../states/FacultadContext';

export default function FacultadDropdown(props) {
  const { addFacultad, clearFields } = useFacultad();
  const [facultades, setFacultades] = useState([]);
  const session = props.session;
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Seleccione una Facultad']));

  useEffect(() => {
    const fetchFacultades = async () => {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/facultad/listar-todos/`, {
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
      setFacultades(data.facultades);
    };

    fetchFacultades();
  }, []);

  useEffect(() => {
    console.log('facultades: ', facultades);
    if (props.idFacultad && facultades) {
      let index = facultades.findIndex((facultad) => facultad && facultad.id_facultad === props.idFacultad);
      if (index !== -1 && facultades[index]) setSelectedKeys(new Set([`${facultades[index].nombre}`]));
    }
  }, [facultades]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  useEffect(() => {
    let index = facultades.findIndex((facultad) => facultad.nombre === selectedValue);
    if (index !== -1) {
      props.handleChange('fid_facultad', facultades[index].id_facultad, props.setIsFacultadSelected);
      props.setIsFacultadSelected(true);
      clearFields();
      addFacultad(facultades[index].id_facultad);
    }
  }, [selectedKeys]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          endContent={<ChevronDownIcon size={16} />}
          variant='flat'
          className='flex justify-between text-gray-700'
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
        emptyContent='No hay facultades registradas'
      >
        {facultades.map((facultad) => (
          <DropdownItem key={facultad.nombre}>{facultad.nombre}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

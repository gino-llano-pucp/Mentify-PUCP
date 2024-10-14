'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';
import { useFacultad } from '../states/FacultadContext';

export default function FacultadDerivacionDropdown(props) {

  console.log('propiedades: ', props);

  const { addFacultad, clearFields } = useFacultad();
  const [facultades, setFacultades] = useState([]);
  const session = props.session;
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([props.facultad || 'Seleccione una Facultad']));

  useEffect(() => {
    const fetchFacultades = async () => {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/listar-facultades-disponibles/`, {
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

      console.log(data);

      setFacultades(data.data);
    };

    fetchFacultades();
  }, []);

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
      console.log('Facultad seleccionada: ', facultades[index].id_facultad);
    }
  }, [selectedKeys]);

  console.log(selectedValue)
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
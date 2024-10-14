'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';
import { useFacultad } from '../states/FacultadContext';

export default function ProgramaFacultadDropdown({
  handleChange,
  setIsProgramSelected,
  idPrograma,
  idFacultad,
  session
}) {
  const { facultad } = useFacultad();
  console.log(facultad)
  const [programas, setProgramas] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(['Seleccione un Programa']));

  useEffect(() => {
    const fetchProgramas = async () => {
      setSelectedKeys(new Set(['Seleccione un Programa']));
      if (facultad !== null || idFacultad) {
        const token = session?.accessToken;
        console.log('sess: ', session);
        if (!token) {
          console.log('No token available');
          return;
        }

        if (facultad) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/facultad/obtenerProgramas/${facultad}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (!response.ok) {
            console.error('Failed to fetch programs');
            return;
          }
          const data = await response.json();
          setProgramas(data);
        } else if (idFacultad) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/facultad/obtenerProgramas/${idFacultad}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (!response.ok) {
            console.error('Failed to fetch programs');
            return;
          }
          const data = await response.json();
          setProgramas(data);
          
        }
      }
    };
    fetchProgramas();
  }, [facultad]);

  useEffect(() => {
    console.log('programas: ', programas);
    if(programas.length === 0) {
      handleChange('fid_programa', 0, setIsProgramSelected);
      setIsProgramSelected(true);
    }else{
      handleChange('fid_programa', null, setIsProgramSelected);
    }
    if (idPrograma && programas) {
      let index = programas.findIndex((programa) => programa && programa.id_programa === idPrograma);
      if (index !== -1 && programas[index]) {
        console.log(index)
        setSelectedKeys(new Set([`${programas[index].nombre}`]));
      }
    }
  }, [programas]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  useEffect(() => {
    if (programas) {
      if(programas.length === 0) {
        //handleChange('fid_programa', 0, setIsProgramSelected);
        setIsProgramSelected(true);
        console.log('Aqui')
      }
      else{
        let index = programas.findIndex((programa) => programa.nombre === selectedValue);
        if (index !== -1) {
          handleChange('fid_programa', programas[index].id_programa, setIsProgramSelected);
          setIsProgramSelected(true);
        } else{
          handleChange('fid_programa', null, setIsProgramSelected);
          setIsProgramSelected(false);
        }
      }
    }
  }, [selectedKeys]);

  return (
    <Dropdown isDisabled={facultad === null}>
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
        emptyContent='No hay programas registrados'
      >
        {(facultad !== null && programas) || (idFacultad && programas)
          ? programas.map((programa) => <DropdownItem key={programa.nombre}>{programa.nombre}</DropdownItem>)
          : ''}
      </DropdownMenu>
    </Dropdown>
  );
}

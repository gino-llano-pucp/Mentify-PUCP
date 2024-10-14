'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { ChevronDownIcon } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

//import { useFacultad } from '../states/FacultadContext';

export default function TipoTutoriaDropdown({setTipoTutoriaFilter, session}) {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Todos']));
  const [tiposTutoria, setTiposTutoria] = useState([]);

  useEffect(() => {
    const fetchTipoTutorias = async () => {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      //const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/listar-tipos-tutoria-asignados`, {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/listar-tipos-tutoria-alumno`, {
        //method: 'GET',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "idAlumno": jwtDecode(session.accessToken).id
        })
      });
      
      if (!response.ok) {
        console.error('Failed to fetch tutory types');
        return;
      }
      const data = await response.json();
      data.data.unshift({nombreTutoria:'Todos'})
      console.log("Lista de tutorias: ",data.data)
      
      
      setTiposTutoria(data.data)
    };

    fetchTipoTutorias();
  }, []);

  useEffect(() => {
    /*console.log('Tipos de tutoria: ', tiposTutoria);
    if (props.id_tipoTutoria && tiposTutoria) {
      let index = tiposTutoria.findIndex((tipoTutoria) => tipoTutoria && tipoTutoria.id_facultad === props.id_tipoTutoria);
      if (index !== -1 && tiposTutoria[index]) setSelectedKeys(new Set([`${tiposTutoria[index].nombre}`]));
    }*/
    setTipoTutoriaFilter(selectedValue);
    //setIdTipoTutoriaFilter(tiposTutoria.find(item => item.nombre === selectedValue)?tiposTutoria.find(item => item.nombre === selectedValue).id:null)
  }, [selectedKeys]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  /*useEffect(() => {
    /*let index = tiposTutoria.findIndex((tipoTutoria) => tipoTutoria.nombre === selectedValue);
    if (index !== -1) {
      props.handleChange('fid_facultad', tiposTutoria[index].id_facultad, props.setIsFacultadSelected);
      props.setIsFacultadSelected(true);
      clearFields();
    }
  }, [selectedKeys]);*/

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
        className='box-border w-[515px] min-w-[515px] max-h-[400px] overflow-y-auto'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        emptyContent='No hay tipos de tutoria registrados'
      >
        {tiposTutoria.map((tipoTutoria) => (
          <DropdownItem key={tipoTutoria.nombreTutoria}>{tipoTutoria.nombreTutoria}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

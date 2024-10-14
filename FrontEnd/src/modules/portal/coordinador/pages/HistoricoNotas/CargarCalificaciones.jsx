'use client';
import React, { useState } from 'react';
import UseButton from '@/modules/core/components/UseButton';
import SearchInput from '@/modules/core/components/SearchInput';
import { CircleCheckBig, CircleX } from 'lucide-react';
import { Button, Pagination } from '@nextui-org/react';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import toast from 'react-hot-toast';
import { HistoricoCard } from '../../components/HistoricoCard';
import { useUsers } from '@/modules/core/states/UsersContext';
import { jwtDecode } from 'jwt-decode';

export default function CargarCalificaciones ({session}) {
  const { users } = useUsers();
  const [filtro, setFiltro] = useState('');
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const { setActiveComponent } = useActiveComponent();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);
  const decoded = jwtDecode(session.accessToken)
  const [flag, setFlag] = useState(true);

  const handleSearchChange = (e) => {
    if(e.target.value.length === 0){
      setEndIndex(9);
    }
    setCurrentPage(1);
    setFiltro(e.target.value);
  };

  const filteredUsers = users[0].filter((user) => {
    const filtroLower = filtro.toLowerCase();
    const apellidoLower = user.primerApellido.toLowerCase();
    const nombresLower = user.nombres.toLowerCase();
    const codigoLower = user.codigo.toLowerCase();
    const concat = `${nombresLower} ${apellidoLower}`.toLowerCase();
    return (
      concat.includes(filtroLower) ||
      codigoLower.includes(filtroLower)
    );
  });

  const usersToShow = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newStartIndex = (page - 1) * itemsPerPage;
    const newEndIndex = Math.min(newStartIndex + itemsPerPage, filteredUsers.length);
    setEndIndex(newEndIndex);
  };

  const cargaMasiva = async () => {
    if(users[0].length === 0){
      setActiveComponent('alumnos', 'Gestión de Alumnos');
      return
    }
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/carga-masiva-notas-alumnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          alumnos: users[0],
          id_Creador: decoded.id
        })
      });

      if (!response.ok) {
        return;
      }

      setActiveComponent('alumnos', 'Gestión de Alumnos');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClick = async () => {
    toast
      .promise(
        cargaMasiva(),
        {
          loading: 'Procesando Notas del Alumno...',
          success: 'Notas del alumno procesadas correctamente',
          error: 'Error al procesar notas del alumno'
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      )
      .catch((error) => {
        console.error('Failed to post render request: ', error);
      });
  };

  const clear = () => {
    setEndIndex(9);
    setCurrentPage(1); 
    setFiltro('');
  };

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-row items-end w-full gap-2'>
          <div className='flex flex-col w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Código o nombre del alumno</span>
            <SearchInput
              placeholder={`Ingresa el código o nombre del alumno`}
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clear}
            />
          </div>
          <Button
            color='primary'
            variant='shadow'
            className='flex items-center justify-center w-40'
            startContent={<CircleCheckBig size={20} />}
            onClick={() => {
              if(!flag) return;
              setFlag(false);
              handleClick();
            }}
          >
            Procesar
          </Button>
          <UseButton
            color='danger'
            variant='shadow'
            className='flex items-center justify-center w-40'
            startContent={<CircleX size={20} />}
            text='Cancelar'
            componentId='alumnos'
            componentName='Gestión de Alumnos'
          />
        </div>
      </div>

      <div className='flex flex-wrap w-full gap-[12px]'>
        {usersToShow.length > 0 ? (
          usersToShow.map((user) => (
            <HistoricoCard
              users={user}
            />
          ))
        ) : (
          <div>No se encontraron usuarios.</div>
        )}
      </div>
      <div className='flex items-center justify-center w-full px-2 py-2 mt-auto'>
        <Pagination
          isCompact
          loop
          showControls
          showShadow
          size='md'
          color='primary'
          initialPage={1}
          className={usersToShow.length === 0 ? 'hidden' : ''}
          total={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
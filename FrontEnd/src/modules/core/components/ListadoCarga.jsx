'use client';
import React, { useEffect, useState } from 'react';
import { useUsers } from '@/modules/core/states/UsersContext';
import UserCard from '@/modules/core/components/UserCard';
import UseButton from '@/modules/core/components/UseButton';
import SearchInput from '@/modules/core/components/SearchInput';
import { CircleCheckBig, CircleX } from 'lucide-react';
import { Button, Pagination } from '@nextui-org/react';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import toast from 'react-hot-toast';

function ListadoCarga({ session }) {
  const { users } = useUsers();
  const [filtro, setFiltro] = useState('');
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const { setActiveComponentById } = useActiveComponent();
  const [idRol, setIdRol] = useState();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);
  const [flag, setFlag] = useState(true);

  let typeUser,
    typeUserCapitalize,
    pluralType,
    pluralTypeCapitalize,
    first = true;

  useEffect(() => {
    if (users[0].length !== 0) {
      if (first && users[0][0].idRol === 3) {
        setIdRol(3);
        first = false;
      } else if (first && users[0][0].idRol === 4) {
        setIdRol(4);
        first = false;
      }
    }
  }, [users]); // Ejecutar cada vez que cambie `users`

  if (idRol === 3) {
    typeUser = 'tutor';
    typeUserCapitalize = 'Tutor';
    pluralType = 'tutores';
    pluralTypeCapitalize = 'Tutores';
  } else {
    typeUser = 'alumno';
    typeUserCapitalize = 'Alumno';
    pluralType = 'alumnos';
    pluralTypeCapitalize = 'Alumnos';
  }

  const handleSearchChange = (e) => {
    if (e.target.value.length === 0) {
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
    const emailLower = user.email.toLowerCase();
    const concat = `${nombresLower} ${apellidoLower}`.toLowerCase();
    return (
      concat.includes(filtroLower) ||
      codigoLower.includes(filtroLower) ||
      emailLower.includes(filtroLower)
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
    try {
      const token = session?.accessToken;
      if (!token) {
        setFlag(false);
        throw new Error('Token invalido');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/cargaMasiva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(users[0])
      });
      
      if (!response.ok) {
        setFlag(false);
        throw new Error('Error en fetch');
      }
      setActiveComponentById(pluralType, `Gestión de ${pluralTypeCapitalize}`);
    } catch (error) {
      setFlag(false);
      throw error;
    }
  };

  const handleClick = async () => {
    toast.promise(
       cargaMasiva(),
      {
        loading: 'Cargando Usuarios...',
        success: 'Usuarios procesados con éxito',
        error: 'Error al procesar usuarios'
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
            <span className='text-lg font-semibold'>Código, nombre o correo del {typeUser}</span>
            <SearchInput
              placeholder={`Ingresa el código, nombre o correo del ${typeUser}`}
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
              if (!flag) return;
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
            componentId={pluralType}
            componentName={`Gestión de ${pluralType}`}
          />
        </div>
      </div>

      <div className='flex flex-wrap w-full gap-[12px] overflow-y-auto'>
        {usersToShow.length > 0 ? (
          usersToShow.map((user) => (
            <UserCard
              queVaEliminar={typeUserCapitalize}
              key={user.id_usuario}
              users={user}
              Eliminar={false}
              componentName={`Cargar ${pluralTypeCapitalize}`}
              session={session}
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

export default ListadoCarga;
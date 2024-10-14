'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import { ListaUsuarios } from '../../components/ListaUsuariosXTipo';
import { debounce } from 'lodash';
import ModalCargaUsuariosTipoTutoria from '@/modules/core/components/ModalCarga';
import AgregarUsuariosTipoTutoria from '../../components/SearchUser';
import { useTutoringType } from '../../states/TutoringTypeContext';
import fetchAPI from "@/modules/core/services/apiService";
import { useUsers } from '@/modules/core/states/UsersContext';
import { jwtDecode } from 'jwt-decode';

export  const UserTutoringType = ({session}) => {
  const { addUser } = useUsers();
  const [filtro, setFiltro] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const {selectedTutoringType} = useTutoringType()
  const [updateNow, setUpdate] = useState(false)
  const decoded = jwtDecode(session.accessToken)

  useEffect(() => {
    fetchUsers(page,filtro);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchUsers = async (pageNum, search = '') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    const data = await fetchAPI({
      endpoint: '/usuario/listarUsuariosPorTipoTutoria',
      method: 'POST',
      token: session.accessToken,
      payload: {
        searchValue: search,
        id_tipoTutoria: selectedTutoringType,
        pageSize: 9,
        sortBy: 'fechaCreacion',
        sortOrder: 'DESC',
        page: pageNum
      },
      successMessage: 'Usuarios listados con éxito.',
      errorMessage: 'Error al listar usuarios.',
      showToast: false,
      useCache: true
    });
    if (data && data.data && data.data.usuarios.length > 0) {
      console.log(data.data.usuarios)
      setUsers(data.data.usuarios);
      setTotalPages(data.data.totalPages);
    } else {
      setUsers([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchUsers(1, searchValue);
  }, 500), [users]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    setPage(1)
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchUsers(1);
  };

  const fetchCargar = async (datos) => {
    try {
      console.log(datos)
      if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
      }
      const data = await fetchAPI({
        endpoint: '/usuario/listar-usuarios-por-codigo',
        method: 'POST',
        token: session.accessToken,
        payload: {
          idCoord: decoded.id,
          datos: datos
        },
        successMessage: 'Usuarios cargados con éxito.',
        errorMessage: 'Error al cargar usuarios.',
        showToast: false,
        useCache: true
      });
      if (data && data.data.length > 0) {
        const usuariosUnicos = [];
        // Un Map para llevar registro de los usuarios ya agregados
        const idsVistos = new Map();
        data.data.forEach(usuario => {
          // Suponiendo que cada usuario tiene un 'id' único
          if (!idsVistos.has(usuario.id_usuario)) {
            idsVistos.set(usuario.id_usuario, true); // Marcar como visto
            usuariosUnicos.push(usuario); // Agregar al arreglo de únicos
          }
        });
        console.log(usuariosUnicos);
        addUser(usuariosUnicos);
      } else {
        console.log('No data returned');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  return (
    <div className='flex flex-col w-full h-full gap-6 '>
      <div className='flex flex-col w-full gap-4'>
        <div className='flex flex-row items-end justify-between w-full gap-2'>
          <div className='flex flex-col w-full gap-1'>
            <span className='text-lg font-semibold'>Código, nombre o correo del usuario</span>
            <SearchInput
              placeholder='Ingresa el código, nombre o correo del usuario'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <div className='flex flex-row justify-between gap-2'>
            <AgregarUsuariosTipoTutoria update={fetchUsers} pageList={page} updateNow={updateNow} filtro={filtro} session={session}/>
            <ModalCargaUsuariosTipoTutoria
              title='Cargar Grupo de Usuarios'
              componentId='listadoCargaGrupoAlumnos'
              componentName='Carga de Grupo de Usuarios'
              idRol={3}
              fetch={fetchCargar}
              PasoFetch={true}
              session={session}
            />
          </div>
        </div>
      </div> 
      <ListaUsuarios 
        filteredUsers={users} 
        handlePageChange={handlePageChange} 
        page={page} 
        totalPages={totalPages} 
        loading={loading} 
        update={fetchUsers} 
        setUpdate={setUpdate} 
        updateNow={updateNow}
        filtro={filtro}
        session={session}/>
    </div>
  );
};

'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import FilterStatusDropdown from '../../../../core/components/FilterStatusDropdown';
import ModalCarga from '../../../../core/components/ModalCarga';
import AddTutor from './AddTutor';
import { debounce } from 'lodash';
import { ListadoUsuarios } from '../../components/ListadoUsuarios';
import fetchAPI from '@/modules/core/services/apiService';

export default function GestionTutores({session}) {
  const [filtro, setFiltro] = useState('');
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const [tutors, setTutors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors(page,filtro);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const fetchTutors = async (pageNum, search='') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    const statusArray = Array.from(statusFilter);

    const data = await fetchAPI({
      endpoint: `/usuario/listar-usuarios-por-rol-paginado/${pageNum}`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        role: 'Tutor',
        searchCriterias: [
          {
            field: 'multiField',
            value: search,
            active: statusArray
          }
        ]
      },
      successMessage: 'Alumnos cargados correctamente',
      errorMessage: 'Error al cargar Alumnos',
      showToast: false
    });
    if (data && data.data.usuarios.length > 0) {
      console.log(data)
      setTutors(data.data.usuarios);
      setTotalPages(data.data.totalPages);
    } else {
      setTutors([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchTutors(1, searchValue);
  }, 500), [tutors]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1);
    fetchTutors(1);
  };

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row flex-wrap items-end w-full gap-2'>
        <div className='flex flex-col gap-1 flex-grow'>
          <span className='text-lg font-semibold'>Código, nombre o correo del tutor</span>
          <SearchInput
            placeholder='Ingresa el código, nombre o correo del tutor'
            value={filtro}
            onChange={handleSearchChange}
            clearSearch={clearSearch}
          />
        </div>
        <FilterStatusDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} fetch={fetchTutors} filtro={filtro} setPage={setPage}/>
        <AddTutor update={fetchTutors} page={page} filtro={filtro} session={session}/>
        <ModalCarga
          title='Cargar Tutores'
          componentId='listadoCarga'
          componentName='Cargar Tutores'
          idRol={3}
          session={session}
        />
      </div>
      <ListadoUsuarios session={session} filteredUsers={tutors} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} userName='Tutor' update={fetchTutors} filtro={filtro}/>
    </div>
  );
}

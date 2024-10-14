'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import ModalTemporal from '../../components/ModalTemporal';
import AddTutoringType from '../../components/AddTutoringType';
import { ListTutoringType } from '../../components/ListTutoringType';
import { debounce } from 'lodash';
import FilterStatusDropdown from '@/modules/core/components/FilterStatusDropdown';
import { jwtDecode } from 'jwt-decode';
import fetchAPI from '@/modules/core/services/apiService';

export default function TiposTutorias({session}) {
  const [filtro, setFiltro] = useState('');
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const [status, setStatus] = useState("Activo");
  const [tutoringTypes, setTutoringTypes] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  /*useEffect(() => {
    const reloadFromLocalStorage = localStorage.getItem('reload');
  
    if (reloadFromLocalStorage === 'false') {
      console.log('Recargando página...')
      localStorage.setItem('reload', 'true');
      window.location.reload();
    }
    else{
      console.log('Página recargada')
    }
  }, []);*/

  const decoded = jwtDecode(session.accessToken);

  useEffect(() => {
    if (session && session.accessToken) {
      fetchTutoringTypesData(page,filtro);
    }
  }, [page]);

  useEffect(() => {
    setPage(1)
    fetchTutoringTypesData(1,filtro);
  }, [status]);

  useEffect(() => {
    const statusArray = Array.from(statusFilter);
    setStatus(statusArray.length === 2 ? 'Todos' : statusArray[0])
  }, [statusFilter]);

  const fetchTutoringTypesData = async (pageNum=1, search='') => {
    setLoading(true);
    const data = await fetchAPI({
      endpoint: `/tipoTutoria/listarTiposTutoria`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        inputSearch: search,
        idCoord: decoded.id,
        estado: status,
        page: pageNum,
        pageSize: 9,
        sortBy: 'fechaCreacion',
        sortOrder: 'DESC'
      },
      successMessage: 'Tipos de Tutoría cargados correctamente',
      errorMessage: 'Error al cargar Tipos de Tutoría',
      showToast: false
    });
    console.log(data)
    if (data && data.tiposTutoria.length > 0) {
      setTutoringTypes(data.tiposTutoria);
      setTotalPages(data.totalPages);
    } else {
      setTutoringTypes([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    setPage(1)
    fetchTutoringTypesData(1, searchValue);
  }, 500), [tutoringTypes]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchTutoringTypesData(1);
  };

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row flex-wrap items-end w-full gap-2'>
        <div className='flex flex-col gap-1 flex-grow'>
          <span className='text-lg font-semibold'>Nombre del Tipo de Tutoría</span>
          <SearchInput
            placeholder='Ingresa el nombre del tipo de tutoría'
            value={filtro}
            onChange={handleSearchChange}
            clearSearch={clearSearch}
          />
        </div>
        <FilterStatusDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} filtro={filtro} setPage={setPage}/>
        <ModalTemporal session={session}/>
        <AddTutoringType update={fetchTutoringTypesData} page={page} filtro={filtro} session={session} />
      </div>
      <ListTutoringType filteredTutoringType={tutoringTypes} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} update={fetchTutoringTypesData} filtro={filtro} session={session}/>
    </div>
  );
}
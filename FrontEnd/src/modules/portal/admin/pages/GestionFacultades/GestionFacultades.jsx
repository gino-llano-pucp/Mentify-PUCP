import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import FilterDropdown from '../../../../core/components/FilterStatusDropdown';
import fetchAPI from '@/modules/core/services/apiService';
import ListaFacultades from '../../components/ListaFacultades';
import { debounce } from 'lodash';
import AgregarFacultad from './AgregarFacultad';

export default function Facultades({session}) {
  const [filtro, setFiltro] = useState('');
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const [facultades, setFacultades] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultades(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchFacultades = async (pageNum, search='') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);
    setLoading(true);
    const statusArray = Array.from(statusFilter);
    console.log(statusArray);

    const data = await fetchAPI({
      endpoint: `/facultad/listar-paginacion/${pageNum}`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        searchCriterias: 1 < statusArray.length ? [
          {
            field: 'nombre',
            value: search
          },
        ]
        :
        [
          {
            field: 'nombre',
            value: search
          },
          {
            field: "esActivo",
            value: (statusArray[0] == "Activo") ? "1" : "0" 
          }          
        ]
      },
      successMessage: 'Facultades cargadas correctamente',
      errorMessage: 'Error al cargar Facultades',
      showToast: false
    });

    if (data && data.data.facultades.length > 0) {
      console.log(data.data.facultades);
      setFacultades(data.data.facultades);
      setTotalPages(data.data.totalPages);
    } else {
      setFacultades([]);
      setTotalPages(0);
    }

    setLoading(false);
  };

  const filteredFacultades = facultades.filter((facultad) => {
/*     const currentStatusFilter = [...statusFilter]; */
    return (
/*       (currentStatusFilter.length === 3 || currentStatusFilter.includes(facultad.esActivo ? 'Activo' : 'Inactivo')) && */
      facultad.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchFacultades(1, searchValue);
  }, 500), [facultades]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1);
    fetchFacultades(page);
  };

  /* useEffect(() => {
    const statusArray = [...statusFilter]; // Convierte el Set en Array
    console.log("filtro: ", statusArray);
    console.log("size: ", statusFilter.size);
  }, [statusFilter]); */

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-wrap items-end w-full gap-2'>
          <div className='flex flex-col w-full md:w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Nombre de la facultad</span>
            <SearchInput
              placeholder={'Ingresa el nombre de la facultad'}
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} fetch={fetchFacultades} filtro={filtro} setPage={setPage}/>
          <AgregarFacultad update={fetchFacultades} page={page} session={session}/>
        </div>
      </div>
      <ListaFacultades filteredFacultades={filteredFacultades} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} update={fetchFacultades} session={session}/>
    </div>
  );
}

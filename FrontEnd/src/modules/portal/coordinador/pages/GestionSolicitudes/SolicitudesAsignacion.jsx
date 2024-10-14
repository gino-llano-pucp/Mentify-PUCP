'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import FilterTutoringTypeDropdown from '../../../../core/components/FilterTutoringTypeDropdown';
import { ListadoSolicitudes } from '../../components/ListadoSolicitudes';
import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import FilterStatusSolicitude from '../../components/FilterStatusSolicitude';
import fetchAPI from '@/modules/core/services/apiService';
import { fetchTypeTutoriasTutorFijo } from '../../services/ListarTutoriasTutorFijo';

export default function SolicitudesAsignacion({session}) {
  const [filtro, setFiltro] = useState('');
  const [statusFilterTipo, setStatusFilterTipo] = useState();
  const [statusFilterEstado, setStatusFilterEstado] = useState();
  const [dateRange, setDateRange] = useState();
  const [solicitudes, setSolicitudes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(page)
    fetchSolicitudes(page, filtro);
  }, [page]);

  useEffect(() => {
    setPage(1)
    fetchSolicitudes(1, filtro);
  }, [statusFilterEstado, statusFilterTipo, dateRange]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchSolicitudes = async (pageNum, search = '') => {
    if(statusFilterTipo === undefined){
      return
    }
    console.log(statusFilterTipo)
    if(statusFilterTipo.length === 0){
      setLoading(false);
      return
    }
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log(dateRange)
    const  data = await fetchAPI({
        endpoint: `/solicitudTutorFijo/paginado-por-coordinador/${pageNum}`,
        method: 'POST',
        token: session.accessToken,
        payload: {
          inputSearch: search,
          tipoTutoria: statusFilterTipo.length === undefined ? statusFilterTipo.id : statusFilterTipo,
          estadoSolicitud: statusFilterEstado,
          fechaDesde: dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
          fechaHasta: dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
          pageSize: 9,
          sortBy: 'fechaCreacion',
          sortOrder: 'DESC'
        },
        successMessage: 'Alumnos cargados correctamente',
        errorMessage: 'Error al cargar Alumnos',
        showToast: false
      });
      console.log(data);
    if (data && data.data && data.data.solicitudes.length > 0) {
      setSolicitudes(data.data.solicitudes);
      setTotalPages(data.data.totalPages);
    } else {
      setSolicitudes([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    setPage(1)
    fetchSolicitudes(1, searchValue);
  }, 500), [statusFilterTipo, statusFilterEstado, dateRange, solicitudes]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);   
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchSolicitudes(1);
  };

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-col items-end w-full gap-2'>
          <div className='flex flex-wrap w-full gap-2'>
            <div className='flex flex-col gap-1 w-full md:w-1/3'>
              <span className='text-base font-medium'>Nombre o Apellido del Alumno</span>
              <SearchInput
                placeholder='Ingresa el nombre o apellido del alumno'
                value={filtro}
                onChange={handleSearchChange}
                clearSearch={clearSearch}
                className="w-full"
              />
            </div>
            <div className='flex flex-col gap-1 w-full md:w-[200px]'>
              <span className='text-base font-medium'>Tipo de tutoría</span>
              <FilterTutoringTypeDropdown setStatusFilter={setStatusFilterTipo} fetch={fetchTypeTutoriasTutorFijo} session={session} isFullLength={true}/>
            </div>
            <div className='flex flex-col gap-1 w-full md:w-[200px]'>
              <span className='text-base font-medium'>Estado de solicitud</span>
              <FilterStatusSolicitude setStatusFilter={setStatusFilterEstado} session={session} />
            </div>
          </div>
          <div className='flex flex-wrap gap-2 w-full'>
            <ControllerDateRange setValue={setDateRange} noLogs={true} />
          </div>
        </div>
      </div>
      <ListadoSolicitudes 
        filteredSolicitudes={solicitudes} 
        handlePageChange={handlePageChange} 
        page={page} 
        totalPages={totalPages} 
        loading={loading} 
        update={fetchSolicitudes}
        filtro={filtro}
        session={session}
        statusFilterEstado={statusFilterEstado}
      />
    </div>
  );
}

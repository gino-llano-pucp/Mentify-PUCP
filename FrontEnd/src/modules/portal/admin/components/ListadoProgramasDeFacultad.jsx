import SearchInput from '@/modules/core/components/SearchInput';
import { CircularProgress, Pagination } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import FilterDropdown from '../../../core/components/FilterStatusDropdown';
import ProgramaCard from './ProgramaCard';
import { useFacultadCoordinador } from '../states/FacultadCoordinadorContext';
import fetchAPI from '@/modules/core/services/apiService';
import { useCallback } from 'react';
import { debounce } from 'lodash';
import AddPrograma from '../pages/GestionProgramas/AddPrograma'
import { jwtDecode } from 'jwt-decode';

export default function ListadoProgramasDeFacultad({session}) {
  const { facultadNombre, facultadId, setFacultadId } = useFacultadCoordinador();
  const [programas, setProgramas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const decoded = jwtDecode(session.accessToken);

  useEffect(() => {
    if(facultadId === 0){
      fetchFacultadId(decoded.id);
    }
  }, []);

  const fetchFacultadId = async (idCoord) => {
    const token = session?.accessToken;
    console.log('sess: ', session);
    if (!token) {
      console.log('No token available');
      return;
    }
    console.log(idCoord)
    const data = await fetchAPI({
      endpoint: `/facultad/obtener-facultad-de-coordinador`,
      method: 'POST',
      token: session.accessToken,
      successMessage: 'Facultad obtenida correctamente',
      errorMessage: 'Error al obtener Facultad',
      showToast: false,
      payload: {
        "idCoord": idCoord
      }
    });
    console.log(data)
    if(data){
      setFacultadId(data.data.id_facultad);
    } else{
      setFacultadId(0);
    }
  };

  useEffect(() => {
      fetchProgramas(page);
  }, [page,facultadId]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchProgramas = async (pageNum, search='') => {
    if(facultadId !== 0){
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }

      const statusArray = Array.from(statusFilter);
      console.log(statusArray);
      const payload = {
        "pageSize": 9,
        "sortBy": "fechaCreacion",
        "sortOrder": "DESC",
        "id_facultad": facultadId,
        "searchCriterias": [
            {
                "field": "nombre",
                "value": search
            }
        ]
      }

      const data = await fetchAPI({
        endpoint: `/programa/listar-paginacion/${pageNum}`,
        method: 'POST',
        token: session.accessToken,
        successMessage: 'Programas listadas correctamente',
        errorMessage: 'Error al listar Programas',
        showToast: false,
        payload: {
          "sortOrder": "ASC",
          "id_facultad": facultadId,
          "searchCriterias": 1 < statusArray.length ? [
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
        }
      });

      if (data && data.data.programas.length > 0) {
        setProgramas(data.data.programas);
        setTotalPages(data.data.totalPages);
      } else {
        setProgramas([]);
        setTotalPages(0);
      }
  
      setLoading(false);
    }
      
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchProgramas(1, searchValue);
  }, 500), [programas]);

  useEffect(() => {
    console.log('programas: ', programas);
  }, [programas]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value)
  };

  const filteredProgramas = programas.filter((programa) => {
/*     const currentStatusFilter = [...statusFilter]; */
    return programa.nombre.toLowerCase().includes(filtro.toLowerCase()) /* &&
    (currentStatusFilter.length === 3 ||
      currentStatusFilter.includes(programa.esActivo ? 'Activo' : 'Inactivo')) */
  }
  );

  const clearSearch = () => {
    setFiltro('');
    setPage(1);
    fetchProgramas(page);
  };

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-wrap items-end w-full gap-2'>
          <div className='flex flex-col w-full md:w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Nombre del programa</span>
            <SearchInput
              placeholder={'Ingresa el nombre del programa'}
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} fetch={fetchProgramas} filtro={filtro} setPage={setPage}/>
          <AddPrograma update={fetchProgramas} page={page} session={session}/>
        </div>
      </div>
      <div className='flex flex-col h-[85%]'>
      <div className='flex flex-wrap w-full gap-[16px]'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
          <CircularProgress aria-label='Cargando programas...' />
          <div>Cargando programas...</div>
        </div>
        ) : filteredProgramas.length > 0 ? (
          filteredProgramas.map((programa, key) => (
            <ProgramaCard
              key={key}
              programa={programa}
              update={fetchProgramas}
              page={page}
              session={session}
            />
          ))
        ) : (
          <div>No se encontraron programas que coincidan con la búsqueda o no hay programas en esta facultad.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-center w-full px-2 py-2 mt-auto'>
          <Pagination
            isCompact
            loop
            showControls
            showShadow
            size='md'
            color='primary'
            initialPage={1}
            page={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
    </div>
  );
}

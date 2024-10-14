import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import fetchAPI from '@/modules/core/services/apiService';
import ListaUnidadesAcademicas from '../../components/ListaUnidadesAcademicas';
import { debounce } from 'lodash';
import AgregarUnidadAcademica from './AgregarUnidadAcademica';
import ModalCargaUnidadesAcademicas from '../../components/ModalCargaUnidadesAcademicas';
import FilterStatusDropdown from '@/modules/core/components/FilterStatusDropdown';

export default function UnidadesAcademicas({session}) {
  const [filtro, setFiltro] = useState('');
  //const { setActiveComponentById } = useActiveComponent();
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const [unidades, setUnidadesAcademicas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    fetchUnidadesAcademicas(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const fetchUnidadesAcademicas = async (pageNum, search='') => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);
    /* setLoading(true); */
    const statusArray = [...statusFilter]; // Convierte el Set en Array
    console.log("status elegido: ",statusArray);
    const payload = {
      searchCriterias: 1 < statusArray.length ? [
        {
          field: 'nombre',
          value: search
        },
        {
          field: 'siglas',
          value: search
        },
        {
          field: 'correoDeContacto',
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
          field: 'siglas',
          value: search
        },
        {
          field: 'correoDeContacto',
          value: search
        },
        {
          field: "esActivo",
          value: (statusArray[0] == "Activo") ? "1" : "0" 
        }          
      ]
    }
    console.log("PAYLOAD: ", payload);
    const data = await fetchAPI({
      endpoint: `/unidadAcademica/listar-paginacion/${pageNum}`,
      method: 'POST',
      token: session.accessToken,
      payload: payload,
      successMessage: 'Unidades Académicas cargadas correctamente',
      errorMessage: 'Error al cargar Unidades Académicas',
      showToast: false
    });

    if (data && data.data.unidades.length > 0) {
      setUnidadesAcademicas(data.data.unidades);
      setTotalPages(data.data.totalPages);
      console.log("Unidades academicas: ",data.data.unidades);
    } else {
      setUnidadesAcademicas([]);
      setTotalPages(0);
    }

    setLoading(false);
  };

  const filteredUnidadesAcademicas = unidades.filter((unidad) => {
    const filtroLower = filtro.toLowerCase();
    const siglaLower = unidad.siglas.toLowerCase();
    const correoDeContactoLower = unidad.correoDeContacto.toLowerCase();
    const nombreLower = unidad.nombre.toLowerCase();
    //const currentStatusFilter = [...statusFilter];
    return (
      (siglaLower.includes(filtroLower) ||
      correoDeContactoLower.includes(filtroLower) ||
      nombreLower.includes(filtroLower)) /*&&
      (currentStatusFilter.length === 3 || 
        currentStatusFilter.includes(unidad.esActivo ? 'Activo' : 'Inactivo'))*/
    );
  });

   useEffect(() => {
    console.log("filtered Unidades Academicas: ", filteredUnidadesAcademicas);
  }, [filteredUnidadesAcademicas]); 



  const handleSearch = useCallback(debounce((searchValue) => {
    fetchUnidadesAcademicas(1, searchValue);
  }, 500), [unidades]);

  useEffect(() => {
    console.log('Unidades Academicas: ', unidades);
  }, [unidades]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1);
    fetchUnidadesAcademicas(page);
  };


  useEffect(() => {
    const statusArray = [...statusFilter]; // Convierte el Set en Array
    console.log('filtro: ', statusArray);
    console.log('size: ', statusFilter.size);
  }, [statusFilter]);

  


  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-wrap items-end w-full gap-2'>
          <div className='flex flex-col w-full md:w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Nombre, siglas o correo de la Unidad Académica</span>
            <SearchInput
              placeholder={'Ingresa el nombre, siglas o correo de la Unidad Académica'}
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <FilterStatusDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} fetch={fetchUnidadesAcademicas} filtro={filtro} setPage={setPage} />
          <AgregarUnidadAcademica update={fetchUnidadesAcademicas} page={page} session={session} />
            <ModalCargaUnidadesAcademicas
              title='Cargar Unidades Académicas'
              componentId='listadoCargaUnidadesAcademicas'
              componentName='Cargar Unidades Academicas'
              session={session}
            />
        </div>
      </div>
      <ListaUnidadesAcademicas
        filteredUnidadesAcademicas={filteredUnidadesAcademicas}
        handlePageChange={handlePageChange}
        page={page}
        totalPages={totalPages}
        loading={loading}
        update={fetchUnidadesAcademicas}
        session={session}
        filtro={filtro} 
      />
    </div>
    );
}

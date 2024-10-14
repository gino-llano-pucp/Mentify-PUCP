'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import ModalCarga from '../../../../core/components/ModalCarga';
import AddStudent from './AddStudent';
import fetchAPI from '@/modules/core/services/apiService';
import { ListadoUsuarios } from '../../components/ListadoUsuarios';
import { debounce } from 'lodash';
import FilterStatusDropdown from '../../../../core/components/FilterStatusDropdown';
import { jwtDecode } from 'jwt-decode';
import ModalNotas from '@/modules/portal/coordinador/components/ModalNotas';
import { useFacultad } from '../../states/FacultadContext';
import { usePrograma } from '../../states/ProgramaContext';


const GestionAlumnos = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addFacultad, addNombreFacultad } = useFacultad();
  const { addPrograma, addNombrePrograma } = usePrograma();
  const decoded = jwtDecode(session.accessToken);

  useEffect(() => {
    if (decoded.roles.some(role => role.includes('Coordinador de Facultad'))) {
      fetchFacultadId(decoded.id)
    }
    if (decoded.roles.some(role => role.includes('Coordinador de Programa'))) {
      fetchProgramaFacultadId(decoded.id)
    }
  }, []);

  useEffect(() => {
    fetchStudents(page,filtro);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
      addFacultad(data.data.id_facultad);
      addNombreFacultad(data.data.nombre);
      if(data.data.TienePrograma){
        addPrograma(true);
      } else{
        addPrograma(null);
      }
    }
  };

  const fetchProgramaFacultadId = async (idCoord) => {
    const token = session?.accessToken;
    console.log('sess: ', session);
    if (!token) {
      console.log('No token available');
      return;
    }
    console.log(idCoord)
    const data = await fetchAPI({
      endpoint: `/programa/obtener-programa-coordinador`,
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
      addFacultad(data.facultad.id_facultad);
      addNombreFacultad(data.facultad.nombre)
      addPrograma(data.id_programa);
      addNombrePrograma(data.nombre);
    }
  };

  const fetchStudents = async (pageNum, search='') => {
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
        idCoord: decoded.id,
        role: 'Alumno',
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
    console.log(data)
    if (data && data.data.usuarios.length > 0) {
      console.log(data.data.usuarios)
      setStudents(data.data.usuarios);
      setTotalPages(data.data.totalPages);
    } else {
      setStudents([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(debounce((searchValue) => {
    fetchStudents(1, searchValue);
  }, 500), [students]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1);
    fetchStudents(1);
  };

  return (
    <div className='flex flex-col w-full h-full gap-6 '>
        <div className='flex flex-row flex-wrap items-end w-full gap-2'>
          <div className='flex flex-col gap-1 flex-grow'>
            <span className='text-lg font-semibold'>Código, nombre o correo del alumno</span>
            <SearchInput
              placeholder='Ingresa el código, nombre o correo del alumno'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <FilterStatusDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} fetch={fetchStudents} filtro={filtro} setPage={setPage}/>
          <AddStudent update={fetchStudents} page={page} filtro={filtro} session={session}/>
          <ModalCarga
            title='Cargar Alumnos'
            componentId='listadoCarga'
            componentName='Cargar Alumnos'
            idRol={4}
            session={session}
          />
          { decoded.roles.some(role => role.includes('Coordinador')) &&
            <ModalNotas
              title='Cargar Histórico de Calificaciones'
              session={session}
            />
          }
        </div>
      <ListadoUsuarios session={session} filteredUsers={students} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} userName='Alumno' update={fetchStudents} filtro={filtro}/>
    </div>
  );
};

export default GestionAlumnos;

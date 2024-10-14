import React, { useCallback, useEffect, useState } from 'react';
import { fetchTypeTutoriasTutorFijo } from '../service/ListarTiposTutoriaPorTutor';
import { jwtDecode } from 'jwt-decode';
import FilterTutoringTypeDropdown from '@/modules/core/components/FilterTutoringTypeDropdown';
import fetchAPI from '@/modules/core/services/apiService';
import SearchInput from '@/modules/core/components/SearchInput';
import { debounce } from 'lodash';
import { ListadoAlumnosAsignados } from '../components/ListadoAlumnosAsignados';


const AlumnosAsignados = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [tipoTutoriaFilter, setTipoTutoriaFilter] = useState();
  const [alumnos, setAlumnos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumnos(page,filtro);
  }, [page,tipoTutoriaFilter]);
  
  useEffect(() => {
    setPage(1)
    //fetchAlumnos(1,"");
  }, [tipoTutoriaFilter]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchAlumnos = async (pageNum, search='') => {
    if(tipoTutoriaFilter===undefined)
      return;
    setLoading(true)
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);
    const data = await fetchAPI({
      endpoint: `/usuario/listar-alumnosAsigandos-tutor/${jwtDecode(session.accessToken).id}`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "page": pageNum,
        "pageSize": 9,
        "sortBy": "fechaCreacion",
        "sortOrder": "DESC",
        "searchCriterias": [
        {
        "field": search,
        "idTipoTutoria": tipoTutoriaFilter.length === undefined ? tipoTutoriaFilter.id : tipoTutoriaFilter,
        }
        ]
      },
      successMessage: 'Alumnos cargados correctamente',
      errorMessage: 'Error al cargar Alumnos',
      showToast: false
  });
  console.log(jwtDecode(session.accessToken).id)
  console.log(tipoTutoriaFilter.length === undefined ? tipoTutoriaFilter.id : tipoTutoriaFilter)
  console.log(data)
  if(data){
    console.log("Lista de alumnos", data)
  }
    
  if (data && data.data && data.data.data && data.data.data.usuarios && data.data.data.usuarios.length > 0) {
    console.log(`Lista de alumnos: `,data)
    console.log(data.data.data.usuarios)
    setAlumnos(data.data.data.usuarios);
    setTotalPages(data.data.data.totalPages);
  } else {
    setAlumnos([]);
    setTotalPages(0);
  }

  setLoading(false);
}

const handleSearch = useCallback(debounce((searchValue) => {
  fetchAlumnos(1,searchValue);
}, 500), [tipoTutoriaFilter, alumnos]);

const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
};

const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchAlumnos(1,"");
};  
  


  return (
    <div className='flex flex-col w-full h-full gap-6'>
    <div className='flex flex-row items-end justify-between w-full'>
      <div className='flex items-end w-full gap-2 flex-wrap'>
        <div className='flex flex-col w-full md:w-3/5 gap-1'>
          <span className='text-lg font-semibold'>Código, nombre o correo del alumno</span>
          <SearchInput
            placeholder='Ingresa el código, nombre o correo del alumno'
            value={filtro}
            onChange={handleSearchChange}
            clearSearch={clearSearch}
            className="w-full"
          />
        </div>
        <div className='flex flex-col basis-1/12 gap-1'>
          <span className='text-lg font-semibold'>Tipo de tutoría</span>
          <FilterTutoringTypeDropdown setStatusFilter={setTipoTutoriaFilter} fetch={fetchTypeTutoriasTutorFijo} session={session}/>
        </div>
      </div>
    </div>
    <ListadoAlumnosAsignados 
    filteredStudents={alumnos}
    handlePageChange={handlePageChange}
    page={page}
    totalPages={totalPages}
    loading={loading} 
    filtro={filtro}/>
  </div>


);
};

export default AlumnosAsignados;



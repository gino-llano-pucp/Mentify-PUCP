import React from 'react';
import SearchInput from '@/modules/core/components/SearchInput';
import ListaTutoresAsignados from '../../components/ListaTutoresAsignados';
import { useState, useEffect, useCallback } from 'react';
import { debounce} from 'lodash';
import fetchAPI from '@/modules/core/services/apiService';
import FilterTutoringTypeDropdown from '@/modules/core/components/FilterTutoringTypeDropdown';
import { fetchTypeAlumno } from '../../services/ListarTutoriasService';
import { fetchSolicitudAlumno } from '../../services/RealizarSolicitudService';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import toast from 'react-hot-toast';
import FilterTutoringTypeDropdownSolicitud from '../../components/FilterTutoringTypeDropdownSolicitud';


export const SolicitarTutor = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [tipoTutoriaFilter, setTipoTutoriaFilter] = useState(null);
  const [tutores, setTutores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setActiveComponentById } = useActiveComponent();
  const [doRefresh, setDoRefresh] = useState(true);

  useEffect(() => {
    if(tipoTutoriaFilter)
    fetchTutores(page,filtro);
  }, [page, tipoTutoriaFilter]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchTutores = async (pageNum, search='') => {
    setLoading(true)
    //setTutores([])
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);

    const data = await fetchAPI({
      endpoint: `/usuario/buscar-tutores`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "tipoTutoria": tipoTutoriaFilter.length === undefined ? tipoTutoriaFilter.id : tipoTutoriaFilter,
        "inputSearch": search,
        "page": pageNum,
        "pageSize": 9
      },
      successMessage: 'Tutores cargados correctamente',
      errorMessage: 'Error al cargar Tutores',
      showToast: false
  });
  console.log(tipoTutoriaFilter)
  console.log(tipoTutoriaFilter.length === undefined ? tipoTutoriaFilter.id : tipoTutoriaFilter)
  console.log(data)
  console.log(tipoTutoriaFilter)
  if(data)
    console.log("Lista de tutores", data)
  if (data && data.tutores && data.tutores.length > 0) {
    console.log(`Lista de tutores: `,data)
    setTutores(data.tutores);
    setTotalPages(data.totalPages);
  } else {
    setTutores([]);
    setTotalPages(0);
    
  }

  setLoading(false);
}

const handleSearchChange = (e) => {
  setFiltro(e.target.value);
  handleSearch(e.target.value);
};

const clearSearch = () => {
  setFiltro('');
  setPage(1);
  fetchTutores(1,'');
};

const handleSearch = useCallback(debounce((searchValue) => {
  fetchTutores(1, searchValue);
}, 500), [tutores]);




  return (
  <div className='flex flex-col w-full h-full gap-6 '>
  <div className='flex flex-row items-end justify-between w-full'>
    <div className='flex flex-row items-end w-full gap-2'>
      <div className='flex flex-col w-3/5 gap-1'>
        <span className='text-lg font-semibold'>Código, nombre o correo del tutor</span>
        <SearchInput
          placeholder='Ingresa el código, nombre o correo del tutor'
          value={filtro}
          clearSearch={clearSearch}
          onChange={handleSearchChange}
        />
      </div>
      <div className='flex flex-col w-3/5 gap-1'>
        <span className='text-lg font-semibold'>Tipos de Tutoría</span>
        <FilterTutoringTypeDropdownSolicitud setStatusFilter={setTipoTutoriaFilter} fetch={fetchTypeAlumno} session={session} doRefresh={doRefresh} setDoRefresh={setDoRefresh}/>
      </div>
    </div>
  </div>
  
  <ListaTutoresAsignados session={session} filteredTutores={tutores} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} selectTutor={true} functionSpecified={fetchSolicitudAlumno} accessOption={true} sendSolicitud={true} setDoRefresh={setDoRefresh}/> 
</div>
)
};



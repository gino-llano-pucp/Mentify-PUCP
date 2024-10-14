import React, { useCallback, useEffect, useState } from 'react'
import SearchInput from '@/modules/core/components/SearchInput'
import FilterTutoringTypeDropdown from '../../../../core/components/FilterTutoringTypeDropdown'
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext'
import ListaTutoresAsignados from '@/modules/portal/alumnos/components/ListaTutoresAsignados'
import { debounce } from 'lodash'
import fetchAPI from '@/modules/core/services/apiService'
import { useTutor } from '../../states/TutorContext'
import { fetchTypeTutoriasTutorFijo } from '../../services/ListarTutoriasTutorFijo'
import { useTutoringType } from '../../states/TutoringTypeContext'

function AsignacionTutor({session}) {
  const { setActiveComponentById } = useActiveComponent();
  const [statusFilter, setStatusFilter] = useState();
  const [filtro, setFiltro] = useState('');
  const [tutores, setTutores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const {addTutor} = useTutor()
  const {addTutoringType} = useTutoringType()

  useEffect(() => {
    fetchTutores(page,filtro);
  }, [page]);

  useEffect(() => {
    setPage(1)
    fetchTutores(1,filtro);
  }, [statusFilter]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchTutores = async (pageNum, search='') => {
    if(statusFilter === undefined){
      return
    }
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);
    console.log(statusFilter)
    console.log(statusFilter.length)
    const data = await fetchAPI({
    endpoint: `/usuario/buscar-tutores`,
    method: 'POST',
    token: session.accessToken,
    payload: {
      "tipoTutoria": statusFilter.length === undefined ? statusFilter.id : statusFilter,
      "inputSearch": search,
      "page": pageNum,
      "pageSize": 9
    },
    successMessage: 'Facultades cargadas correctamente',
    errorMessage: 'Error al cargar Facultades',
    showToast: false
  });
  console.log(data)
  if (data && data.tutores.length > 0) {
    setTutores(data.tutores);
    setTotalPages(data.totalPages);
  } else {
    setTutores([]);
    setTotalPages(0);
  }

  setLoading(false);
  }

  const handleSearch = useCallback(debounce((searchValue) => {
    console.log(searchValue)
    setPage(1)
    fetchTutores(1, searchValue);
  }, 500), [tutores]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchTutores(1);
  };

  const handleClick = (tutor) => {
    addTutor(tutor); 
    addTutoringType(tutor.TipoTutoria.id); 
    setActiveComponentById('alumnosAsignadosTutorCoordinador', 'Lista de alumnos asignados')
  }

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-wrap items-end w-full gap-2'>
          <div className='flex flex-col w-full md:w-3/5 gap-1'>
              <span className='text-lg font-semibold'>Código, nombre o correo del tutor</span>
              
              <SearchInput
                placeholder='Ingresa el código, nombre o correo del tutor'
                value={filtro}
                onChange={handleSearchChange}
                clearSearch={clearSearch}
                className="w-full"
              />
            </div>
            <div className='flex flex-col basis 3/12 gap-1'>
              <span className='text-lg font-semibold'>Tipo de tutoría</span>
              <FilterTutoringTypeDropdown setStatusFilter={setStatusFilter} fetch={fetchTypeTutoriasTutorFijo} session={session} />
           </div>
            </div>
            
        </div>
        <ListaTutoresAsignados filteredTutores={tutores} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} functionSpecified={handleClick} selectTutor={true} accessOption={true} filtro={filtro}/>
        
    </div>
  )
}

export default AsignacionTutor
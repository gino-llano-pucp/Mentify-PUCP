import React from 'react';
import SearchInput from '@/modules/core/components/SearchInput';
import ListaTutoresAsignados from '../../components/ListaTutoresAsignados';
import { Button } from '@nextui-org/react';
import { CirclePlus } from 'lucide-react';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useState, useEffect, useCallback } from 'react';
import { debounce} from 'lodash';
import fetchAPI from '@/modules/core/services/apiService';
import { jwtDecode } from 'jwt-decode';
import FilterRequestTutorDropdown from '../../components/FilterRequestTutorDropdown';
import toast from 'react-hot-toast';

const MisTutores = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [tutores, setTutores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setActiveComponentById } = useActiveComponent();
  const [typeCard, setTypeCard] = useState({uid:1})
  let decoded;

  /*useEffect(()=>{
    if(session&&session.accessToken)
      decoded = jwtDecode(session?.accessToken);
  },[session])*/
  
  useEffect(() => {
    setPage(1);
  }, [typeCard]);

  useEffect(() => {
    fetchTutores(page,filtro,typeCard.uid);
  }, [page,typeCard]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchTutores = async (pageNum, search='',type) => {
    setLoading(true);
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    //Para tutores es 1 y para solicitudes es 2
    console.log("busqueda: ", search);
    console.log(type)
    const data = await fetchAPI({
      endpoint: `/usuario/listar-tutores-y-solicitudes`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idAlumno": jwtDecode(session.accessToken).id,
        "pageSize": 9,
        "sortTutorBy": ["nombres","primerApellido"],
        "sortTutorOrder": "ASC",
        "sortSolicitud": "fechaRegistro",
        "sortSolicitudOrder": "DESC",
        "searchCriterias": {
        "nombreTutor" : search,
        "page" : pageNum,
        "tipo" : type
        }
      },
      successMessage: 'Tutores y Solicitudes cargadas correctamente',
      errorMessage: 'Error al cargar Tutores y Solicitudes',
      showToast: false
  });
  console.log(search)
  console.log(pageNum)
  console.log(data)
  if (data && data.usuarios.length > 0) {
    setTutores(data.usuarios);
    console.log(data)
    //const codigosTutores = data.data.tutores.map(asignacion => asignacion.Tutor.codigo);
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
  fetchTutores(page,'',typeCard.uid);
};

const filteredTutores = tutores.filter(tutor => {
  console.log('tutores: ', tutor);
  return (
    tutor.nombreTutor.toLowerCase().includes(filtro.toLowerCase())
  );
});

const handleSearch = useCallback(debounce((searchValue) => {
  fetchTutores(1, searchValue, typeCard.uid);
}, 500), [tutores]);

const deleteSolicitud =  async(idSolicitud) => {
  
  try{
  const data = await fetchAPI({
    endpoint: `/solicitudTutorFijo/${idSolicitud}`,
    method: 'DELETE',
    token: session.accessToken,
    successMessage: 'Solicitud eliminada con éxito',
    errorMessage: 'Error al eliminar solicitud',
    showToast: false
    });
  } catch(error){
    throw new Error(error)
  }

  }

  const deleteSolicitudToast =  async(idSolicitud) => {
    toast
    .promise(
      deleteSolicitud(idSolicitud),
      {
        loading: 'Eliminando Solicitud...',
        success: 'Solicitud Eliminada con éxito',
        error: 'Error al eliminar solicitud'
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    )
    .then(async (response) => {
      clearSearch()
      console.log(response);
    })
    .catch((error) => {
      console.error('Failed to post render request: ', error);
    });
    
    
  }

  return (
  <div className='flex flex-col w-full h-full gap-6 '>
  <div className='flex flex-row items-end justify-between w-full'>
    <div className='flex flex-wrap items-end w-full gap-2'>
      <div className='flex flex-col w-full md:w-3/5 gap-1'>
        <span className='text-lg font-semibold'>Código, nombre o correo del tutor</span>
        <SearchInput
          placeholder='Ingresa el nombre, código o correo del tutor'
          value={filtro}
          onChange={handleSearchChange}
          clearSearch={clearSearch}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <span className='text-lg font-semibold w-full'></span>
        <FilterRequestTutorDropdown statusFilter={typeCard} setStatusFilter={setTypeCard} className="w-full"/>
      </div>
      <Button
        color='primary'
        variant='shadow'
        className='flex items-center justify-center'
        startContent={<CirclePlus size={20} />}
        onClick={() => {setActiveComponentById('solicitarTutor', 'Solicitud de Tutor')}}
      >
        Solicitar Tutor
      </Button>
    </div>
  </div>
  <ListaTutoresAsignados filteredTutores={tutores} selectTutor={false} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} deleteFunction={deleteSolicitudToast} useModal={false} update={clearSearch}/>
  

</div>
)
};

export default MisTutores;


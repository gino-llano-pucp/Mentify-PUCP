import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import React, { useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import fetchAPI from '@/modules/core/services/apiService';
import { debounce } from 'lodash';
import { AlumnoCardHorizontal } from '../components/AlumnoCardHorizontal';
import { useDetalleAlumno } from '../states/DetalleAlumnoContext';
import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import { fetchTutoringTypesTutorStudent } from '../service/tiposDeTutoria';
import { ListadoCitasAlumno } from '../components/ListadoCitasAlumno';
import FilterTutoringTypeStudentTutor from '../components/FilterTutoringTypeStudentTutor';
import { useEventInfo } from '../states/EventContext';
import { BarChart, BarChart3, BarChart4 } from 'lucide-react';
import { Button } from '@nextui-org/react';

const DetalleAlumnoAsignado = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [tipoTutoriaFilter, setTipoTutoriaFilter] = useState(['Todos']);
  const [citas, setCitas] = useState([]);
  const [dateRange, setDateRange] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setActiveComponentById } = useActiveComponent();
  const {detalleAlumno} = useDetalleAlumno();
  const {setEvent} = useEventInfo();
  
  useEffect(() => {
    if(page&&tipoTutoriaFilter)
      fetchCitasAlumno(page,filtro);
  }, [page, tipoTutoriaFilter]);
  

  useEffect(() => {
    setPage(1);
    fetchCitasAlumno(page,filtro);
  }, [dateRange]);


  /*useEffect(() => {
    setPage(1)
    setTotalPages(data.data.totalPages);
  }, [tipoTutoriaFilter]);*/

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchCitasAlumno = async (pageNum, search='') => {
    setLoading(true)
    //setCitas([])
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    console.log("busqueda: ", search);
    if(dateRange){
      console.log(`${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}`)
      console.log(`${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}`)
    }
    console.log(detalleAlumno.idAlumno)
    console.log(jwtDecode(session.accessToken).id)
    console.log(tipoTutoriaFilter)
    const data = await fetchAPI({
      endpoint: `/sesionCita/listar-citas`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        idAlumno: detalleAlumno.idAlumno,
        idTutor: jwtDecode(session.accessToken).id,
        fechaDesde: dateRange ? `${dateRange.start.year}-${dateRange.start.month}-${dateRange.start.day}` : undefined,
        fechaHasta: dateRange ? `${dateRange.end.year}-${dateRange.end.month}-${dateRange.end.day}` : undefined,
        idTipoTutoria: tipoTutoriaFilter.length === undefined ? tipoTutoriaFilter.id : tipoTutoriaFilter,
        page: page,
        pageSize: 9,
        orderBy: "fechaHoraInicio",
        sortOrder: "DESC"
      },
      successMessage: 'Citas cargadas correctamente',
      errorMessage: 'Error al cargar Citas',
      showToast: false
  });
  console.log(data)
  console.log(detalleAlumno.idAlumno)
  console.log(jwtDecode(session.accessToken).id)
  if(dateRange){
  console.log(dateRange.start)
  console.log(dateRange.end)
}
  console.log(data)
  if(data){
    console.log("Lista de citas", data)
  }
    
  if (data && data.data  && data.data.citas) {
    console.log(`Lista de citas: `,data)
    setCitas(data.data.citas);
    console.log(data.data.totalPages);
    setTotalPages(data.data.totalPages);
  } else {
    setCitas([]);
    setTotalPages(0);
  }

  setLoading(false);
}

const handleSearch = useCallback(debounce((searchValue) => {
  
  fetchCitasAlumno(1,searchValue);
}, 500), [tipoTutoriaFilter, citas]);

const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    handleSearch(e.target.value);
};

const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchCitasAlumno(1,"");
};

const handleClick = (cita) => {
  const newEvent = {}
  newEvent.alumnos = []
  newEvent.alumnos.unshift(detalleAlumno)
  newEvent.id=cita.idCita
  newEvent.idTipoTutoria=cita.idTipoTutoria
  newEvent.nombreTipoTutoria=cita.nombreTipoTutoria
  newEvent.ubicacion=cita.ubicacion
  newEvent.fechaCita=cita.fechaCita
  if(cita&&cita.fechaCita&&cita.horaInicio&&cita.horaFin){
    newEvent.start=cita.horaInicio?new Date(`${cita.fechaCita}T${cita.horaInicio}:00`):null;
    newEvent.end=cita.horaFin?new Date(`${cita.fechaCita}T${cita.horaFin}:00`):null;
  }
  newEvent.fromAlumnosAsignados=true
  console.log(newEvent)
  console.log(cita)
  setEvent(newEvent)
  setActiveComponentById('resultadosDeCita', `Resultados de cita ${cita.nombreTipoTutoria}`)
}

  return (
  <div className='flex flex-col w-full h-full gap-6'>
  <AlumnoCardHorizontal alumno={detalleAlumno}/>
  
<Button
    color='primary'
    variant='shadow'
    className='flex items-center justify-center w-fit p-4'
    startContent={<BarChart3 size={20} />}
    onClick={()=>{
      setActiveComponentById('reporteAlumnoAsignado', 'Reporte de Alumno Asignado');
    }}
  >
            Reporte de Indicadores
  </Button>

  <div className='text-2xl'>Citas</div>
  <div className='flex flex-row w-full gap-2 flex-wrap'>
  <ControllerDateRange setValue={setDateRange}/>
    <div className='flex flex-col gap-1'>
      <span className='text-lg font-semibold'>Tipo de tutoría</span>
      <FilterTutoringTypeStudentTutor setStatusFilter={setTipoTutoriaFilter} fetch={fetchTutoringTypesTutorStudent} idStudent={detalleAlumno.idAlumno} session={session}/>
    </div>
</div>
<ListadoCitasAlumno 
  filteredCitas={citas}
  handlePageChange={handlePageChange}
  page={page}
  totalPages={totalPages}
  loading={loading}
  functionSpecified={handleClick}
  session={session}
  />
  
</div>

);
};

export default DetalleAlumnoAsignado;


/*
<Button
    color='primary'
    variant='shadow'
    className='flex items-center justify-center w-fit'
    startContent={<BarChart3 size={20} />}
    onClick={()=>{
      setActiveComponentById('reporteAlumnoAsignado', 'Reporte de Alumno Asignado');
    }}
  >
            Reporte de Indicadores
  </Button>
*/
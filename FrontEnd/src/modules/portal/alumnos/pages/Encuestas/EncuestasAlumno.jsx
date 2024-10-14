import { ControllerDateRange } from '@/modules/core/components/ControllerDateRange';
import React, { useEffect, useState } from 'react';
import DropdownStatusSurvey from '../../components/DropdownStatusSurvey';
import ListaEncuestasAlumno from '../../components/ListaEncuestasAlumno';
import fetchAPI from '@/modules/core/services/apiService';
import { jwtDecode } from 'jwt-decode';

const EncuestasAlumno = ({session}) => {
  const [dateRange, setDateRange] = useState();
  const [typeCard, setTypeCard] = useState({uid:1});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [surveys, setSurveys] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  
  
  //Si typcard es 1, se listaran las encuestas pendientes, si es 2, las encuestas completadas

  useEffect(() => {
    fetchEncuestas(page,typeCard.uid);
  }, [page,typeCard, dateRange]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const fetchEncuestas = async (pageNum, type) => {
    setLoading(true);
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    //Para tutores es 1 y para solicitudes es 2
    console.log(type)
    const data = await fetchAPI({
      endpoint: `/Encuesta/listarEncuestasAlumno`,
      method: 'POST',
      token: session.accessToken,
      payload: {
        "idAlumno": jwtDecode(session.accessToken).id,
        "page": pageNum,
        "pageSize": 9,
        "searchCriteria": {
        "fechaDesde": dateRange ? `${dateRange.start.day}-${dateRange.start.month}-${dateRange.start.year}` : undefined,
        "fechaHasta": dateRange ? `${dateRange.end.day}-${dateRange.end.month}-${dateRange.end.year}` : undefined,
        "estado" : type
        }
      },
      successMessage: 'Encuestas cargadas correctamente',
      errorMessage: 'Error al cargar Encuestas',
      showToast: false
  });
  console.log(pageNum)
  console.log(type)
  console.log(data)
  if(dateRange){
    console.log(dateRange ? `${dateRange.start.day}-${dateRange.start.month}-${dateRange.start.year}` : undefined)
    console.log(dateRange ? `${dateRange.end.day}-${dateRange.end.month}-${dateRange.end.year}` : undefined)
    console.log(dateRange.start)
    console.log(dateRange.end)

  }
  console.log(data)
 
  if(data&&data.encuestas){
    setSurveys(data.encuestas);
    setTotalPages(data.totalPages);
  }
  else{
    setSurveys([]);
    setTotalPages(1);
  }


  setLoading(false);
}

const clearSearch = () => {
  setDateRange();
  setPage(1);
  fetchEncuestas(1,1);
};
  
  return(
  <>
  <div className='flex flex-col w-full h-full gap-6'>
    <div className='flex flex-row items-end justify-between w-full flex-wrap'>
      <div className='flex flex-wrap items-end w-full gap-2'>
          <ControllerDateRange setValue={setDateRange} isFullLength={true}/>
          <div className='flex flex-col w-1/4 gap-1'>
            <span className='text-base font-medium w-full'>Estado</span>
            <DropdownStatusSurvey statusFilter={typeCard} setStatusFilter={setTypeCard} className="w-full"/>
          </div>
      </div>
    </div>
    <ListaEncuestasAlumno surveys={surveys} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} update={clearSearch} encuestaType={typeCard.uid} session={session} surveyType={typeCard.uid}
    />
    </div>
    </>
  )
};

export default EncuestasAlumno;
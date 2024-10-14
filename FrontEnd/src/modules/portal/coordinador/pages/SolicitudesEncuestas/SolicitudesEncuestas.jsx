'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import fetchAPI from '@/modules/core/services/apiService';
import FilterStatusSurvey from '../../components/FilterStatusSurvey';
import { ListadoEncuesta } from '../../components/ListadoEncuestas';
import { Button } from '@nextui-org/react';
import { CirclePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

export const SolicitudesEncuestas = ({session}) => {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState();
  const [dateRange, setDateRange] = useState();
  const [solicitudes, setSolicitudes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const decoded = jwtDecode(session.accessToken);
  const [flag, setFlag] = useState(false);

  useEffect(()=>{
    setFlag(false);
  },[])

  useEffect(() => {
    fetchSolicitudes(page,filtro);
  }, [page]);

  useEffect(() => {
    setPage(1)
    fetchSolicitudes(1,filtro);
  }, [status, dateRange]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchSolicitudes = async (pageNum, search = '') => {
    if(status === undefined){
      return
    }
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }
    const  data = await fetchAPI({
        endpoint: `/EncuestaMaestra/listarEncuestasMaestras`,
        method: 'POST',
        token: session.accessToken,
        payload: {
          idCoord: decoded.id,
          page: pageNum,
          inputSearch: search,
          estadoEncuesta: status,
          pageSize: 9,
          sortBy: 'fechaCreacion',
          sortOrder: 'DESC'
        },
        successMessage: 'Solicitudes de Encuestas listados correctamente',
        errorMessage: 'Error al listar Solicitudes de Encuestas',
        showToast: false
      });
    console.log(data);
    if (data && data.data && data.data.encuestasMaestras.length > 0) {
      setSolicitudes(data.data.encuestasMaestras);
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
  }, 500), [status, dateRange, solicitudes]);

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);   
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setFiltro('');
    setPage(1)
    fetchSolicitudes(1);
  };

  const enviarEncuestas = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        setFlag(false);
        throw new Error('Error validar Token');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/EncuestaMaestra/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idCoord: decoded.id
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en el fetch:', errorData);
        setFlag(false);
        throw new Error(errorData.message || 'Error en el fetch');
      }
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      setPage(1)
      fetchSolicitudes(1,filtro);
      return data; // Retorna data para que toast.promise la use
    } catch (error) {
      console.error('Error capturado:', error);
      setFlag(false);
      throw error; // Lanza el error para que toast.promise lo maneje
    }
  };
  
  const enviarEncuestasClick = async () => {
    /*await toast.promise(
      enviarEncuestas(),
      {
        loading: 'Enviando Encuestas...',
        success: 'Encuestas enviadas con éxito',
        error: 'No hay alumnos para enviar encuestas'
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    ).catch((error) => {
      console.error('Failed to post render request: ', error);
    });*/

    toast
    .promise(
      enviarEncuestas(),
      {
        loading: 'Enviando encuesta...',
        success: 'Encuesta enviada con éxito',
        error: 'No hay alumnos para enviar encuestas'
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    )
    .then(async (response) => {
      setFlag(false);
      console.log(response);
    })
    .catch((error) => {
      setFlag(false);
      console.error('Failed to post render request: ', error);
    });
  };
  

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex items-end w-full gap-2 flex-row flex-wrap'>
          <div className='flex flex-col w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Título de la Encuesta</span>
            <SearchInput
              placeholder='Ingresa el Título de la Encuesta'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
              className="w-full"
            />
          </div>
          <div className='flex flex-col w-48 gap-1'>
            <span className='text-lg font-semibold'>Estado de la Encuesta</span>
            <FilterStatusSurvey setStatus={setStatus} session={session} />
          </div>
          <Button
            color='primary'
            variant='shadow'
            className='flex items-center justify-center w-44'
            startContent={<CirclePlus size={20} />}
            onClick={()=>{
              if(!flag){
                setFlag(true);
              }
              else return;
              enviarEncuestasClick()
              }}
          >
            Enviar Solicitudes
          </Button>
        </div>
      </div>
      <ListadoEncuesta 
        filteredSolicitudes={solicitudes} 
        handlePageChange={handlePageChange} 
        page={page} 
        totalPages={totalPages} 
        loading={loading} 
      />
    </div>
  );
}

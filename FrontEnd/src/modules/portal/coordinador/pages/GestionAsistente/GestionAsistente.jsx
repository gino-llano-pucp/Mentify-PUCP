import React, { useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react';
import { Button, CircularProgress } from '@nextui-org/react';
import AsistenteCard from '../../components/AsistenteCard';


const dataEjemplo = {
  nombres: "Jose Fernando",
  primerApellido: "Cortes",
  codigo: "00001545",
  correo: "jose@dominio.sample.com"
}

export const GestionAsistente = (session) => {
  const [asistente, setAsistente] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetchAsistente();
  }, [])

  const fetchAsistente = ()=>{
    setLoading(true);
    

    setAsistente(dataEjemplo);
    setLoading(false);
  }

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      
    </div>
  );
  
}
//<ListTutoringType filteredTutoringType={tutoringTypes} handlePageChange={handlePageChange} page={page} totalPages={totalPages} loading={loading} update={fetchTutoringTypesData} filtro={filtro} session={session}/>


/*


{loading?(
        <div className='flex flex-row items-center gap-3'>
        <CircularProgress aria-label='Loading...' />
        <div>Cargando Asistente...</div>
        </div>
        ):
        (
          <>
      {asistente?(
        <AsistenteCard session={session} user={asistente}/>
      ):
      (
        <div className='flex flex-row flex-wrap items-end w-full gap-2'>
        <Button
          color='primary'
          variant='shadow'
          className='flex items-center justify-center w-fit'
          startContent={<CirclePlus size={20} />}
          //onPress={}
        >
          Agregar Asistente
        </Button>
        </div>
      )
      }
      </>
      )
      }


*/
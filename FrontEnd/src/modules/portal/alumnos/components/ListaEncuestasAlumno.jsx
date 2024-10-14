'use client';
import { Button, CircularProgress, Pagination } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import TutorAsignadoCard from './TutorAsignado.Card';
import EncuestaAlumnoCard from './EncuestaAlumnoCard';





const ListaEncuestasAlumno = ({ surveys, handlePageChange, page, totalPages, loading, update, encuestaType, functionSpecified, session, surveyType }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  console.log(surveys)
  console.log(encuestaType)
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Encuestas...</div>
          </div>
        ) : surveys && surveys.length > 0 ? (
            surveys.map((survey) => ((survey) &&
            <EncuestaAlumnoCard key={survey.idEncuesta?survey.idEncuesta:null} survey={survey} functionSpecified={functionSpecified} encuestaType={encuestaType} update={update} session={session} initialLoad={initialLoad} setInitialLoad={setInitialLoad}/>
          ))
        ) : (
            encuestaType===1?
            <div>No hay encuestas pendientes</div>  
            :
            encuestaType===2?
            <div>No hay encuestas completadas</div>  
            :
            null
        )
        }
      </div>
      {totalPages > 1 && (
        <div className='flex items-center justify-center w-full px-2 py-2 mt-auto'>
          <Pagination
            isCompact
            loop
            showControls
            showShadow
            size='md'
            color='primary'
            initialPage={1}
            page={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListaEncuestasAlumno;

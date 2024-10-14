'use client';
import { Button, CircularProgress, Pagination } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import TutorAsignadoCard from './TutorAsignado.Card';



const ListaTutoresAsignados = ({session, filteredTutores, handlePageChange, page, totalPages, loading, selectTutor, functionSpecified, deleteOption, deleteFunction, useModal, accessOption, sendSolicitud, update, filtro, setDoRefresh}) => {
  console.log(filteredTutores)
  console.log(filtro)
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-wrap w-full gap-4'>
        {loading ? (
          <div className='flex flex-row items-center gap-3'>
            <CircularProgress aria-label='Loading...' />
            <div>Cargando Tutores...</div>
          </div>
        ) : filteredTutores.length > 0 ? (
            filteredTutores.map((tutor) => ((tutor) &&
            <TutorAsignadoCard key={tutor.id_usuario?tutor.idTutor:null} tutor={tutor} selectTutor={selectTutor} functionSpecified={functionSpecified} deleteOption={deleteOption?deleteOption:tutor.esSolicitud&&tutor.esSolicitud===1} deleteFunction={deleteFunction} page={page} pending={tutor.esSolicitud===1} useModal={useModal} accessOption={accessOption} sendSolicitud={sendSolicitud} update={update} filtro={filtro} session={session} setDoRefresh={setDoRefresh}/>
          ))
        ) : filteredTutores.length === 0 && filtro===''?
        (
          <div>No hay tutores asignados al Tipo de Tutoria. Para asignar un tutor debe seleccionar el Tipo de Tutoría desde el menú Tipos de Tutorías y utilizar las opciones Agregar Usuario y Cargar.</div>
        )
        :
        (
          <div>No se encontraron tutores asignados al Tipo de Tutoría que coincidan con la búsqueda.</div>
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

export default ListaTutoresAsignados;

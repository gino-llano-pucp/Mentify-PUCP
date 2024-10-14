'use client';
import { Pencil, Trash, Mail, Building2, InfoIcon } from 'lucide-react';
import { Button, Tooltip, useDisclosure } from '@nextui-org/react';
import CardAttribute from './CardAttribute';
import React from 'react';
import EditUnidadAcademica from '../pages/GestionUnidadesAcademicas/EditUnidadAcademica';
import DeleteUnidadAcademica from '../pages/GestionUnidadesAcademicas/DeleteUnidadAcademica';
import ModalActivarUnidadAcademica from './ModalActivarUnidadAcademica';
import fetchAPI from '@/modules/core/services/apiService';
 
const UnidadAcademicaCard = ({ unidad, update, page, session, eliminar_carga=false, filtro }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ActiveData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }

      console.log("Se activara la unidad academica: ",unidad.id_unidad_academica,unidad.siglas);
      const response = await fetchAPI({
        endpoint: '/unidadAcademica/activar',
        method: 'POST',
        payload: {
          "id_unidad_academica" : unidad.id_unidad_academica
        },
        token: token,
        successMessage: 'Unidad académica activada con éxito',
        errorMessage: 'Error al activar la unidad académica',
        showToast: false,
      });

      onOpenChange (false);
      update(page,filtro)
    } catch (error) {
      console.error('Error activando unidad académica', error);
      return error
    }
  };

  return (
    <div className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>{unidad.nombre}</h3>
        {unidad.esActivo === "Activo"  ? (
          <div className='flex flex-row gap-1'>
            {eliminar_carga === false  ? (
              <div className='flex flex-row'>
                
                  <EditUnidadAcademica 
                    unidad={unidad} 
                    update={update} 
                    page={page} 
                    session={session}
                    filtro={filtro} 
                  />
                
                
                  <DeleteUnidadAcademica 
                    unidad={unidad} 
                    update={update} 
                    page={page} 
                    session={session}
                    filtro={filtro} 
                  />
                
              </div>
            ) : (
              <Tooltip content='Eliminar Unidad Académica' color='danger' closeDelay={100}>
                <DeleteUnidadAcademica 
                  unidad={unidad} 
                  update={update} 
                  page={page} 
                  session={session}
                  eliminar_carga={eliminar_carga}
                />
              </Tooltip>
            )}
          </div>
        ) : (
          eliminar_carga === false  ? (
            <div className='flex flex-row gap-1'>
              <ModalActivarUnidadAcademica
                title={`Activar Unidad Académica`}
                activeData={ActiveData}
                isOpen={isOpen}
                onOpen={onOpen}
                onOpenChange={onOpenChange}
              />
            </div>
          ) : (
            
              <DeleteUnidadAcademica 
                unidad={unidad} 
                update={update} 
                page={page} 
                session={session}
                eliminar_carga={eliminar_carga}
              />
            
          )
        )}
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute icon={<Building2 size={20} />} text={unidad.siglas} />
        <CardAttribute icon={<Mail size={20} />} text={unidad.correoDeContacto} />
        {eliminar_carga === false ? (
          <CardAttribute icon={<InfoIcon size={20} />} text={unidad.esActivo} />
        ) :(
          ' '
        )}
      </div>
    </div>
  );
};

export default UnidadAcademicaCard;
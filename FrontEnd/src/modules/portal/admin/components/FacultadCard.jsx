import { InfoIcon, UserCircle } from 'lucide-react';
import React, { useState } from 'react';
import CardAttribute from './CardAttribute';
import { useFacultadCoordinador } from '../states/FacultadCoordinadorContext';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import DeleteFacultad from '../pages/GestionFacultades/DeleteFacultad';
import EditarFacultad from '../pages/GestionFacultades/EditarFacultad';
import { useDisclosure } from '@nextui-org/react';
import ModalActivar from '@/modules/core/components/ModalActivar';
import toast from 'react-hot-toast';

const FacultadCard = ({ facultad, page, update, session }) => {
  const {
    facultadNombre,
    setFacultadNombre,
    coordinatorData,
    setCoordinatorData,
    facultadId,
    setFacultadId,
    clearFields
  } = useFacultadCoordinador();
  const { setActiveComponentById } = useActiveComponent();
  const [edit, setEdit] = useState(false);
  const [delete_, setDelete] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ActiveData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/facultad/activar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "id": String(facultad.id),
				  "nombre": facultad.nombre
        })
      });

      if (!response.ok) {
        throw new Error('Error en fetch')
      }
      onOpenChange(false);
      update(page)
    } catch (error) {
      return error
    }
  };

  const ActivePromise = async () => {
    toast
      .promise(
        ActiveData(),
        {
          loading: 'Activando Facultad...',
          success: 'Facultad activada con éxito',
          error: 'Error al activar al facultad'
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      )
      .then(async (response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Failed to post render request: ', error);
      });
  };


  const handleEdit = () => {
    setFacultadNombre(facultad.nombre);
    setCoordinatorData({
      id: facultad.Encargado.id_usuario,
      code: facultad.Encargado.codigo,
      name: `${facultad.Encargado.nombres}`,
      primerApellido: `${facultad.Encargado.primerApellido}`,
      segundoApellido: `${facultad.Encargado.segundoApellido}`,
      email: facultad.Encargado.email, 
      isSelectedFromSearch: true // Establecer como verdadero si necesita activar la lógica de búsqueda
    });
    setActiveComponentById('editarFacultad', `Editar ${facultad.nombre}`);
  };
  console.log(facultad)
  return (
    <div
      className={`w-[360px] flex flex-col gap-4 p-4 border rounded-xl ${facultad.esActivo === 'Activo' ? 'hover:cursor-pointer transition-shadow hover:shadow-lg' : ''}`}
      onClick={() => {
        if (!edit && !delete_)
        {
          if(facultad.esActivo === 'Inactivo') return;
          setFacultadNombre(facultad.nombre);
          setFacultadId(facultad.id);
          const title = 'Programas de ' + facultad.nombre;
          setActiveComponentById('listadoProgramasDeFacultad', title);
        }
      }}
    >
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words overflow-hidden'>{facultad.nombre}</h3>
        {
          facultad?.esActivo == "Activo" ?
          (
            <div className='flex flex-row gap-1'>
              <EditarFacultad
                initialCoordinadorData={facultad.Encargado ? (facultad?.Encargado) : {
                  id_usuario: '',
                  codigo: '',
                  nombres: '',
                  primerApellido: '',
                  segundoApellido: '',
                  email: '',
                }}
                initialNombreFacultad={facultad.nombre ? (facultad?.nombre) : ""}
                facultadId={facultad.id ? (facultad?.id) : ""}
                setEdit={setEdit}
                page={page}
                update={update}
                session={session}
              />
              <DeleteFacultad facultad={facultad} setDelete={setDelete} page={page} update={update} session={session} />
            </div>
          )
          :
          (<div className='flex flex-row gap-1'>
            <ModalActivar
              title={`Activar Facultad`}
              activeData={ActivePromise}
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
          </div>)
        }
      </div>
      <div className='flex flex-col w-full gap-2'>
        {/* <CardAttribute icon={<Building size={20}/>} text={"INF"}/> */}
        {facultad.Encargado.id_usuario !== '' ? 
          <CardAttribute
            icon={<UserCircle size={20} />}
            text={facultad.Encargado.nombres + ' ' + facultad.Encargado.primerApellido}
          /> : 
          <CardAttribute icon={<UserCircle size={20} />} text={'No asignado'} />
        }
        <CardAttribute icon={<InfoIcon size={20} />} text={facultad.esActivo} />
      </div>
    </div>
  );
};

export default FacultadCard;

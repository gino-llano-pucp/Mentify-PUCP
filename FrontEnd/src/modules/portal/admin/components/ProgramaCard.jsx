import { InfoIcon, Pencil, Trash, UserCircle } from 'lucide-react';
import React from 'react';
import CardAttribute from './CardAttribute';
import EditPrograma from '../pages/GestionProgramas/EditPrograma';
import DeletePrograma from '../pages/GestionProgramas/DeletePrograma';
import { useEffect } from 'react';
import ModalActivar from '@/modules/core/components/ModalActivar';
import toast from 'react-hot-toast';
import { useDisclosure } from '@nextui-org/react';

const ProgramaCard = ({ programa, update, page, session }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    console.log(programa);
  }, [])

  const ActiveData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/programa/activar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "id": String(programa.id),
				  "nombre": programa.nombre
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
          loading: 'Activando Programa...',
          success: 'Programa activada con éxito',
          error: 'Error al activar al Programa'
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

  return (  
    <div className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
      <h3 className='w-[255px] text-lg font-semibold break-words'>{programa.nombre}</h3>
      {
        programa?.esActivo == "Activo" ?
        (
          <div className='flex flex-row gap-1'>
          <EditPrograma
            initialCoordinadorData={programa.Encargado ? (programa?.Encargado) : {
              id_usuario: '',
              codigo: '',
              nombres: '',
              primerApellido: '',
              segundoApellido: '',
              email: '',
            }}
            initialNombrePrograma={programa.nombre ? (programa?.nombre) : ""}
            programaId={programa.id ? (programa?.id) : ""}
            page={page}
            update={update}
            session={session}
          />
          <DeletePrograma programa={programa} update={update} page={page} session={session}/>
        </div>
        )
        :
        (
          <div className='flex flex-row gap-1'>
            <ModalActivar
              title={`Activar Facultad`}
              activeData={ActivePromise}
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
          </div>
        )
      }
      </div>
      <div className='flex flex-col w-full gap-2'>
        {/* <CardAttribute icon={<Building size={20}/>} text={"INF"}/> */}
        {
          programa.Encargado ?
          (
            <CardAttribute icon={<UserCircle size={20} />} text={programa?.Encargado.nombres + ' ' + programa?.Encargado.primerApellido + ' ' + programa?.Encargado.segundoApellido} />
          )
          :
          <CardAttribute icon={<UserCircle size={20} />} text={'No asignado'} />
        }
        <CardAttribute icon={<InfoIcon size={20} />} text={programa?.esActivo} />
      </div>
    </div>
  );
};

export default ProgramaCard;

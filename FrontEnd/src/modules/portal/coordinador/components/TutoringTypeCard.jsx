import ModalActivar from '@/modules/core/components/ModalActivar'
import ModalEliminar from '@/modules/core/components/ModalEliminar'
import { useDisclosure } from '@nextui-org/react';
import { AlarmClock, CalendarClock, CircleUserRound, Info, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import EditTutoringType from './EditTutoringType';
import CardAttribute from '../../admin/components/CardAttribute';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useTutoringType } from '../states/TutoringTypeContext';
import { useNameTutoringType } from '@/modules/core/states/TutoringTypeContext';

export const TutoringTypeCard = ({tutoringType, update, page, filtro, session}) => {
  const { addTutoringType } = useTutoringType()
  const { addNameTutoringType } = useNameTutoringType()
  const { setActiveComponentById } = useActiveComponent()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const deleteData = async () => {
        try {
          const token = session?.accessToken;
          console.log('sess: ', session);
          if (!token) {
            throw new Error("Token no valido");
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/${tutoringType.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          const data = await response.json();
          console.log(data);
    
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error.message || 'Error en fetch');
          }
          onOpenChange(false);
          console.log(page)
          update(page, filtro)
        } catch (error) {
          throw new Error(error.message || 'Error al enviar el formulario');
        }
      };
    
      const deletePromise = async () => {
        toast
          .promise(
            deleteData(),
            {
              loading: 'Eliminando Tipo de Tutoría...',
              success: 'Tipo de Tutoría eliminado con éxito',
              error: (error) => error.message || 'Error al eliminar tipo de tutoría'
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

      const ActiveData = async () => {
        try {
          const token = session?.accessToken;
          console.log('sess: ', session);
          if (!token) {
            throw new Error("Token no valido");
          }
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/${tutoringType.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              esActivo: true
            })
          });
    
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error.message || 'Error en fetch');
          }
          onOpenChange(false);
          update(page, filtro)
        } catch (error) {
          throw new Error(error.message || 'Error al enviar el formulario');
        }
      };
    
      const ActivePromise = async () => {
        toast
          .promise(
            ActiveData(),
            {
              loading: 'Activando Tipo de Tutoría...',
              success: 'Tipo de Tutoría activado con éxito',
              error: (error) => error.message || 'Error al activar al tipo de tutoría'
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
    <div 
      className={`w-[360px] flex flex-col gap-4 p-4 border rounded-xl ${tutoringType.esActivo ? 'hover:cursor-pointer transition-shadow hover:shadow-lg' : ''}`}
      onClick={() => {
        if(tutoringType.esActivo){
          addTutoringType(tutoringType.id)
          addNameTutoringType(tutoringType.nombreTutoria)
          setActiveComponentById('usuarioTipoTutoria',`${tutoringType.nombreTutoria}`)
        }
      }
      }
    >
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {tutoringType.nombreTutoria}
        </h3>
        {tutoringType.esActivo ? (
          <div className='flex flex-row gap-1'>
            <EditTutoringType 
              tutoringType = {tutoringType} 
              update={update} 
              page={page}
              filtro={filtro}
              session={session}
            />
            <ModalEliminar
              title='Eliminar Tipo de Tutoría'
              deleteData={deletePromise}
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
          </div>
        ) : (
          <div className='flex flex-row gap-1'>
            <ModalActivar
              title='Activar Tipo de Tutoría'
              activeData={ActivePromise}
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
          </div>
        )}
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute 
          icon={<AlarmClock size={20} />} 
          text={tutoringType.obligatoriedad} 
          />
        <div className={tutoringType.tipoTutor === null ? 'hidden' : null}>
          <CardAttribute
            icon={<CircleUserRound size={20} />}
            text={tutoringType.tipoTutor === null ? '' : 'Tutor '+tutoringType.tipoTutor}
            />
        </div>
        <CardAttribute
          icon={<CalendarClock size={20} />}
          text={tutoringType.duracion} 
          />
        <CardAttribute
          icon={<UserRound size={20} />}
          text={tutoringType.formato} 
          />
        <CardAttribute 
          icon={<Info size={20} />} 
          text={tutoringType.esActivo ? 'Activo' : 'Inactivo'} />
      </div>
    </div>
  )
}

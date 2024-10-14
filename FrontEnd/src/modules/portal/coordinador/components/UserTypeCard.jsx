import { Hash, Mail, Info, CircleUser } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import ModalEliminar from '@/modules/core/components/ModalEliminar';
import toast from 'react-hot-toast';
import { useDisclosure } from '@nextui-org/react';
import fetchAPI from '@/modules/core/services/apiService';
import { useTutoringType } from '../states/TutoringTypeContext';

export const UserCard = ({ users, page, update, setUpdate, updateNow, filtro, session}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {selectedTutoringType} = useTutoringType()

  const deleteData = async () => {
    try {
      const data = await fetchAPI({
        endpoint: '/asignacionTipoTutoria/eliminar-asignacion-tipo-tutoria',
        method: 'POST',
        token: session.accessToken,
        payload:{
          "id_usuario": users.id,
          "id_tutoringType": selectedTutoringType
        },
        successMessage: 'Usuario eliminado con éxito.',
        errorMessage: 'Error al eliminar usuario.',
        showToast: false,
        useCache: true
      });
      console.log(data)
      if(updateNow === true){
        setUpdate(false)
      }else{
        setUpdate(true)
      }
      update(page,filtro)
      onOpenChange(false);
    } catch (error) {
      return error
    }
  };

  const deletePromise = async () => {
    toast
      .promise(
        deleteData(),
        {
          loading: 'Eliminando Usuario...',
          success: 'Usuario eliminado con éxito',
          error: 'Error al eliminar usuario'
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
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {users.name + ' ' + users.primerApellido}
        </h3>
          <div className='flex flex-row gap-1'>

            <ModalEliminar
              title={`Eliminar ${users.rol}`}
              deleteData={deletePromise}
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
          </div>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute 
            icon={<CircleUser size={20} />} 
            text={users.rol} // Mostrar múltiples roles separados por coma
        />
        <CardAttribute icon={<Hash size={20} />} text={users.code} />
        <CardAttribute icon={<Mail size={20} />} text={users.email} />
      </div>
    </div>
  );
}
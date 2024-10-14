import { Hash, Mail, Info, Book, Calendar } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import toast from 'react-hot-toast';
import EditStudent from '@/modules/portal/admin/pages/GestionAlumnos/EditStudent';
import EditarTutor from '@/modules/portal/admin/pages/GestionTutores/EditarTutor';
import { Button, Tooltip, useDisclosure } from '@nextui-org/react';


function AsistenteCard({session, user}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
 
  const deleteData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${user.id}/role-name/${queVaEliminar}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
      onOpenChange(false);
      update(page,filtro)
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

  const ActiveData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${user.id}/role-name/${queVaEliminar}`, {
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
        throw new Error('Error en fetch')
      }
      onOpenChange(false);
      update(page,filtro)
    } catch (error) {
      return error
    }
  };

  
  return (
    <div className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {user.nombres + ' ' + user.primerApellido}
        </h3>
        {user.esActivo ? (
          <div className='flex flex-row gap-1'>
            {Eliminar === false ? (
              ''
            ) : (
              <EditStudent user = {user} update={update} page={page} filtro={filtro} session={session}/>
            )}

            <ModalEliminar
              title={`Eliminar ${queVaEliminar}`}
              deleteData={Eliminar ? deletePromise : deleteDataCargar}
              isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}
            />
          </div>
        ) : null}
      </div>
      <div className='flex flex-col w-full gap-2'>
        { Eliminar === false ? user.roles === undefined ? null :
          <CardAttribute icon={<Info size={20} />} text={user.roles} /> : null
        }
        <CardAttribute icon={<Hash size={20} />} text={user.codigo} />
        { queVaEliminar === 'Tutor' ? null : user.facultad === null ? null :
          <CardAttribute
            icon={<Book size={20} />}
            text={user.programa === null ? `Facultad: ${user.facultad}` : `Programa: ${user.programa}`}
          />
        }
        <CardAttribute icon={<Mail size={20} />} text={user.email} />
        { Eliminar === false ? null :
          <CardAttribute icon={<Info size={20} />} text={user.esActivo ? 'Activo' : 'Inactivo'} />
        }
      </div>
    </div>
  );
}

export default AsistenteCard;

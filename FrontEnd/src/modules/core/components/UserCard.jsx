import { Hash, Mail, Info, Book, Calendar } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import ModalEliminar from './ModalEliminar';
import toast from 'react-hot-toast';
import ModalActivar from './ModalActivar';
import EditStudent from '@/modules/portal/admin/pages/GestionAlumnos/EditStudent';
import EditarTutor from '@/modules/portal/admin/pages/GestionTutores/EditarTutor';
import { Button, Tooltip, useDisclosure } from '@nextui-org/react';
import { useUsers } from '../states/UsersContext';
import { useActiveComponent } from '../states/ActiveComponentContext';
import { jwtDecode } from 'jwt-decode';

function UserCard({ users, queVaEliminar, Eliminar, update, page, myRol, filtro, session}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { removeUser, addUser } = useUsers();
  const { setActiveComponentById } = useActiveComponent();
  let yo = false;

  if(Eliminar && queVaEliminar === 'Tutor'){
    const decoded = jwtDecode(session.accessToken);
    if(decoded.roles.some(role => role.includes('Coordinador'))){
      if(users.id === decoded.id){
        yo = true;
      }
    }
  }

  const deleteDataCargar = () => {
    removeUser(users.id_usuario);
    onOpenChange(false);
  };
 
  const deleteData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${users.id}/role-name/${queVaEliminar}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${users.id}/role-name/${queVaEliminar}`, {
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

  const ActivePromise = async () => {
    toast
      .promise(
        ActiveData(),
        {
          loading: 'Activando Usuario...',
          success: 'Usuario activado con éxito',
          error: 'Error al activar al usuario'
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

  const handleOnClickEditarDisponibilidad = (component, users)=> {
    console.log("Se añadió el tutor: ", users.nombres);
    addUser(users);
    setActiveComponentById(component, `Editar Disponibilidad de ${users.nombres}`);
  };

  return (
    <div className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words overflow-hidden'>
          {users.nombres + ' ' + users.primerApellido}
        </h3>
        {yo === false ? 
          <>
            {users.esActivo ? (
              <div className='flex flex-row gap-1'>
                {Eliminar === false ? (
                  ''
                ) : (
                  queVaEliminar === 'Tutor' ? 
                    myRol === 'Coordinador de Facultad' ?
                    <div className='flex flex-row'>
                      <Tooltip content='Editar Disponibilidad' color='foreground' closeDelay={100}>
                        <Button
                          isIconOnly
                          color='default'
                          variant='light'
                          aria-label='Editar Disponibilidad'
                          onClick={() => handleOnClickEditarDisponibilidad('editarDisponibilidadTutor',users)}
                          //onClick={() => setActiveComponentById('editarDisponibilidadTutor', `Editar Disponibilidad de ${users.nombres}`)}
                          //onClick={onOpen}
                        >
                          <Calendar size={16} />
                        </Button>
                      </Tooltip>  
                      {/*<EditarDisponibilidadTutor user = {users}/>*/}
                      <EditarTutor user = {users} update={update} page={page} filtro={filtro} session={session}/>
                    </div> :
                    <EditarTutor user = {users} update={update} page={page} filtro={filtro} session={session}/>
                  :
                  <EditStudent user = {users} update={update} page={page} filtro={filtro} session={session}/>
                )}

                <ModalEliminar
                  title={`Eliminar ${queVaEliminar}`}
                  deleteData={Eliminar ? deletePromise : deleteDataCargar}
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onOpenChange={onOpenChange}
                />
              </div>
            ) : (
              <div className='flex flex-row gap-1'>
                <ModalActivar
                  title={`Activar ${queVaEliminar}`}
                  activeData={ActivePromise}
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onOpenChange={onOpenChange}
                />
              </div>
            )}
          </> : null
      }
        
      </div>
      <div className='flex flex-col w-full gap-2'>
        { Eliminar === false ? users.roles === undefined ? null :
          <CardAttribute icon={<Info size={20} />} text={users.roles} /> : null
        }
        <CardAttribute icon={<Hash size={20} />} text={users.codigo} />
        { queVaEliminar === 'Tutor' ? null : users.facultad === null ? null :
          <CardAttribute
            icon={<Book size={20} />}
            text={users.programa === null ? `Facultad: ${users.facultad}` : `Programa: ${users.programa}`}
          />
        }
        <CardAttribute icon={<Mail size={20} />} text={users.email} />
        { Eliminar === false ? null :
          <CardAttribute icon={<Info size={20} />} text={users.esActivo ? 'Activo' : 'Inactivo'} />
        }
      </div>
    </div>
  );
}

export default UserCard;

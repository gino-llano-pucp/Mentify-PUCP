import { Book, Hash, Info, Mail } from "lucide-react";
import toast from "react-hot-toast";
import CardAttribute from "./CardAttribute";
import { useDisclosure } from '@nextui-org/react';
import ModalEliminar from "@/modules/core/components/ModalEliminar";
import EditResponsable from "../pages/GestionResponsable/EditResponsable";
import ModalActivar from "@/modules/core/components/ModalActivar";

function ResponsableTutoriaCard({ users, queVaEliminar, Eliminar, update, session}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    console.log(users);

    const deleteData = async () => {
        console.log(users);
        try {
            const token = session?.accessToken;
            console.log('sess: ', session);
            if (!token) {
                throw new Error('Token invalido')
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/eliminar-responsable-tutoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    codigo: users.codigo
                })
            });
    
            console.log(response);

            if (!response.ok) {
                throw new Error('Error en el fetch')
            }

            onOpenChange(false);
            update()

        } catch (error) {
            return error
        }
    };
    
    const deletePromise = async () => {
        toast
          .promise(
            deleteData(),
            {
              loading: 'Eliminando Responsable de Tutoría...',
              success: 'Responsable de Tutoría eliminado con éxito',
              error: 'Error al eliminar responsable de tutoría'
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
        console.log(users);
        try {
            const token = session?.accessToken;
            console.log('sess: ', session);
            if (!token) {
                throw new Error('Token invalido')
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/activar-responsable-tutoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    codigo: users.codigo
                })
            });

            const data = await response.json();
            console.log(data);

            if (data.data.error === 'Ya existe un responsable de tutoría activo para esta facultad.') {
                console.log(data.data.error);
                throw new Error(data.data.error);
            }

            if (data.data.error === 'Rol "Responsable de Tutoría" no encontrado') {
                console.log(data.data.error);
                throw new Error(data.data.error);
            }

            onOpenChange(false);
            update()

        } catch (error) {
            throw error
        }
    };
    
    const ActivePromise = async () => {
        toast
          .promise(
            ActiveData(),
            {
              loading: 'Activando Responsable de Tutoría...',
              success: 'Responsable de Tutoría activando con éxito',
              error: (error) => error.message
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
                    {users.nombre + ' ' + users.primerApellido}
                </h3>

                {users.esActivo ? 
                  <div className='flex flex-row gap-1'>
                    <EditResponsable user={users} update={update} session={session}/>

                    <ModalEliminar
                        title={`Eliminar ${queVaEliminar}`}
                        deleteData={deletePromise}
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onOpenChange={onOpenChange}
                    />
                 </div> 
                : 
                <div className='flex flex-row gap-1'>
                    <ModalActivar
                    title={`Activar ${queVaEliminar}`}
                    activeData={ActivePromise}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                    />
                </div>
                } 
            </div>

            <div className='flex flex-col w-full gap-2'>
                <CardAttribute icon={<Hash size={20} />} text={users.codigo} />
                <CardAttribute icon={<Mail size={20} />} text={users.correo} />
                {users.facultad&&<CardAttribute icon={<Book size={20} />} text={users.facultad} />}
                <CardAttribute icon={<Info size={20} />} text={users.esActivo ? 'Activo' : 'Inactivo'} />
            </div>
        </div>
    )
}

export default ResponsableTutoriaCard;
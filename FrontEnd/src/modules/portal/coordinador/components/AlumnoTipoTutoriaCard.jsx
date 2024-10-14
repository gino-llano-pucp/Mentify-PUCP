import { Book, Hash, Mail, Info } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import ModalEliminar from '@/modules/core/components/ModalEliminar';
import { useDisclosure } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useTutor } from '../states/TutorContext';

export const AlumnoTipoTutoriaCard = ({student, update, page, setUpdate, updateNow, tutor, filtro, session}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addTutor } = useTutor()

  const deleteData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error('Token invalido')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/desasignar-alumno-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idAlumno: student.id_alumno,
          idTutor: tutor.Tutor.id_usuario,
          tipoTutoria: tutor.TipoTutoria.id
        })
      });
      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
      if(updateNow === true){
        setUpdate(false)
      }else{
        setUpdate(true)
      }
      tutor.Tutor.cantAlumnos--
      addTutor(tutor)
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

  return (
    <div className={'w-[350px] flex flex-col gap-4 p-4 border rounded-xl '}>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {student.nombres + ' ' + student.primerApellido}
        </h3>
        <ModalEliminar
          title='Eliminar asignación de alumno'
          deleteData={deletePromise}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        /> 
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute 
          icon={<Hash size={20} />} 
          text={student.codigo} />
        <CardAttribute 
          icon={<Book size={20} />} 
          text={student.programa === null ? student.facultad : student.programa} />
        <CardAttribute
          icon={<Mail size={20} />}
          text={student.email}
        />
        <CardAttribute
          icon={<Info size={20} />}
          text={student.esSolicitado}
        />
       </div> 
        
    </div>
  )
}
import { Hash, Library, Mail, UsersRound } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';

export const TutorCardHorizontal = ({tutor}) => {
  return (
    
    <div className='w-full py-4 flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {tutor?(tutor.Tutor.nombres + ' ' + tutor.Tutor.primerApellido):null}
        </h3>
      </div>
      <div className='flex flex-row w-full gap-2 justify-between'>
        <CardAttribute
          icon={<Hash size={20} />} 
          text={tutor?(tutor.Tutor.codigo):null} />
        <CardAttribute
          icon={<Mail size={20} />}
          text={tutor?(tutor.Tutor.email):null}
        />
        <CardAttribute
          icon={<Library size={20} />} 
          text={tutor?(tutor.TipoTutoria.nombre):null} />
        <CardAttribute
          icon={<UsersRound size={20} />} 
          text={tutor?(tutor.Tutor.cantAlumnos + ' alumnos asignados a la fecha'):null} />
      </div>
    </div>
  )
}

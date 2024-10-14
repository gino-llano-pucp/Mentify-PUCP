import { Hash, Mail, UsersRound } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';

export const TutorCard = ({tutor}) => {
  return (
    <div className='w-[350px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {tutor.nombres + ' ' + tutor.primerApellido}
        </h3>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute 
          icon={<Hash size={20} />} 
          text={tutor.codigo} />
        <CardAttribute
          icon={<Mail size={20} />}
          text={tutor.email}
        />
        <CardAttribute 
          icon={<UsersRound size={20} />} 
          text={tutor.cantAlumnos + ' alumnos asignados a la fecha'} />
      </div>
    </div>
  )
}

import { Hash, Library, Mail, UsersRound } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';

export const AlumnoCardHorizontal = ({alumno}) => {
    console.log(alumno)
    return (
    
    <div className='w-full py-4 flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {alumno?(alumno.nombreAlumno + ' ' + alumno.primerApellido):null}
        </h3>
      </div>
      <div className='flex flex-row w-full gap-2 justify-between'>
        <CardAttribute
          icon={<Hash size={20} />} 
          text={alumno?(alumno.codigoAlumno):null} />
        <CardAttribute
          icon={<Mail size={20} />}
          text={alumno?(alumno.correo):null}
        />
        <CardAttribute
          icon={<Library size={20} />} 
          text={alumno?(alumno.nombreFacultad):null} />
        
      </div>
    </div>
  )
}
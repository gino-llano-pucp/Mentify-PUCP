import { Hash, Mail, Book } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';

export const AlumnoDerivacionCard = ({alumno}) => {
    console.log(alumno)

    return (
        <div className='w-full flex flex-col gap-4 p-4 border rounded-xl'>
            <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
                <h3 className='w-full text-lg font-semibold break-words'>
                {'Alumno: ' + alumno.nombres + ' ' + alumno.primerApellido + ' ' + alumno.segundoApellido}
                </h3>
            </div>
            <div className='flex flex-col w-full gap-2'>
                <CardAttribute 
                icon={<Hash size={20} />} 
                text={alumno.codigo} />
                <CardAttribute
                icon={<Mail size={20} />}
                text={alumno.email}
                />
            </div>
        </div>
    )
}
import { useSession } from 'next-auth/react';
import CardAttribute from '../../admin/components/CardAttribute';
import { Book, BookOpen, Info, Users } from "lucide-react";
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';

import { useDerivacion } from '../states/SolicitudDerivacionContext';

function DerivacionCard({ users }) {

    console.log('soy una derivacion');
    console.log(users);

    
    const { setActiveComponentById } = useActiveComponent();
    const { addDerivacion } = useDerivacion();

    return (
        <div 
            className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl transition-shadow hover:shadow-lg cursor-pointer'

            onClick={() => {
                console.log('DerivacionCard');
                console.log(users);
                addDerivacion(users);
                setActiveComponentById('solicitudDerivacion', 'Solicitud de Derivación ' + users.id_derivacion);
            }}
        >
            <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
                <h3 className='w-[255px] text-lg font-semibold break-words'>
                    {'Solicitud de Derivación ' + users.id_derivacion}
                </h3>
            </div>

            <div className='flex flex-col w-full gap-2'>
                <CardAttribute icon={<Users size={20} />} text={users.Tutor.nombres + ' ' + users.Tutor.primerApellido} />
                <CardAttribute icon={<Book size={20} />} text={users.UnidadAcademica.nombre} />
                <CardAttribute icon={<BookOpen size={20} />} text={users.TipoTutoria.nombre} />
                <CardAttribute icon={<Info size={20} />} text={users.estado} />
            </div>
        </div>
    )
}

export default DerivacionCard;
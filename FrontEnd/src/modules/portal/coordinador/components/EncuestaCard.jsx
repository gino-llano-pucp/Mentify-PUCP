import { Book, BookOpen, Clock } from 'lucide-react';
import React from 'react';
import CardAttribute from '../../admin/components/CardAttribute';

const EncuestaCard = ({ solicitud }) => {
  console.log(solicitud)

  return (
    <div className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>{solicitud.titulo}</h3>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute
            icon={<Clock size={20} />}
            text={solicitud.estado_encuesta_maestra}
        />
        <CardAttribute
            icon={<Book size={20} />}
            text={`Cantidad de Alumnos: ${solicitud.cant_Alumnos}`}
        />
        <CardAttribute
            icon={<BookOpen size={20} />}
            text={`Cantidad de Alumnos pendientes: ${solicitud.cant_Alumnos_pendiente}`}
        />
        <CardAttribute
            icon={<BookOpen size={20} />}
            text={`Cantidad de Alumnos que respondieron: ${solicitud.cant_Alumnos_respondido}`}
        />
      </div>
    </div>
  );
};

export default EncuestaCard;

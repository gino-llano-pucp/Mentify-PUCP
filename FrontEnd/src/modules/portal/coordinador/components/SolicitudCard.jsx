import { Calendar, Clock, UserCircle } from 'lucide-react';
import React from 'react';
import CardAttribute from '../../admin/components/CardAttribute';
import { useDisclosure } from '@nextui-org/react';
import ModalSolicitud from './ModalSolicitud';

const SolicitudCard = ({ solicitud, update, page, filtro, session }) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(solicitud);

  function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`; // Formato ISO
  }

  return (
    <div
      className='w-[360px] h-min-[180px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer relative transition-shadow hover:shadow-lg'
      onClick={onOpen}
    >
      <div className='absolute'>
        <ModalSolicitud isOpen={isOpen} onOpenChange={onOpenChange} solicitud={solicitud} update={update} page={page} filtro={filtro} session={session} />
      </div>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>{solicitud.TipoTutoria.nombre}</h3>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute
          icon={<UserCircle size={20} />}
          text={solicitud.Alumno.nombres + ' ' + solicitud.Alumno.primerApellido}
        />
        <CardAttribute
            icon={<Calendar size={20} />}
            text={formatDateToISO(solicitud.fechaSolicitud)}
        />
        <CardAttribute
            icon={<Clock size={20} />}
            text={solicitud.estadoSolicitud}
        />
      </div>
    </div>
  );
};

export default SolicitudCard;

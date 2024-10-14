import { Calendar, Clock, LocateIcon, MapPinIcon, UserCircle } from 'lucide-react';
import React from 'react';
import CardAttribute from '../../admin/components/CardAttribute';
import { useDisclosure } from '@nextui-org/react';
import ModalSolicitud from '../../coordinador/components/ModalSolicitud'; 
import GenericCard from '@/modules/core/components/GenericCard';

const CitaAlumnoCard = ({ cita, update, page, functionSpecified, session }) => {
  console.log(cita)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(cita)
  
  function formatDateToISO(dateString) {
    let [y,m,d] = dateString.split('-');
    const date = new Date(Date.UTC(y,m-1,d));
    console.log(date)
    const day = String(date.getUTCDate()).padStart(2,'0');
    const month = String(date.getUTCMonth()+1).padStart(2,'0');
    const year = String(date.getUTCFullYear());
  
    return `${day}-${month}-${year}`; // Formato ISO
  }
  const header = <h3 className='w-[255px] h-min-12 text-base font-semibold break-words'>{cita.nombreTipoTutoria}</h3>;

  const attributes = [
    {
      icon: <Calendar size={20} />,
      text: formatDateToISO(cita.fechaCita),
    },
    {
      icon: <Clock size={20} />,
      text: `${cita.horaInicio} - ${cita.horaFin}`,
    },
    {
      icon: <MapPinIcon size={20} />,
      text: cita.ubicacion,
    },
  ];


  
  return (
  

  
    <GenericCard 
      header={header} 
      attributes={attributes} 
      onClick={() => functionSpecified(cita)} 
    />
  
  );
};

export default CitaAlumnoCard;



/*

<div
      className='w-[360px] h-[150px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer relative'
      onClick={()=>{functionSpecified(cita)}}
    >
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>{cita.tipoTutoria}</h3>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute
            icon={<Calendar size={20} />}
            text={formatDateToISO(cita.fecha)}
        />
        <CardAttribute
            icon={<Clock size={20} />}
            text={`${cita.horaInicio} - ${cita.horaFin}`}
        />
        <CardAttribute
            icon={<MapPinIcon size={20} />}
            text={cita.ubicacion}
        />
      </div>
    </div>


*/
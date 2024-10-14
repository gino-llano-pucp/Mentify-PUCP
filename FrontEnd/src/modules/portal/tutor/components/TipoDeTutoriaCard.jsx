import { AlarmClock, Users, CalendarClock } from 'lucide-react';
import React from 'react';
import CardAttribute from '../../admin/components/CardAttribute';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { useTutoringType } from '../../coordinador/states/TutoringTypeContext';
import GenericCard from '@/modules/core/components/GenericCard';

const TipoDeTutoriaCard = ({ tipoDeTutoria, handleClick }) => {
  const header = <h3 className='w-[255px] h-12 text-base font-semibold break-words'>{tipoDeTutoria.nombre}</h3>;

  const attributes = [
    {
      icon: <AlarmClock size={20} />,
      text: tipoDeTutoria.obligatoriedad,
    },
    {
      icon: <Users size={20} />,
      text: tipoDeTutoria.formato,
    },
    {
      icon: <CalendarClock size={20} />,
      text: tipoDeTutoria.permanencia,
    },
  ];

  return (
    <GenericCard 
      header={header} 
      attributes={attributes} 
      onClick={() => handleClick(tipoDeTutoria)} 
    />
  );
};

export default TipoDeTutoriaCard;
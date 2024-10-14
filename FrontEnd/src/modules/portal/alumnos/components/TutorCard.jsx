import React from 'react';
import { Mail, User, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import GenericCard from '@/modules/core/components/GenericCard';

const TutorCard = ({ tutor, onClick }) => {
  const header = (
    <div className='flex items-center'>
      <Image 
        src={tutor.avatar} 
        alt={tutor.nombres} 
        width={40} 
        height={40} 
        className='w-10 h-10 mr-3 rounded-full' 
      />
      <h3 className='text-base w-[255px] h-12 flex items-center font-semibold break-words'>
        {`${tutor.nombres} ${tutor.primerApellido} ${tutor.segundoApellido}`}
      </h3>
    </div>
  );

  const attributes = [
    {
      icon: <Mail size={20} />,
      text: tutor.email,
    },
    {
      icon: <User size={20} />,
      text: `Código: ${tutor.codigo}`,
    }
  ];

  return (
    <GenericCard
      header={header} 
      attributes={attributes} 
      onClick={() => onClick(tutor)} 
    />
  );
};

export default TutorCard;

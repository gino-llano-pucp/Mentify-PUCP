import CardAttribute from '../../admin/components/CardAttribute';
import React from 'react';
import { Circle, Hash, Library, Mail, Info } from 'lucide-react';
import { useDisclosure } from '@nextui-org/react';
import { ModalSolicitarTutor } from './ModalSolicitarTutor';
import EliminarSolicitud from './EliminarSolicitud';




const TutorAsignadoCard = ({session, tutor, selectTutor, functionSpecified, accessOption, deleteOption, update, page, deleteFunction, pending, sendSolicitud, filtro, setDoRefresh}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleClick = () => {
    if(functionSpecified!==undefined)
      functionSpecified(tutor);
  }
  
  return (
    <div 
      className={ selectTutor ? 'w-[360px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer relative transition-shadow hover:shadow-lg' : 'w-[360px] flex flex-col gap-4 p-4 border rounded-xl'}
      onClick={selectTutor && !sendSolicitud ? handleClick :  onOpen }
    >
      {sendSolicitud && <div className='absolute'>
        <ModalSolicitarTutor isOpen={isOpen} onOpenChange={onOpenChange} tutor={tutor} id_data={tutor.Tutor?(tutor.Tutor.id_usuario):(tutor&&tutor.id_usuario?tutor.id_usuario:(tutor.idTutor?tutor.idTutor:null))} functionSpecified={functionSpecified} session={session} setDoRefresh={setDoRefresh}/>
      </div>}
      
      <div className='flex flex-row items-center justify-between w-full gap-4 card-header'>
      <h3 className='w-[255px] text-lg font-semibold break-words'>{tutor.Tutor?(tutor.Tutor.nombres + ' ' + tutor.Tutor.primerApellido):(tutor&&tutor.nombres? tutor.nombres+ ' ' + tutor.primerApellido:(tutor&&tutor.nombreTutor?tutor.nombreTutor+" "+tutor.primerApellidoTutor:""))}</h3>
      {deleteOption ? 
        <EliminarSolicitud update={update} page={page} idSolicitud={tutor.idSolicitud} deleteFunction={deleteFunction} filtro={filtro} session={session}/>:null
      }
      </div>
      <div className='flex flex-col w-full gap-2'>
      {pending?<CardAttribute icon={<Circle size={20} />} text={"Pendiente"} />:null}
        <CardAttribute icon={<Hash size={20} />} text={tutor.Tutor?(tutor.Tutor.codigo):(tutor&&tutor.codigo?tutor.codigo:(tutor.codigoTutor?tutor.codigoTutor:""))} />
        <CardAttribute icon={<Mail size={20} />} text={tutor.Tutor?(tutor.Tutor.email):(tutor&&tutor.email?tutor.email:(tutor.correo?tutor.correo:""))} />
        <CardAttribute icon={<Library size={20} />} text={tutor.TipoTutoria?tutor.TipoTutoria.nombre:(tutor&&tutor.TipoTutoria?tutor.TipoTutoria:(tutor.nombreTipoTutoria?tutor.nombreTipoTutoria:""))} />
        {tutor.esSolicitado && <CardAttribute icon={<Info size={20} />} text={tutor.esSolicitado} />}
      </div>
    </div>
  );
};

export default TutorAsignadoCard;
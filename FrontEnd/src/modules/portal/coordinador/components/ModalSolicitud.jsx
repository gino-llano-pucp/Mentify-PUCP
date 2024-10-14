import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DateInput,
  Textarea
} from '@nextui-org/react';
import { parseDate } from "@internationalized/date";
import { StudentCard } from './StudentCard';
import { TutorCard } from './TutorCard';
import toast from 'react-hot-toast';

const ModalSolicitud = ({ isOpen, onOpenChange, solicitud, update, page, filtro, session }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [flag, setFlag] = useState(false);
  useEffect(()=>{
    setFlag(false)
  },[isOpen]);

  useEffect(() => {
    if (isOpen && solicitud.motivoRechazo !== null) {
      setRejectionReason(solicitud.motivoRechazo);
    } else {
      setRejectionReason(''); // Reset rejection reason when modal closes
    }
  }, [isOpen, solicitud]);

  const aceptar = async () => {
    try {
      const token = session?.accessToken;
      if (!token) {
        setFlag(false);
        throw new Error('Error validar Token')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/solicitudTutorFijo/responderSolicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "solicitudId": solicitud.idSolicitud,
          "tutorId": solicitud.Tutor.idTutor,
          "aceptada": true,
          "motivoRechazo": null,
          "alumnoId": solicitud.Alumno.idAlumno,
          "tipoTutoriaId": solicitud.TipoTutoria.idTipoTutoria
        })
      });

      if (!response.ok) {
        setFlag(false);
        throw new Error('Error en el fetch')
      }
      update(page,filtro);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const aceptarClick = async () => {
    toast.promise(
      aceptar(),
      {
        loading: 'Aceptando Solicitud...',
        success: 'Solicitud aceptada con éxito',
        error: 'Error al aceptar solicitud'
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    ).then(async (response) => {
      console.log(response);
    }).catch((error) => {
      console.error('Failed to post render request: ', error);
    });
  };

  const rechazar = async () => {
    try {
      const token = session?.accessToken;
      if (!token) {
        setFlag(false);
        throw new Error('Error validar Token')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/solicitudTutorFijo/responderSolicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "solicitudId": solicitud.idSolicitud,
          "tutorId": solicitud.Tutor.idTutor,
          "aceptada": false,
          "motivoRechazo": rejectionReason,
          "alumnoId": solicitud.Alumno.idAlumno,
          "tipoTutoriaId": solicitud.TipoTutoria.idTipoTutoria
        })
      });

      if (!response.ok) {
        setFlag(false);
        throw new Error('Error en el fetch')
      }
      update(page, filtro);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const rechazarClick = async () => {
    toast.promise(
      rechazar(),
      {
        loading: 'Rechazando Solicitud...',
        success: 'Solicitud rechazada con éxito',
        error: 'Error al rechazar solicitud'
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    ).then(async (response) => {
      console.log(response);
    }).catch((error) => {
      console.error('Failed to post render request: ', error);
    });
  };
  
  function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  console.log(solicitud)

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='3xl'
        backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Detalle de Solicitud de Tutor</ModalHeader>
              <ModalBody className='flex justify-center items-center'>
                <div className='flex flex-col gap-4 w-full'>
                  <div className='flex flex-wrap gap-4'>
                    <Input
                      isReadOnly
                      variant="bordered"
                      label="Nombre del tipo de tutoría"
                      value={solicitud.TipoTutoria.nombre}
                      className='w-[300px] mr-12'
                    />
                    <DateInput
                      label='Fecha de la solicitud'
                      isReadOnly
                      variant='bordered'
                      value={parseDate(formatDateToISO(solicitud.fechaSolicitud))}
                      className='w-52'
                    />
                  </div>

                  <div className='flex flex-wrap gap-4 mb-4'>
                    <div className='flex flex-col gap-4'>
                      <h2 className='agregar-facultad-header'>Datos del Alumno</h2>
                      <StudentCard student={solicitud.Alumno} />
                    </div>
                    <div className='flex flex-col gap-4'>
                      <h2 className='agregar-facultad-header'>Datos del Tutor Solicitado</h2>
                      <TutorCard tutor={solicitud.Tutor} />
                    </div>
                  </div>
                </div>
                {solicitud.estadoSolicitud !== 'Aceptado' ?  <div className='flex flex-col w-full'>
                    <Textarea
                      isReadOnly={solicitud.estadoSolicitud !== 'En Espera'}
                      variant="bordered"
                      label="Motivo del rechazo"
                      placeholder='Ingresa el motivo del rechazo'
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="max-w-full"
                      maxLength={250}
                    />
                    <div className='text-right text-sm text-[#b9b9b9]'>
                      {rejectionReason.length} / 250
                    </div>
                </div> : null}
              </ModalBody>
             { solicitud.estadoSolicitud === 'En Espera' ?
               <ModalFooter className='flex justify-center items-center'>
                 <Button
                   className='bg-[#008000] text-white w-full'
                   variant='solid'
                   onClick={
                    ()=>{
                      if(!flag)setFlag(true);
                      else return;
                      aceptarClick()
                    }}
                   isDisabled = {rejectionReason.length !== 0}
                 >
                   Aceptar
                 </Button>
                 <Button 
                   className='bg-[#FF4545] text-white w-full' 
                   variant='solid' 
                   onClick={
                    ()=>{
                    if(!flag)setFlag(true);
                      else return;
                    rechazarClick()
                    }
                  }
                   isDisabled = {rejectionReason.length === 0}
                   >
                   Rechazar
                 </Button>
               </ModalFooter>
             : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ModalSolicitud;

import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@nextui-org/react';
import toast from 'react-hot-toast';

export const ModalSolicitarTutor = ({tutor, isOpen, onOpenChange, id_data, functionSpecified, session, setDoRefresh}) => {
  const [flag, setFlag] = useState(false);
  useEffect(()=>{
    setFlag(false);
  },[isOpen]);

  const registerSolicitud = async (tutor) =>{
    toast
        .promise(
          functionSpecified(session.accessToken, tutor),  
          {
            loading: 'Registrando Solicitud...',
            success: 'Solicitud registrada con éxito',
            error: 'Error al registrar solicitud'
          },
          {
            style: {
              minWidth: '250px'
            }
          }
        )
        .then(async (response) => {
          console.log("aqui")
          setFlag(false)
          setDoRefresh(true)
          onOpenChange(false);
          console.log(response);
        })
        .catch((error) => {
          console.error('Failed to post render request: ', error);
          setFlag(false)
    });
    
    
      
  }

  
  return (
    <div>
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange} 
          backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Realizar Solicitud</ModalHeader>
                <ModalBody className='flex justify-center items-center'>
                  <p className='text-center'>¿Estás seguro que deseas solicitar al tutor?</p>
                </ModalBody>
                <ModalFooter className='flex justify-center items-center'>
                  <Button
                    className='bg-[#008000] text-white w-full'
                    variant='solid'
                    onPress={()=>{
                    if(flag)return
                    else setFlag(true);
                    
                    /*if(!flag)setFlag(true)
                    else return;*/
                    //onOpenChange(false);
                    
                    registerSolicitud(tutor);
                  }}
                  >
                    Si
                  </Button>
                  <Button className='bg-[#FF4545] text-white w-full' variant='solid' onPress={onClose}>
                    No
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </div>
  )
}

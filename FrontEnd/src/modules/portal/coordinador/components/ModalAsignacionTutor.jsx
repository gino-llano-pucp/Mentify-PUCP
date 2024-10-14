import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@nextui-org/react';

export const ModalAsignacionTutor = ({isOpen, onOpenChange, id_data, session}) => {

  return (
    <div>
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange} 
          backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Realizar Asignación</ModalHeader>
                <ModalBody className='flex justify-center items-center'>
                  <p className='text-center'>¿Estás seguro que deseas asignar al tutor?</p>
                </ModalBody>
                <ModalFooter className='flex justify-center items-center'>
                  <Button
                    className='bg-[#008000] text-white w-full'
                    variant='solid'
                    onClick={onClose}
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

'use client';
import {
  Button,
  useDisclosure,
	Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from '@nextui-org/react';
import React from 'react';
import { Trash } from 'lucide-react';

const EliminarSolicitud = ({update, page ,idSolicitud ,deleteFunction, filtro, session}) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const eliminarSolicitud = () =>{
    deleteFunction(idSolicitud);
    onOpenChange(false)
    //update(page,filtro)
  }
  


  
  return (
    <div>
    <Tooltip content='Eliminar Solicitud' color='danger' closeDelay={100}>
    <Button
			isIconOnly
			color='default'
			variant='light'
			aria-label='Eliminar programa'
			onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
        <Trash size={16} />
    </Button>
    </Tooltip>
		<Modal backdrop="blur" isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
      }}
      className='w-[350px]'
    >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Eliminar Solicitud</ModalHeader>
              <ModalBody className='flex justify-center items-center'>
                <p>¿Estás seguro que deseas eliminar la solicitud?</p>
              </ModalBody>
              <ModalFooter className='flex justify-center items-center'>
                <Button
                  className='bg-[#008000] text-white w-full'
                  variant='solid'
                  onClick={eliminarSolicitud}
                >
                  Si
                </Button>
                <Button 
                className='bg-[#FF4545] text-white w-full' 
                variant='solid' 
                onClick={() => {
                  onOpenChange(false);
                }}>
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        
    </div>
    
  );
};

export default EliminarSolicitud;
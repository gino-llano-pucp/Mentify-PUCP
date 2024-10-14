import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip } from '@nextui-org/react';
import { CheckCircle } from 'lucide-react';
import React from 'react';


export default function ModalActivarUnidadAcademica({ title, activeData, isOpen, onOpen, onOpenChange }) {
    return (
      <>
        <Tooltip content='Activar Unidad Académica' color='primary' closeDelay={100}>
            <Button isIconOnly color='default' variant='light' aria-label='Eliminar usuario' onPress={onOpen}>
            <CheckCircle size={16} />
            </Button>
        </Tooltip>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} className='w-[350px]'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
                        <ModalBody className='flex justify-center items-center'>
                            <p>¿Estás seguro que deseas activarlo?</p>
                        </ModalBody>
                        <ModalFooter className='flex justify-center items-center'>
                            <Button className='bg-[#008000] text-white w-full' variant='solid' onPress={activeData}>
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
      </>  
    );
}
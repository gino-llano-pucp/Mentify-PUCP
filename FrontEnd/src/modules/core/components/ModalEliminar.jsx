import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip
} from '@nextui-org/react';
import { Trash } from 'lucide-react';
 
export default function ModalEliminar({ title, deleteData, isOpen, onOpen, onOpenChange}) {
  return (
    <div onClick={(event) => {event.stopPropagation();}}>
      <Tooltip content={title} color='danger' closeDelay={100}>
        <Button isIconOnly color='default' variant='light' aria-label='Eliminar usuario' onPress={onOpen}>
          <Trash size={16} />
        </Button>
      </Tooltip>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} className='w-[350px]'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
              <ModalBody className='flex justify-center items-center'>
                <p>¿Estás seguro que deseas eliminarlo?</p>
              </ModalBody>
              <ModalFooter className='flex justify-center items-center'>
                <Button
                  className='bg-[#008000] text-white w-full'
                  variant='solid'
                  onClick={deleteData}
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
  );
}

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
import { CheckCircle } from 'lucide-react';

export default function ModalActivar({ title, activeData, isOpen, onOpen, onOpenChange }) {
  return (
    <>
      <Tooltip content={title} color='primary' closeDelay={100}>
        <Button isIconOnly color='default' variant='light' aria-label={title} onPress={onOpen}>
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
                <Button className='bg-[#008000] text-white w-full' variant='solid' onClick={activeData}>
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

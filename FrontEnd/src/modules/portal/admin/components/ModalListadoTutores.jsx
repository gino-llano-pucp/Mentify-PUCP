import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import React, { useState } from 'react';
import ListadoTutoresDisponibles from './ListadoTutoresDisponibles';
import { SearchIcon } from 'lucide-react';

const ModalListadoTutores = ({ onSelect }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState({ id: '', code: '', name: '', primerApellido: '', segundoApellido: '', email: '' });

  const handleAssign = () => {
    onSelect(selected);
    onOpenChange(false);
  };

  const handleClear = () => {
    setSelected({ id: '', code: '', name: '', primerApellido: '', segundoApellido: '', email: '' });
    onOpenChange(false);
  };

  return (
    <>
      <Button 
        color='primary' 
        variant='shadow' 
        onPress={onOpen} 
        className='flex items-center justify-center'
        startContent={<SearchIcon size={20} />}>
        Buscar
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside' size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Buscar tutor</ModalHeader>
              <ModalBody>
                <ListadoTutoresDisponibles
                  onSelect={(user) =>
                    setSelected({
                      id: user.id,
                      code: user.code,
                      name: user.name,
                      primerApellido: user.primerApellido,
                      segundoApellido: user.segundoApellido,
                      email: user.email
                    })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color='default' variant='bordered' onPress={handleClear}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={handleAssign}>
                  Asignar como coordinador
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalListadoTutores;

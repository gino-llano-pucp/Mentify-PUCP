import GeneralDropdown from '@/modules/portal/tutor/components/GeneralDropdown';
import { Button, DatePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';

const ModalEdicionDisponibilidad = ({
  isOpen,
  onOpenChange,
  frecuencias,
  frecuencia,
  setFrecuencia,
  fechaLimite,
  setFechaLimite,
  manejarFrecuenciaDisponibilidad,
  handleEliminarDisponibilidad
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
      <ModalContent>
        <ModalHeader className='flex justify-center'>
          Edición de bloque de disponibilidad
        </ModalHeader>
        <ModalBody className='flex flex-row items-center justify-center gap-[16px] w-full'>
          <GeneralDropdown options={frecuencias} selectedKeys={frecuencia} setSelectedKeys={setFrecuencia} />
          <DatePicker isDisabled={([...frecuencia.values()]).includes("único")} value={fechaLimite} onChange={setFechaLimite} label="Hasta" className="w-1/2" />
        </ModalBody>
        <ModalFooter>
          <div className='flex flex-col items-center justify-center w-full gap-4 md:flex-row'>
            <Button
              variant='solid'
              onPress={manejarFrecuenciaDisponibilidad}
              className='w-1/2 h-9 bg-[#008000] text-white'
            >
              Aceptar
            </Button>
            <Button
              variant='solid'
              onPress={handleEliminarDisponibilidad}
              className='w-1/2 h-9 bg-[#FF4545] text-white'
            >
              Eliminar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEdicionDisponibilidad;

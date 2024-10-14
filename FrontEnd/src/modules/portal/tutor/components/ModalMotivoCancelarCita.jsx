import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea} from "@nextui-org/react";
import { Trash } from "lucide-react";
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CircleX } from 'lucide-react';

export default function ModalMotivoCancelarCita({handleEliminarCita, setPopOverHidden}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [input, setInput] = useState("");

  function handleOpen() {
    onOpen();
    setPopOverHidden(true);
  }

  function handleClose(onClose) {
    
      onClose();
      setPopOverHidden(false);
      
  }
  let flag = false;

  useEffect(() => {
    flag = false;
  }, []);

  return (
    <>
      <Button onPress={handleOpen} isIconOnly color='default' variant='light' aria-label='Eliminar cita' >
        <Trash className='w-5 h-5 text-gray-800' />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row justify-between align-center w-full">
                <span>Cancelar una cita</span>
                <CircleX size={20} className="cursor-pointer" onClick={() => handleClose(onClose)} />
              </ModalHeader>
              <ModalBody>
                <Textarea
                  label="Motivo de cancelación"
                  placeholder="Ingrese el motivo por el que desea cancelar la cita"
                  className="w-full"
                  value={input}
                  onValueChange={setInput}
                />
              </ModalBody>
              <ModalFooter className="flex flex-row justify-center w-full">
                <Button onPress={() => {
                  if(!flag) flag = true;
                  else return;
                  handleEliminarCita(input);}} className='bg-[#FF4545] text-white w-1/2'>
                  Cancelar cita
                </Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

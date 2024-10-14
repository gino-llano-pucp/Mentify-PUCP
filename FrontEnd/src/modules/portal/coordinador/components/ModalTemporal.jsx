import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { History } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

export default function ModalTemporal({session}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const decoded = jwtDecode(session.accessToken);

    const reiniciarTemporal = async () => {
      try {
        const token = session?.accessToken;
        console.log('sess: ', session);
        if (!token) {
          throw new Error('Error validar Token')
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/reiniciar-temporales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            "idCoor": decoded.id
          })
        });
        onOpenChange(false);
        if (!response.ok) {
          throw new Error('Error en el fetch')
        } 
      } catch (error) {
        return error
      }
    };
  
    const reiniciarTemporalClick = async () => {
      toast.promise(
        reiniciarTemporal(),
        {
          loading: 'Reiniciando Temporales...',
          success: 'Temporales reiniciados con éxito',
          error: 'Error al reiniciar temporales'
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
  
    return (
      <div>
        <Button
        color='primary'
        variant='shadow'
        className='flex items-center justify-center'
        startContent={<History size={20} />}
        onPress={onOpen}
      >
        Reiniciar Temporales
      </Button>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} className='w-[350px]'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Reiniciar Temporales</ModalHeader>
                <ModalBody className='flex justify-center items-center'>
                  <p className='text-center'>¿Estás seguro que deseas reiniciar a los temporales?</p>
                </ModalBody>
                <ModalFooter className='flex justify-center items-center'>
                  <Button
                    className='bg-[#008000] text-white w-full'
                    variant='solid'
                    onClick={reiniciarTemporalClick}
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

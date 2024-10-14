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
import fetchAPI from '@/modules/core/services/apiService';
import { useUnidades } from '../../states/UnidadContext';


const DeleteUnidadAcademica = ({ unidad, update, page, session, eliminar_carga=false,filtro }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { removeUnidad } = useUnidades();

  const deleteCargaData = () => {
    removeUnidad(unidad.id_unidad_academica);
    onOpenChange(false);
  };


  const deleteData = async () => {
    if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
    }

    const payload = {
      id_unidad_academica: unidad.id_unidad_academica,
    };

    const result = await fetchAPI({
      endpoint: '/unidadAcademica/delete',
      method: 'POST',
      token: session.accessToken, // Ensure the token is correctly passed here
      payload: payload,
      successMessage: 'Unidad Académica eliminada con éxito',
      errorMessage: 'Error al eliminar Unidad Académica',
      showToast: true,
    });

    if (result) {
      update(page,filtro);
      onOpenChange(false);
    }
  };

  return (
    <div>
      <Tooltip content='Eliminar Unidad Académica' color='danger' closeDelay={100}>
      <Button
        isIconOnly
        color='default'
        variant='light'
        aria-label='Eliminar Unidad Académica'
        onClick={onOpen}
      >
        <Trash size={16} />
      </Button>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className='w-[350px]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Eliminar Unidad Académica</ModalHeader>
              <ModalBody className='flex justify-center items-center'>
                <p>¿Estás seguro que deseas eliminarlo?</p>
              </ModalBody>
              <ModalFooter className='flex justify-center items-center'>
                <Button
                  className='bg-[#008000] text-white w-full'
                  variant='solid'
                  onPress={() => {
                    if (eliminar_carga === false) {
                      deleteData();
                    } else {
                      deleteCargaData();
                    }
                    onClose();
                  }}
                >
                  Si
                </Button>
                <Button
                  className='bg-[#FF4545] text-white w-full'
                  variant='solid'
                  onPress={() => {
                    onOpenChange(false);
                  }}
                >
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

export default DeleteUnidadAcademica;

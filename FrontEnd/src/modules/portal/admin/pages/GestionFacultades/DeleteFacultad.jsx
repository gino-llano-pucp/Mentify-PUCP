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
import React, { useEffect } from 'react';
import { Trash } from 'lucide-react';
import fetchAPI from '@/modules/core/services/apiService';
import toast from 'react-hot-toast';

const DeleteFacultad = ({facultad, setDelete, update, page, session}) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let flag = false;
  const deleteData = async () => {
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        console.log('No token available');
        return;
      }
			const payload = {
				"id": String(facultad.id),
				"nombre": facultad.nombre
			}
			console.log(payload)

      /*const result = await fetchAPI({
        endpoint: '/facultad/eliminar/',
        token: session.accessToken,
        method: 'DELETE',
        payload: payload,
        successMessage: 'Facultad eliminada con éxito',
        errorMessage: 'Error al eliminar facultad'
      });*/

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/facultad/eliminar/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await result.json();

      if (result.ok) {
        onOpenChange(false);
        update(page)
      } else{
        flag = false;
        console.log(data)
        throw new Error(data.error.message);
      }

    } catch (error) {
      flag = false;
      console.error('Error submitting form:', error);
      throw new Error(error);
    }
    setDelete(false);
  };

  const handleClick = async () => {
    toast
      .promise(
        deleteData(),
        {
          loading: 'Eliminando Facultad...',
          success: 'Facultad eliminada con éxito',
          error: (err) => `${err.message}`
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      )
      .catch((error) => {
        console.error('Failed to post render request: ', error);
      });
  };
  

  useEffect(() => {
    flag = false;
  } , [isOpen]);

  
  return (
    <div onClick={(event) => {event.stopPropagation();}}>
      <Tooltip content='Eliminar facultad' size='md' color='danger' closeDelay={100}>
        <Button
          isIconOnly
          color='default'
          variant='light'
          aria-label='Eliminar programa'
          onClick={(e) => {
            e.stopPropagation();
            setDelete(true);
            onOpen();
          }}
        >
            <Trash size={16} />
        </Button>
      </Tooltip>
      <Modal backdrop="blur" isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setDelete(false);
        }}
        className='w-[350px]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Eliminar Facultad</ModalHeader>
              <ModalBody className='flex justify-center items-center'>
                <p>¿Estás seguro que deseas eliminarlo?</p>
              </ModalBody>
              <ModalFooter className='flex justify-center items-center'>
                <Button
                  className='bg-[#008000] text-white w-full'
                  variant='solid'
                  onClick={() => {
                    if(!flag) flag = true;
                    else return;
                    handleClick();
                  }}
                >
                  Si
                </Button>
                <Button 
                className='bg-[#FF4545] text-white w-full' 
                variant='solid' 
                onPress={() => {
                  onOpenChange(false);
                  setDelete(false);
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

export default DeleteFacultad;
'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import DatosUnidadAcademica from '../../components/DatosUnidadAcademica';
import validator from 'validator';
import { set } from 'lodash';

const EditUnidadAcademica = ({ unidad, update, page, session, filtro }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [unidadData, setUnidadData] = useState({
    nombre: unidad.nombre,
    siglas: unidad.siglas,
    correoDeContacto: unidad.correoDeContacto
  });
  const [isAcronymInvalid, setAcronymInvalid] = useState(false);
  const [isNameInvalid, setNameInvalid] = useState(false);
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if(isOpen){
      setUnidadData({
        nombre: unidad.nombre,
        siglas: unidad.siglas,
        correoDeContacto: unidad.correoDeContacto
      })
      setAcronymInvalid(false);
      setNameInvalid(false);
      setEmailInvalid(false);
      setFlag(false);
    }
  }, [isOpen]);

  const clearFields = () => {
    setUnidadData({
      nombre: '',
      siglas: '',
      correoDeContacto: ''
    });
  };

  function clearAllInvalidFields() {
    clearAcronym();
    clearName();
    clearEmail();
    clearFields();
  }

  const clearAcronym = () => {
    setUnidadData((prev) => ({ ...prev, siglas: '' }));
    setAcronymInvalid(false);
  };
  const clearName = () => {
    setUnidadData((prev) => ({ ...prev, nombre: '' }));
    setNameInvalid(false);
  };
  const clearEmail = () => {
    setUnidadData((prev) => ({ ...prev, correoDeContacto: '' }));
    setEmailInvalid(false);
  };

  function capitalizeWords(str) {
    const words = str.split(' ');
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(' ');
  }


  const control = { ignore: ' ' };

  const submitForm = async () => {

    let acronym = false, name = false, email = false;

    // Updated validation logic for siglas
    if (unidadData.siglas.length === 0 || !validator.isAlpha(unidadData.siglas)) {
      setAcronymInvalid(true);
      acronym = true;
    } else {
      setAcronymInvalid(false);
    }

    if (unidadData.nombre.length === 0 || !validator.isAlpha(unidadData.nombre, 'es-ES', control)) {
      setNameInvalid(true);
      name = true;
    } else {
      setNameInvalid(false);
    }

    if (unidadData.correoDeContacto.length === 0 || !validator.isEmail(unidadData.correoDeContacto)) {
      setEmailInvalid(true);
      email = true;
    } else {
      setEmailInvalid(false);
    }

    if (acronym || name || email) {
      setFlag(false)
      throw new Error("Campos no validos");
    }

    


    try{
      const token = session?.accessToken;
      if (!token) {
        console.log('No token available');
        return;
      }
  
      const payload = {
        id_unidad_academica: unidad.id_unidad_academica,
        nombre: unidadData.nombre,
        siglas: unidadData.siglas,
        correoDeContacto: unidadData.correoDeContacto,
      };
      console.log("Se va a editar la unidad",unidad,"a ",unidadData);
      
      unidadData.nombre = capitalizeWords(unidadData.nombre);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/unidadAcademica/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok){
        if(response.status === 409){
            console.log(data.error);
            setFlag(false)
            throw new Error(data.error);
        }else{
          setFlag(false)
          throw new Error(data.error || 'Error inesperado al editar Unidad Académica');
        }
      }

      update(page,filtro);
      clearAllInvalidFields();
      onOpenChange(false);
    }catch(error){
      setFlag(false)
      throw error;
    }
  };

  const handleClick = async () => {
    toast .promise(
        submitForm(),
        {
            loading: 'Editando Unidad Académica...',
            success: 'Unidad Académica editada con éxito',
            error: (error) => error.message
        },
        {   
            style: {
                minWidth: '250px'
            }
        }
        )
        .then(async (response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error('Failed to post render request: ', error);
    });
};


  return (
    <div>
      <Tooltip content='Editar Unidad Académica' color='foreground'closeDelay={100}>
      <Button 
        isIconOnly 
        color='default' 
        variant='light' 
        aria-label='Editar Unidad Académica'
        onPress={onOpen}
      >
        <Pencil size={16} />
      </Button>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size='2xl'
        onClose={clearAllInvalidFields}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Editar Unidad Académica</ModalHeader>
              <ModalBody>
                <DatosUnidadAcademica
                  unidadData={unidadData}
                  setUnidadData={setUnidadData}
                  clearAcronym={clearAcronym}
                  clearName={clearName}
                  clearEmail={clearEmail}
                  isAcronymInvalid={isAcronymInvalid}
                  setAcronymInvalid={setAcronymInvalid}
                  isNameInvalid={isNameInvalid}
                  setNameInvalid={setNameInvalid}
                  isEmailInvalid={isEmailInvalid}
                  setEmailInvalid={setEmailInvalid}
                />
              </ModalBody>
              <ModalFooter className='flex flex-col w-full gap-4 md:flex-row justify-center items-center'>
                <Button
                  variant='solid'
                  className='w-1/2 h-9 bg-[#008000] text-white'
                  onPress={() => {
                    if(!flag){
                      setFlag(true)
                    }else
                      return;
                    handleClick();
                  }}
                >
                  Guardar
                </Button>
                <Button
                  variant='solid'
                  className='w-1/2 h-9 bg-[#FF4545] text-white'
                  onPress={() => {
                    onClose();
                  }}
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditUnidadAcademica;

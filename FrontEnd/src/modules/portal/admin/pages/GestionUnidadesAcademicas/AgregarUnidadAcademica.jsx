import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import toast from 'react-hot-toast';
import validator from 'validator';
import DatosUnidadAcademica from '../../components/DatosUnidadAcademica';
import { CirclePlus } from 'lucide-react';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';

const AgregarUnidadAcademica = ({ update, page, session }) => {
  const [unidadData, setUnidadData] = useState({
    nombre: '',
    siglas: '',
    correoDeContacto: ''
  });

  const [isAcronymInvalid, setAcronymInvalid] = useState(false);
  const [isNameInvalid, setNameInvalid] = useState(false);
  const [isEmailInvalid, setEmailInvalid] = useState(false);

  const { setActiveComponent } = useActiveComponent();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setFlag(false);
  }, [isOpen]);

  const clearAcronym = () => {
    setAcronymInvalid(false);
    setUnidadData((prev) => ({ ...prev, siglas: '' }));
  };

  const clearName = () => {
    setNameInvalid(false);
    setUnidadData((prev) => ({ ...prev, nombre: '' }));
  };

  const clearEmail = () => {
    setEmailInvalid(false);
    setUnidadData((prev) => ({ ...prev, correoDeContacto: '' }));
  };

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

    try {
      const token = session?.accessToken;
      if (!token) {
        console.log('No token available'); 
        return;
      }
      unidadData.nombre = capitalizeWords(unidadData.nombre);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/unidadAcademica/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: unidadData.nombre,
          siglas: unidadData.siglas,
          correoDeContacto: unidadData.correoDeContacto
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if(data.error === 'Ya existe una unidad académica con el mismo nombre, siglas o correo de contacto.'){
          setFlag(false);
          throw new Error(data.error);
        }
        toast.error(`Error al agregar la unidad académica: ${data.message}`);
        return;
      }
      update(page);
      clearAllInvalidFields();
      onOpenChange(false);

      //toast.success(`Unidad Académica agregada con éxito: ${data.message}`);
    } catch (error) {
      throw error
    }
  };

  const handleClick = async () => {
    toast
      .promise(
        submitForm(),
        {
          loading: 'Agregando Unidad Académica...',
          success: 'Unidad Académica agregado con éxito',
          error: (error) => error.message === 'Ya existe una unidad académica con el mismo nombre, siglas o correo de contacto.' ? `Error al agregar la unidad Académica: ${error.message}` : 'Error al agregar Unidad Académica'
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
      <Button
        color='primary'
        variant='shadow'
        className='flex items-center justify-center w-40'
        startContent={<CirclePlus size={20} />}
        onPress={onOpen}
      >
        Agregar
      </Button>
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
              <ModalHeader className='flex flex-col gap-1'>Agregar Unidad Académica</ModalHeader>
              <ModalBody>
                <DatosUnidadAcademica
                  unidadData={unidadData}
                  setUnidadData={setUnidadData}
                  mode={'add'}
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
                  className='w-40 h-9 bg-[#008000] text-white'
                  onClick={()=>{
                  if(!flag){
                    setFlag(true)
                  }else
                    return;
                    handleClick()
                  }}
                >
                  Agregar
                </Button>
                <Button
                  variant='solid'
                  className='w-40 h-9 bg-[#FF4545] text-white'
                  onPress={onClose}
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

export default AgregarUnidadAcademica;

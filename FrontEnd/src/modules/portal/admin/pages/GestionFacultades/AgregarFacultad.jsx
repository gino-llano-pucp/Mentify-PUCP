import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DatosFacultad from '../../components/DatosFacultad';
import DatosCoordinador from '../../components/DatosCoordinador';
import { CirclePlus } from 'lucide-react';
import fetchAPI from '@/modules/core/services/apiService';

const AgregarFacultad = ({update, page, session}) => {
  const [coordinatorData, setCoordinatorData] = useState({
    id: '',
    code: '',
    name: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    isSelectedFromSearch: false
  });
  const [facultadNombre, setFacultadNombre] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setFlag(false);
  }, [isOpen]);

  const validateFacultadNombre = (facultadNombre) => {
    if (!facultadNombre) {
      setErrors({ facultadNombre: 'Por favor, ingrese el nombre de la facultad' });
      return false;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(facultadNombre)) {
      setErrors({ facultadNombre: 'El nombre de la facultad no puede incluir números' });
      return false;
    }
    return true;
  };

  const validateCoordinadorName = (name) => {
    if (!name) {
      setErrors({ name: 'Por favor, ingrese el nombre del coordinador' });
      return false;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(name)) {
      setErrors({ name: 'El nombre del coordinador no puede incluir números' });
      return false;
    }
    return true;
  };

  const validateCoordinadorPrimerApellido = (apellidos) => {
    if (!apellidos) {
      setErrors({ primerApellido: 'Por favor, ingrese el primer apellido del coordinador' });
      return false;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(apellidos)) {
      setErrors({ primerApellido: 'El primer apellido del coordinador no pueden incluir números' });
      return false;
    }
    return true;
  };

  const validateCoordinadorSegundoApellido = (apellidos) => {
    /*
    if (!apellidos) {
      setErrors({ segundoApellido: 'Por favor, ingrese el segundo apellido del coordinador' });
      return false;
    }
    */
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(apellidos)) {
      setErrors({ segundoApellido: 'El segundo apellido del coordinador no pueden incluir números' });
      return false;
    }
    return true;
  };

  const validateCoordinadorCode = (code) => {
    if (!code) {
      setErrors({ code: 'Por favor, ingrese el código del coordinador' });
      return false;
    }
    if (code.length === 0 || code.length > 8) {
      setErrors({
        code: 'El código ingresado debe ser menor o igual a 8 caracteres'
      });
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setErrors({ email: 'Por favor, ingrese el correo electrónico del coordinador' });
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: 'El correo electrónico es inválido' });
      return false;
    }
    return true;
  };

  const clearCoordinadorFields = () => {
    setCoordinatorData({ id: '', code: '', name: '', primerApellido: '', segundoApellido: '', email: '', isSelectedFromSearch: false });
  };

  // Función para limpiar los campos de facultad y coordinador
  const clearFields = () => {
    setCoordinatorData({ id: '', code: '', name: '', primerApellido: '', segundoApellido: '', email: '', isSelectedFromSearch: false });
    setFacultadNombre('');
    setErrors({});
  };

  const submitForm = async () => {
    let errors = {};
    const fieldsToValidate = [
      { field: 'facultadNombre', validate: validateFacultadNombre, message: 'Por favor, ingrese un nombre de facultad válido.' },
      { field: 'name', validate: validateCoordinadorName, message: 'Por favor, ingrese el nombre del coordinador.' },
      { field: 'primerApellido', validate: validateCoordinadorPrimerApellido, message: 'Por favor, ingrese el primer apellido del coordinador.' },
      { field: 'segundoApellido', validate: validateCoordinadorSegundoApellido, message: 'Por favor, ingrese el segundo apellido del coordinador.' },
      { field: 'code', validate: validateCoordinadorCode, message: 'El código ingresado debe ser menor o igual a 8 caracteres' },
      { field: 'email', validate: validateEmail, message: 'Por favor, ingrese un correo electrónico válido.' }
    ];
  
    fieldsToValidate.forEach(({ field, validate, message }) => {
      if (!validate(field === 'facultadNombre' ? facultadNombre : coordinatorData[field])) {
        errors[field] = message;
      }
    });
    console.log(errors)
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setFlag(false)
      throw new Error("Campos no válidos");
    }
  
    setErrors({});
  
    const payload = {
      id: coordinatorData.id,
      code: coordinatorData.code,
      name: coordinatorData.name,
      primerApellido: coordinatorData.primerApellido,
      segundoApellido: coordinatorData.segundoApellido,
      email: coordinatorData.email,
      isSelectedFromSearch: coordinatorData.isSelectedFromSearch,
      facultadNombre: facultadNombre
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/facultad/registrar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    /*const response = await fetchAPI({
      endpoint: '/facultad/registrar/',
      method: 'POST',
      payload: payload,
      token: session?.accessToken,
      successMessage: 'Facultad y coordinador agregados con éxito',
      errorMessage: 'Error al agregar facultad y coordinador',
      showToast: false // Manejamos los toasts manualmente en handleClick
    });*/
    const data = await response.json();

    console.log(data)
    console.log(response)
    if (response.ok) {
      update(page);
      clearFields();
      onOpenChange(false);
      return response;
    } else {
      setFlag(false)
      
      if(data && data.error && data.error.message){
        throw new Error(data.error.message);
      }
      throw new Error('Error al agregar facultad y coordinador');
    }
  };
  
  const handleClick = async () => {
    
    toast.promise(
      submitForm(),
      {
        loading: 'Agregando Facultad...',
        success: 'Facultad agregada con éxito',
        error: (err) => `${err.message}`
      },
      {
        style: {
          minWidth: '250px'
        }
      }
    )
    .then((response) => {
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
        //onClick={() => setActiveComponentById('agregarFacultad', 'Agregar facultad')}
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
        size='4xl'
        onClose={clearFields}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Agregar Facultad</ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-4'>
                  <DatosFacultad 
                    facultadNombre={facultadNombre} 
                    setFacultadNombre={setFacultadNombre} 
                    mode={'add'}
                    errors={errors} 
                    setErrors={setErrors}
                  />
                  <DatosCoordinador
                    coordinatorData={coordinatorData}
                    setCoordinatorData={setCoordinatorData}
                    clearFields={clearCoordinadorFields}
                    mode={'add'}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>
              </ModalBody>
              <ModalFooter className='flex flex-col w-full gap-4 md:flex-row justify-center items-center'>
                <Button
                  variant='solid'
                  className='w-1/2 h-9 bg-[#008000] text-white'
                  onClick={()=>{
                    if(!flag){
                      setFlag(true)
                    }else
                      return;
                    handleClick()}}
                >
                  Agregar
                </Button>
                <Button
                  variant='solid'
                  className='w-1/2 h-9 bg-[#FF4545] text-white'
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

export default AgregarFacultad;

'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import { CirclePlus } from 'lucide-react';
import { set } from 'lodash';

const AddTutor = ({update, page, filtro, session}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tutor, setTutor] = useState({
    codigo: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
  });

  useEffect(() => {
    setTutor({
      codigo: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      email: '',
    });
    setCodeIsInvalid(false);
    setNameIsInvalid(false);
    setLastName1IsInvalid(false);
    setLastName2IsInvalid(false);
    setEmailIsInvalid(false);
    setFlag(false);
  }, [isOpen]);

  const [isCodeInvalid, setCodeIsInvalid] = useState(false); // Estado para validar el campo de código
  const [isNameInvalid, setNameIsInvalid] = useState(false);
  const [isLastName1Invalid, setLastName1IsInvalid] = useState(false);
  const [isLastName2Invalid, setLastName2IsInvalid] = useState(false);
  const [isEmailInvalid, setEmailIsInvalid] = useState(false);
  const [flag, setFlag] = useState(false);
  //const [isSelected, setIsSelected] = useState(false);
  

  
  const clearCode = () => {
    setCodeIsInvalid(false);
    setTutor((prev) => ({ ...prev, codigo: '' }));
  };
  const clearName = () => {
    setNameIsInvalid(false);
    setTutor((prev) => ({ ...prev, nombres: '' }));
  };
  const clearPrimerApellidos = () => {
    setLastName1IsInvalid(false);
    setTutor((prev) => ({ ...prev, primerApellido: '' }));
  };
  const clearSegundoApellidos = () => {
    setLastName2IsInvalid(false);
    setTutor((prev) => ({ ...prev, segundoApellido: '' }));
  };
  const clearEmail = () => {
    setEmailIsInvalid(false);
    setTutor((prev) => ({ ...prev, email: '' }));
  };

  function clearAllInvalidFields() {
    clearCode();
    clearName();
    clearPrimerApellidos();
    clearSegundoApellidos();
    clearEmail();
  }

  // Función para limpiar los campos
  const clearFields = () => {
    setTutor({ codigo: '', nombres: '', primerApellido: '', segundoApellido: '', email: '' });
  };

  // Manejadores para cambiar cada campo
  const handleChange = (field, value, setIsValid=null) => {
    if(setIsValid) setIsValid(false);
    setTutor((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  const control = { ignore: ' ' };

  function capitalizeWords(str) {
    // Divide la cadena en palabras
    const words = str.split(' ');

    // Capitaliza la primera letra de cada palabra
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Une las palabras capitalizadas en una sola cadena
    return capitalizedWords.join(' ');
  }

  const submitForm = async () => {
    console.log('aqui');
    let code = false,
      name = false,
      last1 = false,
      last2 = false,
      email = false;
    if (tutor.codigo.length === 0 || tutor.codigo.length > 8) {
      setCodeIsInvalid(true); // Establecer como inválido si el código no tiene 8 dígitos
      code = true;
    } else {
      setCodeIsInvalid(false); // Establecer como válido si el código tiene 8 dígitos
    }
    if (tutor.nombres.length === 0 || !validator.isAlpha(tutor.nombres, 'es-ES', control)) {
      setNameIsInvalid(true);
      name = true;
    } else {
      setNameIsInvalid(false);
    }
    if (tutor.primerApellido.length === 0 || !validator.isAlpha(tutor.primerApellido, 'es-ES', control)) {
      setLastName1IsInvalid(true);
      last1 = true;
    } else {
      setLastName1IsInvalid(false);
    }
    if (tutor.segundoApellido.length > 0 && !validator.isAlpha(tutor.segundoApellido, 'es-ES', control)) {
      setLastName2IsInvalid(true);
      last2 = true;
    } else {
      setLastName2IsInvalid(false);
    }
    if (tutor.email.length !== 0 && validator.isEmail(tutor.email)) {
      setEmailIsInvalid(false);
    } else {
      setEmailIsInvalid(true);
      email = true;
    }
    if (code || name || last1 || last2 || email) {
      setFlag(false);
      throw new Error("Campos no validos");
    }
    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error("Token Invalido");
      }
      tutor.nombres = capitalizeWords(tutor.nombres);
      tutor.primerApellido = capitalizeWords(tutor.primerApellido);
      tutor.segundoApellido = capitalizeWords(tutor.segundoApellido);
      tutor.idRol = 3;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idRol: tutor.idRol,
          codigo: tutor.codigo,
          nombres: tutor.nombres,
          primerApellido: tutor.primerApellido,
          segundoApellido: tutor.segundoApellido,
          email: tutor.email,
          //rolAdicional: isSelected
        })
      });

      const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta
      console.log(data)
      if (!response.ok) {
        setFlag(false)
        if (data.message === 'Usuario already exists'){
          throw new Error("El tutor ya existe");
        }
        throw new Error("Error en el fetch");
      }

      clearFields(); // Limpiar los campos después de un envío exitoso

      update(page,filtro)
      clearAllInvalidFields();
      onOpenChange(false);
    } catch (error) {
      setFlag(false)
      throw error
    }
  };

  const handleClick = async () => {
    toast
      .promise(
        submitForm(),
        {
          loading: 'Agregando Tutor...',
          success: 'Tutor agregado con éxito',
          error: (error) => error.message === 'El tutor ya existe' ? `Error al agregar Tutor: ${error.message}` : 'Error al agregar Tutor'
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
      {isOpen && (
        <Modal 
          backdrop="blur"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          size='4xl'
          onClose={clearAllInvalidFields}
        >
          <ModalContent>
          {(onClose) => (
            <>
            <ModalHeader className='flex flex-col gap-1'>Agregar Tutor</ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-4'></div>
            <h2 className='agregar-facultad-header'>Datos del Tutor</h2>
            <div className='flex flex-wrap w-full gap-4'>
              <div className='h-16'>
                <Input
                  isClearable
                  isRequired
                  onClear={clearCode}
                  className='w-[415px]'
                  type='text'
                  label='Código'
                  placeholder='Ingresa el código del tutor'
                  value={tutor.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value, setCodeIsInvalid)}
                  isInvalid={isCodeInvalid}
                  errorMessage='El código ingresado debe ser menor o igual a 8 caracteres'
                />
              </div>
              <div className='h-16'>
                <Input
                  isClearable
                  isRequired
                  onClear={clearName}
                  className='w-[415px]'
                  type='text'
                  label='Nombre'
                  placeholder='Ingresa el nombre del tutor'
                  value={tutor.nombres}
                  onChange={(e) => handleChange('nombres', e.target.value, setNameIsInvalid)}
                  isInvalid={isNameInvalid}
                  errorMessage='Debe ingresar el nombre del tutor, no debe contener dígitos'
                />
            </div>
              <div className='h-16'>
                <Input
                  isClearable
                  isRequired
                  onClear={clearPrimerApellidos}
                  className='w-[415px]'
                  type='text'
                  label='Primer Apellido'
                  placeholder='Ingresa el primer apellido del tutor'
                  value={tutor.primerApellido}
                  onChange={(e) => handleChange('primerApellido', e.target.value, setLastName1IsInvalid)}
                  isInvalid={isLastName1Invalid}
                  errorMessage='El campo no debe estar vacío y no debe contener dígitos'
                />
              </div>
              <div className='h-16'>
                <Input
                  isClearable
                  onClear={clearSegundoApellidos}
                  className='w-[415px]'
                  type='text'
                  label='Segundo Apellido'
                  placeholder='Ingresa el segundo apellido del tutor'
                  value={tutor.segundoApellido}
                  onChange={(e) => handleChange('segundoApellido', e.target.value, setLastName2IsInvalid)}
                  isInvalid={isLastName2Invalid}
                  errorMessage='El campo no debe contener dígitos'
                />
              </div>
              <div className='h-16'>
                <Input
                  isClearable
                  isRequired
                  onClear={clearEmail}
                  className='w-[415px]'
                  type='text'
                  label='Correo electrónico'
                  placeholder='Ingresa el correo electrónico del tutor'
                  value={tutor.email}
                  onChange={(e) => handleChange('email', e.target.value, setEmailIsInvalid)}
                  isInvalid={isEmailInvalid}
                  errorMessage='El correo ingresado no es válido'
                />
              </div>
              {/*<div className='h-16 ml-1 flex items-center'>
                <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                  Es Alumno
                </Checkbox>
              </div>*/}
          </div>
        </ModalBody>
        <ModalFooter className='flex justify-center items-center'>
              <Button className='bg-[#008000] text-white w-40 h-9' variant='solid' onClick={() => {
                  if(!flag){
                    setFlag(true);
                  } else return;
                  handleClick();
                }}>
                Agregar
              </Button>
              <Button className='bg-[#FF4545] text-white w-40 h-9' variant='solid' onPress={() => {onClose()}}>
                Cancelar
              </Button>
            </ModalFooter>
            </>
            )}
            </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default AddTutor;

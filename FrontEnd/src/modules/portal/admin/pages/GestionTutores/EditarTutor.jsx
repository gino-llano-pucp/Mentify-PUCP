'use Client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import validator from 'validator';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';

const EditarTutor = ({user, update, page, filtro, session}) => {
  // Antes de modificar, guardar los datos de user en una variable para no perderlos en la modificacion
  // Cuando haga Clear
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tutor, setTutor] = useState({
    idRol: 3,
    codigo: user.codigo,
    nombres: user.nombres,
    primerApellido: user.primerApellido,
    segundoApellido: user.segundoApellido,
    email: user.email
  });

  useEffect(() => {
    setTutor({
      idRol: 3,
      codigo: user.codigo,
      nombres: user.nombres,
      primerApellido: user.primerApellido,
      segundoApellido: user.segundoApellido,
      email: user.email
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
  //const [isSelected, setIsSelected] = useState(user.roles.length >= 2 ? true : false);
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

  // Función para limpiar los campos
  const clearFields = () => {
    setTutor({ codigo: user.codigo,
      nombres: user.nombres,
      primerApellido: user.primerApellido,
      segundoApellido: user.segundoApellido,
      email: user.email });
  };

  // Manejadores para cambiar cada campo
  const handleChange = (field, value, setIsValid = null) => {
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
    if(user.codigo === tutor.codigo && user.nombres === tutor.nombres &&
      user.primerApellido === tutor.primerApellido && user.segundoApellido === tutor.segundoApellido &&
      user.email === tutor.email){
     onOpenChange(false);
     return;
   }

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${user.id}`, {
        method: 'PUT',
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
      const data = await response.json();
      if (!response.ok) {
        setFlag(false)
        throw new Error(data.message || "Error al actualizar tutor");
      }

      clearFields(); // Limpiar los campos después de un envío exitoso
      update(page,filtro)
      onOpenChange(false);
      
    } catch (error) {
      setFlag(false)
      throw new Error(error.message || "Error al actualizar tutor");
    }
  };

  const handleClick = async () => {
    toast
      .promise(
        submitForm(),
        {
          loading: 'Actualizando Tutor...',
          success: 'Tutor actualizado con éxito',
          error: error => `${error}`
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

  return (
    <div className='flex flex-col w-full gap-24'>
      <Tooltip content='Editar Tutor' color='foreground' closeDelay={100}>
        <Button
          isIconOnly
          color='default'
          variant='light'
          aria-label='Editar tutor'
          onClick={onOpen}
        >
          <Pencil size={16} />
        </Button>
      </Tooltip>
      { isOpen && (
        <Modal
          backdrop="blur"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          size='4xl'
        >
          <ModalContent>
          {(onClose) => (
              <>
            <ModalHeader className='flex flex-col gap-1'>Editar Tutor</ModalHeader>
        <ModalBody>
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
              <Button className='bg-[#008000] text-white w-full' variant='solid' onClick={() => {
                  if(!flag){
                    setFlag(true);
                  } else return;
                  handleClick();
                }}>
                Guardar
              </Button>
              <Button className='bg-[#FF4545] text-white w-full' variant='solid' onPress={() => {onClose()}}>
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

export default EditarTutor;

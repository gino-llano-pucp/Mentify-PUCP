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
  Checkbox
} from '@nextui-org/react';
import FacultadDropdown from '../../components/FacultadDropdown';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import ProgramaFacultadDropdown from '../../components/ProgramaFacultadDropdown';
import { useFacultad } from '../../states/FacultadContext';
import { CirclePlus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { usePrograma } from '../../states/ProgramaContext';
import { set } from 'lodash';

const AddStudent = ({update, page, filtro, session}) => {
  const [student, setStudent] = useState({
    codigo: '',
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    fid_facultad: '',
    fid_programa: ''
  });
  const [isCodeInvalid, setCodeIsInvalid] = useState(false); // Estado para validar el campo de código
  const [isNameInvalid, setNameIsInvalid] = useState(false);
  const [isLastName1Invalid, setLastName1IsInvalid] = useState(false);
  const [isLastName2Invalid, setLastName2IsInvalid] = useState(false);
  const [isEmailInvalid, setEmailIsInvalid] = useState(false);
  const [isFacultadSelected, setIsFacultadSelected] = useState(false);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { facultad } = useFacultad();
  const { Programa } = usePrograma();
  const [programa, setPrograma] = useState(null);
  const { clearFields } = useFacultad();
  const [isSelected, setIsSelected] = useState(false);
  const decoded = jwtDecode(session.accessToken);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setStudent({
      codigo: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      email: '',
      fid_facultad: '',
      fid_programa: ''
    })
    setCodeIsInvalid(false);
    setNameIsInvalid(false);
    setLastName1IsInvalid(false);
    setLastName2IsInvalid(false);
    setEmailIsInvalid(false);
    setIsFacultadSelected(false);
    setIsProgramSelected(false);
    setFlag(false);
    setIsSelected(false);
  }, [isOpen]);

  const clearCode = () => {
    setCodeIsInvalid(false);
    setStudent((prev) => ({ ...prev, codigo: '' }));
  };
  const clearName = () => {
    setNameIsInvalid(false);
    setStudent((prev) => ({ ...prev, nombres: '' }));
  };
  const clearPrimerApellidos = () => {
    setLastName1IsInvalid(false);
    setStudent((prev) => ({ ...prev, primerApellido: '' }));
  };
  const clearSegundoApellidos = () => {
    setLastName2IsInvalid(false);
    setStudent((prev) => ({ ...prev, segundoApellido: '' }));
  };
  const clearEmail = () => {
    setEmailIsInvalid(false);
    setStudent((prev) => ({ ...prev, email: '' }));
  };
  

  function clearAllInvalidFields() {
    clearCode();
    clearName();
    clearPrimerApellidos();
    clearSegundoApellidos();
    clearEmail();
    if(!decoded.roles.some(role => role.includes('Coordinador'))) clearFields();
  }

  // Manejadores para cambiar cada campo
  const handleChange = (field, value, setIsValid = null) => {
    if(setIsValid) setIsValid(false);
    setStudent((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleChangeFacultad = (field, value, setIsValid) => {
    setPrograma(null);
    if (field !== 'fid_facultad') {
      setIsValid(false);
    }
    
  };

  const handleChangePrograma = (field, value, setIsValid) => {
    setPrograma(value)
    if (field !== 'fid_programa') {
      setIsValid(false);
    }
    
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



  // Poner los parametros en el async nos va a permitir  que los flags puedan estar actualizados
  const submitForm = async () => {
    console.log(programa)
    console.log(Programa)
    let code = false,
      name = false,
      last1 = false,
      last2 = false,
      email = false;
    //verificar que el codigo de alumno tenga 8 digitos
    if (student.codigo.length === 0 || student.codigo.length > 8) {
      setCodeIsInvalid(true); // Establecer como inválido si el código no tiene 8 dígitos
      code = true;
    } else {
      setCodeIsInvalid(false); // Establecer como válido si el código tiene 8 dígitos
    }

    //verificar que el nombre de alumno tenga caracteres y no tenga digitos
    if (student.nombres.length === 0 || !validator.isAlpha(student.nombres, 'es-ES', control)) {
      setNameIsInvalid(true);
      name = true;
    } else {
      setNameIsInvalid(false);
    }
    if (student.primerApellido.length === 0 || !validator.isAlpha(student.primerApellido, 'es-ES', control)) {
      setLastName1IsInvalid(true);
      last1 = true;
    } else {
      setLastName1IsInvalid(false);
    }
    if (
      student.segundoApellido.length > 0 &&
      !validator.isAlpha(student.segundoApellido, 'es-ES', control)
    ) {
      setLastName2IsInvalid(true);
      last2 = true;
    } else {
      setLastName2IsInvalid(false);
    }
    if (student.email.length !== 0 && validator.isEmail(student.email)) {
      setEmailIsInvalid(false);
    } else {
      setEmailIsInvalid(true);
      email = true;
    }
    if (facultad === null) {
      setFlag(false);
      toast.error('Debe elegir una facultad');
    }
    if ((Programa===true || Programa===null ) && programa === null) {
      setFlag(false);
      toast.error('Debe elegir una programa');
    }
    
    // Verificar si alguno de los campos es inválido
    if (code || name || last1 || last2 || email || (facultad===null) || ((Programa===true || Programa===null ) && programa === null) ) {
      setFlag(false);
      throw new Error("Campos no validos");
    }

    try {
      const token = session?.accessToken;
      console.log('sess: ', session);
      if (!token) {
        throw new Error("Token Invalido");
      }
      student.idRol = 4;
      student.fid_facultad = facultad;
      student.fid_programa = (Programa===true || Programa===null) ? programa : Programa;
      student.nombres = capitalizeWords(student.nombres);
      student.primerApellido = capitalizeWords(student.primerApellido);
      student.segundoApellido = capitalizeWords(student.segundoApellido);
      console.log(student);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idRol: student.idRol,
          codigo: student.codigo,
          nombres: student.nombres,
          primerApellido: student.primerApellido,
          segundoApellido: student.segundoApellido,
          email: student.email,
          fid_programa: student.fid_programa,
          fid_facultad: student.fid_facultad,
          rolAdicional: isSelected
        })
      });

      const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta

      if (!response.ok) {
        setFlag(false)
        if (data.message === 'Usuario already exists'){
          throw new Error("El alumno ya existe");
        }
        throw new Error("Error en fetch");
      }
      update(page,filtro)
      clearAllInvalidFields();
      onOpenChange(false);
    } catch (error) {
      setFlag(false)
      throw error;
    }
  };

  const handleClick = async () => {
    toast
      .promise(
        submitForm(),
        {
          loading: 'Agregando Alumno...',
          success: 'Alumno agregado con éxito',
          error: (error) => error.message === 'El alumno ya existe' ? `Error al agregar Alumno: ${error.message}` : 'Error al agregar Alumno'
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
            <ModalHeader className='flex flex-col gap-1'>Agregar Alumno</ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-4'>
                <h2 className='agregar-facultad-header'>Datos del Alumno</h2>
                <div className='flex flex-wrap w-full gap-4'>
                  {/*codigo de alumno*/}
                  <div className='h-16'>
                    <Input
                      isClearable
                      isRequired
                      onClear={clearCode}
                      className='w-[415px]'
                      type='text'
                      label='Código'
                      placeholder='Ingresa el código del alumno'
                      value={student.codigo}
                      onChange={(e) => handleChange('codigo', e.target.value, setCodeIsInvalid)}
                      isInvalid={isCodeInvalid}
                      errorMessage='El código ingresado debe ser menor o igual a 8 caracteres'
                    />
                  </div>

                  {/*nombre de alumno*/}
                  <div className='h-16'>
                    <Input
                      isClearable
                      isRequired
                      onClear={clearName}
                      className='w-[415px]'
                      type='text'
                      label='Nombre'
                      placeholder='Ingresa el nombre del alumno'
                      value={student.nombres}
                      onChange={(e) => handleChange('nombres', e.target.value, setNameIsInvalid)}
                      isInvalid={isNameInvalid}
                      errorMessage='Debe ingresar el nombre del alumno, no debe contener dígitos'
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
                      placeholder='Ingresa el primer apellido del alumno'
                      value={student.primerApellido}
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
                      placeholder='Ingresa el segundo apellido del alumno'
                      value={student.segundoApellido}
                      onChange={(e) => handleChange('segundoApellido', e.target.value, setLastName2IsInvalid)}
                      isInvalid={isLastName2Invalid}
                      errorMessage='El campo no debe contener dígitos'
                    />
                  </div>

                  <div className='h-20'>
                    <Input
                      isClearable
                      isRequired
                      onClear={clearEmail}
                      className='w-[415px]'
                      type='text'
                      label='Correo electrónico'
                      placeholder='Ingresa el correo electrónico del alumno'
                      value={student.email}
                      onChange={(e) => handleChange('email', e.target.value, setEmailIsInvalid)}
                      isInvalid={isEmailInvalid}
                      errorMessage='El correo ingresado no es válido'
                    />
                  </div>

                  <div className='h-16 ml-1 flex items-center'>
                    <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                      Es Tutor
                    </Checkbox>
                  </div>
                </div>
                { console.log(decoded.roles) }
                { !decoded.roles.some(role => role.includes('Coordinador de Programa')) &&
                <div className='flex flex-wrap w-full gap-4'>
                { !decoded.roles.some(role => role.includes('Coordinador')) &&
                  <div className='w-[415px] flex flex-col gap-4'>
                    <h2 className='agregar-facultad-header'>Datos de la Facultad</h2>
                    <FacultadDropdown
                      handleChange={handleChangeFacultad}
                      isFacultadSelected={isFacultadSelected}
                      setIsFacultadSelected={setIsFacultadSelected}
                      session={session}
                    />
                  </div>
                }
                  <div className='w-[415px] flex flex-col gap-4'>
                    <h2 className='agregar-facultad-header'>Datos del Programa</h2>
                    <ProgramaFacultadDropdown
                      handleChange={handleChangePrograma}
                      setIsProgramSelected={setIsProgramSelected}
                      session={session}
                    />
                  </div>
                </div>
                }
              </div>
            </ModalBody>
            <ModalFooter className='flex flex-col w-full gap-4 md:flex-row justify-center items-center'>
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

export default AddStudent;

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
  Tooltip,
  Checkbox
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import FacultadDropdown from '../../components/FacultadDropdown';
import ProgramaFacultadDropdown from '../../components/ProgramaFacultadDropdown';
import validator from 'validator';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { useFacultad } from '../../states/FacultadContext';
import { jwtDecode } from 'jwt-decode';
import { set } from 'lodash';

function EditStudent({user, update, page, filtro, session}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [student, setStudent] = useState({
    idRol: 4,
    codigo: user.codigo,
    nombres: user.nombres,
    primerApellido: user.primerApellido,
    segundoApellido: user.segundoApellido,
    email: user.email,
    fid_facultad: user.fid_facultad,
    fid_programa: user.fid_programa
  });

  const decoded = jwtDecode(session.accessToken);
  
  const [isCodeInvalid, setCodeIsInvalid] = useState(false); // Estado para validar el campo de código
  const [isNameInvalid, setNameIsInvalid] = useState(false);
  const [isLastName1Invalid, setLastName1IsInvalid] = useState(false);
  const [isLastName2Invalid, setLastName2IsInvalid] = useState(false);
  const [isEmailInvalid, setEmailIsInvalid] = useState(false);
  const [isFacultadSelected, setIsFacultadSelected] = useState(false);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const [isSelected, setIsSelected] = useState(user.roles.length >= 2 ? true : false);
  const { facultad, addFacultad } = useFacultad();
  const [programa, setPrograma] = useState(user.fid_programa === null ? 0 : user.fid_programa);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if(isOpen){
      setStudent({
        idRol: 4,
        codigo: user.codigo,
        nombres: user.nombres,
        primerApellido: user.primerApellido,
        segundoApellido: user.segundoApellido,
        email: user.email,
        fid_facultad: user.fid_facultad,
        fid_programa: user.fid_programa
      });
      setIsSelected(user.roles.length >= 2 ? true : false);
      setPrograma(user.fid_programa === null ? 0 : user.fid_programa);
      setIsFacultadSelected(false);
      setIsProgramSelected(false);
      setCodeIsInvalid(false);
      setNameIsInvalid(false);
      setLastName1IsInvalid(false);
      setLastName2IsInvalid(false);
      setEmailIsInvalid(false);
      setFlag(false);
    }else if(decoded.roles.some(role => role.includes('Administrador'))){
      addFacultad(null);
    }
    
  }, [isOpen]);

  console.log(user.fid_programa);
  console.log(programa)

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

  const clearFields = () => {
    setStudent({
      codigo: user.codigo,
      nombres: user.nombres,
      primerApellido: user.primerApellido,
      segundoApellido: user.segundoApellido,
      email: user.email,
      fid_facultad: user.fid_facultad,
      fid_programa: user.fid_programa
    });
  };

  const handleChange = (field, value, setIsValid = null) => {
    if(setIsValid) setIsValid(false);
    setStudent((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleChangeFacultad = (field, value, setIsValid) => {
    if(user.fid_programa === null && value === user.fid_facultad){
      setPrograma(0);
    } else{
      setPrograma(null);
    }
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

  const submitForm = async () => {
      if (user.codigo === student.codigo && user.nombres === student.nombres &&
          user.primerApellido === student.primerApellido && user.segundoApellido === student.segundoApellido &&
          user.email === student.email && user.fid_facultad === facultad &&
          (user.fid_programa === null ? 0 : user.fid_programa) === programa && (user.roles.length >= 2 ? true : false) === isSelected) {
          onOpenChange(false);
          return;
      }
      console.log(user)
      console.log(student)
      console.log(programa)
      let code = false,
          name = false,
          last1 = false,
          last2 = false,
          email = false;
      if (student.codigo.length === 0 || student.codigo.length > 8){
          setCodeIsInvalid(true); // Establecer como inválido si el código no tiene 8 dígitos
          code = true;
      } else {
          setCodeIsInvalid(false); // Establecer como válido si el código tiene 8 dígitos
      }
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
      if (student.segundoApellido.length > 0 && !validator.isAlpha(student.segundoApellido, 'es-ES', control)) {
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
      if (programa === null) {
        setFlag(false);
        toast.error('Debe elegir una programa');
      }

      if (code || name || last1 || last2 || email || programa === null) {
        setFlag(false);
          throw new Error("Campos no válidos");
      }
      //updated.setUpdated(student.id_usuario);
      try {
          const token = session?.accessToken;
          console.log('sess: ', session);
          if (!token) {
              throw new Error("Token inválido");
          }
          student.fid_facultad = facultad;
          student.fid_programa = programa;
          student.nombres = capitalizeWords(student.nombres);
          student.primerApellido = capitalizeWords(student.primerApellido);
          student.segundoApellido = capitalizeWords(student.segundoApellido);
          console.log(student);
          console.log(user)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${user.id}`, {
              method: 'PUT',
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
          const data = await response.json();
          console.log(data)
          if (!response.ok) {
            setFlag(false)
            throw new Error(data.message || "Error al actualizar alumno");
          }
          update(page, filtro);
          onOpenChange(false);
      } catch (error) {
        setFlag(false)
        throw new Error(error.message || "Error al actualizar alumno");
      }
  };

  const handleClick = async () => {
      toast
          .promise(
              submitForm(),
              {
                  loading: 'Actualizando Alumno...',
                  success: 'Alumno actualizado con éxito',
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
    <div>
      <Tooltip content='Editar Alumno' color='foreground' closeDelay={100}>
        <Button
          isIconOnly
          color='default'
          variant='light'
          aria-label='Editar alumno'
          onClick={onOpen}
        >
          <Pencil size={16} />
        </Button>
      </Tooltip>
      {isOpen && (
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
                <ModalHeader className='flex flex-col gap-1'>Editar Alumno</ModalHeader>
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
                    { !decoded.roles.some(role => role.includes('Coordinador de Programa')) &&
                      <div className='flex flex-wrap w-full gap-4'>
                      { !decoded.roles.some(role => role.includes('Coordinador')) &&
                        <div className='w-[415px] flex flex-col gap-4'>
                          <h2 className='agregar-facultad-header'>Datos de la Facultad</h2>
                          <FacultadDropdown
                            student={student}
                            handleChange={handleChangeFacultad}
                            isFacultadSelected={isFacultadSelected}
                            setIsFacultadSelected={setIsFacultadSelected}
                            idFacultad={user.fid_facultad}
                            session={session}
                          />
                        </div>}
                        <div className='w-[415px] flex flex-col gap-4'>
                          <h2 className='agregar-facultad-header'>Datos del Programa</h2>
                          <ProgramaFacultadDropdown
                            handleChange={handleChangePrograma}
                            setIsProgramSelected={setIsProgramSelected}
                            idPrograma={user.fid_programa}
                            idFacultad={user.fid_facultad}
                            session={session}
                          />
                        </div>
                      </div>
                    }
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
                  <Button className='bg-[#FF4545] text-white w-full' variant='solid' onPress={() => {onClose();}}>
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
}

export default EditStudent;

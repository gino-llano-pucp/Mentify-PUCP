'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { CirclePlus } from 'lucide-react';
import DatosPrograma from '../../components/DatosPrograma';
import DatosCoordinador from '../../components/DatosCoordinador';
import { useFacultadCoordinador } from '../../states/FacultadCoordinadorContext';

const AddPrograma = ({update,page, session}) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [coordinatorData, setCoordinatorData] = useState({
    id: '',
    code: '',
    name: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    isSelectedFromSearch: false
  });
  const [programaNombre, setProgramaNombre] = useState(''); // Estado para almacenar el nombre de la facultad
  
  const { goBackToPenultimate } = useActiveComponent();
  const [errors, setErrors] = useState({});

  const { facultadId } = useFacultadCoordinador();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setFlag(false);
  }, [isOpen]);

  const validateProgramaNombre = (programaNombre) => {
    console.log(programaNombre);
    if (!programaNombre) {
      setErrors({ programaNombre: 'Por favor, ingrese el nombre del programa' });
      return false;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(programaNombre)) {
      setErrors({ programaNombre: 'El nombre del programa no puede incluir números' });
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

    // Agregar ceros al inicio si el código tiene menos de 8 caracteres
    if (code.length < 8) {
      code = code.padStart(8, '0');
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
    setProgramaNombre('');
    setErrors({});
  };

  const handleGoBack = () => {
    clearFields();
    goBackToPenultimate();
  };

  const submitForm = async () => {
    let errors = {}
    const fieldsToValidate = [
      { field: 'programaNombre', validate: validateProgramaNombre, message: 'Por favor, ingrese un nombre de programa válido.' },
      { field: 'name', validate: validateCoordinadorName, message: 'Por favor, ingrese el nombre del coordinador.' },
      { field: 'primerApellido', validate: validateCoordinadorPrimerApellido, message: 'Por favor, ingrese el primer apellido del coordinador.' },
      { field: 'segundoApellido', validate: validateCoordinadorSegundoApellido, message: 'Por favor, ingrese el segundo apellido del coordinador.' },
      { field: 'code', validate: validateCoordinadorCode, message: 'El código ingresado debe ser menor o igual a 8 caracteres' },
      { field: 'email', validate: validateEmail, message: 'Por favor, ingrese un correo electrónico válido.' }
    ];
    /*
    if (!validateProgramaNombre(programaNombre)) {
      errors.programaNombre = 'Por favor, ingrese un nombre de programa válido.';
      progName=true;
    }
    if (!validateCoordinadorName(coordinatorData.name)) {
      errors.name = 'Por favor, ingrese el nombre del coordinador.';
      name=true;
    }
    if (!validateCoordinadorPrimerApellido(coordinatorData.primerApellido)) {
      errors.primerApellido = 'Por favor, ingrese el primer apellido del coordinador.';
      primer_apellido = true;
    }
    if (!validateCoordinadorSegundoApellido(coordinatorData.segundoApellido)) {
      errors.segundoApellido = 'Por favor, ingrese el segundo apellido del coordinador.';
      segundo_apellido = true;
    }
    if (!validateCoordinadorCode(coordinatorData.code)) {
      errors.code = 'El código ingresado debe ser de 8 caracteres.';
      code = true;
      
    }
    if (!validateEmail(coordinatorData.email)) {
      errors.email = 'Por favor, ingrese un correo electrónico válido.';
      email = true;
    }
    */
    fieldsToValidate.forEach(({ field, validate, message }) => {
      if (!validate(field === 'programaNombre' ? programaNombre : coordinatorData[field])) {
        errors[field] = message;
      }
    });


    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      console.log("ERROR");
      setFlag(false)
      throw new Error("Campos no validos");
      return;
    }

    console.log(typeof facultadId);
    console.log('FACULTAD ID: ' + facultadId);
    console.log('PROGRAMA NOMBRE: ' + programaNombre);

    const token = session?.accessToken;
    console.log('sess: ', session);
    if (!token) {
      console.log('No token available');
      return;
    }
    console.log(token)

    const payload = {
      idFacultad: facultadId.toString(),
      code: coordinatorData.code,
      name: coordinatorData.name,
      apellidos: coordinatorData.primerApellido + ' ' + coordinatorData.segundoApellido,
      email: coordinatorData.email,
      isSelectedFromSearch: coordinatorData.isSelectedFromSearch,
      programaNombre: programaNombre // Asegúrate de capturar el valor del input de la facultad
    }
    console.log(payload)
    try {
      const response =  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/programa/registrar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta

      if (!response.ok) {
        setFlag(false)
        throw new Error(`${data.error}`);
      }
      update(page)
      clearFields();
      onOpenChange(false);

      update(page);
      clearFields();
      onOpenChange(false);
      // Usa los datos parseados donde los necesites, ya no necesitas llamar de nuevo a `response.json()`
      /* toast.success(`Programa y coordinador agregados con éxito: ${data.message}`); */

      /* clearFields();  // Limpiar los campos después de un envío exitoso
            goBackToPenultimate(); */
/*       handleGoBack(); */
    } catch (error) {
      setFlag(false)
      console.error('Error submitting form:', error);
      throw new Error(error)
      /* toast.error(`Error al agregar programa y coordinador: ${error.message}`); */
    }
  };
  
  const handleClick = async () => {
    
    toast
      .promise(
        submitForm(),
        {
          loading: 'Agregando Programa...',
          success: 'Programa agregado con éxito',
          error: (err) => `${err.message}`
        },
        {
          style: {
            minWidth: '250px'
          }
        }
      )
      .catch((error) => {
        setFlag(false)
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
        size='4xl'
        onClose={clearFields}
      >
        <ModalContent>
        {(onClose) => (
            <>
          <ModalHeader className='flex flex-col gap-1'>Agregar Programa</ModalHeader>
          <ModalBody>
            <div className='flex flex-col gap-4'>
              <DatosPrograma 
                programaNombre={programaNombre} 
                setProgramaNombre={setProgramaNombre} 
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
              onPress={()=>{
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

export default AddPrograma;
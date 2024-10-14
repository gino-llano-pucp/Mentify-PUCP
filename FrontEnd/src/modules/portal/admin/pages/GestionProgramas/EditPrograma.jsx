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
  Tooltip
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import DatosPrograma from '../../components/DatosPrograma';
import DatosCoordinador from '../../components/DatosCoordinador';
import fetchAPI from '@/modules/core/services/apiService';
import { useFacultadCoordinador } from '../../states/FacultadCoordinadorContext';

const EditPrograma = ({initialCoordinadorData, initialNombrePrograma, programaId, update, page, session}) => {
  const [errors, setErrors] = useState({});
  const [editable, setEditable] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCoordinatorChanged, setIsCoordinatorChanged] = useState({
    changed: false,
    changes: {}
  });
	const [isFacultyChanged, setIsFacultyChanged] = useState({
    changed: false,
    oldValue: '',
    newValue: ''
  });

  const [coordinatorData, setCoordinatorData] = useState({
    id: initialCoordinadorData.id_usuario,
    code: initialCoordinadorData.codigo,
    name: initialCoordinadorData.nombres,
    primerApellido: initialCoordinadorData.primerApellido,
    segundoApellido: initialCoordinadorData.segundoApellido,
    email: initialCoordinadorData.email,
    isSelectedFromSearch: false
  });
  const [programaNombre, setProgramaNombre] = useState(initialNombrePrograma);
  const [flag, setFlag] = useState(false);
  const {  clearFields } = useFacultadCoordinador();


  useEffect(() => {
    console.log("COORD DATA: ", initialCoordinadorData);
    setCoordinatorData({
      id: initialCoordinadorData.id_usuario,
      code: initialCoordinadorData.codigo,
      name: initialCoordinadorData.nombres,
      primerApellido: initialCoordinadorData.primerApellido,
      segundoApellido: initialCoordinadorData.segundoApellido,
      email: initialCoordinadorData.email,
      isSelectedFromSearch: false
    })
    setProgramaNombre(initialNombrePrograma)
    setErrors({})
    setFlag(false);
  }, [isOpen])

  const clearCoordinadorFields = () => {
    setCoordinatorData({ id: '', code: '', name: '', primerApellido: '', segundoApellido: '', email: '', isSelectedFromSearch: false });
  };

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

  const submitForm = async () => {
    console.log('faculty: ', isFacultyChanged);
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
    // Log para cambios de facultad
    if (isFacultyChanged.changed) {
      console.log(
        `El nombre de la facultad cambió de '${isFacultyChanged.oldValue}' a '${isFacultyChanged.newValue}'`
      );
      if (!isFacultyChanged.newValue) {
        toast.error('La facultad debe tener un nombre.');
        return; // Detener la ejecución si falta algún campo
      }
    }

    // Log para cambios de coordinador
    if (isCoordinatorChanged.changed) {
      console.log('Cambios en el coordinador:', isCoordinatorChanged.changes);
    }

    // Validar que todos los campos necesarios del coordinador están presentes
    if (
      isCoordinatorChanged.changed &&
      (!coordinatorData.code || !coordinatorData.name || !coordinatorData.primerApellido || !coordinatorData.email)
    ) {
      toast.error('Todos los campos del coordinador deben estar llenos');
      return; // Detener la ejecución si falta algún campo
    }

    let errors = {}

    if (!validateProgramaNombre(programaNombre)) {
      errors.programaNombre = 'Por favor, ingrese un nombre de programa válido.';
    }
    if (!validateCoordinadorName(coordinatorData.name)) {
      errors.name = 'Por favor, ingrese el nombre del coordinador.';
    }
    if (!validateCoordinadorPrimerApellido(coordinatorData.primerApellido)) {
      errors.primerApellido = 'Por favor, ingrese el primer apellido del coordinador.';
    }
    if (!validateCoordinadorSegundoApellido(coordinatorData.segundoApellido)) {
      errors.segundoApellido = 'Por favor, ingrese el segundo apellido del coordinador.';
    }
    if (!validateCoordinadorCode(coordinatorData.code)) {
      errors.code = 'El código ingresado debe ser de 8 caracteres.';
    }
    if (!validateEmail(coordinatorData.email)) {
      errors.email = 'Por favor, ingrese un correo electrónico válido.';
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
      //return;
      setFlag(false);
      throw new Error("Campos no validos");
    }
    
    
    const token = session?.accessToken;
    console.log('sess: ', session);
    if (!token) {
      console.log('No token available');
      return;
    }

    const payload = {
      programaId: programaId,
      programaNombre: programaNombre,
      coordinatorData: {
        id: coordinatorData.id,
        codigo: coordinatorData.code,
        nombres: coordinatorData.name,
        primerApellido: coordinatorData.primerApellido,
        segundoApellido: coordinatorData.segundoApellido,
        email: coordinatorData.email,
      }/* isCoordinatorChanged.changed ? {
        id: coordinatorData.id,
        codigo: coordinatorData.code,
        nombres: coordinatorData.name,
        primerApellido: coordinatorData.primerApellido,
        segundoApellido: coordinatorData.segundoApellido,
        email: coordinatorData.email,
      } : undefined */
    };
    console.log("EDITAR PROGRAMA: ", payload);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/programa/editar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (response.ok) {

/*       const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/${coordinatorData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idRol: 3,
          codigo: coordinatorData.code,
          nombres: coordinatorData.name,
          primerApellido: coordinatorData.primerApellido,
          segundoApellido: coordinatorData.segundoApellido,
          email: coordinatorData.email,
          rolAdicional: true
        })
      });
      const data2 = await response2.json();
      console.log(data2);

      if (response2.ok) */
        
        /* toast.success(`Programa y coordinador editados con éxito: ${data.message}`); */
        update(page);
        /* if (isFacultyChanged.changed) */
        setProgramaNombre(payload.programaNombre);
        setCoordinatorData(payload.coordinatorData);
        onOpenChange(false);
    }
    else {
        setFlag(false);
        throw new Error(data.error? data.error : "Error al actualizar alumno");
    }
      /* toast.error(`Error al editar programa y coordinador: ${data.message}`); */
  };




  
  const handleClick = async () => {
    
    toast.promise(
      submitForm(),
      {
        loading: 'Editando Programa...',
        success: 'Programa editado con éxito',
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
      <Tooltip content='Editar programa' color='foreground' closeDelay={100}>
        <Button 
        isIconOnly 
        color='default' 
        variant='light' 
        aria-label='Editar programa'
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
        size='4xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Editar Programa</ModalHeader>
              <ModalBody >
                <div className='flex flex-col gap-4'>
                  <DatosPrograma
                    programaNombre={programaNombre}
                    setProgramaNombre={setProgramaNombre}
                    initialFacultyName={programaNombre}
                    setIsFacultyChanged={setIsFacultyChanged}
                    mode={'edit'}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <DatosCoordinador
                    coordinatorData={coordinatorData}
                    setCoordinatorData={setCoordinatorData}
                    editable={editable}
                    setEditable={setEditable}
                    mode={'edit'}
                    setIsCoordinatorChanged={setIsCoordinatorChanged}
                    clearFields={clearCoordinadorFields}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>
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
                    onOpenChange(false);
                    setEditable(false);
                    /* clearFields(); */
                    setIsCoordinatorChanged({
                      changed: false,
                      changes: {}
                    })
                    setIsFacultyChanged({
                      changed: false,
                      oldValue: '',
                      newValue: ''
                    })
                    setProgramaNombre(initialNombrePrograma)
                    setErrors({});
                    setCoordinatorData({
                      id: initialCoordinadorData.id_usuario,
                      code: initialCoordinadorData.codigo,
                      name: initialCoordinadorData.nombres,
                      primerApellido: initialCoordinadorData.primerApellido,
                      segundoApellido: initialCoordinadorData.segundoApellido,
                      email: initialCoordinadorData.email,
                      isSelectedFromSearch: false
                    })
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

export default EditPrograma;
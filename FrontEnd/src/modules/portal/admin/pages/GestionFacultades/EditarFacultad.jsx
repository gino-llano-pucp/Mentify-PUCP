import React, { useEffect, useState } from 'react';
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
import { useFacultadCoordinador } from '../../states/FacultadCoordinadorContext';
import DatosFacultad from '../../components/DatosFacultad';
import DatosCoordinador from '../../components/DatosCoordinador';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import fetchAPI from '@/modules/core/services/apiService';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';

const EditarFacultad = ({initialCoordinadorData, initialNombreFacultad, facultadId, setEdit, page, update, session}) => {
  const [errors, setErrors] = useState({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {  clearFields } = useFacultadCoordinador();
  const { goBackToPenultimate } = useActiveComponent();
  const [editable, setEditable] = useState(false);
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
  const [facultadNombre, setFacultadNombre] = useState(initialNombreFacultad);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setFacultadNombre(initialNombreFacultad);
    setCoordinatorData(
      {
        id: initialCoordinadorData.id_usuario,
        code: initialCoordinadorData.codigo,
        name: initialCoordinadorData.nombres,
        primerApellido: initialCoordinadorData.primerApellido,
        segundoApellido: initialCoordinadorData.segundoApellido,
        email: initialCoordinadorData.email,
        isSelectedFromSearch: false
      }
    )
    setErrors({})
    setFlag(false);
  }, [isOpen]);

  const validateFacultadNombre = (facultadNombre) => {
    console.log(facultadNombre);
    if (!facultadNombre) {
      setErrors({ facultadNombre: 'Por favor, ingrese el nombre del programa' });
      return false;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(facultadNombre)) {
      setErrors({ facultadNombre: 'El nombre del programa no puede incluir números' });
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


  const submitForm = async () => {
    let errors = {}
    console.log('faculty: ', isFacultyChanged);
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

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      console.log("ERROR");
      //return;
      setFlag(false)
      throw new Error("Campos no validos");
    }

    setErrors({});
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


    if (!validateFacultadNombre(facultadNombre)) {
      errors.facultadNombre = 'Por favor, ingrese un nombre de facultad válido.';
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
   

    const payload = {
      facultadId: facultadId,
/*       facultadNombre: isFacultyChanged.changed ? isFacultyChanged.newValue : undefined, */
      facultadNombre: facultadNombre,
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
    console.log("EDITAR FACULTAD: ", payload);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/facultad/editar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log(data)
    console.log(response)
    if (response.ok) {
      update(page);
      setFacultadNombre(payload.facultadNombre);
      setCoordinatorData(payload.coordinatorData);
      setEdit(false);
      onOpenChange(false);
      return response;
    } else {
      setFlag(false)
      
      if(data && data.error){
        throw new Error(data.error);
      }
      throw new Error('Error al editar facultad y coordinador');
    }
      
    
  };

  const handleClick = async () => {
    
    toast.promise(
      submitForm(),
      {
        loading: 'Editando Facultad...',
        success: 'Facultad editada con éxito',
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
    <div onClick={(event) => {event.stopPropagation();}}>
      <Tooltip content='Editar facultad' size='md' color='foreground' closeDelay={100}>
        <Button 
          isIconOnly 
          color='default' 
          variant='light' 
          aria-label='Editar programa'
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
            setEdit(true);
          }}
        >
          <Pencil size={16} />
        </Button>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
          if(!isOpen){
            setFacultadNombre(initialNombreFacultad);
          }
          setEdit(false);
        }}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size='4xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Editar Facultad</ModalHeader>
              <ModalBody>

                <div className='flex flex-col gap-4'>
                  <DatosFacultad
                    facultadNombre={facultadNombre}
                    setFacultadNombre={setFacultadNombre}
                    setIsFacultyChanged={setIsFacultyChanged}
                    initialFacultyName={facultadNombre}
                    mode={'edit'}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <DatosCoordinador
                    coordinatorData={coordinatorData}
                    setCoordinatorData={setCoordinatorData}
                    clearFields={clearCoordinadorFields}
                    editable={editable}
                    setEditable={setEditable}
                    setIsCoordinatorChanged={setIsCoordinatorChanged}
                    mode={'edit'}
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
/*                   disabled={!isCoordinatorChanged.changed && !isFacultyChanged.changed} */
                >
                  Guardar
                </Button>
                <Button
                  variant='solid'
                  className='w-1/2 h-9 bg-[#FF4545] text-white'
                  onPress={() => {
                    /*
                    onOpenChange(false);
                    setEdit(false);
                    setEditable(false);
                    */
                    /* clearFields(); */
                    /*
                    setIsCoordinatorChanged({
                      changed: false,
                      changes: {}
                    })
                    setIsFacultyChanged({
                      changed: false,
                      oldValue: '',
                      newValue: ''
                    })
                    setFacultadNombre(initialNombreFacultad)
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
                    ;*/
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

export default EditarFacultad;

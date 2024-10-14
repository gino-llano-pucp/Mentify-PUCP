import { Button, Input, Tooltip } from '@nextui-org/react';
import { PlusCircleIcon, SearchIcon, Trash2Icon, TrashIcon } from 'lucide-react';
import React, { useState } from 'react';
import ModalListadoTutores from '../../components/ModalListadoTutores';
import toast from 'react-hot-toast';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import DatosPrograma from '../../components/DatosPrograma';
import DatosCoordinador from '../../components/DatosCoordinador';
import { useFacultadCoordinador } from '../../states/FacultadCoordinadorContext';

const AgregarPrograma = ({session}) => {
  const [coordinatorData, setCoordinatorData] = useState({
    id: '',
    code: '',
    name: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    isSelectedFromSearch: false
  });
  const [facultadNombre, setFacultadNombre] = useState(''); // Estado para almacenar el nombre de la facultad
  const { goBackToPenultimate } = useActiveComponent();
  const [errors, setErrors] = useState({});

  const { facultadId } = useFacultadCoordinador();

  const validateFacultadNombre = (facultadNombre) => {
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
    if (!apellidos) {
      setErrors({ segundoApellido: 'Por favor, ingrese el segundo apellido del coordinador' });
      return false;
    }
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
        code: 'El código ingresado debe ser de 8 caracteres'
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
  };

  const handleGoBack = () => {
    clearFields();
    goBackToPenultimate();
  };

  const submitForm = async () => {
    let errors = {};

    if (!validateFacultadNombre(facultadNombre)) {
      errors.facultadNombre = 'Por favor, ingrese un nombre de programa válido.';
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

    if (Object.keys(errors).length > 0) {
      // Si hay múltiples errores, proporciona un mensaje genérico junto con detalles específicos
      /*             const errorMessage = (
                <div>
                    Por favor, revise los siguientes errores:
                    {Object.values(errors).map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            );
            toast.error(errorMessage); */
      setErrors(errors);
      return;
    }
    console.log(typeof facultadId);
    console.log('FACULTAD ID: ' + facultadId);
    console.log('PROGRAMA NOMBRE: ' + facultadNombre);

    try {
      const response = await await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/programa/registrar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idFacultad: facultadId.toString(),
          code: coordinatorData.code,
          name: coordinatorData.name,
          apellidos: coordinatorData.primerApellido + ' ' + coordinatorData.segundoApellido,
          email: coordinatorData.email,
          isSelectedFromSearch: coordinatorData.isSelectedFromSearch,
          programaNombre: facultadNombre // Asegúrate de capturar el valor del input de la facultad
        })
      });

      console.log('coord: ', coordinatorData);

      const data = await response.json(); // Parsea el JSON del cuerpo de la respuesta

      if (!response.ok) {
        toast.error(`Error al agregar programa y coordinador: ${data.message}`);
        return;
      }

      // Usa los datos parseados donde los necesites, ya no necesitas llamar de nuevo a `response.json()`
      toast.success(`Programa y coordinador agregados con éxito: ${data.message}`);
      /* clearFields();  // Limpiar los campos después de un envío exitoso
            goBackToPenultimate(); */
      handleGoBack();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Error al agregar programa y coordinador: ${error.message}`);
    }
  };

  return (
    <div className='flex flex-col items-center w-full gap-12'>
      <DatosPrograma facultadNombre={facultadNombre} setFacultadNombre={setFacultadNombre} mode={'add'}
        errors={errors} setErrors={setErrors}
      />
      <DatosCoordinador
        coordinatorData={coordinatorData}
        setCoordinatorData={setCoordinatorData}
        clearFields={clearCoordinadorFields}
        mode={'add'}
        errors={errors}
        setErrors={setErrors}
      />
      <div className='flex flex-col w-[400px] items-center gap-4 md:w-1/4 md:flex-row'>
        <Button
          color='secondary'
          variant='solid'
          onClick={submitForm}
          style={{
            width: 'auto',
            maxWidth: 'fit-content',
            minWidth: 'fit-content',
            color: 'white',
            backgroundColor: '#008000'
          }}
        >
          Agregar
        </Button>
        <Button
          color='default'
          variant='bordered'
          onClick={handleGoBack}
          style={{
            color: 'white',
            backgroundColor: '#FF4545',
            border: 'none'
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default AgregarPrograma;

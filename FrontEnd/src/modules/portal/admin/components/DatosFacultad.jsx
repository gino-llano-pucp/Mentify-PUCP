import { Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const DatosFacultad = ({
  facultadNombre,
  setFacultadNombre,
  setIsFacultyChanged,
  initialFacultyName,
  mode = 'add',
  errors = {},
  setErrors
}) => {
  const [currentName, setCurrentName] = useState(facultadNombre);

  console.log('ERRORS: ' + errors);

/*   useEffect(() => {
    // Al cargar el componente, establecer el nombre actual basado en el nombre inicial proporcionado
    if (mode === 'edit') {
      // Solo establecer el nombre actual en modo de edición
      setCurrentName(facultadNombre);
    }
  }, [facultadNombre, mode]); */

/*   useEffect(() => {
    // Manejar el cambio solo en modo edicion
    console.log("HERE");
    console.log(currentName);
    console.log(initialFacultyName);

    if (mode === 'edit') {
      if (currentName !== initialFacultyName) {
        setFacultadNombre(currentName);
        setIsFacultyChanged({
          changed: true,
          oldValue: initialFacultyName,
          newValue: currentName
        });
      } else {
        setIsFacultyChanged({ changed: false });
      }
    }
  }, [currentName, initialFacultyName, setIsFacultyChanged, mode]); */

  const handleChange = (event) => {

    setFacultadNombre(event.target.value);
    const copy = JSON.parse(JSON.stringify(errors));
    copy.facultadNombre = "";
    console.log(copy);
    setErrors(copy);
  };

  const clearField = () => {
/*     if (mode === 'edit') {
      setCurrentName(facultadNombre);
    }    */  
    setFacultadNombre('');
    const copy = JSON.parse(JSON.stringify(errors));
    copy.facultadNombre = "";
    setErrors(copy);
  };

  return (
    <div className='flex flex-col w-full gap-4'>
      <h2 className='agregar-facultad-header'>Datos de la facultad</h2>
      <div className='h-16'>
        <Input
          isClearable
          isRequired
          onClear={clearField}
          className='w-full'
          type='text'
          label='Nombre'
          placeholder='Ingresa el nombre de la facultad'
          value={facultadNombre}
          onChange={handleChange}
          isInvalid={errors.facultadNombre ? true : false}
          errorMessage={errors.facultadNombre}
        />
      </div>
    </div>
  );
};

export default DatosFacultad;

import { Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const DatosPrograma = ({
  programaNombre,
  setProgramaNombre,
  setIsFacultyChanged,
  initialFacultyName,
  mode = 'add',
  errors = {},
  setErrors
}) => {
  console.log(programaNombre)
  const [currentName, setCurrentName] = useState(programaNombre);

/*   useEffect(() => {
    // Al cargar el componente, establecer el nombre actual basado en el nombre inicial proporcionado
    if (mode === 'edit') {
      // Solo establecer el nombre actual en modo de edición
      setCurrentName(programaNombre);
    }
  }, [programaNombre, mode]);

  useEffect(() => {
    // Manejar el cambio solo en modo edicion
    if (mode === 'edit') {
      if (currentName !== initialFacultyName) {
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
/*     if (mode === 'edit') {
      setCurrentName(event.target.value);
    }     */ 
    setProgramaNombre(event.target.value);
    const copy = JSON.parse(JSON.stringify(errors));
    copy.programaNombre = "";
    setErrors(copy);
  };

  const clearField = () => {
/*     if (mode === 'edit') {
      setCurrentName(programaNombre);
    }    */  
    setProgramaNombre('');
    const copy = JSON.parse(JSON.stringify(errors));
    copy.programaNombre = "";
    setErrors(copy);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='agregar-facultad-header'>Datos del programa</h2>
      <div className='h-16'>
        <Input
          isClearable
          isRequired
          onClear={clearField}
          className='w-[415px]'
          type='text'
          label='Nombre'
          placeholder='Ingresa el nombre del programa'
          value={programaNombre}
          onChange={handleChange}
          isInvalid={errors.programaNombre ? true : false}
          errorMessage={errors.programaNombre}
        />  
      </div>
    </div>
  );
};

export default DatosPrograma;

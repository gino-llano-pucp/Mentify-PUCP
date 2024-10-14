import { Input } from '@nextui-org/react';
import React from 'react';

const DatosUnidadAcademica = ({
  unidadData,
  setUnidadData,
  clearAcronym,
  clearName,
  clearEmail,
  isAcronymInvalid,
  setAcronymInvalid,
  isNameInvalid,
  setNameInvalid,
  isEmailInvalid,
  setEmailInvalid
}) => {
  const handleChange = (field, value, setIsValid) => {
    setIsValid(false);
    setUnidadData((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col w-full gap-4'>
        <h2 className='agregar-facultad-header'>Datos de la Unidad Académica</h2>

        {/* Siglas de la Unidad Académica */}
        <div className='h-16'>
          <Input
            isClearable
            isRequired
            onClear={clearAcronym}
            className='w-[220px]'
            type='text'
            label='Siglas'
            placeholder='Ingrese las siglas'
            value={unidadData.siglas}
            onChange={(e) => handleChange('siglas', e.target.value, setAcronymInvalid)}
            isInvalid={isAcronymInvalid}
            errorMessage='Ingresa siglas válidas'
          />
        </div>

        {/* Nombre de la Unidad Académica */}
        <div className='h-16'>
          <Input
            isClearable
            isRequired
            onClear={clearName}
            className='w-full'
            type='text'
            label='Nombre'
            placeholder='Ingrese el nombre'
            value={unidadData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value, setNameInvalid)}
            isInvalid={isNameInvalid}
            errorMessage='Debe ingresar el nombre de la unidad académica'
          />
        </div>

        {/* Correo de contacto de la Unidad Académica */}
        <div className='h-16'>
          <Input
            isClearable
            isRequired
            onClear={clearEmail}
            className='w-full'
            type='text'
            label='Correo de contacto'
            placeholder='Ingrese el correo de contacto'
            value={unidadData.correoDeContacto}
            onChange={(e) => handleChange('correoDeContacto', e.target.value, setEmailInvalid)}
            isInvalid={isEmailInvalid}
            errorMessage='El correo ingresado no es válido'
          />
        </div>
      </div>
    </div>
  );
};

export default DatosUnidadAcademica;

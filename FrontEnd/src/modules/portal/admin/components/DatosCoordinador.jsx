import React, { useState, useEffect } from 'react';
import ModalListadoTutores from './ModalListadoTutores';
import { Button, Input, Tooltip } from '@nextui-org/react';
import { Edit2Icon, TrashIcon, XCircleIcon } from 'lucide-react';

const DatosCoordinador = ({
  coordinatorData,
  setCoordinatorData,
  clearFields,
  editable = 'true',
  setEditable,
  setIsCoordinatorChanged,
  mode = 'add',
  errors = {},
  setErrors
}) => {
  const [initialData, setInitialData] = useState(coordinatorData);

  // Al cargar el componente, guardar los datos del coordinador inicial en el sistema (para modo edit)
  useEffect(() => {
    setInitialData(coordinatorData);
  }, []);

  useEffect(() => {
    if (!editable) {
      setCoordinatorData(initialData); // Retorna la data inicial
      return;
    }
    // clearFields(); // Si es editable, limpia los campos del coordinador
  }, [editable]);

  useEffect(() => {
    if (mode !== 'edit') return;
/*     // Verificar cambios específicos en campos clave
    const hasCodeChanged = initialData.code !== coordinatorData.code;
    const hasEmailChanged = initialData.email !== coordinatorData.email;

    if (hasCodeChanged && hasEmailChanged) {
      // ambos deben cambiar codigo y email
      setIsCoordinatorChanged({
        changed: true,
        changes: {
          codeChanged: hasCodeChanged,
          emailChanged: hasEmailChanged
        }
      }); */
    const hasNameChanged = initialData.name !== coordinatorData.name;
    const hasPrimerApellidoChanged = initialData.primerApellido !== coordinatorData.primerApellido;
    const hasSegundoApellidoChanged = initialData.segundoApellido !== coordinatorData.segundoApellido;
    const hasEmailChanged = initialData.email !== coordinatorData.email;

    if (hasNameChanged || hasPrimerApellidoChanged || hasSegundoApellidoChanged || hasEmailChanged) {
      // ambos deben cambiar codigo y email
      setIsCoordinatorChanged({
        changed: true,
        changes: {
          nameChanged: hasNameChanged,
          primerApellidoChanged: hasPrimerApellidoChanged,
          segundoApellidoChanged: hasSegundoApellidoChanged,
          emailChanged: hasEmailChanged
        }
      });
    } else {
      setIsCoordinatorChanged({ changed: false });
    }
  }, [coordinatorData, initialData, setIsCoordinatorChanged, mode]);

  const toggleEditable = () => {
    console.log("TOGLE: ", editable);
    setEditable(!editable);
  };

  const handleToggleEditable = () => {
    // llega como true, va a cambiar a false y viceversa
    if (editable) {
      setCoordinatorData(initialData); // Restaurar a los datos originales si se cancela la edición.
    }
    // editable sera false => cambio coordinador? no y viceversa
    setIsCoordinatorChanged(!editable);
    toggleEditable();
  };

  const handleChange = (field, value) => {
    setCoordinatorData((prevState) => ({
      ...prevState,
      [field]: value,
      isSelectedFromSearch: false
    }));
    if (mode == 'add' || mode == 'edit') {
      const copy = JSON.parse(JSON.stringify(errors));
      copy[field] = "";
      setErrors(copy);
    }
  };

  const handleSelectFromSearch = (user) => {
    setCoordinatorData({
      id: user.id,
      code: user.code,
      name: user.name,
      primerApellido: user.primerApellido,
      segundoApellido: user.segundoApellido,
      email: user.email,
      isSelectedFromSearch: true
    });
/*     setErrors({
      code:"",
      name:"",
      primerApellido:"",
      segundoApellido:"",
      facultadNombre: errors.facultadNombre,
      email:""

    }) */
    if (mode !== 'edit') return;
    setIsCoordinatorChanged({ changed: true, changes: { fromSearch: true } });
  };

  const clearField = (field) => {
    if (mode == "add" || mode == "edit")
      setCoordinatorData((prev) => ({ ...prev, [field]: '' }));

    if (mode == 'add' || mode == "edit") {
      const copy = JSON.parse(JSON.stringify(errors));
      copy[field] = "";
      setErrors(copy);
    }
  };

  const fieldPlaceholders = {
    code: 'Ingresa el código del coordinador',
    name: 'Ingresa el nombre del coordinador',
    primerApellido: 'Ingresa el primer apellido del coordinador',
    segundoApellido: 'Ingresa el segundo apellido del coordinador',
    email: 'Ingresa el email del coordinador'
  };

  const fieldLabels = {
    code: 'Código',
    name: 'Nombres',
    primerApellido: 'Primer apellido',
    segundoApellido: 'Segundo apellido',
    email: 'Correo Electrónico'
  };

  // Función para agregar ceros al inicio si el código tiene menos de 8 caracteres
  const formatCode = (code) => {
    if (!code) return code;
    return code.padStart(8, '0');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='agregar-facultad-header'>Datos del coordinador</h2>
        <div className='flex flex-row gap-2'>
          {(editable || mode === 'add') && (
            <>
              <ModalListadoTutores onSelect={handleSelectFromSearch} />
              <Tooltip content='Limpiar campos' color='primary'>
                <Button
                  isIconOnly
                  color='default'
                  variant='ghost'
                  aria-label='Limpiar campos coordinador'
                  onPress={clearFields}
                >
                  <TrashIcon size={20} />
                </Button>
              </Tooltip>
            </>
          )}
          {mode === 'edit' && (
            <Tooltip content={editable ? 'Cancelar edición' : 'Habilitar edición'} color='primary'>
              <Button
                isIconOnly
                color='default'
                variant='ghost'
                aria-label={editable ? 'Cancelar edición' : 'Habilitar edición'}
                onPress={handleToggleEditable}
              >
                {editable ? <XCircleIcon size={20} /> : <Edit2Icon size={20} />}
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="flex flex-wrap w-full gap-4">
        {editable
          ? ['code', 'name', 'primerApellido', 'segundoApellido', 'email'].map((field, key) => (
            <div key={key} className='h-16'>
              { field === 'segundoApellido' ? (
                  <Input
                    key={field}
                    isClearable
                    disabled={!editable}
                    onClear={() => clearField(field)}
                    className='w-[415px]'
                    type='text'
                    label={fieldLabels[field]}
                    placeholder={fieldPlaceholders[field]}
                    value={coordinatorData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    isInvalid={errors[field] ? true : false}
                    errorMessage={errors[field]}
                  />
              ) : (
                  <Input
                      key={field}
                      isClearable
                      isRequired
                      disabled={!editable}
                      onClear={() => clearField(field)}
                      className='w-[415px]'
                      type='text'
                      label={fieldLabels[field]}
                      placeholder={fieldPlaceholders[field]}
                      value={coordinatorData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      isInvalid={errors[field] ? true : false}
                      errorMessage={errors[field]}
                    />
              )
              }
            </div> 
          ))
          : ['code', 'name', 'primerApellido', 'segundoApellido', 'email'].map((field, key) => (
              <div key={key} className='h-16'>
                { field === 'segundoApellido' ? (
                  <Input
                    key={field}
                    disabled={!editable}
                    className='w-[415px]'
                    type='text'
                    label={fieldLabels[field]}
                    placeholder={fieldPlaceholders[field]}
                    value={field === 'code' ? formatCode(coordinatorData[field]) : coordinatorData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <Input
                    key={field}
                    disabled={!editable}
                    isRequired
                    className='w-[415px]'
                    type='text'
                    label={fieldLabels[field]}
                    placeholder={fieldPlaceholders[field]}
                    value={field === 'code' ? formatCode(coordinatorData[field]) : coordinatorData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                )
                }
              </div>
            ))
          }
      </div>
      
    </div>
  );
};

export default DatosCoordinador;

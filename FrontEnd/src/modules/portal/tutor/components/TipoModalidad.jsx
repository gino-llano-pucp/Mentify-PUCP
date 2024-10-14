import { Input, Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'

const TipoModalidad = ({modalities, selectedModality, handleModalityChange, inputProps, clearUbicacion, isUbicacionInvalid, visualizar, value}) => {
  
  useEffect(() => {
    console.log("VALUE: ", value);
  }, [value])
  
  useEffect(() => {
    console.log("VISUALIZAR: ", visualizar);
  }, [visualizar])

  return (
    <div className='flex flex-row items-center w-full gap-4 '>
                   <div className='flex flex-col justify-center w-full h-20'> 
                      {visualizar ? (
                        <div className='flex flex-col px-3 py-2 rounded-xl bg-[#F2F2F3] gap-1 hover:bg-[#E0E0E3] transition duration-200'>
                          <span className='text-xs text-gray-600 transition duration-200 hover:text-gray'>Tipo de modalidad</span>
                          <span>{Array.from(selectedModality)[0].charAt(0).toUpperCase() + Array.from(selectedModality)[0].slice(1).toLowerCase()}</span>
                        </div>
                      ) : (
                        <Select
                            items={modalities}
                            label="Tipo de modalidad"
                            placeholder="Selecciona una modalidad"
                            defaultSelectedKeys={selectedModality}
                            isDisabled={visualizar}
                            className="max-w-xs"
                            onSelectionChange={handleModalityChange}
                            >
                            {(modality) => <SelectItem key={modality.key}>{modality.label}</SelectItem>}
                        </Select>
                      )}
                        <div className='mt-2 text-xs text-red-500'>{'\u00A0'}</div>
                    </div>
                    <div className='flex flex-col justify-center w-full h-20'>
                      {visualizar ? (
                        <Input
                            {...inputProps}
                            className="w-full"
                            color={isUbicacionInvalid ? 'danger' : 'default'}
                            isReadOnly={visualizar}
                            defaultValue={value}
                        />
                      ) : (
                        <Input
                          isClearable
                          {...inputProps}
                          className="w-full"
                          onClear={clearUbicacion}
                          color={isUbicacionInvalid ? 'danger' : 'default'}
                          isReadOnly={visualizar}
                          defaultValue={visualizar ? value : ''}
                        />
                      )}
                      
                      <div className='mt-2 text-xs text-red-500'>{isUbicacionInvalid ? ( selectedModality == 'presencial' ? 'La ubicación es obligatoria.' : 'El enlace es obligatorio.') : '\u00A0'}</div>
                    </div>
            
                </div>
  )
}

export default TipoModalidad
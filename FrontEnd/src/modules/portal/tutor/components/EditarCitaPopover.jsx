/* import React from 'react'
import { useStudentInfo } from '../states/StudentInfoContext';
import { Button, DateInput, Popover, PopoverContent, PopoverTrigger, User } from '@nextui-org/react';
import { CalendarIcon } from 'lucide-react';
import CustomTimeInput from './CustomTimeInput';

const EditarCitaPopover = (showButton, isOpen, setIsOpen, setShowButton) => {
    const { studentInfo, updateStudentInfo } = useStudentInfo();
    
    const handleClosePopover = () => {
        setIsOpen(false);
      };

  return (
    <>
      {showButton && (
        <Popover isOpen={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            setShowButton(open);
          }}>
          <PopoverTrigger>
            <Button
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                zIndex: 1000,
                backgroundColor: 'red', // Color visible para comprobar la posición
              }}
            >
              Open Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col w-[500px] p-2 gap-2">
                <div className='flex flex-row items-center justify-between popover-header'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-sm text-gray-700'>Tipo de tutoría</span>
                        <span className="text-base font-medium">{tipoTutoria?.nombre}</span>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <Button isIconOnly color='default' variant='light' aria-label='Cerrar visualización de cita' onPress={handleClosePopover}>
                            <CircleX className='w-5 h-5 text-gray-800' />
                        </Button>
                    </div>
                </div>
                <div className='flex justify-start w-full mb-2'>
                    <User   
                        name={`${studentInfo.nombres} ${studentInfo.primerApellido}`}
                        description={`${studentInfo.email}`}
                        avatarProps={{
                            src: studentInfo.avatar
                        }}
                    />
                </div>
                <div className='flex flex-row items-center w-full gap-4 fecha-hora'>
                    <DateInput
                        label="Fecha"
                        isReadOnly
                        defaultValue={selectedEvent.date ? parseDate(formatDate(selectedEvent.date)) : undefined}
                        placeholderValue={new CalendarDate(1995, 11, 6)} 
                        labelPlacement="inside"
                        className='w-full'
                        startContent={
                        <CalendarIcon className="flex-shrink-0 text-2xl pointer-events-none text-default-400" />
                        }
                    />
                    <CustomTimeInput startTime={selectedEvent.startTime} endTime={selectedEvent.endTime}/>
                </div>
                <div className='flex flex-row items-center w-full gap-4 '>
                   <div className='flex flex-col justify-center w-full h-24'>
                      <Select
                            items={modalities}
                            label="Tipo de modalidad"
                            placeholder="Selecciona una modalidad"
                            defaultSelectedKeys={selectedModality}
                            className="max-w-xs"
                            onSelectionChange={handleModalityChange}
                            >
                            {(modality) => <SelectItem key={modality.key}>{modality.label}</SelectItem>}
                        </Select>
                        <div className='mt-2 text-xs text-red-500'>{'\u00A0'}</div>
                    </div>
                    <div className='flex flex-col justify-center w-full h-24'>
                      <Input 
                          isClearable
                          {...inputProps}
                          className="w-full"
                          onClear={clearUbicacion}
                          color={isUbicacionInvalid ? 'danger' : 'default'}
                      />
                      <div className='mt-2 text-xs text-red-500'>{isUbicacionInvalid ? 'La ubicación es obligatoria.' : '\u00A0'}</div>
                    </div>
            
                </div>
                <div className='flex flex-row justify-end w-full gap-2 mt-2'>
                    <Button color='default' onPress={handleClosePopover}>Cancelar</Button>
                    <Button color='primary' onPress={handleRegisterCita}>Registrar</Button>
                </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default EditarCitaPopover */
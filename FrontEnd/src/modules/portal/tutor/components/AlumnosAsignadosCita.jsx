import { Avatar, AvatarGroup, Tooltip, User } from '@nextui-org/react'
import React from 'react'
import { AvatarGroupComponent } from './AvatarGroupComponent'
import { SingleUserComponent } from './SingleUserComponent'

const AlumnosAsignadosCita = ({studentInfos}) => {
  return (
    <div className='flex flex-col w-full mb-2'>
                  <h4 className='text-sm font-medium text-gray-800'>{studentInfos.length > 0 ? 'Alumnos Asignados' : 'Alumno Asignado'}</h4>
                  <span className='text-xs text-gray-600'>{studentInfos.length > 1 ? `Se han seleccionado ${studentInfos.length} estudiantes` : 'Información del alumno asignado a la cita'}</span>
                  <div className='flex justify-start w-full mt-4'>
                    {studentInfos.length > 1 ? (
                      <AvatarGroupComponent studentInfos={studentInfos} />
                    ) : (
                      <SingleUserComponent student={studentInfos[0]} />
                    )}
                  </div>
                </div>
  )
}

export default AlumnosAsignadosCita
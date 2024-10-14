import { Avatar, AvatarGroup, Tooltip, User } from '@nextui-org/react'
import React from 'react'

const TutorAsignadoCita = ({tutor}) => {
  return (
    <div className='flex flex-col w-full mb-2'>
                  <h4 className='text-sm font-medium text-gray-800'>Tutor Asignado</h4>
                  <span className='text-xs text-gray-600'>{'Información del tutor asignado a la cita'}</span>
                  <div className='flex justify-start w-full mt-4'>
                    {(
                      <User   
                        name={tutor.nombres + " " + tutor.primerApellido + " " + tutor.segundoApellido}
                        description={`${tutor?.email}`}
                        avatarProps={{
                            src: tutor?.imagen
                        }}
                        />
                    )}
                  </div>
                </div>
  )
}

export default TutorAsignadoCita
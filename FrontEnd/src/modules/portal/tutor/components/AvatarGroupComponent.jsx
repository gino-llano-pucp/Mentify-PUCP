import { Avatar, AvatarGroup, Tooltip } from '@nextui-org/react';
import React from 'react';

export const AvatarGroupComponent = ({ studentInfos }) => {
  if (studentInfos.length <= 1) return null;  // Este componente no maneja un único estudiante.

  return (
    <AvatarGroup
      className='pl-4'
      isBordered
      max={5}
      total={studentInfos.length}
      renderCount={(count) => {
        const extraCount = studentInfos.length - 5;
        return extraCount > 0 ? (
          <p className="font-medium text-small text-foreground ms-2">+{extraCount} others</p>
        ) : null;
      }}
    >
      {studentInfos.map((student, index) => (
        <Tooltip content={
          <div className='flex flex-col px-1 py-2'> 
            <span className='text-sm font-medium'>{student.nombres} {student.primerApellido}</span>
            <span className='text-xs font-normal'>{student.email}</span>
          </div>
        }>
          <Avatar key={student.idAlumno} src={student.avatar} />
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

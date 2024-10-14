import { User } from '@nextui-org/react';
import React from 'react';

export const SingleUserComponent = ({ student }) => {
  if (!student) return null;

  return (
    <User   
      name={`${student.nombres} ${student.primerApellido}`}
      description={`${student.email}`}
      avatarProps={{
        src: student.avatar ? student.avatar : student.imagen
      }}
    />
  );
};

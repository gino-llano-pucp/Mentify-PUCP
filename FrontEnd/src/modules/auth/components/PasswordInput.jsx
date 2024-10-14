'use client';
import React, { useState } from 'react';
import InputField from './InputField';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { EyeIcon } from 'lucide-react';

const PasswordInput = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  return (
    <InputField
      name='password'
      label='Contraseña'
      type={isVisible ? 'text' : 'password'}
      endContent={
        <button type='button' onClick={toggleVisibility}>
          {isVisible ? <EyeClosedIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      }
    />
  );
};

export default PasswordInput;

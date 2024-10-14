'use client';
import React, { useState } from 'react';
import Separator from './Separator';
import InputField from './InputField';
import { Button } from '@nextui-org/react';
import { signIn } from '@/auth';

const LoginForm = ({ children }) => {
  /* const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible); */

  return (
    <div className='flex flex-col w-full gap-6'>
      {/* <SocialLoginButton/> */}
      {children}
      {/* <Separator text={"O continúa con"}/> */}
    </div>
  );
};

export default LoginForm;

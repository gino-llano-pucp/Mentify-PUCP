import { signIn } from '@/auth';
import React from 'react';
import InputField from './InputField';
import { CredentialsSignin } from 'next-auth';
import { redirect } from 'next/navigation';
import PasswordInput from './PasswordInput';
import LocalAuthSubmitButton from './LocalAuthSubmitButton';
import Link from 'next/link';
// Porfa alguien agregue el codigo necesario para que se pueda ingresar con codigo pucp

const LocalAuthForm = () => {

  return (
    <form
      action={async (formData) => {
        'use server';
        try {
          await signIn('credentials', formData);
        } catch (error) {
          if (error instanceof CredentialsSignin) {
            redirect(`/login?error=Default`);
          }
        }
      }}
    >
      <div className='flex flex-col gap-2'>
        <InputField name={'identifier'} label='Correo electrónico o código PUCP' type={'text'} />
        <PasswordInput />
      </div>
      <Link href='/PasswordRecovery'>
        <span className='mb-8 text-sm text-[#6571AC] cursor-pointer' >Olvidé mi contraseña</span>
      </Link>
      <LocalAuthSubmitButton />
    </form>
  );
};

export default LocalAuthForm;

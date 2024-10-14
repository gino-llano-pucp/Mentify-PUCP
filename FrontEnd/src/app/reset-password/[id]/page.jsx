'use client';
import { Button, Input, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { handleRedirect } from '@/app/lib/actions';
import { Eye, EyeOff, CircleHelp } from 'lucide-react';
import toast from 'react-hot-toast';

function Page({ params }) {
  console.log(params);
  const [error, setError] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleNew, setIsVisibleNew] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);

  const [isPasswordInvalid, setPasswordInvalid] = useState(false);
  const [isPasswordNewInvalid, setPasswordNewInvalid] = useState(false);

  const [userPass, setUserPass] = useState({
    password: '',
    passwordNew: ''
  });

  const clearPassword = () => {
    setPasswordInvalid(false);
    setUserPass((prev) => ({ ...prev, password: '' }));
  };

  const clearPasswordNew = () => {
    setPasswordNewInvalid(false);
    setUserPass((prev) => ({ ...prev, passwordNew: '' }));
  };

  const handleChange = (field, value, setIsValid = null) => {
    if(setIsValid) setIsValid(false);
    setUserPass((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  function clearAllInvalidFields() {
    clearPassword();
    clearPasswordNew();
  }

  const handleSubmit = async () => {

    let password = false;

    console.log('holaaaa');

    if (userPass.password.length >= 8 && userPass.password.match(/[a-z]/) && userPass.password.match(/[A-Z]/) && userPass.password.match(/[0-9]/)) {
      setPasswordInvalid(false);
    } else {
      setPasswordInvalid(true);
      password = true;
    }

    if (password) {
      throw new Error('La contraseña no es suficientemente robusta');
    }

    console.log(userPass.password)
    console.log(userPass.passwordNew)

    if (userPass.password != userPass.passwordNew){
      throw new Error('Las contraseñas no coinciden')
    }

    console.log(params);
    console.log(userPass.password);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/handle-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params,
          newPassword: userPass.password
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        if (response.status === 400) {
          console.log(data.error);
          throw new Error(data.error);
        } else {
          console.log(data.error)
            throw new Error(data.error || 'Error al restablecer la contraseña');
        }
      }

      clearAllInvalidFields();

    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      await toast.promise(
        handleSubmit(),
        {
            loading: 'Restableciendo contraseña...',
            success: 'Contraseña restablecida con éxito',
            error: (error) => error.message === 'Token inválido o expirado' ? 'Token inválido o expirado' : error.message === 'Las contraseñas no coinciden' ? 'Las contraseñas no coinciden' : 'Error al restablecer la contraseña'
        },
        {   
            style: {
                minWidth: '250px'
            }
        }
      );
      handleRedirect(); // Llama a la acción del servidor para redireccionar
    } catch (error) {
      console.error('Failed to post render request: ', error);
    }
  };

  return (
    <aside className='fixed inset-0'>
      <div className='relative w-full h-full'>
        <Image
          src='/landscape_background.jpg'
          alt='Mentify Campus (Imagen Referencial)'
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className='absolute inset-0 bg-black bg-opacity-70 z-10'>
          <div className='p-10 absolute top-1/2 left-1/2 w-2/6 min-h-1/2 h-auto bg-white rounded-lg transform -translate-x-1/2 -translate-y-1/2 z-20'>
            <div className='mb-4'>
              <Image src='/leaf_icon.svg' alt='Mentify logo' width={70} height={70} />
            </div>
            <p className='text-4xl font-bold text-left'>
              Restablecer contraseña
            </p>

            <div className="flex flex-col gap-4 py-6">
              <div className='h-20 mb-3'>

                <div className='mb-2 flex flex-row items-center space-x-2'>
                  <span className='text-sm'>
                    Nueva contraseña
                  </span>
                  <Tooltip
                    content="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
                    placement='bottom'
                    showArrow
                    classNames = {{
                      base: [
                        "before:bg-black dark:before:bg-white",
                      ],
                      content: [
                        "text-white bg-black border-0 max-w-60"
                      ]
                    }}
                  >
                    <CircleHelp size={20}/>
                  </Tooltip>
                </div>

                <Input
                  fullWidth
                  radius='md'
                  type={isVisible ? 'text' : 'password'}
                  value={userPass.password}
                  onChange={(e) => handleChange('password', e.target.value, setPasswordInvalid)}
                  isInvalid={isPasswordInvalid}
                  errorMessage='La contraseña no es suficientemente robusta'
                  placeholder=' '
                  variant='bordered'
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />

              </div>

              <Input
                  fullWidth
                  radius='md'
                  type={isVisibleNew ? 'text' : 'password'}
                  value={userPass.passwordNew}
                  onChange={(e) => handleChange('passwordNew', e.target.value, setPasswordNewInvalid)}
                  labelPlacement='outside'
                  label="Confirma tu contraseña"
                  placeholder=' '
                  variant='bordered'
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibilityNew}>
                      {isVisibleNew ? (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className='py-2'>
                <Button
                  fullWidth
                  color='primary'
                  variant='solid'
                  onClick={handleClick}
                >
                  Restablecer contraseña
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Page;
'use client';
import { Button, Input } from '@nextui-org/react';
import { update } from 'lodash';
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import { handleRedirect } from '../lib/actions'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

function Page() {
    const [user, setUser] = useState({
        email: ''
    });

    const [isEmailInvalid, setEmailIsInvalid] = useState(false);

    const clearEmail = () => {
        setEmailIsInvalid(false);
        setUser((prev) => ({ ...prev, email: '' }));
    };

    function clearAllInvalidFields() {
        clearEmail();
    }

    const handleChange = (field, value, setIsValid = null) => {
        if (setIsValid) setIsValid(false);
        setUser((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const submitEmail = async () => {
        let email = false;

        if (user.email.length !== 0 && validator.isEmail(user.email)) {
            setEmailIsInvalid(false);
        } else {
            setEmailIsInvalid(true);
            email = true;
        }

        if (email) {
            throw new Error('Correo inválido');
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/handle-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log(data.error);
                    throw new Error(data.error);
                } else {
                    throw new Error(data.error || 'Error inesperado al enviar instrucciones');
                }
            }

            clearAllInvalidFields();

        } catch (error) {
            throw error;
        }
    };

    const handleClick = async () => {
        try {
            await toast.promise(
                submitEmail(),
                {
                    loading: 'Enviando instrucciones...',
                    success: 'Instrucciones enviadas con éxito',
                    error: (error) => error.message === 'Usuario no encontrado' ? 'Error al enviar instrucciones: el correo ingresado no se encuentra registrado en el sistema' : 'Error al enviar instrucciones'
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
                            ¿Olvidaste tu contraseña?
                        </p>

                        <p className='py-4'>
                            Enviaremos instrucciones a tu correo electrónico sobre cómo restablecer tu contraseña.
                        </p>

                        <div className="flex flex-col gap-4 py-6">
                            
                            <div className='h-20'>
                                <Input
                                    fullWidth
                                    radius='md'
                                    type="text"
                                    labelPlacement='outside'
                                    placeholder="johndoe@example.com"
                                    label="Correo electrónico"
                                    variant='bordered'
                                    value={user.email}
                                    isInvalid={isEmailInvalid}
                                    onChange={(e) => handleChange('email', e.target.value, setEmailIsInvalid)}
                                    isClearable
                                    onClear={clearEmail}
                                    errorMessage='El correo ingresado no es válido'
                                />
                            </div>

                            <div className='py-0'>
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

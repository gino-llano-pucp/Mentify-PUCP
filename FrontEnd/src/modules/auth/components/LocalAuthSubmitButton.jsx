'use client';
import { Button } from '@nextui-org/react';
import React, { useRef, useState } from 'react';

const LocalAuthSubmitButton = () => {
  const submitButtonRef = useRef(null);
  const [secondClickDone, setSecondClickDone] = useState(false);

  const handleClick = () => {
    if (!secondClickDone) {
      setSecondClickDone(true); // Configura que el segundo clic ha sido ejecutado
      setTimeout(() => {
        // Aquí se verifica que el botón exista antes de intentar clickearlo nuevamente.
        submitButtonRef.current?.click();
      }, 100); // Retraso de 100 milisegundos
    }
  };

  return (
    <Button
      ref={submitButtonRef}
      type='submit'
      className='bg-[#00C1BC] mt-8 text-white w-full flex flex-row justify-center p-2 rounded-lg'
      onClick={handleClick}
    >
      Iniciar Sesión
    </Button>
  );
};

export default LocalAuthSubmitButton;

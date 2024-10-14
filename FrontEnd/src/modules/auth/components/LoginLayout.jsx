'use client';
import { redirect, useSearchParams } from 'next/navigation';
/* import { auth } from "@/auth";
import { redirect } from 'next/navigation' */
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

const errorMessages = {
  Configuration: 'Hubo un problema con la configuración del servidor. Por favor, verifica tus opciones.',
  AccessDenied:
    'No tienes permiso para acceder a esta sección. Por favor, revisa tus permisos o contacta al administrador.',
  Verification:
    'Hubo un problema con la verificación. Es posible que el token haya expirado o ya se haya utilizado.',
  Default: 'Ocurrió un error inesperado. Por favor, intenta nuevamente o contacta al soporte.'
};

export default function LoginLayout({ children }) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // Display the toast with the appropriate error message
      const message = errorMessages[error] || errorMessages.Default;
      toast.error("Correo electrónico o contraseña incorrectos. Por favor, intenta nuevamente.");
      redirect('/login'); // back to start flow
    }
  }, [error]); // Only run when 'error' changes

  return (
    <main className='flex flex-row items-center justify-center w-full h-full overflow-hidden'>
      {children}
    </main>
  );
}

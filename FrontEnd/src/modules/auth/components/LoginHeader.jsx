import Image from 'next/image';

const LoginHeader = () => (
  <div className='flex flex-col items-center justify-center w-full gap-12'>
    <Image src='/mentify.svg' alt='Mentify logo' width={230} height={200} />
    <header className='flex flex-col gap-2'>
      <h1 className='text-4xl font-bold text-[#39487F] text-center'>¡Bienvenido de vuelta!</h1>
      <p className='hidden px-4 text-base text-center xl:block'>
        Accede a los servicios de tutoría que tenemos para ti con Mentify. Inicia sesión para comenzar.
      </p>
    </header>
  </div>
);

export default LoginHeader;

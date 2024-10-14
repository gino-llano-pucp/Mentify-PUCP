import Image from 'next/image';
import { Button } from '@nextui-org/button';
import { signIn } from '@/auth.js';

const SocialLoginButton = () => (
  <form
    action={async () => {
      'use server';
      await signIn('google');
    }}
    className='flex items-center justify-center w-full'
  >
    <Button
      type='submit'
      className='bg-white border'
      startContent={<Image src='/google.png' alt="Google's logo" width={30} height={30} />}
    >
      Inicia sesión con Google
    </Button>
  </form>
);

export default SocialLoginButton;

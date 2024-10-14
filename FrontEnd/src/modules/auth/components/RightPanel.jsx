import React from 'react';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import SocialLoginButton from './SocialLoginButton';
import Separator from './Separator';
import LocalAuthForm from './LocalAuthForm';
/* import LocalAuthForm from './LocalAuthForm'
 */
const RightPanel = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-8 p-8 overflow-y-auto bg-white '>
      <LoginHeader />
      <LoginForm>
        <SocialLoginButton />
        <Separator text={'O continúa con'} />
        <LocalAuthForm />
      </LoginForm>
    </section>
  );
};

export default RightPanel;

import { auth } from '@/auth';
import LeftPanel from '@/modules/auth/components/LeftPanel';
import LoginLayout from '@/modules/auth/components/LoginLayout';
import RightPanel from '@/modules/auth/components/RightPanel';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function LandingPage() {
  // Obtener los datos del servidor
  const session = await auth();

  if (session) {
    redirect('/portal');
  }

  return (
    <LoginLayout>
      <LeftPanel />
      <RightPanel />
    </LoginLayout>
  );
}

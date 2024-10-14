import React from 'react';
import WorkArea from '@/modules/core/components/WorkArea';
import { auth } from '@/auth';

export default async function Portal() {
  // Obtener los datos del servidor
  const session = await auth();

  return (
    <WorkArea session={session}/>
  );
}

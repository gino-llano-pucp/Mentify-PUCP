import { signOut } from '@/auth';
import React from 'react';
import ButtonLogOut from './ButtonLogOut';

export default async function SidebarLogout({}) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <ButtonLogOut/>
    </form>
  );
}

'use client';
import { LogOut } from 'lucide-react';
import React from 'react'

export default function ButtonLogOut () {
  const handleClick = () => {
    const reloadFromLocalStorage = localStorage.getItem('reload');
    localStorage.setItem('reload', 'false');
  };
  return (
    <button
      type='submit'
      className='flex w-full gap-2 px-4 py-3 items-center rounded-lg transition duration-300 ease-in-out hover:bg-[#F2F2F2] cursor-pointer'
      onClick={handleClick}
    >
        <LogOut size={20} className='text-[#555555]' />
        <p className='text-sm text-[#555555]'>Cerrar sesión</p>
    </button>
  )
}

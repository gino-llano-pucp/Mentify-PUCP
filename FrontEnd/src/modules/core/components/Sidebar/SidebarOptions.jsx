'use client';
import SidebarLink from './SidebarLink';
import { School, User } from 'lucide-react';
import { useState } from 'react';

const SidebarOptions = () => {
  const sublinks = [
    { href: '/tutores', text: 'Tutores' },
    { href: '/alumnos', text: 'Alumnos' }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  function updateSelectedIndex(index) {
    setSelectedIndex(index);
  }
  function compareSelectedIndex(index) {
    return selectedIndex == index;
  }

  return (
    <div className='flex flex-col gap-1'>
      {/* Simple link */}
      <SidebarLink
        index={0}
        compareSelectedIndex={compareSelectedIndex}
        updateSelectedIndex={updateSelectedIndex}
        href='/facultades'
        icon={<School className='w-8 h-8 md:h-6 md:w-6' />}
      >
        Facultades y Programas
      </SidebarLink>
      {/* Complex link with sublinks */}
      <SidebarLink
        index={1}
        compareSelectedIndex={compareSelectedIndex}
        updateSelectedIndex={updateSelectedIndex}
        href=''
        variant='complex'
        icon={<User className='w-8 h-8 md:h-6 md:w-6' />}
        sublinks={sublinks}
      >
        Gestión de Usuarios
      </SidebarLink>
    </div>
  );
};

export default SidebarOptions;

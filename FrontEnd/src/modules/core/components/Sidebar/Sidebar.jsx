'use client';
import ProfileCard from './ProfileCard';
import SidebarNavigation from './SidebarNavigation';
import { RoleProvider } from '../../states/RoleContext';
import { useSidebar } from '../../states/SidebarContext';
import SidebarLogo from './SidebarLogo';
import Separator from '@/modules/auth/components/Separator';

export default function Sidebar({ session, children }) {
  const { isOpen, toggleSidebar } = useSidebar();
  /* const session = await auth();

  console.log('Sesión iniciada: ', session); */
  // w-[100px]
  return (
    <>
      {/* Overlay */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 z-20`}
        onClick={toggleSidebar}
      ></div>
      {/* Sidebar flotante */}
      <div 
        className={`
          fixed md:static top-0 left-0 h-full 
          bg-[#F9F9F9] z-30 
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          flex flex-col justify-between py-4 px-3 md:p-6
          w-[250px] md:w-[310px]
        `}
      >
        <div className='flex flex-col w-full h-95 gap-4'>
            <SidebarLogo/>
            <SidebarNavigation session={session} />
        </div>
        <div className='flex flex-col gap-2'>
          <Separator/>
          <ProfileCard session={session}>
            {children}
          </ProfileCard>
        </div>
      </div>
    </>
  );
}

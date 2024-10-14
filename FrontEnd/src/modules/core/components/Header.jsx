'use client';
import { Bell } from 'lucide-react';
import React, { useEffect } from 'react';
import { useActiveComponent } from '../states/ActiveComponentContext';
import { Button } from '@nextui-org/react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useSidebar } from '../states/SidebarContext';
import { useNotificationPanel } from '../states/NotificationContext';
import NotificationPopOver from './Notifications/NotificationPopOver';
import { useRole } from '../states/RoleContext';
import SidebarInstitution from './Sidebar/SidebarInstitution';

const Header = ({session}) => {
  const { navigationHistory } = useActiveComponent();
  const { toggleSidebar } = useSidebar();
  const { toggleNotificationPanel } = useNotificationPanel();
  const { selectedRole, loadingRoles, allRolesMenuItems } = useRole();

  const activeComponentName =
    navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1].name : null;

  const SkeletonLoader = () => (
    <div className='flex animate-pulse'>
      <div className='w-[200px] h-8 bg-gray-300 rounded'>&nbsp;&nbsp;&nbsp;</div>
    </div>
  );

  useEffect(() => {
    console.log("selectedRole changed: ", selectedRole);
  }, [selectedRole])

  const hasRole = (menuItems, role) => {
    return menuItems.some(item => item.role === role);
  };

  return (
    <div className='flex items-center justify-between w-full px-4 py-4 border-b md:px-12 border-gray-30'>
      <div className='flex flex-row items-center gap-4'>
        <Button
          isIconOnly
          color='default'
          variant='light'
          aria-label='Centro de notificaciones'
          className='flex md:hidden'
          onClick={toggleSidebar}
        >
          <HamburgerMenuIcon className='block w-5 h-5 text-gray-800 md:hidden' />
        </Button>
        {activeComponentName ? (
          <h1 className='text-lg font-bold text-[#39487F]'>{activeComponentName}</h1>
        ) : (
          <SkeletonLoader />
        )}
      </div>
      <div className='flex flex-row gap-4 items-center'>
        {hasRole(allRolesMenuItems, 'Alumno') && <NotificationPopOver session={session} />}
        <SidebarInstitution/>
      </div>
    </div>
  );
};

export default Header;

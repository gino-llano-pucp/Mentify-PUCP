'use client';
import Image from 'next/image';
import {
  Dropdown,
  Button,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useRole } from '../../states/RoleContext';
import RoleSkeleton from './RoleSkeleton';
import { Check, ChevronsUpDown } from 'lucide-react';

export default function ProfileCard({ session, children }) {
  // Estado para guardar los roles decodificados
  const [roles, setRoles] = useState([]);
  const { selectedRole, setRole, loadingRoles, setLoadingRoles } = useRole();

  useEffect(() => {
    // Decodificar el token y establecer roles en el estado
    if (session) {
      const decoded = jwtDecode(session.accessToken);
      const rolesArray = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles].filter(Boolean);
      setRoles(rolesArray);
      if (rolesArray.length > 0) {
        setRole(rolesArray[0]);
        setLoadingRoles(false);
      }
    }
  }, []);

  const handleSelectRole = (index) => {
    setRole(roles[index]);
  };

  return (
    <Dropdown placement='top' className='mt-3 w-60' backdrop='blur'>
      <DropdownTrigger>
        <div
          className='flex flex-row items-center gap-4 md:gap-2 rounded-lg transition
                duration-300 ease-in-out hover:bg-[#F2F2F2] px-4 py-3 cursor-pointer
                '
        >
          <div className='flex-shrink-0'>
            <div className='relative w-10 h-10 overflow-hidden rounded-full md:w-8 md:h-8 '>
              <Image
                src={session?.user?.image || '/profile-pic.webp'}
                alt={session?.user?.name || 'Profile Picture'}
                fill={true}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className='flex-col justify-center w-full flex'>
            <div className='text-sm font-medium text-[#555555] flex flex-row items-center justify-between w-full'>{session?.user?.name || 'User Name'}
            <ChevronsUpDown className='ml-2' size={18} color='#555555'/>  
            {/* {roles.length > 1 && (
                <ChevronsUpDown className='ml-2' size={18} color='#555555'/>  
            )} */}
            </div>
            {/* {loadingRoles ? (
              <RoleSkeleton />
            ) : (
              <div className='text-sm text-[#CCC]'>{selectedRole || 'User Role'}</div>
            )} */}
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu 
          aria-label='User options' 
          variant='light'
          color='primary'
        >
          <DropdownItem
            key={"logout"}
          >
            {children}
          </DropdownItem>
      </DropdownMenu>
      {/* {roles && roles.length > 1 && (
        <DropdownMenu 
          aria-label='User roles' 
          onAction={handleSelectRole}
          variant='bordered'
          color='primary'
        >
          {roles.map((role, index) => {

            return (
            <DropdownItem 
              key={index} 
              textValue={role}
              className='flex flex-row items-center'
            >
              <div className='flex items-center w-full justify-between'>
                <span>{role}</span>
                {role === selectedRole && <Check size={18} className='ml-2' />}
              </div>
            </DropdownItem>
          )
          })}
        </DropdownMenu>
      )} */}
    </Dropdown>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import SidebarLink from './SidebarLink';
import { useActiveComponent } from '../../states/ActiveComponentContext';
import { useRole } from '../../states/RoleContext';
import fetchAPI from '../../services/apiService';
import SidebarLinkSkeleton from './SidebarLinkSkeleton';
import Separator from '@/modules/auth/components/Separator';

const SidebarNavigation = ({session}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { selectedRole, loadingRoles, allRolesMenuItems, setAllRolesMenuItems } = useRole();
  const { setActiveComponentById, setActiveComponent } = useActiveComponent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("session: ", session);
  }, [session])

  useEffect(() => {
    console.log("loading roles: ", loadingRoles);
  }, [loadingRoles])

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
      }

      const data = await fetchAPI({
        endpoint: '/sidebar-options',
        method: 'GET',
        token: session.accessToken,
        successMessage: 'Menú cargado correctamente',
        errorMessage: 'Error al cargar el menú',
        showToast: false
      });

      if (data) {
        setAllRolesMenuItems(data);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [loadingRoles]);

  // Filtrar opciones basadas en el rol seleccionado
  useEffect(() => {
    const filteredItems =
      allRolesMenuItems.find((roleMenu) => roleMenu.role === selectedRole)?.menuItems || [];
      console.log("menu completo: ", allRolesMenuItems);
    setMenuItems(filteredItems);
  }, [selectedRole, allRolesMenuItems]);

  useEffect(() => {
    // Asegurarse de que menuItems no esté vacío para configurar el componente activo
    if (menuItems.length > 0) {
      setActiveComponentById(menuItems[0].componentId, menuItems[0].label, true);
      setSelectedId(menuItems[0].id);
    }
  }, [menuItems]); // Este useEffect solo se activará cuando menuItems cambie

  /* useEffect(() => {
    console.log('menu items: ', menuItems);
  }, [menuItems]); */

  const getIconComponent = (iconName) => {
    const LucideIcons = require('lucide-react');
    const IconComponent = LucideIcons[iconName] || LucideIcons.ChevronDown;
    return <IconComponent className='h-8 md:h-5 w-8 md:w-5 text-[#555555] ' />;
  };

  return (
    <>
      {loading ? (
        <>
          <SidebarLinkSkeleton />
          <SidebarLinkSkeleton />
          <SidebarLinkSkeleton />
        </>
      ) : (
        <div className='flex flex-col gap-4 w-full overflow-y-auto elegant-scrollbar'>
          {allRolesMenuItems.map((roleMenu) => (
            <div key={roleMenu.role}>
              <Separator/>
              <h2 className='text-sm font-medium text-[#808080] mt-4 mb-2'>{roleMenu.role}</h2>
              {roleMenu.menuItems.map((item) => (
                <SidebarLink
                  key={item.id}
                  icon={getIconComponent(item.icon)}
                  componentId={item.componentId}
                  setActiveComponent={setActiveComponent}
                  onClick={() => setSelectedId(item.id)}
                  variant={item.children.length > 0 ? 'complex' : 'simple'}
                  sublinks={item.children}
                  isSelected={item.id === selectedId}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                >
                  {item.label}
                </SidebarLink>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarNavigation;

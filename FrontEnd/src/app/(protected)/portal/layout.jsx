import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/modules/core/components/Sidebar/Sidebar';
import { ActiveComponentProvider } from '@/modules/core/states/ActiveComponentContext';
import { SessionProvider } from 'next-auth/react';
import Header from '@/modules/core/components/Header';
import DynamicBreadcrumbs from '@/modules/core/components/DynamicBreadcrumbs';
import { SidebarProvider } from '@/modules/core/states/SidebarContext';
import SidebarLogout from '@/modules/core/components/Sidebar/SidebarLogout';
import NotificationPanel from '@/modules/core/components/NotificationPanel';
import { NotificationPanelProvider } from '@/modules/core/states/NotificationContext';
import { RoleProvider } from '@/modules/core/states/RoleContext';
import Separator from '@/modules/auth/components/Separator';
import { InstitucionProvider } from '@/modules/core/states/InstitutionContext';

export default async function ProtectedLayout({ children }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  console.log('Session found:', session);

  return (
    <section className='relative z-0 flex flex-row w-full h-full overflow-hidden md:h-screen'>
      <NotificationPanelProvider>
        <ActiveComponentProvider>
          <SidebarProvider>
            <RoleProvider>
              <InstitucionProvider>
                <Sidebar session={session}>
                  <SidebarLogout />
                </Sidebar>
                <div className='flex flex-col w-full'>
                  <Header session={session} />
                  <DynamicBreadcrumbs />
                  {children}
                </div>
                <NotificationPanel />
              </InstitucionProvider>
            </RoleProvider>
          </SidebarProvider>
        </ActiveComponentProvider>
      </NotificationPanelProvider>
    </section>
  );
}

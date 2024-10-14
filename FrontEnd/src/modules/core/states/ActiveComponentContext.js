'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { componentMapping } from '../lib/componentMapping';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';

const ActiveComponentContext = createContext();

export const useActiveComponent = () => useContext(ActiveComponentContext);

export const ActiveComponentProvider = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState([]);
  /* const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams(); */

  /* // Función para mapear rutas a IDs de componentes
  const getComponentIdFromPath = (path) => {
    const routes = {
      '/portal': 'home',
      '/portal/facultades': 'facultad',
      // Añade más rutas según sea necesario
    };

    return routes[path] || 'notFound';
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (!pathname.startsWith('/portal')) {
        // Redireccionar a /portal si la ruta actual no comienza con /portal
        redirect('/portal');
        return;
      }

      const componentId = getComponentIdFromPath(pathname);
      const componentName = componentMapping[componentId]?.displayName || 'Not Found';
      // Usar setActiveComponentById
      setActiveComponentById(componentId, componentName, true);
    };

    handleRouteChange();

    // No necesitamos un cleanup function aquí ya que useEffect se ejecutará
    // cada vez que pathname o searchParams cambien
  }, [pathname, searchParams]); */

  const setActiveComponent = (component, name, reset = false) => {
    if (reset) {
      // Reset the navigation history to only include the new component
      setNavigationHistory([{ component, name }]);
    } else {
      setNavigationHistory((prev) => {
        // Check if component already exists in the history to avoid duplicates
        const existingIndex = prev.findIndex((item) => item.name === name);
        if (existingIndex !== -1) {
          // Remove all entries after the existing component to simulate "going back"
          return prev.slice(0, existingIndex + 1);
        }
        // Add new component to the history
        return [...prev, { component, name }];
      });
    }
  };

  const setActiveComponentFromBreadcrumb = (index) => {
    setNavigationHistory((prev) => {
      const newHistory = prev.slice(0, index + 1);
      return newHistory;
    });
  };

  const setActiveComponentById = (componentId, componentName, reset = false) => {
    // reset = true resetea el historial de navegacion
    const Component = componentMapping[componentId];
    if (Component) {
      const componentInstance = <Component />;
      console.log('Activating component:', componentName);
      setActiveComponent(Component, componentName, reset);
    }
  };

  const goBackToPenultimate = () => {
    setNavigationHistory((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1); // Remove the last item, reverting to the penultimate
      }
      return prev; // If there's one or no items, return the current state
    });
  };

  return (
    <ActiveComponentContext.Provider
      value={{
        navigationHistory,
        setActiveComponent,
        setActiveComponentFromBreadcrumb,
        setActiveComponentById,
        goBackToPenultimate
      }}
    >
      {children}
    </ActiveComponentContext.Provider>
  );
};

'use client';
import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const SidebarContext = createContext();

// Proveedor del contexto
export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>{children}</SidebarContext.Provider>;
};

// Hook para usar el contexto
export const useSidebar = () => useContext(SidebarContext);

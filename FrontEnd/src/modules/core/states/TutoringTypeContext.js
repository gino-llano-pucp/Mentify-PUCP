'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const NameTutoringTypeContext = createContext();

// Proveedor del contexto
export const NameTutoringTypeProvider = ({ children }) => {
  const [nameTutoringType, setNameTutoringType] = useState(null);

  // Función para agregar un nuevo usuario
  const addNameTutoringType = (newNameTutoringType) => {
    setNameTutoringType(newNameTutoringType);
  };

  const clearFields = () => {
    setNameTutoringType(null);
  };

  return <NameTutoringTypeContext.Provider value={{ nameTutoringType, addNameTutoringType, clearFields }}>{children}</NameTutoringTypeContext.Provider>;
};

// Hook personalizado para facilitar el acceso al contexto
export const useNameTutoringType = () => useContext(NameTutoringTypeContext);

'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para agregar un nuevo usuario
  const addUser = (newUser) => {
    setUser(newUser);
  };

  const clearFields = () => {
    setUser(null);
  };

  return <UserContext.Provider value={{ user, addUser, clearFields }}>{children}</UserContext.Provider>;
};

// Hook personalizado para facilitar el acceso al contexto
export const useUser = () => useContext(UserContext);

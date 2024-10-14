'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const UsersContext = createContext();

// Proveedor del contexto
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  // Función para agregar un nuevo usuario
  const addUser = (newUser) => {
    setUsers([newUser]);
  };

  const removeUser = (userId) => {
    {
      console.log(users.map((arrayUser) => arrayUser.filter((user) => user.id_usuario !== userId)));
    }
    setUsers(users.map((arrayUser) => arrayUser.filter((user) => user.id_usuario !== userId)));
  };

  return <UsersContext.Provider value={{ users, addUser, removeUser }}>{children}</UsersContext.Provider>;
};

// Hook personalizado para facilitar el acceso al contexto
export const useUsers = () => useContext(UsersContext);

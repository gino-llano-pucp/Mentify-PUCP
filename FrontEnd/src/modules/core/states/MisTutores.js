'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const MisTutoresContext = createContext();

// Proveedor del contexto
export const MisTutoresProvider = ({ children }) => {
  const [misTutores, setMisTutores] = useState();

  // Función para agregar un nuevo usuario
  const addMisTutores = (newMisTutores) => {
    setMisTutores(newMisTutores);
  };

  const removeMisTutores = (userId) => {
    {
      console.log(misTutores.map((arrayMisTutores) => arrayMisTutores.filter((user) => user.id_usuario !== userId)));
    }
    setMisTutores(misTutores.map((arrayMisTutores) => arrayMisTutores.filter((user) => user.id_usuario !== userId)));
  };

  return <MisTutoresContext.Provider value={{ misTutores, addMisTutores, removeMisTutores }}>{children}</MisTutoresContext.Provider>;
};

// Hook personalizado para facilitar el acceso al contexto
export const useMisTutores = () => useContext(MisTutoresContext);

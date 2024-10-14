'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const FileContext = createContext();

// Proveedor del contexto
export const FileProvider = ({ children }) => {
    const [fileData, setFileData] = useState(null);

  // Función para agregar un nuevo usuario
  const saveFileData = (newfileData) => {
    setFileData(newfileData);
  };

  return <FileContext.Provider value={{ fileData, saveFileData }}>{children}</FileContext.Provider>;
};

// Hook personalizado para facilitar el acceso al contexto
export const useFile = () => useContext(FileContext);
'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const ProgramaContext = createContext();

// Proveedor del contexto
export const ProgramaProvider = ({ children }) => {
  const [Programa, setPrograma] = useState(null);
  const [NombrePrograma, setNombrePrograma] = useState(null);

  // Función para agregar un nuevo usuario
  const addPrograma = (newPrograma) => {
    setPrograma(newPrograma);
  };

  const addNombrePrograma = (newPrograma) => {
    setNombrePrograma(newPrograma);
  };

  const clearFields = () => {
    setPrograma(null);
  };

  return (
    <ProgramaContext.Provider value={{ Programa, NombrePrograma, addNombrePrograma, addPrograma, clearFields }}>
      {children}
    </ProgramaContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const usePrograma = () => useContext(ProgramaContext);

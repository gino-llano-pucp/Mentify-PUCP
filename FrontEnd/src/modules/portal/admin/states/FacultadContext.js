'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const FacultadContext = createContext();

// Proveedor del contexto
export const FacultadProvider = ({ children }) => {
  const [facultad, setFacultad] = useState(null);
  const [Nombrefacultad, setNombreFacultad] = useState(null);

  // Función para agregar un nuevo usuario
  const addFacultad = (newFacultad) => {
    setFacultad(newFacultad);
  };

  const addNombreFacultad = (newFacultad) => {
    setNombreFacultad(newFacultad);
  };

  const clearFields = () => {
    setFacultad(null);
  };

  return (
    <FacultadContext.Provider value={{ facultad, Nombrefacultad, addNombreFacultad, addFacultad, clearFields }}>
      {children}
    </FacultadContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useFacultad = () => useContext(FacultadContext);

'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const FacultadCoordinadorContext = createContext();

// Proveedor del contexto
export const FacultadCoordinadorProvider = ({ children }) => {
  const [coordinatorData, setCoordinatorData] = useState({
    id: '',
    code: '',
    name: '',
    apellidos: '',
    email: '',
    isSelectedFromSearch: false
  });
  const [facultadNombre, setFacultadNombre] = useState('');
  const [facultadId, setFacultadId] = useState(0);

  const clearFields = () => {
    setCoordinatorData({ id: '', code: '', name: '', apellidos: '', email: '', isSelectedFromSearch: false });
    /* setFacultadNombre(""); */
  };

  return (
    <FacultadCoordinadorContext.Provider
      value={{
        coordinatorData,
        setCoordinatorData,
        facultadNombre,
        setFacultadNombre,
        facultadId,
        setFacultadId,
        clearFields
      }}
    >
      {children}
    </FacultadCoordinadorContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useFacultadCoordinador = () => useContext(FacultadCoordinadorContext);

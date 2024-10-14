'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const DerivacionContext = createContext();

// Proveedor del contexto
export const DerivacionProvider = ({ children }) => {
  const [derivacion, setDerivacion] = useState(null);

  const addDerivacion = (newDerivacion) => {
    setDerivacion(newDerivacion);
  };

  return (
    <DerivacionContext.Provider value={{ derivacion, addDerivacion }}>
      {children}
    </DerivacionContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useDerivacion = () => useContext(DerivacionContext);
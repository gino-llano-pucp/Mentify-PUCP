'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const DetalleAlumnoContext = createContext();

// Proveedor del contexto
export const DetalleAlumnoProvider = ({ children }) => {
  const [detalleAlumno, setDetalleAlumno] = useState(null);

  const addDetalleAlumno = (newDetalleAlumno) => {
    setDetalleAlumno(newDetalleAlumno);
  };

  return (
    <DetalleAlumnoContext.Provider value={{ detalleAlumno, addDetalleAlumno }}>
      {children}
    </DetalleAlumnoContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useDetalleAlumno = () => useContext(DetalleAlumnoContext);
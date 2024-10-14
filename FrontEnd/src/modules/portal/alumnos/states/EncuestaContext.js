'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const EncuestaContext = createContext();

// Proveedor del contexto
export const EncuestaProvider = ({ children }) => {
  const [idEncuesta, setIdEncuesta] = useState(null);
  const {estadoEncuesta, setEstadoEncuesta} = useState(null);
  
  //Funcion para agreagr un id de encuesta
  const addIdEncuesta = (newIdEncuesta) => {
    setIdEncuesta(newIdEncuesta);
  };
  //Funcion para agreagr un estado de encuesta
  const addEstadoEncuesta = (newEstadoEncuesta) => {
    setIdEncuesta(newEstadoEncuesta);
  };

  const clearFields = () => {
    setIdAlumno(null);
    setIdEncuesta(null);
    setEstadoEncuesta(null);
  };


  return (
    <EncuestaContext.Provider value={{ idEncuesta, addIdEncuesta, estadoEncuesta, addEstadoEncuesta, clearFields }}>{children}</EncuestaContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useEncuestaAlumno = () => useContext(EncuestaContext);
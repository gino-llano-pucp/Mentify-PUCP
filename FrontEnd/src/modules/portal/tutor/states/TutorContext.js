'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const TutorContext = createContext();

// Proveedor del contexto
export const TutorProvider = ({ children }) => {
  const [tutorId, setTutorId] = useState(0);

  const clearFields = () => {
    setTutorId(0);
  };

  return (
    <TutorContext.Provider value={{ tutorId, setTutorId, clearFields }}>
      {children}
    </TutorContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useTutor = () => useContext(TutorContext);
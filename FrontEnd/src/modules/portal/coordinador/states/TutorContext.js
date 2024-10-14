'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const TutorContext = createContext();

// Proveedor del contexto
export const TutorProvider = ({ children }) => {
  const [tutor, setTutor] = useState();

  // Función para agregar un nuevo usuario
  const addTutor = (newTutor) => {
    setTutor(newTutor);
  };

  const removeTutor = (userId) => {
    {
      console.log(tutor.map((arrayTutor) => arrayTutor.filter((user) => user.id_usuario !== userId)));
    }
    setTutor(tutor.map((arrayTutor) => arrayTutor.filter((user) => user.id_usuario !== userId)));
  };

  return <TutorContext.Provider value={{ tutor, addTutor, removeTutor }}>{children}</TutorContext.Provider>;
};

// Hook personalizado para facilitar el acceso al contexto
export const useTutor = () => useContext(TutorContext);

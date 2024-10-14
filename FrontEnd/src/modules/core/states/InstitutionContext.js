"use client"
import React, { createContext, useContext, useState } from 'react';

const InstitucionContext = createContext();

export const InstitucionProvider = ({ children, session }) => {
  const [institucion, setInstitucion] = useState(null);

  return (
    <InstitucionContext.Provider value={{ institucion, setInstitucion }}>
      {children}
    </InstitucionContext.Provider>
  );
};

export const useInstitucion = () => useContext(InstitucionContext);

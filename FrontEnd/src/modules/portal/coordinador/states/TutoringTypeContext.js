import React, { createContext, useContext, useState } from 'react';

//crea el contexto
const TutoringTypeContext = createContext();

//crea el proveedor del contexto
export const TutoringTypeProvider = ({ children }) => {
  const [selectedTutoringType, setSelectedTutoringType] = useState(null);

  const addTutoringType = (tutoringType) => {
    setSelectedTutoringType(tutoringType);
  };

  return (
    <TutoringTypeContext.Provider value={{ selectedTutoringType, addTutoringType }}>
      {children}
    </TutoringTypeContext.Provider>
  );
};

export const useTutoringType = () => useContext(TutoringTypeContext);

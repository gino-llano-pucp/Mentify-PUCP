'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const EventInfoContext = createContext();

// Proveedor del contexto
export const EventProvider = ({ children }) => {
  const [event, setEvent] = useState({});
  const [asistenciaContext, setAsistenciaContext] = useState([]);

  return (
    <EventInfoContext.Provider value={{ event, setEvent, asistenciaContext, setAsistenciaContext }}>
      {children}
    </EventInfoContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useEventInfo = () => useContext(EventInfoContext);
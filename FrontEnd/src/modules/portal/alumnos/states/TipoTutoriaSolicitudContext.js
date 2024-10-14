'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const TipoTutoriaSolicitudContext = createContext();

// Proveedor del contexto
export const TipoTutoriaSolicitudProvider = ({ children }) => {
  const [tipoTutoriaSolicitud, setTipoTutoriaSolicitud] = useState(null);
  const [idTipoTutoriaSolicitud, setIdTipoTutoriaSolicitud] = useState(null);
  //Funcion para agreagr un nombre de tipo de tutoria
  const addTipoTutoriaSolicitud = (newTipoTutoriaSolicitud) => {
    setTipoTutoriaSolicitud(newTipoTutoriaSolicitud);
  };
  //Funcion para agregar un id de tipo de tutoria
  const addIdTipoTutoriaSolicitud = (newIdTipoTutoriaSolicitud) => {
    setIdTipoTutoriaSolicitud(newIdTipoTutoriaSolicitud);
  };

  const clearFields = () => {
    setTipoTutoriaSolicitud(null);
    setIdTipoTutoriaSolicitud(null);
  };

  return (
    <TipoTutoriaSolicitudContext.Provider value={{ tipoTutoriaSolicitud, addTipoTutoriaSolicitud, idTipoTutoriaSolicitud, addIdTipoTutoriaSolicitud, clearFields }}>{children}</TipoTutoriaSolicitudContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto
export const useTipoTutoriaSolicitud = () => useContext(TipoTutoriaSolicitudContext);
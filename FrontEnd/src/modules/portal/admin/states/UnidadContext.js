'use client';
import React, { createContext, useContext, useState } from 'react';

// Creación del contexto
const UnidadesContext = createContext();

// Proveedor del contexto
export const UnidadProvider = ({ children }) => {

    const [unidades, setUnidades] = useState([]);

    const addUnidad = (newUnidades) => {
        console.log("Se añadió la unidad",newUnidades);
        setUnidades([newUnidades]);
    };

    const removeUnidad = (id_Unidad) =>{
        {console.log(unidades.map((arrayUnidad) => arrayUnidad.filter((unidad) => unidad.id_unidad_academica !== id_Unidad)))}
        setUnidades(unidades.map((arrayUnidad) => arrayUnidad.filter((unidad) => unidad.id_unidad_academica !== id_Unidad)));
    };

    return <UnidadesContext.Provider value={{ unidades, addUnidad, removeUnidad}}>{children}</UnidadesContext.Provider>
};

// Hook personalizado para facilitar el acceso al contexto
export const useUnidades = () => useContext(UnidadesContext);

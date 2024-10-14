'use client';

import React, { createContext, useContext, useState } from 'react';

const SolicitudDerivacionContext = createContext();

export const SolicitudDerivacionProvider = ({ children }) => {
    const [derivacion, setDerivacion] = useState(null);

    const addDerivacion = (newDerivacion) => {
        setDerivacion(newDerivacion);
    };

    return (
        <SolicitudDerivacionContext.Provider value={{ derivacion, addDerivacion }}>
            {children}
        </SolicitudDerivacionContext.Provider>
    );
};

export const useDerivacion = () => useContext(SolicitudDerivacionContext);
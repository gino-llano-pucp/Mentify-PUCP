// context/ModeContext.js
import React, { createContext, useState, useContext } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState('visualizarCitas'); // Puede ser 'visualizarCitas', 'editarDisponibilidad', 'registrarCita'
    const [viewMode, setViewMode] = useState('calendar'); // Puede ser 'calendar' o 'list'

    return (
        <ModeContext.Provider value={{ mode, setMode, viewMode, setViewMode }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => useContext(ModeContext);

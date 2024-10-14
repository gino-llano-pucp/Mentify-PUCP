import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const StudentInfoContext = createContext();

// Crear el proveedor del contexto
export const StudentInfoProvider = ({ children }) => {
  const [studentInfos, setStudentInfos] = useState([]);

  const addStudentInfo = (info) => {
    setStudentInfos((prevInfos) => [...prevInfos, info]);
  };

  const updateStudentInfo = (index, info) => {
    setStudentInfos((prevInfos) => {
      const newInfos = [...prevInfos];
      newInfos[index] = info;
      return newInfos;
    });
  };

  const clearStudentInfos = () => {
    setStudentInfos([]);
  };

  const removeStudentInfo = (index) => {
    setStudentInfos((prevInfos) => prevInfos.filter((_, i) => i !== index));
  };

  const toggleStudentInfo = (info) => {
    setStudentInfos((prevInfos) => {
      const index = prevInfos.findIndex(student => student.idAlumno === info.idAlumno);
      if (index === -1) {
        // Agregar estudiante a la lista si no está presente
        return [...prevInfos, info];
      } else {
        // Remover estudiante de la lista si ya está presente
        return prevInfos.filter((_, i) => i !== index);
      }
    });
  };

  return (
    <StudentInfoContext.Provider value={{ studentInfos, addStudentInfo, updateStudentInfo, removeStudentInfo, clearStudentInfos, toggleStudentInfo, setStudentInfos }}>
      {children}
    </StudentInfoContext.Provider>
  );
};

// Hook para usar el contexto
export const useStudentInfo = () => useContext(StudentInfoContext);

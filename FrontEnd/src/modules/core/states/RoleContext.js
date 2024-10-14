'use client';
import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [allRolesMenuItems, setAllRolesMenuItems] = useState([]);

  const setRole = (role) => {
    setSelectedRole(role);
  };

  return (
    <RoleContext.Provider value={{ selectedRole, setRole, loadingRoles, setLoadingRoles, allRolesMenuItems, setAllRolesMenuItems }}>
      {children}
    </RoleContext.Provider>
  );
};

'use client';
import React, { createContext, useContext, useState } from 'react';

const NotificationPanelContext = createContext();

export const useNotificationPanel = () => useContext(NotificationPanelContext);

export const NotificationPanelProvider = ({ children }) => {
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const toggleNotificationPanel = () => {
    setNotificationPanelOpen(!isNotificationPanelOpen);
  };

  return (
    <NotificationPanelContext.Provider value={{ isNotificationPanelOpen, toggleNotificationPanel }}>
      {children}
    </NotificationPanelContext.Provider>
  );
};

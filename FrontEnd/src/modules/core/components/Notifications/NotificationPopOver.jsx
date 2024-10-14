"use client"
import React, { useEffect, useRef, useState } from 'react'
import {Popover, PopoverTrigger, PopoverContent, Button, Badge} from "@nextui-org/react";
import { Bell, CircleX } from 'lucide-react';
import NotificationCard from './NotificationCard';
import fetchAPI from '../../services/apiService';

const NotificationPopOver = ({session}) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
      }

      const data = await fetchAPI({
        endpoint: '/notifications',
        method: 'GET',
        token: session.accessToken,
        successMessage: 'Notificaciones cargadas correctamente',
        errorMessage: 'Error al cargar notificaciones',
        showToast: false
      });

      if (data && data.data) {
        setNotifications(data.data);
      }
    };

    fetchNotifications();
  }, [session]);

  useEffect(() => {
    console.log("notificaciones: ", notifications);
  }, [notifications])

  const handleClose = async () => {
    if (!session || !session.accessToken) {
      console.log('No session or token available');
      return;
    }

    const notificationIds = notifications
      .filter(notification => !notification.leido)
      .map(notification => notification.id);

    if (notificationIds.length > 0) {
      await fetchAPI({
        endpoint: '/notifications/mark-as-read',
        method: 'PUT',
        token: session.accessToken,
        payload: { notificationIds },
        successMessage: 'Notificaciones marcadas como leídas',
        errorMessage: 'Error al marcar notificaciones como leídas',
        showToast: false
      });

      // Actualizar el estado local para marcar las notificaciones como leídas
      setNotifications(notifications.map(notification => 
        notificationIds.includes(notification.id)
          ? { ...notification, leido: true }
          : notification
      ));
    }

    setIsOpen(false);
  };

  const handleClosePopover = () => {
    setIsOpen(false);
    handleClose();
  };

  function handleOpenChange(open) {
    setIsOpen(open);
  }

  const handleButtonClick = () => {
    if (badgeRef.current) {
      badgeRef.current.click();
    }
  };

  return (
    <Popover placement="bottom" showArrow={false} onClose={handleClose} isOpen={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Badge isInvisible={notifications.filter(notification => !notification.leido).length === 0} content={notifications.filter(notification => !notification.leido).length} color='danger' size='lg' ref={badgeRef}>
          <Button 
            isIconOnly 
            color='default' 
            variant='light' 
            aria-label='Centro de notificaciones' 
            className='border border-gray-300' 
            onClick={handleButtonClick}
          >
            <Bell className='w-5 h-5 text-gray-800' />
          </Button>
        </Badge>
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex flex-col w-full h-[400px] p-2 overflow-y-auto elegant-scrollbar'>
            <div className='w-[450px] flex flex-row justify-between items-center p-2'>
                <h2 className='text-lg font-bold text-gray-900'>Notificaciones</h2>
                <Button isIconOnly color='default' variant='light' aria-label='Cerrar centro de notificaciones' onPress={handleClosePopover}>
                    <CircleX className='w-5 h-5 text-gray-600'/>
                </Button>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              {notifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationPopOver
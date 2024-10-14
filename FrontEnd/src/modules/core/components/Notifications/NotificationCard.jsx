import { BookOpen, Building2, Calendar } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ProfilePicturePlaceholder from '../ProfilePicturePlaceholder'
import { Chip } from '@nextui-org/react'

// Configuración de los estados de las notificaciones para los chips
const notificationStatuses = {
    'confirmación': { color: 'success', text: 'Programada' },
    'cambio': { color: 'warning', text: 'Modificada' },
    'cancelación': { color: 'danger', text: 'Cancelada' }
};

const NotificationCard = ({notification}) => {
    const chipSettings = notificationStatuses[notification.tipo] || { color: 'default', text: 'Estado Desconocido' };
    // Clase condicional para notificaciones leídas
    const opacityClass = notification.leido ? 'opacity-80' : 'opacity-100';

    return (
        <div className={`flex flex-col w-full gap-2 cursor-pointer transition duration-300 hover:bg-gray-200 rounded-lg p-2 ${opacityClass}`}>
            <div className='flex flex-row w-full justify-between items-center'>
                <div className='flex flex-row gap-2 items-center'>
                    <ProfilePicturePlaceholder
                        src={notification.avatar}
                        alt={notification.tutor}
                        width={8}
                        height={8}
                    />
                    <span className='font-medium'>{notification.tutor}</span>
                    <span>{notification.title}</span>
                </div>
                {!notification.leido && (
                    <div className="flex translate-x-2 -translate-y-5 items-center justify-center w-3 h-3 bg-blue-500 rounded-full ml-2"></div>
                )}
            </div>
            <div className='flex flex-col pl-10'>
                <div className='flex flex-row w-full gap-2'>
                    <BookOpen size={16}/>
                    <span>{notification.tipoTutoria}</span>
                </div>
                <div className='flex flex-row w-full gap-2'>
                    <Calendar size={16}/>
                    <span>{notification.time}</span>
                </div>
                <div className='flex flex-row w-full gap-2'>
                    <Building2 size={16}/>
                    <span>{notification.details}</span>
                </div>
                <div className='flex flex-row justify-between mt-2 items-center'>
                <Chip size="sm" color={chipSettings.color} variant='dot'>{chipSettings.text}</Chip>
                <span className='text-gray-500'>{notification.ago}</span>
                </div>
            </div>

        </div>
    )
}

export default NotificationCard
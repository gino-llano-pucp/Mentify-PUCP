"use client";
import React from 'react'
import { useNotificationPanel } from '../states/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = () => {
    const { isNotificationPanelOpen } = useNotificationPanel();

    // Definir las variantes de animación para framer-motion
    const variants = {
        open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
        closed: { x: "100%", opacity: 0 }
    };

    if (!isNotificationPanelOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
            className="notification-panel"
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            style={{
                width: '300px',
                height: '100vh',
                backgroundColor: 'white',
            }}
            >
            {/* Contenido del panel de notificaciones */}
            <h2>Notificaciones</h2>
            <p>¡Tienes nuevas notificaciones!</p>
            </motion.div>
        </AnimatePresence>
    )
}

export default NotificationPanel
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io } from 'socket.io-client';

interface Notification {
    id: string;
    type: 'NEW_ORDER';
    orderId: number;
    userName: string;
    userEmail: string;
    totalPrice: number;
    itemCount: number;
    timestamp: string;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Conectar al servidor Socket.IO
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8089';
        const socketInstance = io(API_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketInstance.on('connect', () => {
            console.log('✅ Conectado a Socket.IO');
            // Unirse al room de administradores
            socketInstance.emit('join-admin');
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Desconectado de Socket.IO');
        });

        // Escuchar nuevas órdenes
        socketInstance.on('new-order', (notification: Notification) => {
            console.log('📢 Nueva orden recibida:', notification);
            setNotifications(prev => [notification, ...prev]);

            // Reproducir sonido de notificación (opcional)
            playNotificationSound();
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => console.log('No se pudo reproducir el sonido:', err));
        } catch (error) {
            console.log('Error al reproducir sonido:', error);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                clearNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import axios from 'axios';

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
    const [seenOrderIds, setSeenOrderIds] = useState<Set<number>>(new Set());
    const pollingIntervalRef = useRef<number | null>(null);

    const fetchRecentOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8089';
            const response = await axios.get(`${API_URL}/orders/recent?minutes=10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const newNotifications: Notification[] = response.data.data;

                // Filtrar solo las notificaciones que no hemos visto antes
                const unseenNotifications = newNotifications.filter(
                    notif => !seenOrderIds.has(notif.orderId)
                );

                if (unseenNotifications.length > 0) {
                    // Agregar las nuevas notificaciones al inicio
                    setNotifications(prev => [...unseenNotifications, ...prev]);

                    // Actualizar el conjunto de IDs vistos
                    setSeenOrderIds(prev => {
                        const newSet = new Set(prev);
                        unseenNotifications.forEach(notif => newSet.add(notif.orderId));
                        return newSet;
                    });

                    // Reproducir sonido solo para nuevas notificaciones
                    playNotificationSound();
                }
            }
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
        }
    };

    useEffect(() => {
        // Obtener notificaciones inmediatamente
        fetchRecentOrders();

        // Configurar polling cada 10 segundos
        pollingIntervalRef.current = setInterval(fetchRecentOrders, 10000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [seenOrderIds]); // Dependencia en seenOrderIds para actualizar el intervalo

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
        setSeenOrderIds(new Set());
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

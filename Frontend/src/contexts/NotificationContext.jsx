import { createContext, useContext, useMemo, useState } from 'react';
import { sendWhatsAppNotification } from '../api/notifications';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const notify = async ({
    type = 'info',
    title = 'Notification',
    message = 'New update available',
    timeout = 5000,
    whatsappPhone,
    whatsappMessage,
    actionLabel,
    onAction,
  } = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type,
      title,
      message,
      timeout,
      whatsappPhone,
      whatsappMessage,
      actionLabel,
      onAction,
      whatsappStatus: null,
    };

    setToasts((prev) => [toast, ...prev].slice(0, 4));

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      }
    }

    if (whatsappPhone && whatsappMessage) {
      try {
        const response = await sendWhatsAppNotification({
          phone: whatsappPhone,
          message: whatsappMessage,
          title,
        });

        if (response.ok) {
          setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, whatsappStatus: 'Queued for WhatsApp' } : item)));
        } else {
          setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, whatsappStatus: 'Delivery failed' } : item)));
        }
      } catch (error) {
        console.warn('WhatsApp notification failed', error);
        setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, whatsappStatus: 'Delivery failed' } : item)));
      }
    }

    window.setTimeout(() => removeToast(id), timeout);
  };

  const value = useMemo(() => ({ notify, removeToast }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`notification-card ${toast.type || 'info'}`}>
            <div className="notification-icon">✉️</div>
            <div style={{ flex: 1 }}>
              <div className="notification-title">{toast.title}</div>
              <div className="notification-message">{toast.message}</div>
              {toast.whatsappStatus && <div className="notification-message" style={{ marginTop: '.3rem', fontSize: '.8rem' }}>{toast.whatsappStatus}</div>}
              {(toast.actionLabel || toast.onAction) && (
                <div className="notification-actions">
                  <button
                    className="notification-btn"
                    onClick={() => {
                      if (toast.onAction) toast.onAction();
                      removeToast(toast.id);
                    }}
                  >
                    {toast.actionLabel || 'Open'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

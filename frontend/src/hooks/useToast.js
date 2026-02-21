import { useState, useCallback, useRef } from 'react';

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const removeToast = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((title, message, type = 'ok') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, title, message, type }]);
        timers.current[id] = setTimeout(() => removeToast(id), 4500);
        return id;
    }, [removeToast]);

    return { toasts, addToast, removeToast };
}

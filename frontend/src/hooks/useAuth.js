import { useState, useEffect, useCallback } from 'react';

const API = '/api';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('lawpilot_token'));
    const [loading, setLoading] = useState(true);

    const api = useCallback(async (path, options = {}) => {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API}${path}`, { ...options, headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(err.detail || 'Request failed');
        }
        return res.json();
    }, [token]);

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        api('/auth/me')
            .then(u => setUser(u))
            .catch(() => { localStorage.removeItem('lawpilot_token'); setToken(null); })
            .finally(() => setLoading(false));
    }, [token, api]);

    const login = async (email, password) => {
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);
        const data = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form,
        }).then(r => {
            if (!r.ok) throw new Error('Login failed');
            return r.json();
        });
        localStorage.setItem('lawpilot_token', data.access_token || data.accessToken);
        setToken(data.access_token || data.accessToken);
        setUser(data.user);
        return data;
    };

    const register = async (email, password, name) => {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name: name, fullName: name }),
        });
        localStorage.setItem('lawpilot_token', data.access_token || data.accessToken);
        setToken(data.access_token || data.accessToken);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('lawpilot_token');
        setToken(null);
        setUser(null);
    };

    return {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        api,
    };
}

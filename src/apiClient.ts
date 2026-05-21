export const API_BASE = '/v2';

let accessToken = localStorage.getItem('access_token') || null;

export const setToken = (token: string) => {
    accessToken = token;
    localStorage.setItem('access_token', token);
};

export const clearToken = () => {
    accessToken = null;
    localStorage.removeItem('access_token');
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
    }

    return res.json();
};

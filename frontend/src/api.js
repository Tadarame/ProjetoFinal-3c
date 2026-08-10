export const API_URL = 'http://localhost:8000/api';

export function getToken() {
    return localStorage.getItem('token');
}
export function setToken(token) {
    localStorage.setItem('token', token);
}

export function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

export async function apiFetch(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        Accept: 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        logout();
        return;
    }

    return response;
}
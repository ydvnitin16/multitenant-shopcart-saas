const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const loginUser = async (data) => {
    const res = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Authentication failed');
    }
    return await res.json();
};

export const signupUser = async (data) => {
    const res = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Authentication failed');
    }
    return await res.json();
};

export const logoutUser = async () => {
    const res = await fetch(`${BASE_URL}/user/logout`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Logout failed');
    }

    return await res.json();
};

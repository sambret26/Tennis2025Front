import { API_URL } from './apiConfig.js';

const USER_API_URL = `${API_URL}/users`;

export async function connectUser(username, password) {
    try {
        const response = await fetch(`${USER_API_URL}/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if(response.status === 401) {
            return 401;
        }
        if(response.status === 404) {
            return 404;
        }
        if(!response.ok) {
            throw new Error('Failed to connect user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error connecting user:', error);
        throw error;
    }
}

export async function createAccount(username, password) {
    try {
        const response = await fetch(`${USER_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if(response.status === 409) {
            return 409;
        }
        if(!response.ok) {
            throw new Error('Failed to create account');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}

export async function updateRole(userId, newRole) {
    try {
        const response = await fetch(`${USER_API_URL}/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newRole: newRole })
        });
        if(response.status === 403) {
            return 403;
        }
        if(!response.ok) {
            throw new Error('Failed to update role');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
}

export async function connectAdmin(password, userId, newRole) {
    try {
        const response = await fetch(`${USER_API_URL}/admin/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password, userId, newRole }),
        });
        if(response.status === 401 || response.status === 403) {
            return 401;
        }
        if(!response.ok) {
            throw new Error('Failed to connect admin');
        }
        return await response.json();
    } catch (error) {
        console.error('Error connecting admin:', error);
        throw error;
    }
}
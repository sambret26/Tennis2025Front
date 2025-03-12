import { API_URL } from './apiConfig.js';

const SETTINGS_API_URL = `${API_URL}/settings`;

export async function getSettings() {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/`);
        if(!response.ok) {
            throw new Error('Failed to fetch settings');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
    }
}

export async function updatePrices(prices) {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/updatePrices`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prices})
        });
        if(!response.ok) {
            throw new Error('Failed to update prices');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating prices:', error);
        throw error;
    }
}

export async function updateBatchsActive(batchsActive) {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/batchsActive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ batchsActive })
        });
        if(!response.ok) {
            throw new Error('Failed to update batchsActive');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating batchsActive:', error);
        throw error;
    }
}

export async function updateMojaSync(mojaSync) {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/mojaSync`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mojaSync })
        });
        if(!response.ok) {
            throw new Error('Failed to update mojaSync');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating mojaSync:', error);
        throw error;
    }
}

export async function updateCalendarSync(calendarSync) {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/calendarSync`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ calendarSync })
        });
        if(!response.ok) {
            throw new Error('Failed to update calendarSync');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating calendarSync:', error);
        throw error;
    }
}

export async function updateToken(token) {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/token`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        if(!response.ok) {
            throw new Error('Failed to update token');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating token:', error);
        throw error;
    }
}
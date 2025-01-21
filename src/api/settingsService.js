import { API_URL } from './apiConfig.js';

const SETTINGS_API_URL = `${API_URL}/settings`;

export async function getStartAndEndDate() {
    try {
        const response = await fetch(`${SETTINGS_API_URL}/dates`);
        if(!response.ok) {
            throw new Error('Failed to fetch start and end dates');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching start and end dates:', error);
        throw error;
    }
}
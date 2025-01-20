import { API_URL } from './apiConfig.js';

const AVAILABILITY_API_URL = API_URL + '/availabilities';

export async function getAllAvailabilities() {
    try {
        const response = await fetch(`${AVAILABILITY_API_URL}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch availabilities');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching availabilities:', error);
        throw error;
    }
}
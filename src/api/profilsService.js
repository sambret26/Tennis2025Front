import { API_URL } from './apiConfig.js';

const PROFILS_API_URL = `${API_URL}/profils`;

export async function getProfils() {
    try {
        const response = await fetch(`${PROFILS_API_URL}/`);
        if(!response.ok) {
            throw new Error('Failed to fetch profils');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching profils:', error);
        throw error;
    }
}
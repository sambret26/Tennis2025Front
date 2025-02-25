import { API_URL } from './apiConfig.js';

const COMPETITION_API_URL = `${API_URL}/competitions`;

export async function getCompetitions() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch competitions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching competitions:', error);
        throw error;
    }
}

export async function updateCompetition(competition) {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(competition)
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour de la competition');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}
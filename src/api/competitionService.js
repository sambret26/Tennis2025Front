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

export async function updateCompetition(competitionId) {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/active`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(competitionId)
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour de la compétition');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updateCompetitions() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour de la liste des compétitions');
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function getStartAndEndDate() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/dates`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error('Erreur lors de la récupération des dates de la compétition');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}
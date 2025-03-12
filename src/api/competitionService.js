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

export async function activeCompetition(competitionId) {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/active`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ competitionId })
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour de la compétition');
        const responseBody = await response.json();
        return responseBody['isBatchActive'];
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

export async function deleteCompetitionData() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/deleteAllDatas`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression des données de la compétition');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updateCourts() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/courts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des courts');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updateCategories() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des catégories');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updateGrids() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/grids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des découpages');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updateMatches() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des matchs');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updateRankings() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/rankings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des classements');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

export async function updatePlayers() {
    try {
        const response = await fetch(`${COMPETITION_API_URL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des joueurs');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}
import { API_URL } from './apiConfig.js';

const MATCHES_API_URL = `${API_URL}/matches`;

export async function getMatches(date) {
    try {
        const formattedDate = date.toISOString().split('T')[0]; // Convertit la date en format ISO
        const response = await fetch(`${MATCHES_API_URL}/planning?date=${formattedDate}`);
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
}

export async function updateMatchResult(matchId, playerId, score) {
    try {
        const response = await fetch(`${MATCHES_API_URL}/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId, playerId, score }),
        });
        if (!response.ok) {
            throw new Error('Failed to set match result');
        }
    } catch (error) {
        console.error('Error setting match result:', error);
        throw error;
    }
}
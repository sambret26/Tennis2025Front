import { API_URL } from './apiConfig.js';
import { getLocaleDate } from '../utils/dateUtils.js';

const MATCHES_API_URL = `${API_URL}/matches`;

export async function getMatches(date) {
    try {
        const formattedDate = getLocaleDate(date); // TODO Sortir la conversion
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

export async function updateMatchResult(matchId, playerId, score, finish, double) {
    try {
        const response = await fetch(`${MATCHES_API_URL}/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId, playerId, score, finish, double }),
        });
        if (!response.ok) {
            throw new Error('Failed to set match result');
        }
    } catch (error) {
        console.error('Error setting match result:', error);
        throw error;
    }
}

export async function updatePlayerAvailability(matchId, available, playerNumber) {
    try {
        const response = await fetch(`${MATCHES_API_URL}/playerAvailability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId, available, playerNumber }),
        });
        if (!response.ok) {
            throw new Error('Failed to update player availability');
        }
    } catch (error) {
        console.error('Error updating player availability:', error);
        throw error;
    }
}
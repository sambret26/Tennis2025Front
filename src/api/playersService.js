import { API_URL } from './apiConfig.js';

const PLAYERS_API_URL = API_URL + '/players';

export async function getAllPlayers() {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/allNames`);
        if(!response.ok) {
            throw new Error('Failed to fetch players');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching players:', error);
        throw error;
    }
}
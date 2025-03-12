import { API_URL } from './apiConfig.js';

const PLAYERS_API_URL = `${API_URL}/players`;

export async function getAllPlayers() {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/`);
        
        if(!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch players: ${response.status} ${errorText}`);
        }
        
        const text = await response.text();
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            throw new Error('Invalid JSON response');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching players:', error);
        throw error;
    }
}
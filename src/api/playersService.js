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

export async function updatePlayerBalance(playerId, balance) {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/${playerId}/balance`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(balance)
        });

        if (!response.ok) {
            throw new Error(`Failed to update balance: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating balance:', error);
        throw error;
    }
}
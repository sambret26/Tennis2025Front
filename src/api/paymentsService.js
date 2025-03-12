import { API_URL } from './apiConfig.js';

const PAYMENTS_API_URL = `${API_URL}/payments`;

export async function updatePlayerPayments(playerId, payments, balance) {
    try {
        const response = await fetch(`${PAYMENTS_API_URL}/${playerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payments, balance })
        });

        if (!response.ok) {
            throw new Error(`Failed to update payments: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating payments:', error);
        throw error;
    }
}

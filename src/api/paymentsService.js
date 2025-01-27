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

export async function getPlayerPayments(playerId) {
    try {
        const response = await fetch(`${PAYMENTS_API_URL}/${playerId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch payments: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
}

export async function deletePlayerPayment(paymentId) {
    try {
        const response = await fetch(`${PAYMENTS_API_URL}/${paymentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete payment: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting payment:', error);
        throw error;
    }
}

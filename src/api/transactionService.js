import { API_URL } from './apiConfig.js';

const TRANSACTION_API_URL = `${API_URL}/transactions`;

export async function getTransactions() {
    try {
        const response = await fetch(`${TRANSACTION_API_URL}/`);
        if(!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

export const updateTransactions = async (transactions) => {
    try {
        const response = await fetch(`${TRANSACTION_API_URL}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactions }),
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des transactions');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};
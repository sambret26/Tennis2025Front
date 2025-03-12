import { API_URL } from './apiConfig.js';

const REDUCTION_API_URL = `${API_URL}/reductions`;

export const updatePlayerReductions = async (playerId, reductions, balance) => {
    try {
        const response = await fetch(`${REDUCTION_API_URL}/${playerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reductions, balance }),
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour des réductions du joueur');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};


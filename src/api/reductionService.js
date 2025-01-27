import { API_URL } from './apiConfig.js';

const REDUCTION_API_URL = `${API_URL}/reductions`;

export const getPredefinedReductions = async () => {
    try {
        const response = await fetch(`${REDUCTION_API_URL}/predefined`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des réductions prédéfinies');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const createReduction = async (playerId, reductionData) => {
    try {
        const response = await fetch(`${REDUCTION_API_URL}/${playerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reductionData),
        });
        if (!response.ok) throw new Error('Erreur lors de la création de la réduction');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const deleteReduction = async (reductionId) => {
    try {
        const response = await fetch(`${REDUCTION_API_URL}/${reductionId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression de la réduction');
        return true;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

export const updatePlayerReductions = async (playerId, reductions, balance) => {
    try {
        console.log(JSON.stringify({ reductions, balance }));
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


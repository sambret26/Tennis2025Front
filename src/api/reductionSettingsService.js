import { API_URL } from './apiConfig.js';

const REDUCTION_SETTINGS_API_URL = `${API_URL}/reductionSettings`;

export const getPredefinedReductions = async () => {
    try {
        const response = await fetch(`${REDUCTION_SETTINGS_API_URL}/`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des réductions prédéfinies');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};
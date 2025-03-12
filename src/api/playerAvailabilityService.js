import { API_URL } from './apiConfig.js';
import { getLocaleDate } from '../utils/dateUtils.js';

const PLAYER_AVAILABILITY_API_URL = `${API_URL}/playerAvailabilities`;

export async function getAllPlayersAvailabilities() {
    try {
        const response = await fetch(`${PLAYER_AVAILABILITY_API_URL}/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch availabilities');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching availabilities:', error);
        throw error;
    }
}

export async function getAllPlayersAvailabilitiesForDay(date) {
    let formattedDate = '[no formatted date]';
    try {
        formattedDate = getLocaleDate(date); // Convertit la date en format ISO
        const response = await fetch(`${PLAYER_AVAILABILITY_API_URL}/date?date=${formattedDate}`);
        if (!response.ok) {
            throw new Error('Failed to fetch availabilities for day ' + formattedDate);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching availabilities for day ' + formattedDate + ':', error);
        throw error;
    }
}

export async function updatePlayerAvailability(playerId, day, timeSlot, available) {
    try {
        const response = await fetch(`${PLAYER_AVAILABILITY_API_URL}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId, day, timeSlot, available }),
        });
        if (!response.ok) { 
            throw new Error('Failed to update player availability for playerId ' + playerId);
        }
    } catch (error) {
        console.error('Error updating player availability for playerId ' + playerId + ':', error);
        throw error;
    }
}
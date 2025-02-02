import { API_URL } from './apiConfig.js';

const ACCOUNT_API_URL = `${API_URL}/accounts`;

export async function getAccountData() {
    try {
        const response = await fetch(`${ACCOUNT_API_URL}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch account data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching account data:', error);
        throw error;
    }
}

export async function getAccountDataForADay(day) {
    try {
        const response = await fetch(`${ACCOUNT_API_URL}/${day}`);
        if (!response.ok) {
            throw new Error('Failed to fetch account data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching account data:', error);
        throw error;
    }
}
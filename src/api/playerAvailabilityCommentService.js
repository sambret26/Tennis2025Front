import { API_URL } from './apiConfig.js';

const COMMENT_API_URL = `${API_URL}/playerAvailabilityComment`;

export const getAllCommentsForDay = async (day) => {
    try {
        const response = await fetch(`${COMMENT_API_URL}/${day}`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments for day');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments for day:', error);
        throw error;
    }
};

export const createOrUpdateComment = async (commentData) => {
    try {
        const response = await fetch(`${COMMENT_API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({commentData}),
        });
        if (!response.ok) {
            throw new Error('Failed to save comment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error saving comment:', error);
        throw error;
    }
};
import axios from 'axios';
import { API_URL } from './apiConfig.js';

const COMMENT_API = `${API_URL}/playerAvailabilityComment`;

export const getAllCommentsForDay = async (day) => {
    try {
        const response = await axios.get(`${COMMENT_API}/${day}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments for day:', error);
        throw error;
    }
};

export const createOrUpdateComment = async (commentData) => {
    try {
        const response = await axios.post(COMMENT_API, commentData);
        return response.data;
    } catch (error) {
        console.error('Error saving comment:', error);
        throw error;
    }
};
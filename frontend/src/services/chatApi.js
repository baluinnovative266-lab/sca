import axios from 'axios';

const API_BASE_URL = '/api';

export const sendChatMessage = async (message, career, skills) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            message,
            career,
            skills
        });
        return response.data;
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
    }
};

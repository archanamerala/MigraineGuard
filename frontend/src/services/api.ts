import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const predictMigraine = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const getFeatureImportance = async () => {
  const response = await axios.get(`${API_BASE_URL}/feature-importance`);
  return response.data;
};
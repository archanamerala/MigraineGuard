import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export const predict = async (data) => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

export const fetchWeather = async (city = 'London') => {
  try {
    const response = await api.post('/weather', { city });
    return response.data;
  } catch (error) {
    console.error('Weather error:', error);
    return { temperature: 22, humidity: 65, pressure: 1013, city, mock: true };
  }
};
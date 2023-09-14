import axios from 'axios';

const defaultBaseURL = 'http://localhost:3001';
const backendBaseURL = process.env.BACKEND_BASE_URL || defaultBaseURL;

const httpService = axios.create({
  baseURL: backendBaseURL,
  timeout: 10000,
});

export const get = async (url, config = {}) => {
  try {
    const response = await httpService.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const post = async (url, data, config = {}) => {
  try {
    const response = await httpService.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

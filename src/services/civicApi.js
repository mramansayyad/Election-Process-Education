import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
const BASE_URL = 'https://www.googleapis.com/civicinfo/v2';

const civicClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const getVoterInfo = async (address) => {
  if (!API_KEY) {
    console.warn('VITE_GOOGLE_CIVIC_API_KEY is missing');
    throw new Error('API Key Missing: Please check your .env file.');
  }

  try {
    const response = await civicClient.get('/voterinfo', {
      params: {
        address: address,
        // We leave electionId empty to get the most recent/upcoming election
      },
    });
    return response.data;
  } catch (error) {
    console.error('Civic API Error:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error('No upcoming elections found for this address, or the address is invalid.');
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch election data.');
  }
};

export const getRepresentatives = async (address) => {
  try {
    const response = await civicClient.get('/representatives', {
      params: { address },
    });
    return response.data;
  } catch (error) {
    console.error('Civic API Error (Reps):', error.message);
    throw error;
  }
};

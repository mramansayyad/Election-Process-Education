import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
const BASE_URL = 'https://www.googleapis.com/civicinfo/v2';

const civicClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Mock data shown when no active election is found (typical in off-cycle years)
const getMockVoterData = (address) => ({
  isMockData: true,
  kind: 'civicinfo#voterInfoResponse',
  normalizedInput: {
    line1: address,
    city: 'Your City',
    state: 'XX',
    zip: address.replace(/\D/g, '').slice(0, 5),
  },
  election: {
    id: 'mock',
    name: 'General Election (Example)',
    electionDay: '2026-11-03',
  },
  pollingLocations: [
    {
      address: {
        locationName: 'Community Center (Example)',
        line1: '123 Main Street',
        city: 'Your City',
        state: 'XX',
        zip: '00000',
      },
      pollingHours: '7:00 AM - 8:00 PM',
      notes: 'This is example data. Your actual polling place will appear here closer to the election.',
    },
  ],
  earlyVoteSites: [],
  dropOffLocations: [],
});

export const getVoterInfo = async (address) => {
  if (!API_KEY) {
    console.warn('VITE_GOOGLE_CIVIC_API_KEY is missing — returning mock data');
    return getMockVoterData(address);
  }

  try {
    const response = await civicClient.get('/voterinfo', {
      params: {
        address: address,
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    console.warn(`Civic API returned ${status} — falling back to mock data`);

    // 404 = no active election, 400 = bad address, both are expected in off-cycle years
    if (status === 404 || status === 400) {
      return getMockVoterData(address);
    }

    // For genuine server/auth errors, surface a friendly message
    const apiMessage = error.response?.data?.error?.message;
    throw new Error(
      apiMessage || 'Unable to fetch election data right now. Please try again later.'
    );
  }
};

export const getRepresentatives = async (address) => {
  if (!API_KEY) return { offices: [], officials: [] };

  try {
    const response = await civicClient.get('/representatives', {
      params: { address },
    });
    return response.data;
  } catch (error) {
    console.warn('Civic API (Reps) failed — returning empty result', error.message);
    return { offices: [], officials: [] };
  }
};

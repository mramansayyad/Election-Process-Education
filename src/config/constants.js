/**
 * Election Process Education - Global Constants
 * Centralized configuration for industrial-grade decoupling.
 */

export const STATE_NAMES = {
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CH: 'Chandigarh',
  CT: 'Chhattisgarh',
  DN: 'Dadra and Nagar Haveli and Daman and Diu',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JK: 'Jammu and Kashmir',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PY: 'Puducherry',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UT: 'Uttarakhand',
  WB: 'West Bengal',
};

export const PIN_PREFIX_TO_STATE = {
  '11': 'DL', '12': 'HR', '13': 'HR', '14': 'PB', '15': 'PB',
  '16': 'CH', '17': 'HP', '18': 'JK', '19': 'JK', '20': 'UP',
  '21': 'UP', '22': 'UP', '23': 'UP', '24': 'UP', '25': 'UP',
  '26': 'UP', '27': 'UP', '28': 'UT', '30': 'RJ', '31': 'RJ',
  '32': 'RJ', '33': 'RJ', '34': 'RJ', '36': 'GJ', '37': 'GJ',
  '38': 'GJ', '39': 'GJ', '40': 'MH', '41': 'MH', '42': 'MH',
  '43': 'MH', '44': 'MH', '45': 'MP', '46': 'MP', '47': 'MP',
  '48': 'MP', '49': 'CT', '50': 'TG', '51': 'AP', '52': 'AP',
  '53': 'AP', '56': 'KA', '57': 'KA', '58': 'KA', '59': 'KA',
  '60': 'TN', '61': 'TN', '62': 'TN', '63': 'TN', '64': 'TN',
  '67': 'KL', '68': 'KL', '69': 'KL', '70': 'WB', '71': 'WB',
  '72': 'WB', '73': 'WB', '74': 'WB', '75': 'OR', '76': 'OR',
  '77': 'OR', '78': 'AS', '79': 'AS', '80': 'BR', '81': 'BR',
  '82': 'BR', '83': 'JH', '84': 'BR', '85': 'BR',
};

export const ECI_LINKS = {
  VOTER_PORTAL: 'https://voters.eci.gov.in/',
  KNOW_YOUR_CANDIDATE: 'https://voterportal.eci.gov.in/know-your-candidate',
  VOTER_GUIDE: 'https://eci.gov.in/voter-guide/',
  ELECTORAL_ROLL: 'https://electoralsearch.eci.gov.in/',
  POLLING_STATION_LOCATOR: 'https://voterportal.eci.gov.in/polling-station',
};

export const APP_CONFIG = {
  TITLE: 'Indian Voter Guide 2026',
  LOCAL_STORAGE_KEY: 'voter_profile_secure',
  GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', // To be replaced in production
};

export const UI_STRINGS = {
  WELCOME_TITLE: 'Your Vote, Your Future',
  WELCOME_SUBTITLE: 'Hardened Guide for Indian Citizens',
  LOGIN_PROMPT: 'Please sign in to access personalized voter milestones.',
  JARGON_PLACEHOLDER: 'Ask about "EVM", "VVPAT", "MCC"...',
};

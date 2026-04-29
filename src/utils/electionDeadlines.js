/**
 * Indian Election Deadlines Utility
 * Based on the Election Commission of India (ECI) schedule:
 * - National Voters' Day: January 25
 * - Special Summary Revision (SSR): Oct–Jan annually
 * - Lok Sabha Election: May 2024 (next ~2029)
 * - Various Vidhan Sabha cycles by State/UT
 *
 * For this educational tool, we provide the next-cycle milestones
 * mapped by the user's PIN-detected state.
 */

// Shared ECI portal links
const ECI = {
  voterSearch: 'https://voters.eci.gov.in',
  registration: 'https://voters.eci.gov.in/registration/form6',
  epic: 'https://voters.eci.gov.in/epic-download',
  nvd: 'https://www.eci.gov.in/national-voters-day',
  ssr: 'https://www.eci.gov.in/electoral-rolls',
  blo: 'https://voters.eci.gov.in',
};

// National milestones common to every state
const NATIONAL_MILESTONES = [
  {
    id: 'nvd',
    title: 'National Voters\' Day',
    subtitle: 'Rashtriya Matdata Diwas',
    date: '2027-01-25',
    type: 'national',
    link: ECI.nvd,
    description: 'Annual celebration on Jan 25 — ECI marks the founding of the Election Commission (1950). New voters receive their EPIC card on this day.',
  },
  {
    id: 'ssr_start',
    title: 'Special Summary Revision (SSR) — Draft Roll',
    subtitle: 'Vishesh Sankshipt Punarikshan',
    date: '2026-10-01',
    type: 'registration',
    link: ECI.ssr,
    description: 'Draft electoral rolls are published for public inspection. Citizens can check if their name appears using the Voter Search portal.',
  },
  {
    id: 'ssr_claim',
    title: 'SSR — Claims & Objections Period',
    subtitle: 'Daave aur Aapattiyaan',
    date: '2026-11-01',
    type: 'registration',
    link: ECI.registration,
    description: 'File Form 6 to add your name, Form 7 to delete an entry, or Form 8 to correct details. Deadline to submit to your BLO.',
  },
  {
    id: 'final_roll',
    title: 'Final Electoral Roll Published',
    subtitle: 'Antim Matdata Suchi',
    date: '2027-01-05',
    type: 'registration',
    link: ECI.voterSearch,
    description: 'The authenticated final roll is released. Verify your entry on the ECI Voter Search portal before National Voters\' Day.',
  },
];

// State/UT-specific upcoming Vidhan Sabha milestones
const DEADLINES_BY_STATE = {
  // Bihar PIN starts 800
  'BR': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Bihar Vidhan Sabha Election', date: '2025-10-28', type: 'election', link: ECI.voterSearch, description: 'General Election for Bihar State Legislative Assembly (243 constituencies).' },
  ],
  // Delhi PIN starts 110
  'DL': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Delhi Vidhan Sabha Election', date: '2025-02-08', type: 'election', link: ECI.voterSearch, description: 'General Election for Delhi Legislative Assembly (70 constituencies).' },
  ],
  // Maharashtra PIN starts 400-445
  'MH': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Maharashtra Vidhan Sabha Election', date: '2024-11-20', type: 'election', link: ECI.voterSearch, description: 'General Election for Maharashtra Legislative Assembly (288 constituencies).' },
  ],
  // Uttar Pradesh PIN starts 200-285
  'UP': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Uttar Pradesh Vidhan Sabha Election', date: '2027-02-01', type: 'election', link: ECI.voterSearch, description: 'General Election for UP Legislative Assembly (403 constituencies).' },
  ],
  // West Bengal PIN starts 700
  'WB': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'West Bengal Vidhan Sabha Election', date: '2026-04-27', type: 'election', link: ECI.voterSearch, description: 'General Election for West Bengal Legislative Assembly (294 constituencies).' },
  ],
  // Tamil Nadu PIN starts 600
  'TN': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Tamil Nadu Vidhan Sabha Election', date: '2026-04-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Tamil Nadu Legislative Assembly (234 constituencies).' },
  ],
  // Karnataka PIN starts 560-591
  'KA': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Karnataka Vidhan Sabha Election', date: '2028-05-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Karnataka Legislative Assembly (224 constituencies).' },
  ],
  // Gujarat PIN starts 360-396
  'GJ': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Gujarat Vidhan Sabha Election', date: '2027-12-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Gujarat Legislative Assembly (182 constituencies).' },
  ],
  // Rajasthan PIN starts 302-345
  'RJ': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Rajasthan Vidhan Sabha Election', date: '2028-11-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Rajasthan Legislative Assembly (200 constituencies).' },
  ],
  // Madhya Pradesh PIN starts 450-488
  'MP': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Madhya Pradesh Vidhan Sabha Election', date: '2028-11-01', type: 'election', link: ECI.voterSearch, description: 'General Election for MP Legislative Assembly (230 constituencies).' },
  ],
  // Andhra Pradesh PIN starts 500-535
  'AP': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Andhra Pradesh Vidhan Sabha Election', date: '2029-04-01', type: 'election', link: ECI.voterSearch, description: 'General Election for AP Legislative Assembly (175 constituencies).' },
  ],
  // Telangana PIN starts 500-509
  'TS': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Telangana Vidhan Sabha Election', date: '2028-11-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Telangana Legislative Assembly (119 constituencies).' },
  ],
  // Kerala PIN starts 670-695
  'KL': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Kerala Vidhan Sabha Election', date: '2026-04-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Kerala Legislative Assembly (140 constituencies).' },
  ],
  // Punjab PIN starts 140-148
  'PB': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Punjab Vidhan Sabha Election', date: '2027-02-01', type: 'election', link: ECI.voterSearch, description: 'General Election for Punjab Legislative Assembly (117 constituencies).' },
  ],
  // Haryana PIN starts 120-136
  'HR': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Haryana Vidhan Sabha Election', date: '2024-10-05', type: 'election', link: ECI.voterSearch, description: 'General Election for Haryana Legislative Assembly (90 constituencies).' },
  ],
  // Jharkhand PIN starts 814-835
  'JH': [
    ...NATIONAL_MILESTONES,
    { id: 'vidhan', title: 'Jharkhand Vidhan Sabha Election', date: '2024-11-20', type: 'election', link: ECI.voterSearch, description: 'General Election for Jharkhand Legislative Assembly (81 constituencies).' },
  ],
};

// 6-digit PIN prefix → state code mapping (leading 2 digits)
const PIN_PREFIX_TO_STATE = {
  '11': 'DL', '12': 'HR', '13': 'PB', '14': 'PB', '16': 'PB', '17': 'HR',
  '20': 'UP', '21': 'UP', '22': 'UP', '23': 'UP', '24': 'UP', '25': 'UP',
  '26': 'UP', '27': 'UP', '28': 'UP', '30': 'RJ', '31': 'RJ', '32': 'RJ',
  '33': 'RJ', '34': 'RJ', '36': 'GJ', '37': 'GJ', '38': 'GJ', '39': 'GJ',
  '40': 'MH', '41': 'MH', '42': 'MH', '43': 'MH', '44': 'MH', '45': 'MP',
  '46': 'MP', '47': 'MP', '48': 'MP', '49': 'MP', '50': 'TS', '51': 'AP',
  '52': 'AP', '53': 'AP', '56': 'KA', '57': 'KA', '58': 'KA', '59': 'KA',
  '60': 'TN', '61': 'TN', '62': 'TN', '63': 'TN', '64': 'TN',
  '67': 'KL', '68': 'KL', '69': 'KL', '70': 'WB', '71': 'WB', '72': 'WB',
  '73': 'WB', '74': 'WB', '80': 'UP', '81': 'UP', '82': 'UP', '83': 'UP',
  '84': 'UP', '85': 'UP', '80': 'BR', '81': 'BR', '82': 'BR', '83': 'JH',
  '84': 'JH', '85': 'BR',
};

/**
 * Derive state code from a 6-digit Indian PIN code.
 * @param {string} pin - 6-digit PIN code
 * @returns {string} - 2-letter state code (e.g., 'MH', 'DL')
 */
export const getStateFromPin = (pin) => {
  if (!pin || pin.length < 2) return null;
  const prefix = pin.slice(0, 2);
  return PIN_PREFIX_TO_STATE[prefix] || null;
};

/**
 * Get election deadlines for a given state code or PIN code.
 * @param {string} stateOrPin
 * @returns {Array} sorted array of deadline objects
 */
export const getDeadlinesForState = (stateOrPin) => {
  if (!stateOrPin) return NATIONAL_MILESTONES;
  // Try treating as state code first (2 letters), else derive from PIN
  const key = stateOrPin.length === 2
    ? stateOrPin.toUpperCase()
    : getStateFromPin(stateOrPin)?.toUpperCase();
  return (key && DEADLINES_BY_STATE[key]) || NATIONAL_MILESTONES;
};

export const generateGoogleCalendarUrl = (deadline, location = '') => {
  const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const title = encodeURIComponent(deadline.title);
  const dateStr = deadline.date.replace(/-/g, '');
  const dates = `${dateStr}/${dateStr}`;
  const details = encodeURIComponent(
    `${deadline.description || ''}\n\nMore info: ${deadline.link}`
  );
  const loc = encodeURIComponent(location);
  return `${base}&text=${title}&dates=${dates}&details=${details}&location=${loc}`;
};

export const getDaysRemaining = (dateStr) => {
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

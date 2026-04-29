/**
 * Election Deadlines Utility
 * Handles state-specific election dates and Google Calendar event generation.
 */

const DEFAULT_ELECTION_DAY = "2026-11-03"; // General Election 2026

const DEADLINES_BY_STATE = {
  "CA": [
    { id: 'reg', title: "Online Registration Deadline", date: "2026-10-19", type: "registration", link: "https://registertovote.ca.gov/" },
    { id: 'mail', title: "Mail-in Ballot Request", date: "2026-10-27", type: "mail", link: "https://www.sos.ca.gov/elections/voter-registration/vote-mail" },
    { id: 'early', title: "Early Voting Starts", date: "2026-10-05", type: "voting", link: "https://caearlyvoting.sos.ca.gov/" },
    { id: 'election', title: "Election Day", date: DEFAULT_ELECTION_DAY, type: "election", link: "https://www.sos.ca.gov/elections" }
  ],
  "NY": [
    { id: 'reg', title: "Registration Deadline", date: "2026-10-24", type: "registration", link: "https://elections.ny.gov/voter-registration" },
    { id: 'early', title: "Early Voting Period", date: "2026-10-24", type: "voting", link: "https://elections.ny.gov/early-voting-new-york-state" },
    { id: 'election', title: "Election Day", date: DEFAULT_ELECTION_DAY, type: "election", link: "https://elections.ny.gov/" }
  ],
  "TX": [
    { id: 'reg', title: "Registration Deadline", date: "2026-10-05", type: "registration", link: "https://www.votetexas.gov/register-to-vote/" },
    { id: 'early', title: "Early Voting Period", date: "2026-10-19", type: "voting", link: "https://www.votetexas.gov/voting/where.html" },
    { id: 'election', title: "Election Day", date: DEFAULT_ELECTION_DAY, type: "election", link: "https://www.votetexas.gov/" }
  ]
};

const GENERIC_DEADLINES = [
  { id: 'reg', title: "General Registration", date: "2026-10-05", type: "registration", link: "https://vote.gov" },
  { id: 'election', title: "Election Day", date: DEFAULT_ELECTION_DAY, type: "election", link: "https://vote.gov" }
];

export const getDeadlinesForState = (stateCode) => {
  return DEADLINES_BY_STATE[stateCode?.toUpperCase()] || GENERIC_DEADLINES;
};

export const generateGoogleCalendarUrl = (deadline, location = "") => {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const title = encodeURIComponent(deadline.title);
  
  // Format date for Google Calendar (YYYYMMDD)
  const dateStr = deadline.date.replace(/-/g, '');
  const dates = `${dateStr}/${dateStr}`; // All-day event
  
  const details = encodeURIComponent(`Reminder for: ${deadline.title}. More info at: ${deadline.link}`);
  const loc = encodeURIComponent(location);
  
  return `${base}&text=${title}&dates=${dates}&details=${details}&location=${loc}`;
};

export const getDaysRemaining = (dateStr) => {
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

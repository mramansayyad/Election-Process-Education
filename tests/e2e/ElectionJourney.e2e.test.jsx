import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../../src/App';
import { VoterProvider } from '../../src/context/VoterContext';

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }) => (
    <button onClick={() => onSuccess({ credential: 'mock-token' })}>
      Mock Google Login
    </button>
  ),
  googleLogout: vi.fn(),
  useGoogleLogin: vi.fn(),
}));

vi.mock('jwt-decode', () => ({
  jwtDecode: () => ({
    name: 'Test Voter',
    email: 'test@voter.in',
    picture: 'https://avatar.cc/test',
    sub: '123456789',
  }),
}));

// Definitive static icon mock to avoid hoisting/initialization issues
vi.mock('lucide-react', () => {
  const React = require('react');
  const iconNames = [
    'Calendar', 'ArrowRight', 'CheckCircle2', 'Clock', 'ExternalLink', 'Plus',
    'Vote', 'Info', 'MapPin', 'Sparkles', 'Circle', 'ArrowLeft', 'UserCheck',
    'HelpCircle', 'Search', 'FileText', 'CreditCard', 'Users', 'Navigation',
    'AlertCircle', 'RefreshCcw', 'MapPinOff', 'ShieldCheck', 'Landmark',
    'BookOpen', 'Copy', 'Share2', 'Check', 'LogOut', 'Loader2'
  ];
  const icons = { __esModule: true };
  iconNames.forEach(name => {
    icons[name] = (props) => React.createElement('div', { ...props, 'data-testid': `icon-${name.toLowerCase()}` });
  });
  return icons;
});

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Full E2E Election Journey Simulation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should complete the full user journey from landing to dashboard', async () => {
    render(
      <VoterProvider>
        <App />
      </VoterProvider>
    );

    // 1. Landing Page (Login Screen)
    expect(screen.getByText(/Indian Voter Guide/i)).toBeInTheDocument();
    const loginButton = screen.getByText(/Mock Google Login/i);
    fireEvent.click(loginButton);

    // 2. Registration Question
    await waitFor(() => {
      expect(screen.getByText(/Are you registered to vote in India/i)).toBeInTheDocument();
    });
    const registeredOption = screen.getByText(/Yes, my name is on the roll/i);
    fireEvent.click(registeredOption);

    // 3. PIN Code Input
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e.g. 400001/i)).toBeInTheDocument();
    });
    const pinInput = screen.getByPlaceholderText(/e.g. 400001/i);
    fireEvent.change(pinInput, { target: { value: '400001' } });
    
    const findButton = screen.getByText(/Find My Details/i);
    fireEvent.click(findButton);

    // 4. Dashboard (Verify reached final state)
    await waitFor(() => {
      expect(screen.getByText(/Jai Hind/i)).toBeInTheDocument();
      expect(screen.getByText(/Readiness/i)).toBeInTheDocument();
      expect(screen.getByText(/400001/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // 5. Verify BigQuery tracking (Simulated via checks if needed)
    // Actually, we just want to see the UI reached the final state.
    expect(screen.getByText(/Maharashtra Vidhan Sabha Election/i)).toBeInTheDocument();
  });
});

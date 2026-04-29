import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { VoterProvider } from '../../src/context/VoterContext';
import VoterJourney from '../../src/components/journey/VoterJourney';
import App from '../../src/App';

// Ensure React Act environment is set correctly
global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock Framer Motion with common elements including 'a'
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Robust Lucide Mock (Expanded manual list to avoid hoisting/ReferenceError issues)
vi.mock('lucide-react', () => {
  const Icon = (name) => (props) => <div data-testid={`icon-${name}`} {...props} />;
  return {
    CheckCircle2: Icon('check-circle'),
    Circle: Icon('circle'),
    ArrowRight: Icon('arrow-right'),
    ArrowLeft: Icon('arrow-left'),
    MapPin: Icon('map-pin'),
    UserCheck: Icon('user-check'),
    LogOut: Icon('logout'),
    Loader2: Icon('loader'),
    Vote: Icon('vote'),
    Landmark: Icon('landmark'),
    ShieldCheck: Icon('shield-check'),
    BookOpen: Icon('book-open'),
    CreditCard: Icon('credit-card'),
    Users: Icon('users'),
    Sparkles: Icon('sparkles'),
    RefreshCcw: Icon('refresh'),
    AlertTriangle: Icon('alert-triangle'),
    Search: Icon('search'),
    FileText: Icon('file-text'),
    PhoneCall: Icon('phone-call'),
    ExternalLink: Icon('external-link'),
    Calendar: Icon('calendar'),
    Clock: Icon('clock'),
    Mail: Icon('mail'),
    Info: Icon('info'),
    AlertCircle: Icon('alert'),
    HelpCircle: Icon('help-circle'),
    Check: Icon('check'),
    ChevronRight: Icon('chevron-right'),
    ChevronLeft: Icon('chevron-left'),
    Flag: Icon('flag'),
    Award: Icon('award'),
    TrendingUp: Icon('trending-up'),
    Zap: Icon('zap'),
    Menu: Icon('menu'),
    X: Icon('x'),
    Bell: Icon('bell'),
    Settings: Icon('settings'),
    Share2: Icon('share-2'),
    ArrowUpRight: Icon('arrow-up-right'),
    Download: Icon('download'),
    Plus: Icon('plus'),
    PlusCircle: Icon('plus-circle'),
    CheckCircle: Icon('check-circle-main'),
    Database: Icon('database'),
    Cpu: Icon('cpu'),
    Layers: Icon('layers'),
    Globe: Icon('globe'),
    Languages: Icon('languages'),
    Sun: Icon('sun'),
    Moon: Icon('moon'),
    Map: Icon('map'),
    Hash: Icon('hash'),
    Filter: Icon('filter'),
    Layout: Icon('layout'),
    Smartphone: Icon('smartphone'),
    FileDown: Icon('file-down'),
    Eye: Icon('eye'),
    EyeOff: Icon('eye-off'),
    Lock: Icon('lock'),
    User: Icon('user'),
    Heart: Icon('heart'),
    Home: Icon('home'),
  };
});

// Mock lazy-loaded JargonBuster
vi.mock('../../src/components/buster/JargonBuster', () => ({
  default: () => <div data-testid="jargon-buster">Mock Jargon Buster</div>
}));

describe('Voter Journey Regression Suite', () => {
  const STORAGE_KEY = 'voter_data_in';

  beforeEach(() => {
    window.localStorage.clear();
    
    // Initialise session as authenticated at Step 1
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step: 1,
      user: { name: 'Test User', email: 'test@example.com', picture: '' },
      isRegistered: null,
      pinCode: '',
      stateCode: ''
    }));

    vi.useRealTimers();
  });

  it('should navigate from Registration to Location step', async () => {
    render(
      <VoterProvider>
        <VoterJourney />
      </VoterProvider>
    );

    expect(screen.getByText(/Are you registered to vote in India\?/i)).toBeInTheDocument();

    const yesOption = screen.getByText(/Yes, my name is on the roll/i);
    fireEvent.click(yesOption);

    // Wait for transition
    await waitFor(() => {
      expect(screen.getByText(/Enter your 6-digit PIN Code/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(/Step 2 of 2/i)).toBeInTheDocument();
  });

  it('should complete the journey and show Dashboard', async () => {
    render(
      <VoterProvider>
        <App />
      </VoterProvider>
    );

    const yesOption = await screen.findByText(/Yes, my name is on the roll/i);
    fireEvent.click(yesOption);

    const pinInput = await screen.findByLabelText(/6-digit Indian PIN Code/i, {}, { timeout: 2000 });
    fireEvent.change(pinInput, { target: { value: '400001' } });
    
    const submitBtn = screen.getByText(/Find My Details/i);
    fireEvent.click(submitBtn);

    // Wait for Dashboard (Jai Hind, Test!)
    await waitFor(() => {
      expect(screen.getByText(/Jai Hind, Test!/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(saved.step).toBe(3);
    expect(saved.pinCode).toBe('400001');
    expect(saved.stateCode).toBe('MH');
  });

  it('should allow navigation back to previous steps', async () => {
    render(
      <VoterProvider>
        <VoterJourney />
      </VoterProvider>
    );

    fireEvent.click(screen.getByText(/No, I need to register/i));
    await waitFor(() => {
      expect(screen.getByText(/Step 2 of 2/i)).toBeInTheDocument();
    });

    const backBtn = screen.getByText(/Back/i);
    fireEvent.click(backBtn);

    await waitFor(() => {
      expect(screen.getByText(/Are you registered to vote in India\?/i)).toBeInTheDocument();
    });
  });
});

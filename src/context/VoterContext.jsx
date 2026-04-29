import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStateFromPin } from '../utils/electionDeadlines';

const VoterContext = createContext();

const DEFAULT_STATE = {
  step: 0,
  user: null,            // Google OAuth user profile
  isRegistered: null,
  pinCode: '',
  state: '',
  stateCode: '',
  deadlines: [],
  pollingPlace: null,
};

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const VoterProvider = ({ children }) => {
  const [voterData, setVoterData] = useState(() => {
    const saved = safeParse(localStorage.getItem('voter_data_in'));
    return saved || DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('voter_data_in', JSON.stringify(voterData));
  }, [voterData]);

  const updateVoterData = (newData) => {
    setVoterData(prev => {
      const updated = { ...prev, ...newData };
      // Auto-derive stateCode from PIN whenever pinCode changes
      if (newData.pinCode && newData.pinCode.length === 6) {
        const derived = getStateFromPin(newData.pinCode);
        if (derived) updated.stateCode = derived;
      }
      return updated;
    });
  };

  const nextStep = () => {
    setVoterData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setVoterData(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  const resetJourney = () => {
    // Keep Google user logged in but reset voter journey
    setVoterData(prev => ({ ...DEFAULT_STATE, user: prev.user }));
    localStorage.removeItem('voter_data_in');
  };

  const signOut = () => {
    setVoterData(DEFAULT_STATE);
    localStorage.removeItem('voter_data_in');
  };

  return (
    <VoterContext.Provider value={{ voterData, updateVoterData, nextStep, prevStep, resetJourney, signOut }}>
      {children}
    </VoterContext.Provider>
  );
};

export const useVoter = () => {
  const context = useContext(VoterContext);
  if (!context) throw new Error('useVoter must be used within a VoterProvider');
  return context;
};

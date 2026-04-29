import React, { createContext, useContext, useState, useEffect } from 'react';

const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
  const [voterData, setVoterData] = useState(() => {
    const saved = localStorage.getItem('voter_data');
    return saved ? JSON.parse(saved) : {
      step: 0,
      isRegistered: null,
      isFirstTime: null,
      zipCode: '',
      address: '',
      state: '',
      stateCode: '',
      deadlines: [],
      pollingPlace: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('voter_data', JSON.stringify(voterData));
  }, [voterData]);

  const updateVoterData = (newData) => {
    setVoterData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    updateVoterData({ step: voterData.step + 1 });
  };

  const prevStep = () => {
    updateVoterData({ step: Math.max(0, voterData.step - 1) });
  };

  const resetJourney = () => {
    setVoterData({
      step: 0,
      isRegistered: null,
      isFirstTime: null,
      zipCode: '',
      address: '',
      state: '',
      deadlines: [],
      pollingPlace: null,
    });
  };

  return (
    <VoterContext.Provider value={{ voterData, updateVoterData, nextStep, prevStep, resetJourney }}>
      {children}
    </VoterContext.Provider>
  );
};

export const useVoter = () => {
  const context = useContext(VoterContext);
  if (!context) {
    throw new Error('useVoter must be used within a VoterProvider');
  }
  return context;
};

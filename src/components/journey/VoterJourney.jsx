import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoter } from '../../context/VoterContext';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, MapPin, UserCheck, HelpCircle } from 'lucide-react';
import { sanitizeInput, validatePinCode } from '../../utils/security';

// Defined at top to avoid hoisting crash
const Sparkles = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

// Registration status + PIN code (login is step 0 handled by App)
// Steps moved to local scope to handle icons specifically or imported from constants if needed.
// For the icons we keep them here but can pull text from constants.
const steps = [
  {
    title: 'Voter Registration',
    question: 'Are you registered to vote in India?',
    key: 'isRegistered',
    hint: 'You can check on voters.eci.gov.in using your EPIC number or name.',
    options: [
      { label: "Yes, my name is on the roll", value: true, icon: <UserCheck className="text-green-500" aria-hidden="true" /> },
      { label: "No, I need to register", value: false, icon: <Circle className="text-slate-400" aria-hidden="true" /> },
      { label: "I'm not sure", value: 'unsure', icon: <HelpCircle className="text-blue-500" aria-hidden="true" /> },
    ],
  },
  {
    title: 'Your Location',
    question: 'Enter your 6-digit PIN Code',
    key: 'pinCode',
    isInput: true,
    inputMode: 'numeric',
    maxLength: 6,
    placeholder: 'e.g. 400001',
    hint: 'Your PIN code helps us identify your Assembly Constituency and State.',
    icon: <MapPin className="text-orange-500" aria-hidden="true" />,
  },
];

const VoterJourney = () => {
  const { voterData, updateVoterData, nextStep, prevStep } = useVoter();
  // voterData.step: 0 = login (handled by App), 1 = isRegistered, 2 = pinCode
  // Here step index within this component is (voterData.step - 1)
  const localStep = Math.min(Math.max(voterData.step - 1, 0), steps.length - 1);
  const step = steps[localStep];

  const handleOptionSelect = (value) => {
    updateVoterData({ [step.key]: value });
    if (localStep < steps.length - 1) {
      setTimeout(nextStep, 300);
    }
  };

  const handleInputChange = (e) => {
    // Basic sanitization and digit filtering
    const val = sanitizeInput(e.target.value).replace(/\D/g, '').slice(0, 6);
    updateVoterData({ [step.key]: val });
  };

  const handleNextStep = () => {
    if (step.isInput && !validatePinCode(pinValue)) {
      alert('Please enter a valid 6-digit PIN code.');
      return;
    }
    nextStep();
  };

  const pinValue = voterData.pinCode || '';

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8" role="progressbar" aria-valuemin="0" aria-valuemax={steps.length} aria-valuenow={localStep + 1}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              idx <= localStep ? 'bg-orange-500' : 'bg-slate-200'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={localStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="card"
        >
          <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2 block">
            Step {localStep + 1} of {steps.length}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{step.question}</h2>
          {step.hint && (
            <p className="text-sm text-slate-500 mb-6">{step.hint}</p>
          )}

          <div className="space-y-4">
            {step.isInput ? (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {step.icon}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={step.maxLength}
                  value={pinValue}
                  onChange={handleInputChange}
                  placeholder={step.placeholder}
                  className="input-field pl-12 text-lg font-medium tracking-widest"
                  autoFocus
                  aria-required="true"
                  aria-label="6-digit Indian PIN Code"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" aria-live="polite">
                  {pinValue.length}/6
                </span>
              </div>
            ) : (
              step.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    voterData[step.key] === opt.value
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg">{opt.icon}</div>
                    <span className="font-semibold text-slate-700">{opt.label}</span>
                  </div>
                  {voterData[step.key] === opt.value && (
                    <CheckCircle2 className="text-orange-500" size={20} />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={localStep === 0}
              className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-800 disabled:opacity-0 transition-all min-h-[44px] px-4 -ml-4"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {step.isInput && (
              <button
                onClick={handleNextStep}
                disabled={pinValue.length < 6}
                className="btn-primary flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
              >
                Find My Details
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VoterJourney;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoter } from '../../context/VoterContext';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, MapPin, UserCheck, HelpCircle } from 'lucide-react';

// Defined at top to avoid "used before defined" runtime crash
const Sparkles = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

const steps = [
  {
    title: "Registration Status",
    question: "Are you currently registered to vote?",
    key: "isRegistered",
    options: [
      { label: "Yes, I'm all set!", value: true, icon: <UserCheck className="text-green-500" /> },
      { label: "No, I need to register", value: false, icon: <Circle className="text-slate-400" /> },
      { label: "I'm not sure", value: "unsure", icon: <HelpCircle className="text-blue-500" /> }
    ]
  },
  {
    title: "First-Time Voter",
    question: "Is this your first time voting in a major election?",
    key: "isFirstTime",
    options: [
      { label: "Yes, it's my first time!", value: true, icon: <Sparkles className="text-yellow-500" /> },
      { label: "No, I've voted before", value: false, icon: <CheckCircle2 className="text-primary-500" /> }
    ]
  },
  {
    title: "Your Location",
    question: "What is your Zip Code?",
    key: "zipCode",
    isInput: true,
    placeholder: "e.g. 90210",
    icon: <MapPin className="text-primary-500" />
  }
];

const VoterJourney = () => {
  const { voterData, updateVoterData, nextStep, prevStep } = useVoter();
  const currentStep = Math.min(voterData.step, steps.length - 1);
  const step = steps[currentStep];

  const handleOptionSelect = (value) => {
    updateVoterData({ [step.key]: value });
    if (currentStep < steps.length - 1) {
      setTimeout(nextStep, 300);
    }
  };

  const handleInputChange = (e) => {
    updateVoterData({ [step.key]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              idx <= voterData.step ? 'bg-primary-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="card"
        >
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2 block">
            Step {currentStep + 1} of {steps.length}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{step.question}</h2>

          <div className="space-y-4">
            {step.isInput ? (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {step.icon}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={voterData[step.key] || ''}
                  onChange={handleInputChange}
                  placeholder={step.placeholder}
                  className="input-field pl-12 text-lg font-medium"
                  autoFocus
                />
              </div>
            ) : (
              step.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    voterData[step.key] === opt.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg">{opt.icon}</div>
                    <span className="font-semibold text-slate-700">{opt.label}</span>
                  </div>
                  {voterData[step.key] === opt.value && (
                    <CheckCircle2 className="text-primary-500" size={20} />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-800 disabled:opacity-0 transition-all min-h-[44px] px-4 -ml-4"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {step.isInput ? (
              <button
                onClick={nextStep}
                disabled={!voterData[step.key] || voterData[step.key].length < 5}
                className="btn-primary flex items-center gap-2"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VoterJourney;

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useVoter } from '../../context/VoterContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Vote, Landmark, BookOpen } from 'lucide-react';

const FEATURES = [
  { icon: <Vote size={20} />, label: 'Check Your Electoral Roll' },
  { icon: <Landmark size={20} />, label: 'Download e-EPIC Card' },
  { icon: <ShieldCheck size={20} />, label: 'Know Your BLO & Booth' },
  { icon: <BookOpen size={20} />, label: 'AI Election Jargon Buster' },
];

const LoginScreen = () => {
  const { updateVoterData, nextStep } = useVoter();

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      updateVoterData({
        user: {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          sub: decoded.sub,
        },
      });
      nextStep(); // advance to "Are you registered?"
    } catch (err) {
      console.error('Failed to decode Google credential', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 px-4 py-12">
      {/* Indian flag-inspired accent bar */}
      <div className="flex w-64 h-1.5 rounded-full overflow-hidden mb-10 shadow">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-t border-b border-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card shadow-2xl shadow-orange-100/50 border border-orange-100/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
              <Vote size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Indian Voter Guide
            </h1>
            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
              Your personalized Election Commission of India companion. Sign in to get started.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                <span className="text-orange-500 shrink-0">{f.icon}</span>
                <span className="text-xs font-semibold text-slate-600 leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Google Sign-In */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-slate-400 text-center">
              Sign in securely with your Google account to personalise your voter journey.
            </p>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.error('Google Sign-In failed')}
                theme="outline"
                size="large"
                width="320"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ECI Attribution */}
      <p className="text-xs text-slate-400 mt-8 text-center max-w-sm">
        Powered by data from the{' '}
        <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">
          Election Commission of India (ECI)
        </a>{' '}
        and Google Gemini AI. This is an educational tool.
      </p>
    </div>
  );
};

export default LoginScreen;

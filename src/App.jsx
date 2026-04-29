import React from 'react';
import Header from './components/layout/Header';
import VoterJourney from './components/journey/VoterJourney';
import { useVoter } from './context/VoterContext';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Search } from 'lucide-react';

function App() {
  const { voterData } = useVoter();
  const isJourneyComplete = voterData.step >= 3;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        {!isJourneyComplete ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
                Your Vote, <span className="text-primary-600">Simplified.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Navigate the election process with confidence. Get personalized deadlines, 
                find your polling place, and understand the fine print—all in one place.
              </p>
            </motion.div>

            <VoterJourney />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Personalized Dashboard */}
              <div className="md:col-span-2 space-y-8">
                <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
                  <h2 className="text-2xl font-bold mb-2">Welcome, Voter!</h2>
                  <p className="opacity-90">We've personalized your election guide based on Zip Code <span className="font-bold underline">{voterData.zipCode}</span>.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card flex items-start gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Deadlines</h3>
                      <p className="text-sm text-slate-500">Upcoming registration dates.</p>
                    </div>
                  </div>
                  <div className="card flex items-start gap-4">
                    <div className="p-3 bg-accent-50 text-accent-600 rounded-xl">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Polling Place</h3>
                      <p className="text-sm text-slate-500">Find where to cast your vote.</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="text-primary-500" size={20} />
                    AI Jargon Buster
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    Confused by election laws? Paste a term or law here and Gemini will explain it in plain English.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Paste text here..." 
                      className="input-field"
                    />
                    <button className="btn-primary flex items-center gap-2 py-2">
                      <Search size={18} />
                      Explain
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="card bg-slate-900 text-white">
                  <h3 className="font-bold mb-4">Quick Checklist</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 opacity-80">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${voterData.isRegistered === true ? 'bg-primary-500 border-primary-500' : 'border-slate-700'}`}>
                        {voterData.isRegistered === true && <span className="text-[10px]">✓</span>}
                      </div>
                      Registered to Vote
                    </li>
                    <li className="flex items-center gap-3 opacity-80">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                      Check Polling Hours
                    </li>
                    <li className="flex items-center gap-3 opacity-80">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                      Review Ballot Preview
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 VoteSmart Education Assistant. Data provided by Google Civic Information API.</p>
          <p className="mt-1">Built for accessibility and education.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

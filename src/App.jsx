import React from 'react';
import Header from './components/layout/Header';
import VoterJourney from './components/journey/VoterJourney';
import PollingFinder from './components/finder/PollingFinder';
import JargonBuster from './components/buster/JargonBuster';
import ElectionTimeline from './components/timeline/ElectionTimeline';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useVoter } from './context/VoterContext';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function App() {
  const { voterData, resetJourney } = useVoter();
  const isJourneyComplete = voterData.step >= 3;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
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
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-20">
                
                {/* Welcome Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl md:text-3xl font-bold">Welcome back, Voter!</h2>
                      <button 
                        onClick={resetJourney}
                        className="text-xs bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-lg backdrop-blur-md transition-colors min-h-[44px] flex items-center"
                      >
                        Reset Profile
                      </button>
                    </div>
                    <p className="opacity-90 max-w-lg">
                      Your personalized election guide is ready for Zip Code <span className="font-bold underline">{voterData.zipCode}</span>. 
                      {voterData.stateCode && <> (Detected State: <span className="font-bold">{voterData.stateCode}</span>)</>}
                    </p>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </motion.div>

                {/* Personalized Timeline (Phase 3) */}
                <ErrorBoundary>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ElectionTimeline />
                  </motion.div>
                </ErrorBoundary>

                {/* Polling Place Finder */}
                <ErrorBoundary>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <PollingFinder />
                  </motion.div>
                </ErrorBoundary>

                {/* AI Jargon Buster Section */}
                <ErrorBoundary>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <JargonBuster />
                  </motion.div>
                </ErrorBoundary>
              </div>

              {/* Sidebar: Status & Checklist */}
              <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card bg-slate-900 text-white"
                >
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-primary-400" size={20} />
                    Voter Readiness
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${voterData.isRegistered === true ? 'bg-primary-500 border-primary-500' : 'border-slate-700'}`}>
                        {voterData.isRegistered === true && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Registered to Vote</p>
                        <p className="text-xs opacity-60 mt-0.5">
                          {voterData.isRegistered === true ? 'Verified in your profile' : 'Pending verification'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold opacity-80">Photo ID Prepared</p>
                        <p className="text-xs opacity-50 mt-0.5">Check your state requirements</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold opacity-80">Ballot Reviewed</p>
                        <p className="text-xs opacity-50 mt-0.5">Preview your candidates</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group">
                    View Full Checklist
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                <div className="p-6 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-200">
                  <h4 className="font-bold mb-2">Helpful Tip</h4>
                  <p className="text-xs opacity-90 leading-relaxed">
                    Most states require you to register at least 30 days before an election. Check your timeline for the exact date!
                  </p>
                </div>
              </aside>

            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 VoteSmart Education Assistant.</p>
          <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
            This tool is for educational purposes. Data powered by Google Civic & Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

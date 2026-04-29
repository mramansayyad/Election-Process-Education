import React from 'react';
import Header from './components/layout/Header';
import LoginScreen from './components/auth/LoginScreen';
import VoterJourney from './components/journey/VoterJourney';
import VoterServicesHub from './components/finder/VoterServicesHub';
import ElectionTimeline from './components/timeline/ElectionTimeline';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useVoter } from './context/VoterContext';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin, LogOut, Loader2 } from 'lucide-react';
import { STATE_NAMES } from './constants/indianStates';

// Lazy load heavy components
const JargonBuster = React.lazy(() => import('./components/buster/JargonBuster'));



function App() {
  const { voterData, resetJourney, signOut } = useVoter();

  // Log analytical events to BigQuery when dashboard is viewed
  React.useEffect(() => {
    if (voterData.step >= 3 && voterData.stateCode) {
      import('./services/bigQueryAnalytics').then(({ trackRegionalInterest }) => {
        trackRegionalInterest(voterData.stateCode);
      }).catch(err => console.error('Failed to load BigQuery service', err));
    }
  }, [voterData.step, voterData.stateCode]);

  // Route 1: Not logged in → show Login
  const isAuthenticated = Boolean(voterData.user);
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Route 2: Journey in progress (steps 1–2) → show VoterJourney
  // step 0 = login (done), steps 1–2 = journey questions, step >= 3 = dashboard
  const isJourneyComplete = voterData.step >= 3;

  if (!isJourneyComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50 font-sans">
        {/* Minimal header for journey */}
        <div className="py-4 px-6 border-b border-slate-100 bg-white/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇮🇳</span>
            <span className="font-extrabold text-slate-800 text-lg">Indian Voter Guide</span>
          </div>
          <div className="flex items-center gap-3">
            {voterData.user?.picture && (
              <img
                src={voterData.user.picture}
                alt={voterData.user.name}
                className="w-8 h-8 rounded-full border-2 border-orange-200"
              />
            )}
            <span className="text-sm font-medium text-slate-600 hidden sm:block">
              {voterData.user?.name?.split(' ')[0]}
            </span>
          </div>
        </div>

        <main className="flex-1">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-10 px-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              Your Vote, <span className="text-orange-500">Empowered.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Personalised guidance from the Election Commission of India — just for you.
            </p>
          </motion.div>
          <VoterJourney />
        </main>
      </div>
    );
  }

  // Route 3: Dashboard
  const stateName = STATE_NAMES[voterData.stateCode] || voterData.stateCode || 'India';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-20">

              {/* Welcome Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white border-none relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {voterData.user?.picture && (
                        <img
                          src={voterData.user.picture}
                          alt={voterData.user.name}
                          className="w-12 h-12 rounded-full border-2 border-white/30 shadow"
                        />
                      )}
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                          Jai Hind, {voterData.user?.name?.split(' ')[0] || 'Voter'}! 🇮🇳
                        </h2>
                        <p className="text-orange-100 text-sm">
                          Your personalised election guide is ready.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={resetJourney}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg backdrop-blur-md transition-colors min-h-[44px] flex items-center"
                      >
                        Update PIN
                      </button>
                      <button
                        onClick={signOut}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg backdrop-blur-md transition-colors min-h-[44px] flex items-center gap-1"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 text-sm backdrop-blur-sm">
                      <MapPin size={14} />
                      PIN: <span className="font-bold">{voterData.pinCode}</span>
                      {stateName && <span className="opacity-80">({stateName})</span>}
                    </div>
                    {voterData.isRegistered === true && (
                      <div className="flex items-center gap-2 bg-green-500/30 rounded-full px-3 py-1.5 text-sm">
                        <CheckCircle2 size={14} />
                        Registered Voter
                      </div>
                    )}
                    {voterData.isRegistered === false && (
                      <a
                        href="https://voters.eci.gov.in/registration/form6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-yellow-400/30 rounded-full px-3 py-1.5 text-sm hover:bg-yellow-400/40 transition-colors"
                      >
                        ⚠ Register Now (Form 6)
                      </a>
                    )}
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                {/* Indian tricolor accent */}
                <div className="absolute top-0 right-0 h-full w-1.5 flex flex-col">
                  <div className="flex-1 bg-[#FF9933]/40" />
                  <div className="flex-1 bg-white/20" />
                  <div className="flex-1 bg-[#138808]/40" />
                </div>
              </motion.div>

              {/* Election Timeline */}
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ElectionTimeline />
                </motion.div>
              </ErrorBoundary>

              {/* ECI Voter Services Hub */}
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <VoterServicesHub />
                </motion.div>
              </ErrorBoundary>

              {/* ECI Jargon Buster */}
              <ErrorBoundary>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <React.Suspense fallback={
                    <div className="card bg-white p-8 flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                      <Loader2 className="animate-spin mb-4" size={32} />
                      <p className="text-sm font-medium">Initialising AI Assistant...</p>
                    </div>
                  }>
                    <JargonBuster />
                  </React.Suspense>
                </motion.div>
              </ErrorBoundary>
            </div>

            {/* Sidebar: Voter Readiness */}
            <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card bg-slate-900 text-white"
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-orange-400" size={20} />
                  Voter Readiness
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${voterData.isRegistered === true ? 'bg-green-500 border-green-500' : 'border-slate-700'}`}>
                      {voterData.isRegistered === true && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Name on Electoral Roll</p>
                      <p className="text-xs opacity-60 mt-0.5">
                        {voterData.isRegistered === true
                          ? 'Confirmed in your profile'
                          : voterData.isRegistered === false
                          ? 'Register via Form 6 on ECI portal'
                          : 'Verify at voters.eci.gov.in'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold opacity-80">EPIC Card / e-EPIC</p>
                      <p className="text-xs opacity-50 mt-0.5">Download from voters.eci.gov.in</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold opacity-80">Know Your Booth</p>
                      <p className="text-xs opacity-50 mt-0.5">Use Voter Search on ECI portal</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://voters.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-8 py-3 bg-orange-500 hover:bg-orange-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
                >
                  Open ECI Voter Portal
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>

              {/* ECI Tip Card */}
              <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl text-white shadow-lg shadow-orange-200">
                <h4 className="font-bold mb-2">🗳 Did You Know?</h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  India has over 97 crore registered voters — the world's largest electorate. Your EPIC card
                  (Electors' Photo Identity Card) is issued free of charge by the ECI and is a valid photo ID
                  across India.
                </p>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <div className="flex justify-center gap-1.5 mb-3 text-xs font-bold tracking-widest uppercase text-slate-400">
            <span className="text-[#FF9933]">■</span>
            Indian Voter Guide — Educational Tool
            <span className="text-[#138808]">■</span>
          </div>
          <p>
            Powered by{' '}
            <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">
              Election Commission of India
            </a>
            {' '}data and Google Gemini AI.
          </p>
          <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
            This is an educational tool. No voter data is stored on our servers.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useVoter } from '../../context/VoterContext';
import { getVoterInfo } from '../../services/civicApi';
import PollingStationCard from './PollingStationCard';
import { Search, Loader2, AlertCircle, MapPinOff } from 'lucide-react';
import { motion } from 'framer-motion';

const PollingFinder = () => {
  const { voterData, updateVoterData } = useVoter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [addressInput, setAddressInput] = useState(voterData.zipCode || '');

  const fetchPollingInfo = async (addr) => {
    if (!addr) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getVoterInfo(addr);
      setResults(data);
      
      // Extract state code if available
      const state = data.normalizedInput?.state;
      if (state) {
        updateVoterData({ stateCode: state });
      }
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (voterData.zipCode) {
      fetchPollingInfo(voterData.zipCode);
    }
  }, [voterData.zipCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPollingInfo(addressInput);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Your Polling Station</h2>
          <p className="text-slate-500 text-sm">Find where to cast your ballot for the next election.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter full address or zip..."
              className="input-field pl-10 py-3 text-sm"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary py-3 px-6 flex items-center gap-2 text-sm min-h-[44px]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium animate-pulse">Fetching official election data...</p>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4"
        >
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-red-800">Something went wrong</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <p className="text-red-600 text-xs mt-3">Tip: Try entering your full residential address for better accuracy.</p>
          </div>
        </motion.div>
      )}

      {!loading && !error && results && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Polling Places */}
          {results.pollingLocations?.map((loc, idx) => (
            <PollingStationCard key={`polling-${idx}`} station={loc} type="Election Day Polling Place" />
          ))}

          {/* Early Vote Sites */}
          {results.earlyVoteSites?.map((loc, idx) => (
            <PollingStationCard key={`early-${idx}`} station={loc} type="Early Voting Site" />
          ))}

          {/* Drop Off Locations */}
          {results.dropOffLocations?.map((loc, idx) => (
            <PollingStationCard key={`dropoff-${idx}`} station={loc} type="Ballot Drop-Off" />
          ))}

          {(!results.pollingLocations && !results.earlyVoteSites && !results.dropOffLocations) && (
            <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <MapPinOff className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="font-bold text-slate-800">No specific locations found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
                While we found the election, the specific polling sites for your address haven't been published yet. 
                Check back closer to election day!
              </p>
            </div>
          )}
        </motion.div>
      )}

      {!loading && !error && !results && !voterData.zipCode && (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400">Enter your address above to find your polling station.</p>
        </div>
      )}
    </section>
  );
};

export default React.memo(PollingFinder);

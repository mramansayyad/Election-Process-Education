import React, { useState, useRef } from 'react';
import { useVoter } from '../../context/VoterContext';
import { getGeminiBuster } from '../../services/geminiApi';
import { Sparkles, Search, Loader2, Copy, Share2, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_TERMS = [
  "EPIC Card",
  "EVM / VVPAT",
  "Model Code of Conduct",
  "Booth Level Officer (BLO)",
  "NOTA",
  "Lok Sabha vs Vidhan Sabha",
  "Delimitation",
];


const JargonBuster = () => {
  const { voterData } = useVoter();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const handleBust = async (termToBust) => {
    const term = termToBust || input;
    if (!term.trim()) return;

    setInput(term);
    setIsGenerating(true);
    setError(null);
    setResult('');

    try {
      await getGeminiBuster(term, voterData, (streamedText) => {
        setResult(streamedText);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Election Term Explained',
        text: `Check out this explanation of "${input}": ${result}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-white border-2 border-primary-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">ECI Jargon Buster</h3>
        </div>
        
        <p className="text-slate-600 mb-6 text-sm">
          Indian election terms and ECI procedures explained simply — with Hindi translations where applicable.
        </p>

        {/* Search Input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleBust(); }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. EPIC Card, EVM, NOTA, BLO..." 
              className="input-field pl-12"
              aria-label="Indian election term to explain"
              disabled={isGenerating}
            />
          </div>
          <button 
            type="submit" 
            disabled={isGenerating || !input.trim()}
            className="btn-primary flex items-center justify-center gap-2 px-8 min-w-[140px]"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <><Search size={20} /> Explain</>}
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full mb-1">Quick Tap:</span>
          {QUICK_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => handleBust(term)}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-600 text-slate-600 text-xs font-semibold rounded-full transition-colors border border-transparent hover:border-primary-100 min-h-[44px]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      <AnimatePresence>
        {(result || error) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-2xl overflow-hidden border border-primary-100 shadow-2xl shadow-primary-100/50"
            aria-live="polite"
          >
            <div className="p-1 bg-gradient-to-r from-primary-400 to-accent-400" />
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary-600">
                  <Sparkles size={18} />
                  <span className="text-xs font-bold uppercase tracking-tighter">AI Explanation</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                  <AlertCircle className="shrink-0" size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-800 text-lg leading-relaxed font-medium">
                    {result}
                    {isGenerating && <span className="inline-block w-2 h-5 ml-1 bg-primary-500 animate-pulse align-middle" />}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JargonBuster;

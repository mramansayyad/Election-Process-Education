import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, CheckCircle2, Clock, ExternalLink, Plus } from 'lucide-react';
import { getDeadlinesForState, generateGoogleCalendarUrl, getDaysRemaining } from '../../utils/electionDeadlines';
import { useVoter } from '../../context/VoterContext';

const ElectionTimeline = () => {
  const { voterData } = useVoter();
  const deadlines = getDeadlinesForState(voterData.stateCode || voterData.pinCode);
  const now = new Date();

  // Find the next upcoming deadline
  const nextDeadline = deadlines.find(d => new Date(d.date) >= now);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Election Milestones</h2>
          <p className="text-slate-500 text-sm">Key ECI dates and deadlines for your state.</p>
        </div>
        {nextDeadline && (
          <div className="bg-primary-50 px-4 py-2 rounded-full border border-primary-100 flex items-center gap-2">
            <Clock size={16} className="text-primary-600" />
            <span className="text-sm font-bold text-primary-700">
              {getDaysRemaining(nextDeadline.date)} days until {nextDeadline.title}
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2" />

        <div className="space-y-12">
          {deadlines.map((item, idx) => {
            const isPast = new Date(item.date) < now;
            const isNext = item.id === nextDeadline?.id;
            const isEven = idx % 2 === 0;

            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  isPast ? 'opacity-50' : 'opacity-100'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md -translate-x-1/2 z-10 ${
                  isPast ? 'bg-slate-300' : isNext ? 'bg-primary-500 ring-4 ring-primary-100' : 'bg-white border-primary-400'
                }`}>
                  {isNext && <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-full h-full bg-primary-500 rounded-full opacity-30" />}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] ml-12 md:ml-0 ${
                  isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'
                }`}>
                  <div className={`card group p-6 ${isNext ? 'border-primary-200 bg-white shadow-xl shadow-primary-50' : 'bg-white'}`}>
                    <time dateTime={item.date} className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">
                      {new Date(item.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500 italic mb-2">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">{item.description}</p>
                    )}
                    
                    <div className={`flex items-center gap-4 mt-6 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        Action <ArrowRight size={16} />
                      </a>
                      <a 
                        href={generateGoogleCalendarUrl(item)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-50 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Add to Google Calendar"
                      >
                        <Plus size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ElectionTimeline);

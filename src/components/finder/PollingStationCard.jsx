import React from 'react';
import { MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';

const PollingStationCard = ({ station, type = "Polling Place" }) => {
  if (!station) return null;

  const { address, locationName, pollingHours } = station;
  const fullAddress = `${address.line1}, ${address.city}, ${address.state} ${address.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${locationName} ${fullAddress}`)}`;

  return (
    <div className="card border-l-4 border-l-primary-500 hover:scale-[1.01] transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase mb-2">
            {type}
          </span>
          <h3 className="text-xl font-bold text-slate-800">{locationName || 'Unnamed Location'}</h3>
        </div>
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
          title="Open in Google Maps"
        >
          <ExternalLink size={20} />
        </a>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 text-slate-600">
          <MapPin size={18} className="mt-1 shrink-0 text-slate-400" />
          <p className="text-sm leading-relaxed">{fullAddress}</p>
        </div>
        
        {pollingHours && (
          <div className="flex items-start gap-3 text-slate-600">
            <Clock size={18} className="mt-1 shrink-0 text-slate-400" />
            <p className="text-sm italic">{pollingHours}</p>
          </div>
        )}
      </div>

      <a 
        href={mapsUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full btn-secondary flex items-center justify-center gap-2"
      >
        <Navigation size={18} />
        Get Directions
      </a>
    </div>
  );
};

export default React.memo(PollingStationCard);

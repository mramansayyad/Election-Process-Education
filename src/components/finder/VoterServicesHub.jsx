import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, FileText, CreditCard, MapPin, Users, HelpCircle } from 'lucide-react';

const ECI_SERVICES = [
  {
    id: 'voter-search',
    title: 'Search Your Name',
    subtitle: 'Electoral Roll Verification',
    description: 'Check if your name is on the Electoral Roll using your EPIC number, mobile number, or personal details.',
    href: 'https://voters.eci.gov.in',
    icon: <Search size={28} />,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    tag: 'voters.eci.gov.in',
  },
  {
    id: 'new-registration',
    title: 'New Registration',
    subtitle: 'Form 6 — Add Name to Roll',
    description: 'First-time voter? Apply online using Form 6 to add your name to the electoral roll of your constituency.',
    href: 'https://voters.eci.gov.in/registration/form6',
    icon: <FileText size={28} />,
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    tag: 'Form 6',
  },
  {
    id: 'epic-download',
    title: 'Download e-EPIC',
    subtitle: 'Digital Voter ID Card',
    description: 'Download your Electronic Photo Identity Card (e-EPIC) as a PDF. Works as a valid identity document.',
    href: 'https://voters.eci.gov.in/epic-download',
    icon: <CreditCard size={28} />,
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    tag: 'e-EPIC PDF',
  },
  {
    id: 'know-booth',
    title: 'Know Your Booth & BLO',
    subtitle: 'Booth Level Officer',
    description: 'Find your polling station details and Booth Level Officer (BLO) who manages the electoral roll in your area.',
    href: 'https://voters.eci.gov.in',
    icon: <MapPin size={28} />,
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    tag: 'Booth Locator',
  },
  {
    id: 'candidates',
    title: 'Candidate / Party Info',
    subtitle: 'Affidavit & Campaign Data',
    description: 'Know your candidates — view their affidavits, criminal records (if any), and campaign expenditure disclosures.',
    href: 'https://affidavit.eci.gov.in',
    icon: <Users size={28} />,
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    tag: 'affidavit.eci.gov.in',
  },
  {
    id: 'grievance',
    title: 'File a Grievance / cVIGIL',
    subtitle: 'Report MCC Violations',
    description: 'Report violations of the Model Code of Conduct (MCC) or election malpractice using the ECI cVIGIL app or portal.',
    href: 'https://cvigil.eci.gov.in',
    icon: <HelpCircle size={28} />,
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    tag: 'cVIGIL',
  },
];

const VoterServicesHub = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Digital Voter Services</h2>
        <p className="text-slate-500 text-sm mt-1">
          Direct links to official Election Commission of India (ECI) portals — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {ECI_SERVICES.map((svc, idx) => (
          <motion.a
            key={svc.id}
            href={svc.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group block p-6 rounded-2xl border-2 ${svc.bg} ${svc.border} hover:shadow-xl transition-all`}
          >
            {/* Icon + Tag */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${svc.color} text-white shadow-md`}>
                {svc.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-full border border-slate-100">
                {svc.tag}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 mb-0.5">
              {svc.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mb-3">{svc.subtitle}</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{svc.description}</p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:gap-3 transition-all">
              Open ECI Portal
              <ExternalLink size={14} className="opacity-60" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* ECI Badge */}
      <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl text-white text-sm">
        <span className="text-2xl">🇮🇳</span>
        <div>
          <p className="font-bold">Official ECI Portals Only</p>
          <p className="text-slate-400 text-xs mt-0.5">
            All links open official Government of India / ECI websites. This tool does not collect or store your voter data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(VoterServicesHub);

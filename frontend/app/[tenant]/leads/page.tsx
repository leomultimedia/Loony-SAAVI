"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

const LEAD_STATUS_COLORS: Record<string, string> = {
  'NEW': 'text-gray-400 bg-white/5',
  'CONTACTED': 'text-cyberBlue bg-cyberBlue/10',
  'QUALIFIED': 'text-yellow-400 bg-yellow-400/10',
  'MEETING_SET': 'text-purple-400 bg-purple-400/10',
  'WON': 'text-matrixGreen bg-matrixGreen/10',
  'LOST': 'text-red-500 bg-red-500/10',
};

const DEMO_LEADS = [
  { id: 'L001', name: 'Ahmed Al Mansoori', company: 'Dubai Fintech Group', phone: '+971 50 *** 4567', email: 'a.al***@dfg.ae', source: 'Excel', status: 'MEETING_SET', score: 92, lastMsg: '2 min ago' },
  { id: 'L002', name: 'Priya Sharma', company: 'Axiom Telecom', phone: '+971 52 *** 8910', email: 'p.sh***@axiom.ae', source: 'HubSpot', status: 'QUALIFIED', score: 78, lastMsg: '15 min ago' },
  { id: 'L003', name: 'Khalid Bin Rashid', company: 'ADNOC Digital', phone: '+971 56 *** 1234', email: 'k.ra***@adnoc.ae', source: 'GSheet', status: 'CONTACTED', score: 61, lastMsg: '1 hr ago' },
  { id: 'L004', name: 'Sarah Mitchell', company: 'Emaar PropTech', phone: '+44 78 *** 5678', email: 's.mi***@emaar.com', source: 'CSV', status: 'NEW', score: 44, lastMsg: 'Just now' },
  { id: 'L005', name: 'Mohammed Al Farsi', company: 'RTA Smart Init.', phone: '+971 54 *** 2090', email: 'm.fa***@rta.ae', source: 'HubSpot', status: 'WON', score: 98, lastMsg: '3 days ago' },
];

export default function LeadsPage() {
  const { tenant } = useParams();
  const router = useRouter();
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [uploadModal, setUploadModal] = useState(false);
  const [connectModal, setConnectModal] = useState<'gsheet' | 'crm' | null>(null);
  const [importing, setImporting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImporting(true);
    setTimeout(() => {
      // Simulate parsed leads being added
      const newLeads = [
        { id: 'L006', name: 'Fatima Al Zaabi', company: 'DEWA Digital', phone: '+971 50 *** 9999', email: 'f.za***@dewa.gov.ae', source: 'Excel', status: 'NEW', score: 55, lastMsg: 'Just now' },
        { id: 'L007', name: 'Tom Chen', company: 'DP World Tech', phone: '+971 55 *** 1111', email: 't.ch***@dpworld.ae', source: 'Excel', status: 'NEW', score: 70, lastMsg: 'Just now' },
      ];
      setLeads(prev => [...prev, ...newLeads]);
      setImporting(false);
      setUploadModal(false);
    }, 2500);
  };

  const launchCampaign = (lead: any) => {
    router.push(`/${tenant}/whatsapp?leadId=${lead.id}&name=${encodeURIComponent(lead.name)}`);
  };

  const filtered = filterStatus === 'ALL' ? leads : leads.filter(l => l.status === filterStatus);

  return (
    <main className="min-h-screen bg-transparent p-6 font-sans text-white relative">

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel iron-glow rounded-[3rem] p-12 relative"
            >
              <button onClick={() => setUploadModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-red-500 hover:text-black transition">×</button>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Import Leads</h2>
              <p className="text-gray-500 text-xs font-mono mb-10">PII Auto-Redacted before AI Processing. UAE PDPL Compliant.</p>

              {importing ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 border-t-4 border-red-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-mono text-gray-400 animate-pulse uppercase tracking-widest">Ingesting & Scrubbing PII...</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/20 rounded-3xl hover:border-red-500 transition cursor-pointer group">
                  <span className="text-5xl mb-4 group-hover:scale-110 transition">📂</span>
                  <p className="font-bold text-sm mb-1">Drop Excel / CSV here</p>
                  <p className="text-[10px] text-gray-500 font-mono">Or click to browse</p>
                  <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRM/GSheet Connect Modal */}
      <AnimatePresence>
        {connectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel iron-glow rounded-[3rem] p-12 relative"
            >
              <button onClick={() => setConnectModal(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-red-500 hover:text-black transition">×</button>
              <h2 className="text-3xl font-black tracking-tighter mb-2">{connectModal === 'gsheet' ? 'Google Sheets' : 'HubSpot CRM'}</h2>
              <p className="text-gray-500 text-xs font-mono mb-10">OAuth 2.0 Secure Handshake. No credentials stored.</p>
              <div className="space-y-4">
                <input type="text" placeholder={connectModal === 'gsheet' ? 'Paste Google Sheet URL...' : 'HubSpot API Key...'} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-cyberBlue outline-none" />
                <button className="w-full py-4 bg-cyberBlue text-black font-black rounded-xl uppercase tracking-widest text-xs hover:bg-white transition">
                  Authorize & Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lead Detail Sidebar */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-[400px] z-[100] glass-panel iron-glow border-l border-white/10 p-10 flex flex-col gap-8 overflow-y-auto"
          >
            <button onClick={() => setSelectedLead(null)} className="self-end w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-red-500 hover:text-black transition">×</button>
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Lead Profile</p>
              <h2 className="text-2xl font-black tracking-tight">{selectedLead.name}</h2>
              <p className="text-gray-400 text-sm">{selectedLead.company}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 glass-panel rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase mb-1">AI Score</p>
                <p className="text-3xl font-black text-white">{selectedLead.score}<span className="text-base text-gray-500">%</span></p>
              </div>
              <div className="p-4 glass-panel rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase mb-1">Source</p>
                <p className="text-xl font-black text-cyberBlue">{selectedLead.source}</p>
              </div>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between p-3 border border-white/5 rounded-xl">
                <span className="text-gray-500">Phone</span>
                <span>{selectedLead.phone}</span>
              </div>
              <div className="flex justify-between p-3 border border-white/5 rounded-xl">
                <span className="text-gray-500">Email</span>
                <span>{selectedLead.email}</span>
              </div>
              <div className="flex justify-between p-3 border border-white/5 rounded-xl">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded font-black ${LEAD_STATUS_COLORS[selectedLead.status]}`}>{selectedLead.status}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <button onClick={() => launchCampaign(selectedLead)} className="w-full py-4 bg-red-500 text-black font-black rounded-xl uppercase text-xs tracking-widest hover:bg-red-400 transition">
                🚀 Launch WhatsApp Campaign
              </button>
              <button className="w-full py-3 glass-panel rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition">
                📅 Book Meeting Manually
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full">
        <nav className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1 text-[10px] font-mono text-gray-500 uppercase">
              <button onClick={() => router.push(`/${tenant}/dashboard`)} className="hover:text-white transition">← Dashboard</button>
              <span>/</span>
              <span>Lead Vault</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Lead Intake <span className="text-red-500">Hub</span></h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setConnectModal('gsheet')} className="px-5 py-2.5 glass-panel rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition flex items-center gap-2">
              🌐 Google Sheets
            </button>
            <button onClick={() => setConnectModal('crm')} className="px-5 py-2.5 glass-panel rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition flex items-center gap-2">
              🔗 HubSpot CRM
            </button>
            <button onClick={() => setUploadModal(true)} className="px-6 py-2.5 bg-red-500 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-400 transition flex items-center gap-2">
              ↑ Upload Excel
            </button>
          </div>
        </nav>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-10">
          {Object.entries(LEAD_STATUS_COLORS).map(([status, cls]) => {
            const count = leads.filter(l => l.status === status).length;
            return (
              <button key={status} onClick={() => setFilterStatus(filterStatus === status ? 'ALL' : status)}
                className={`p-5 glass-panel rounded-2xl text-center transition hover:scale-105 ${filterStatus === status ? 'border-red-500 border' : ''}`}>
                <p className={`text-2xl font-black ${cls.split(' ')[0]}`}>{count}</p>
                <p className="text-[9px] font-mono text-gray-500 uppercase mt-1">{status.replace('_', ' ')}</p>
              </button>
            );
          })}
        </div>

        {/* Lead Table */}
        <div className="glass-panel iron-glow rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/40 border-b border-white/10">
              <tr className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="p-5">Lead</th>
                <th className="p-5">Company</th>
                <th className="p-5">Source</th>
                <th className="p-5">AI Score</th>
                <th className="p-5">Status</th>
                <th className="p-5">Last Touch</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedLead(lead)}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition cursor-pointer group"
                >
                  <td className="p-5">
                    <div className="font-bold text-white group-hover:text-red-400 transition">{lead.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{lead.email}</div>
                  </td>
                  <td className="p-5 text-sm text-gray-300">{lead.company}</td>
                  <td className="p-5">
                    <span className="text-[10px] glass-panel px-3 py-1 rounded-full font-bold uppercase">{lead.source}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${lead.score > 80 ? 'bg-matrixGreen' : lead.score > 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                          style={{ width: `${lead.score}%` }}></div>
                      </div>
                      <span className="text-xs font-bold">{lead.score}%</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${LEAD_STATUS_COLORS[lead.status]}`}>{lead.status.replace('_', ' ')}</span>
                  </td>
                  <td className="p-5 text-[10px] text-gray-500 font-mono">{lead.lastMsg}</td>
                  <td className="p-5 text-right">
                    <button onClick={(e) => { e.stopPropagation(); launchCampaign(lead); }}
                      className="px-4 py-2 bg-red-500 text-black font-black rounded-lg text-[10px] uppercase hover:bg-red-400 transition opacity-0 group-hover:opacity-100">
                      🚀 Launch
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

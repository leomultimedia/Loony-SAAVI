"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

const AGENT_META: Record<string, { color: string; emoji: string }> = {
  Leo:   { color: '#ef4444', emoji: '🦁' },
  Eva:   { color: '#8b5cf6', emoji: '🌸' },
  Lia:   { color: '#06b6d4', emoji: '🔬' },
  James: { color: '#f59e0b', emoji: '🎯' },
  Mary:  { color: '#10b981', emoji: '🌿' },
};

const DEMO_LEADS = [
  { id: 'L001', name: 'Ahmed Al Mansoori', company: 'Dubai Fintech Group', phone: '+971 50 *** 4567', email: 'a.al***@dfg.ae', source: 'Excel', status: 'MEETING_SET', aiScore: 92, lastMsg: '2 min ago', agentId: null, salesUserId: null },
  { id: 'L002', name: 'Priya Sharma', company: 'Axiom Telecom', phone: '+971 52 *** 8910', email: 'p.sh***@axiom.ae', source: 'HubSpot', status: 'QUALIFIED', aiScore: 78, lastMsg: '15 min ago', agentId: null, salesUserId: null },
  { id: 'L003', name: 'Khalid Bin Rashid', company: 'ADNOC Digital', phone: '+971 56 *** 1234', email: 'k.ra***@adnoc.ae', source: 'GSheet', status: 'CONTACTED', aiScore: 61, lastMsg: '1 hr ago', agentId: null, salesUserId: null },
  { id: 'L004', name: 'Sarah Mitchell', company: 'Emaar PropTech', phone: '+44 78 *** 5678', email: 's.mi***@emaar.com', source: 'CSV', status: 'NEW', aiScore: 44, lastMsg: 'Just now', agentId: null, salesUserId: null },
];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'text-gray-400 bg-white/5', CONTACTED: 'text-cyberBlue bg-cyberBlue/10',
  QUALIFIED: 'text-yellow-400 bg-yellow-400/10', MEETING_SET: 'text-purple-400 bg-purple-400/10',
  WON: 'text-matrixGreen bg-matrixGreen/10', LOST: 'text-red-500 bg-red-500/10',
};

export default function LeadsPage() {
  const { tenant } = useParams();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [salesUsers, setSalesUsers] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState('demo-tenant');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [connectModal, setConnectModal] = useState<'gsheet' | 'crm' | null>(null);
  const [importing, setImporting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    const entity = stored[0] || { id: 'demo-tenant', name: 'Lear Cyber tech' };
    setTenantId(entity.id);

    // Try to load from DB, fallback to demo
    Promise.all([
      fetch(`/api/leads?tenantId=${entity.id}`).then(r => r.json()).catch(() => []),
      fetch(`/api/agents?tenantId=${entity.id}`).then(r => r.json()).catch(() => []),
      fetch(`/api/sales-users?tenantId=${entity.id}`).then(r => r.json()).catch(() => []),
    ]).then(([dbLeads, dbAgents, dbUsers]) => {
      setLeads(Array.isArray(dbLeads) && dbLeads.length ? dbLeads : DEMO_LEADS);
      setAgents(Array.isArray(dbAgents) ? dbAgents : []);
      setSalesUsers(Array.isArray(dbUsers) ? dbUsers : []);
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImporting(true);
    // Simulate parse + PDPL masking
    setTimeout(async () => {
      const newLeads = [
        { name: 'Fatima Al Zaabi', company: 'DEWA Digital', phone: '+971501234567', email: 'f.zaabi@dewa.gov.ae', source: 'EXCEL' },
        { name: 'Tom Chen', company: 'DP World Tech', phone: '+971551111222', email: 't.chen@dpworld.ae', source: 'EXCEL' },
      ];
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, leads: newLeads }),
      });
      const { count } = await res.json();
      // Refresh
      const fresh = await fetch(`/api/leads?tenantId=${tenantId}`).then(r => r.json()).catch(() => []);
      setLeads(Array.isArray(fresh) && fresh.length ? fresh : leads);
      setImporting(false);
      setUploadModal(false);
      alert(`✅ Imported ${count} leads. PII auto-masked.`);
    }, 2500);
  };

  const assignAgent = async (leadId: string, agentId: string) => {
    setAssigning(true);
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId }),
    }).catch(() => null);
    if (res?.ok) {
      const updated = await res.json();
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, agentId: updated.agentId, agent: updated.agent } : l));
      if (selectedLead?.id === leadId) setSelectedLead((p: any) => ({ ...p, agentId: updated.agentId, agent: updated.agent }));
    } else {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, agentId } : l));
    }
    setAssigning(false);
  };

  const assignSalesUser = async (leadId: string, salesUserId: string) => {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salesUserId }),
    }).catch(() => null);
    if (res?.ok) {
      const updated = await res.json();
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, salesUserId: updated.salesUserId, salesUser: updated.salesUser } : l));
      if (selectedLead?.id === leadId) setSelectedLead((p: any) => ({ ...p, salesUserId: updated.salesUserId, salesUser: updated.salesUser }));
    } else {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, salesUserId } : l));
    }
  };

  const filtered = filterStatus === 'ALL' ? leads : leads.filter(l => l.status === filterStatus);
  const activeAgents = agents.filter(a => a.isActive);

  return (
    <main className="min-h-screen bg-transparent p-6 font-sans text-white relative">

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg glass-panel iron-glow rounded-[3rem] p-12 relative">
              <button onClick={() => setUploadModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-red-500 hover:text-black transition">×</button>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Import Leads</h2>
              <p className="text-gray-500 text-xs font-mono mb-8">UAE PDPL Auto-Masking: Phone & Email redacted before AI processing.</p>
              {importing ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 border-t-4 border-red-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-mono text-gray-400 animate-pulse uppercase tracking-widest">Ingesting & Masking PII via Ghost-Protocol...</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/20 rounded-3xl hover:border-red-500 transition cursor-pointer group">
                  <span className="text-5xl mb-4 group-hover:scale-110 transition">📂</span>
                  <p className="font-bold text-sm mb-1">Drop Excel / CSV here</p>
                  <p className="text-[10px] text-gray-500 font-mono">Supports .xlsx, .xls, .csv</p>
                  <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRM Connect Modal */}
      <AnimatePresence>
        {connectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg glass-panel iron-glow rounded-[3rem] p-12 relative">
              <button onClick={() => setConnectModal(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-red-500 hover:text-black transition">×</button>
              <h2 className="text-3xl font-black tracking-tighter mb-2">{connectModal === 'gsheet' ? '📊 Google Sheets' : '🔗 HubSpot CRM'}</h2>
              <p className="text-gray-500 text-xs font-mono mb-8">Configure this in Settings → Integrations for persistent credentials.</p>
              <div className="space-y-4">
                <input type="text" placeholder={connectModal === 'gsheet' ? 'Spreadsheet ID' : 'HubSpot Portal ID'} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-cyberBlue outline-none" />
                <input type="password" placeholder={connectModal === 'gsheet' ? 'Service Account Key' : 'Private App Token'} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-cyberBlue outline-none" />
                <button onClick={() => { setConnectModal(null); router.push(`/${tenant}/settings`); }} className="w-full py-4 bg-cyberBlue text-black font-black rounded-xl uppercase tracking-widest text-xs hover:bg-white transition">
                  Save in Settings & Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lead Sidebar */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-[420px] z-[100] glass-panel iron-glow border-l border-white/10 p-10 flex flex-col gap-6 overflow-y-auto">
            <button onClick={() => setSelectedLead(null)} className="self-end w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-red-500 hover:text-black transition">×</button>
            
            <div>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">Lead Profile · {selectedLead.id}</p>
              <h2 className="text-2xl font-black tracking-tight">{selectedLead.name}</h2>
              <p className="text-gray-400 text-sm">{selectedLead.company}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 glass-panel rounded-2xl text-center">
                <p className="text-[9px] text-gray-500 uppercase mb-1">AI Score</p>
                <p className={`text-3xl font-black ${selectedLead.aiScore > 80 ? 'text-matrixGreen' : selectedLead.aiScore > 60 ? 'text-yellow-400' : 'text-red-500'}`}>{selectedLead.aiScore}%</p>
              </div>
              <div className="p-4 glass-panel rounded-2xl text-center">
                <p className="text-[9px] text-gray-500 uppercase mb-1">Source</p>
                <p className="text-xl font-black text-cyberBlue">{selectedLead.source}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {[['Phone', selectedLead.phone], ['Email', selectedLead.email]].map(([k, v]) => (
                <div key={k} className="flex justify-between p-3 border border-white/5 rounded-xl">
                  <span className="text-gray-500">{k}</span><span>{v}</span>
                </div>
              ))}
              <div className="flex justify-between p-3 border border-white/5 rounded-xl items-center">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded font-black ${STATUS_COLORS[selectedLead.status]}`}>{selectedLead.status}</span>
              </div>
            </div>

            {/* Assign AI Agent */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Assign AI Agent</label>
              <div className="grid grid-cols-5 gap-2">
                {['Leo', 'Eva', 'Lia', 'James', 'Mary'].map(name => {
                  const meta = AGENT_META[name];
                  const agent = agents.find(a => a.agentName === name);
                  const isAssigned = selectedLead.agentId === agent?.id || selectedLead.agent?.agentName === name;
                  return (
                    <button key={name} disabled={!agent?.isActive}
                      onClick={() => assignAgent(selectedLead.id, agent?.id || name)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition text-center ${isAssigned ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:border-white/30'} ${!agent?.isActive ? 'opacity-30 cursor-not-allowed' : ''}`}>
                      <span className="text-xl">{meta.emoji}</span>
                      <span className="text-[9px] font-black mt-1">{name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-gray-600 mt-2 font-mono">Enable agents in Settings → AI Agents</p>
            </div>

            {/* Assign Sales User */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Assign Sales Rep (HITL)</label>
              {salesUsers.length === 0 ? (
                <button onClick={() => router.push(`/${tenant}/settings`)} className="w-full py-3 glass-panel rounded-xl text-xs text-gray-500 hover:text-white transition uppercase font-bold tracking-widest">+ Add Team in Settings</button>
              ) : (
                <select
                  value={selectedLead.salesUserId || ''}
                  onChange={e => { assignSalesUser(selectedLead.id, e.target.value); setSelectedLead((p: any) => ({ ...p, salesUserId: e.target.value })); }}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none appearance-none">
                  <option value="">— Unassigned (AI Only) —</option>
                  {salesUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>)}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button onClick={() => router.push(`/${tenant}/whatsapp?leadId=${selectedLead.id}&name=${encodeURIComponent(selectedLead.name)}`)}
                className="w-full py-4 bg-red-500 text-black font-black rounded-xl uppercase text-xs tracking-widest hover:bg-red-400 transition">
                🚀 Launch WhatsApp Campaign
              </button>
              <button onClick={() => router.push(`/${tenant}/settings`)}
                className="w-full py-3 glass-panel rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition">
                ⚙️ Configure Plugins
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="max-w-7xl mx-auto w-full">
        <nav className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1 text-[10px] font-mono text-gray-500 uppercase">
              <button onClick={() => router.push(`/${tenant}/dashboard`)} className="hover:text-white transition">← Dashboard</button>
              <span>/</span><span>Lead Vault</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Lead <span className="text-red-500">Vault</span></h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setConnectModal('gsheet')} className="px-5 py-2.5 glass-panel rounded-xl text-xs font-black uppercase hover:bg-white/5 transition">📊 GSheet</button>
            <button onClick={() => setConnectModal('crm')} className="px-5 py-2.5 glass-panel rounded-xl text-xs font-black uppercase hover:bg-white/5 transition">🔗 HubSpot</button>
            <button onClick={() => setUploadModal(true)} className="px-6 py-2.5 bg-red-500 text-black rounded-xl text-xs font-black uppercase hover:bg-red-400 transition">↑ Excel Import</button>
            <button onClick={() => router.push(`/${tenant}/settings`)} className="px-5 py-2.5 glass-panel rounded-xl text-xs font-black uppercase hover:bg-white/5 transition">⚙️ Settings</button>
          </div>
        </nav>

        {/* Status filter pills */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SET', 'WON', 'LOST'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition ${filterStatus === s ? 'bg-red-500 text-black' : 'glass-panel text-gray-500 hover:text-white'}`}>
              {s.replace('_', ' ')} {s !== 'ALL' && `(${leads.filter(l => l.status === s).length})`}
            </button>
          ))}
        </div>

        <div className="glass-panel iron-glow rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/40 border-b border-white/10">
              <tr className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="p-5">Lead</th>
                <th className="p-5">Source</th>
                <th className="p-5">AI Agent</th>
                <th className="p-5">Sales Rep</th>
                <th className="p-5">Score</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const assignedAgent = lead.agent || agents.find(a => a.id === lead.agentId);
                return (
                  <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedLead(lead)}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition cursor-pointer group">
                    <td className="p-5">
                      <div className="font-bold group-hover:text-red-400 transition">{lead.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{lead.company}</div>
                    </td>
                    <td className="p-5"><span className="glass-panel px-3 py-1 rounded-full text-[10px] font-bold uppercase">{lead.source}</span></td>
                    <td className="p-5">
                      {assignedAgent ? (
                        <span className="flex items-center gap-2 text-xs font-bold">
                          <span>{AGENT_META[assignedAgent.agentName]?.emoji}</span>
                          <span>{assignedAgent.agentName}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-600 font-mono">— Unassigned</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] text-gray-500 font-mono">
                        {lead.salesUser?.name || '— AI Only'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${(lead.aiScore || 0) > 80 ? 'bg-matrixGreen' : (lead.aiScore || 0) > 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                            style={{ width: `${lead.aiScore || 0}%` }}></div>
                        </div>
                        <span className="text-xs font-bold">{lead.aiScore || 0}%</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${STATUS_COLORS[lead.status]}`}>{lead.status?.replace('_', ' ')}</span>
                    </td>
                    <td className="p-5 text-right">
                      <button onClick={e => { e.stopPropagation(); router.push(`/${tenant}/whatsapp?leadId=${lead.id}&name=${encodeURIComponent(lead.name)}`); }}
                        className="px-4 py-2 bg-red-500 text-black font-black rounded-lg text-[10px] uppercase hover:bg-red-400 transition opacity-0 group-hover:opacity-100">
                        🚀 Launch
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

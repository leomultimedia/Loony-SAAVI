"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResellerGlobalAdmin() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [confirmingAction, setConfirmingAction] = useState<{ type: 'archive' | 'revive', id: string, name: string } | null>(null);

  useEffect(() => {
     const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
     setTenants(stored);
  }, []);

  const totalMRR = tenants.reduce((acc, t) => acc + ((t.status === 'Archived' ? 0 : t.mrr) || 0), 0);

  const handleAction = () => {
    if (!confirmingAction) return;
    const { type, id } = confirmingAction;
    
    let updated;
    if (type === 'archive') {
        updated = tenants.map(t => t.id === id ? { ...t, status: 'Archived', mrr: 0 } : t);
    } else {
        updated = tenants.map(t => t.id === id ? { ...t, status: 'Active', mrr: t.tier === 'PRO' ? 499 : 1999 } : t);
    }
    
    setTenants(updated);
    localStorage.setItem('vanguard_tenants', JSON.stringify(updated));
    setConfirmingAction(null);
  };

  const activeTenants = tenants.filter(t => t.status !== 'Archived');
  const archivedTenants = tenants.filter(t => t.status === 'Archived');

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans p-8 font-mono">
      <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-10">
        <div>
           <h1 className="text-3xl font-display font-bold">Vanguard Master Console</h1>
           <p className="text-sm text-gray-500 mt-2">Hierarchical Entity Management & Global Billing</p>
        </div>
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
           <button 
             onClick={() => setActiveTab('active')}
             className={`px-6 py-2 rounded-md text-xs font-bold transition ${activeTab === 'active' ? 'bg-cyberBlue text-black shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'text-gray-500 hover:text-white'}`}
           >
             ACTIVE ({activeTenants.length})
           </button>
           <button 
             onClick={() => setActiveTab('archived')}
             className={`px-6 py-2 rounded-md text-xs font-bold transition ${activeTab === 'archived' ? 'bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-gray-500 hover:text-white'}`}
           >
             ARCHIVED ({archivedTenants.length})
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-matrixGreen/30 p-6 rounded-xl shadow-[0_0_20px_rgba(0,255,65,0.05)]">
              <span className="text-gray-400 text-sm">Monthly Recurring Revenue</span>
              <div className="text-4xl font-bold flex items-center gap-4 mt-2">
                  <span className="text-matrixGreen">${totalMRR}</span>
              </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <span className="text-gray-400 text-sm">Sovereign Node Entities</span>
              <div className="text-4xl font-bold mt-2">{tenants.length}</div>
          </div>
      </div>

      <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-black/50 border-b border-white/10 text-gray-400 text-xs uppercase">
                  <tr>
                      <th className="p-4 text-xs font-mono">Entity Hierarchy</th>
                      <th className="p-4">Admin Email</th>
                      <th className="p-4">Tier / Plan</th>
                      <th className="p-4">Uptime Status</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {(activeTab === 'active' ? activeTenants : archivedTenants).length === 0 && (
                      <tr>
                          <td colSpan={5} className="p-12 text-center text-gray-600 italic">No {activeTab} entities detected. System dormant.</td>
                      </tr>
                  )}
                  {(activeTab === 'active' ? activeTenants : archivedTenants).map(t => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                 {t.isMaster ? (
                                     <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold">MASTER</span>
                                 ) : (
                                     <span className="text-gray-600 text-xs">└─</span>
                                 )}
                                 <span className="font-bold text-cyberBlue">{t.name}</span>
                              </div>
                              <span className="text-[10px] text-gray-600 block ml-6 font-mono">{t.id}</span>
                          </td>
                          <td className="p-4 text-gray-300 font-mono text-xs">{t.email}</td>
                          <td className="p-4">
                             <div className="flex flex-col">
                                <span className="font-bold text-white text-xs">{t.tier}</span>
                                <span className="text-[10px] text-gray-500">${t.status === 'Archived' ? 0 : t.mrr}/mo</span>
                             </div>
                          </td>
                          <td className="p-4">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${t.status === 'Archived' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-matrixGreen shadow-[0_0_10px_#00ff41] content-pulse'}`}></span>
                                <span className="text-[10px] uppercase font-bold tracking-tighter">{t.status}</span>
                             </div>
                          </td>
                          <td className="p-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                  {t.status === 'Active' ? (
                                      <>
                                          <a href={`/loonyheads/dashboard`} className="px-3 py-1.5 bg-cyberBlue/10 border border-cyberBlue/40 text-cyberBlue rounded text-[10px] font-bold hover:bg-cyberBlue hover:text-black">DASHBOARD</a>
                                          <button 
                                            onClick={() => setConfirmingAction({ type: 'archive', id: t.id, name: t.name })}
                                            className="px-3 py-1.5 bg-red-500/10 border border-red-500/40 text-red-500 rounded text-[10px] font-bold hover:bg-red-500 hover:text-black"
                                          >
                                            ARCHIVE
                                          </button>
                                      </>
                                  ) : (
                                      <button 
                                        onClick={() => setConfirmingAction({ type: 'revive', id: t.id, name: t.name })}
                                        className="px-3 py-1.5 bg-matrixGreen/10 border border-matrixGreen/40 text-matrixGreen rounded text-[10px] font-bold hover:bg-matrixGreen hover:text-black"
                                      >
                                        REVIVE ENTITY
                                      </button>
                                  )}
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* CUSTOM ACTION MODAL (Replaces window.confirm) */}
      <AnimatePresence>
          {confirmingAction && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm shadow-2xl">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl overflow-hidden relative"
                  >
                        <div className={`absolute top-0 left-0 w-full h-1 ${confirmingAction.type === 'archive' ? 'bg-red-500' : 'bg-matrixGreen'}`}></div>
                        <h2 className="text-xl font-bold mb-4">Confirm Infrastructure Shift?</h2>
                        <p className="text-gray-400 text-sm mb-8">
                            Are you sure you want to <strong>{confirmingAction.type}</strong> the entity <strong>{confirmingAction.name}</strong>? 
                            {confirmingAction.type === 'archive' ? ' This will pause all automated revenue loops.' : ' This will immediately resume billing and node inference.'}
                        </p>
                        <div className="flex gap-4">
                            <button 
                              onClick={() => setConfirmingAction(null)}
                              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg font-bold text-sm hover:bg-white/10"
                            >
                              CANCEL
                            </button>
                            <button 
                              id="modal-confirm-btn"
                              onClick={handleAction}
                              className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm ${confirmingAction.type === 'archive' ? 'bg-red-500 text-black hover:bg-red-600' : 'bg-matrixGreen text-black hover:bg-[#00cc33]'}`}
                            >
                              CONFIRM
                            </button>
                        </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <section className="mt-20 p-8 bg-cyberBlue/5 border border-cyberBlue/20 rounded-2xl max-w-4xl border-dashed">
          <h2 className="text-xl font-display font-bold text-cyberBlue mb-4 flex items-center gap-2 italic underline">
             MASTER CONSOLE INSTRUCTIONS
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-[11px] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
              <div className="space-y-4">
                  <p>1. <span className="text-white">Hierarchical Control:</span> Master Entities appear with purple badges. Any Sub-Entity created under a Master can be audited directly from the Master Dashboard.</p>
                  <p>2. <span className="text-white">Non-Destructive Archiving:</span> Archiving a client stops the MRR (revenue) but keeps the lead database safe. Use the RED TABS to see clients who are currently paused.</p>
              </div>
              <div className="space-y-4">
                   <p>3. <span className="text-white">Uniqueness Filter:</span> The system prevents duplicate entity names globally to ensure legal and cryptographic isolation.</p>
                   <p>4. <span className="text-white">Revival Loop:</span> Reviving an archived client instantly re-authenticates their BYOK secrets and resumes the $499/mo matrix loop.</p>
              </div>
          </div>
      </section>
    </main>
  );
}

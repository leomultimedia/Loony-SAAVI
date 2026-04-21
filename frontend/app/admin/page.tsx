"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResellerGlobalAdmin() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [confirmingAction, setConfirmingAction] = useState<{ type: 'archive' | 'revive' | 'offboard', id: string, name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
      setLoading(true);
      try {
          // Real dynamic API fetch
          const res = await fetch('/api/tenants');
          const data = await res.json();
          setTenants(Array.isArray(data) ? data : []);
      } catch (e) {
          console.error("Vanguard Sync Failed", e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
     fetchTenants();
  }, []);

  const totalMRR = tenants.reduce((acc, t) => acc + ((t.status === 'Archived' ? 0 : (t.subscriptionTier === 'PRO' ? 499 : 1999)) || 0), 0);

  const handleAction = async () => {
    if (!confirmingAction) return;
    const { type, id } = confirmingAction;
    
    try {
        if (type === 'offboard') {
            await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
        } else {
            const nextStatus = type === 'archive' ? 'Archived' : 'Active';
            await fetch(`/api/tenants/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: nextStatus })
            });
        }
        await fetchTenants();
    } catch (e) {
        alert("Operation Synchronicity Error");
    }
    
    setConfirmingAction(null);
  };

  const activeTenants = tenants.filter(t => t.status !== 'Archived');
  const archivedTenants = tenants.filter(t => t.status === 'Archived');

  return (
    <main className="min-h-screen bg-transparent text-white font-sans p-8 font-mono relative">
      
      {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-cyberBlue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-bold tracking-[0.4em] text-cyberBlue">VAULT_QUERYING...</span>
              </div>
          </div>
      )}

      <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-10">
        <div>
           <h1 className="text-3xl font-display font-bold">Vanguard Master Console</h1>
           <p className="text-sm text-gray-500 mt-2 italic flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-matrixGreen rounded-full animate-pulse"></span>
              Live SQL_Persisted Infrastructure Link
           </p>
        </div>
        <div className="flex glass-panel rounded-lg p-1 border border-white/10">
           <button 
             onClick={() => setActiveTab('active')}
             className={`px-6 py-2 rounded-md text-xs font-bold transition ${activeTab === 'active' ? 'bg-cyberBlue text-black' : 'text-gray-500 hover:text-white'}`}
           >
             ACTIVE ({activeTenants.length})
           </button>
           <button 
             onClick={() => setActiveTab('archived')}
             className={`px-6 py-2 rounded-md text-xs font-bold transition ${activeTab === 'archived' ? 'bg-red-500 text-black' : 'text-gray-500 hover:text-white'}`}
           >
             ARCHIVED ({archivedTenants.length})
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-matrixGreen/50"></div>
              <span className="text-gray-400 text-sm">Monthly Recurring Revenue</span>
              <div className="text-4xl font-bold flex items-center gap-4 mt-2">
                  <span className="text-matrixGreen">${totalMRR}</span>
              </div>
          </div>
          <div className="glass-panel p-6 rounded-xl">
              <span className="text-gray-400 text-sm">Sovereign Node Entities</span>
              <div className="text-4xl font-bold mt-2">{tenants.length}</div>
          </div>
      </div>

      <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left glass-panel rounded-xl overflow-hidden shadow-2xl">
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
                  {(activeTab === 'active' ? activeTenants : archivedTenants).length === 0 && !loading && (
                      <tr>
                          <td colSpan={5} className="p-12 text-center text-gray-600 italic">No {activeTab} entities detected in Prisma DB.</td>
                      </tr>
                  )}
                  {(activeTab === 'active' ? activeTenants : archivedTenants).map(t => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                 {t.isMaster ? (
                                     <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">MASTER</span>
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
                                <span className="font-bold text-white text-xs">{t.subscriptionTier}</span>
                                <span className="text-[10px] text-gray-500">${t.status === 'Archived' ? 0 : (t.subscriptionTier === 'PRO' ? 499 : 1999)}/mo</span>
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
                                          <a href={`/loonyheads/dashboard`} className="px-3 py-1.5 glass-panel text-cyberBlue rounded text-[10px] font-bold hover:bg-cyberBlue hover:text-black">DASHBOARD</a>
                                          <button 
                                            onClick={() => setConfirmingAction({ type: 'archive', id: t.id, name: t.name })}
                                            className="px-3 py-1.5 glass-panel text-red-500 rounded text-[10px] font-bold hover:bg-red-500 hover:text-black"
                                          >
                                            ARCHIVE
                                          </button>
                                      </>
                                  ) : (
                                      <>
                                          <button 
                                            onClick={() => setConfirmingAction({ type: 'revive', id: t.id, name: t.name })}
                                            className="px-3 py-1.5 glass-panel text-matrixGreen rounded text-[10px] font-bold hover:bg-matrixGreen hover:text-black"
                                          >
                                            REVIVE
                                          </button>
                                          <button 
                                            onClick={() => setConfirmingAction({ type: 'offboard', id: t.id, name: t.name })}
                                            className="px-3 py-1.5 glass-panel text-red-600 rounded text-[10px] font-bold hover:bg-red-600 hover:text-black"
                                          >
                                            OFFBOARD
                                          </button>
                                      </>
                                  )}
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      <AnimatePresence>
          {confirmingAction && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative"
                  >
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-center">Protocol Confirmation</h2>
                        <p className="text-gray-400 text-sm mb-8 text-center">
                            Triggering <strong>{confirmingAction.type}</strong> on <strong>{confirmingAction.name}</strong>.
                            {confirmingAction.type === 'offboard' ? ' THIS ACTION IS PERMANENT.' : ' This shift will affect billing immediately.'}
                        </p>
                        <div className="flex gap-4">
                            <button 
                              onClick={() => setConfirmingAction(null)}
                              className="flex-1 px-4 py-3 glass-panel border-white/10 rounded-lg font-bold text-xs"
                            >
                              CANCEL
                            </button>
                            <button 
                              onClick={handleAction}
                              className={`flex-1 px-4 py-3 rounded-lg font-bold text-xs ${confirmingAction.type === 'archive' || confirmingAction.type === 'offboard' ? 'bg-red-500 text-black' : 'bg-matrixGreen text-black'}`}
                            >
                              CONFIRM_SHIFT
                            </button>
                        </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </main>
  );
}

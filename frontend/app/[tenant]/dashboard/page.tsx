"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

export default function CommandDashboard() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [currentEntity, setCurrentEntity] = useState<any>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setTenants(stored);
    
    // Simple mock logic: If we are on a dashboard, we assume we are viewing the 
    // first tenant as the current context for this demo.
    setCurrentEntity(stored[0] || null);
  }, []);

  const subEntities = currentEntity?.isMaster 
    ? tenants.filter(t => t.parentId === currentEntity.id)
    : [];

  const exportDataExcel = () => {
      // Generates a native structured CSV format natively recognized by MS Excel
      const csvData = "Lead ID,Lead Phone,Risk Score,ISO 27001 Gaps,Pipeline Status\nIDX-992,+971501234567,HIGH,Missing SSL/DMARC,Negotiating\nIDX-993,+44812345678,LOW,None,Closed";
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'Vanguard_Tenant_Data_Export.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 font-sans p-6 overflow-hidden flex flex-col relative">
       
       {/* Global Cmd+K Palette */}
       <OmniCommandBar />

       <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-4 relative z-20 font-mono">
           <div className="flex items-center gap-4">
               {currentEntity?.isMaster && (
                   <span className="bg-purple-500 text-black px-2 py-1 rounded text-[10px] font-bold">MASTER HUB ACTIVE</span>
               )}
               <span className="text-xs text-gray-400 italic">Entity: {currentEntity?.name || 'Loading Sovereign Node...'}</span>
           </div>
           <button onClick={exportDataExcel} className="text-[10px] bg-black border border-cyberBlue/40 text-cyberBlue px-4 py-2 rounded-lg hover:bg-cyberBlue hover:text-black transition flex items-center gap-2 font-bold uppercase tracking-widest">
              ↓ Download Lead Vault (Excel)
           </button>
       </div>

       {/* Master Aggregate View Banner */}
       {currentEntity?.isMaster && subEntities.length > 0 && (
           <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto mb-8 p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
               <h3 className="text-xs font-bold text-purple-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                   Managing Sub-Entities ({subEntities.length})
               </h3>
               <div className="flex gap-4">
                   {subEntities.map(sub => (
                       <div key={sub.id} className="p-3 bg-black border border-white/5 rounded-xl flex flex-col gap-1 min-w-[150px]">
                            <span className="text-[10px] font-bold text-white">{sub.name}</span>
                            <span className="text-[9px] text-gray-600">Plan: {sub.tier}</span>
                            <span className="text-[9px] text-matrixGreen">Status: ACTIVE</span>
                       </div>
                   ))}
               </div>
           </motion.section>
       )}

       {/* OMNI-BAR / NO MENUS */}
       <header className="flex justify-center mb-8 pt-4 z-10 w-full relative">
           <div className="absolute inset-x-0 -top-10 h-32 bg-cyberBlue/5 blur-3xl rounded-full"></div>
           <div className="w-full max-w-3xl flex flex-col items-center">
             <div className="w-full backdrop-blur-2xl bg-white/5 border border-white/10 rounded-full px-8 py-4 flex justify-between shadow-2xl z-20">
               <span className="font-mono text-gray-500">Search leads, command audits...</span>
               <span className="font-mono text-cyberBlue border border-cyberBlue/30 rounded px-2 text-sm bg-cyberBlue/10">Press ⌘ K</span>
             </div>
           </div>
       </header>

       {/* HEATMAP GRID */}
       <section className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Main Queue */}
          <div className="md:col-span-8 bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
               <div className="w-32 h-32 border-4 border-cyberBlue rounded-full animate-ping"></div>
             </div>
             
             <h2 className="text-2xl font-display font-medium mb-8 flex items-center gap-3">
                <span className="w-3 h-3 bg-cyberBlue rounded-full shadow-[0_0_10px_#00f3ff]"></span>
                AI Sales Qualification Queue
             </h2>

             <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyberBlue/30 transition cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyberBlue to-purple-500 flex items-center justify-center text-black font-bold">
                          {String.fromCharCode(64 + i)}
                        </div>
                        <div>
                          <p className="font-medium">Lead Sync Protocol #{i+991}</p>
                          <p className="text-xs text-gray-500 font-mono">Status: In-Progress Audit</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-matrixGreen font-mono text-sm">88% Match</p>
                         <p className="text-[10px] text-gray-600">Detected: SSL Gap</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Side Panels */}
          <div className="md:col-span-4 space-y-6">
             <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest font-mono">[LIVE] Risk & Compliance Heatmap</h3>
                <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-yellow-500/10 to-matrixGreen/10 animate-pulse"></div>
                   <span className="text-xs text-gray-600 font-mono italic">Syncing live shadow-audit nodes...</span>
                </div>
             </div>

             <div className="bg-matrixGreen text-black p-6 rounded-3xl shadow-[0_0_40px_rgba(0,255,65,0.1)]">
                <h3 className="font-bold mb-2">Revenue Pipeline Velocity</h3>
                <p className="text-4xl font-extrabold tracking-tighter">$142.8k</p>
                <div className="mt-4 h-1 w-full bg-black/20 rounded-full overflow-hidden">
                   <div className="h-full bg-black w-2/3"></div>
                </div>
             </div>
          </div>

       </section>

       {/* Matrix Background Elements */}
       <div className="fixed bottom-0 left-0 p-8 font-mono text-[10px] text-gray-800 pointer-events-none uppercase">
          Vanguard OS // Node: AE-DXB-01 // Secure Connection: Active
       </div>
    </main>
  );
}

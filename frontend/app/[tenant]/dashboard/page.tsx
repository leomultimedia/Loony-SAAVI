"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

// Types for background processes
interface BackgroundTask {
    id: string;
    name: string;
    progress: number;
    status: 'Running' | 'Complete' | 'Failed';
    type: 'AI_SIM' | 'SHADOW_AUDIT' | 'CRM_SYNC';
}

export default function CommandDashboard() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [tasks, setTasks] = useState<BackgroundTask[]>([
      { id: 'task_01', name: 'Llama-3 Analysis: Lead #992', progress: 65, status: 'Running', type: 'AI_SIM' },
      { id: 'task_02', name: 'Global DNS Shadow Audit', progress: 40, status: 'Running', type: 'SHADOW_AUDIT' },
      { id: 'task_03', name: 'HubSpot Pipeline Handshake', progress: 100, status: 'Complete', type: 'CRM_SYNC' },
  ]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setTenants(stored);
    setCurrentEntity(stored[0] || { name: 'Lear Cyber tech', email: 'admin@lct.com', tier: 'PRO', status: 'Active' });

    // Simulate background process movement
    const interval = setInterval(() => {
        setTasks(prev => prev.map(t => ({
            ...t,
            progress: t.progress < 100 ? t.progress + Math.floor(Math.random() * 5) : 100,
            status: t.progress >= 99 ? 'Complete' : 'Running'
        })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const subEntities = currentEntity?.isMaster 
    ? tenants.filter(t => t.parentId === currentEntity.id)
    : [];

  const exportDataExcel = () => {
      if (!currentEntity) return;
      const csvData = "Lead ID,Lead Phone,Risk Score,ISO 27001 Gaps,Pipeline Status\nIDX-992,+971501234567,HIGH,Missing SSL/DMARC,Negotiating\nIDX-993,+44812345678,LOW,None,Closed";
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Vanguard_Export_${currentEntity?.name?.replace(/\s+/g, '_') || 'Export'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 font-sans p-6 overflow-hidden flex flex-col relative selection:bg-cyberBlue selection:text-black">
       
       {/* Cinematic Background Mesh */}
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00f3ff10_0%,transparent_50%)]"></div>
           <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#a855f710_0%,transparent_40%)]"></div>
       </div>

       <OmniCommandBar />

       {/* Top Navigation Bar */}
       <nav className="flex justify-between items-center w-full max-w-7xl mx-auto mb-8 relative z-20">
           <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href='/admin'}>
                    <div className="w-8 h-8 rounded-lg bg-matrixGreen/20 border border-matrixGreen/40 flex items-center justify-center text-matrixGreen group-hover:bg-matrixGreen group-hover:text-black transition">
                        <span className="text-xs font-bold">A</span>
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest text-gray-400 group-hover:text-white">TO_ADMIN</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">Sovereign Node Context</span>
                    <span className="text-sm font-bold text-cyberBlue">{currentEntity?.name}</span>
                </div>
           </div>

           <div className="flex items-center gap-4">
               <button onClick={exportDataExcel} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  <span className="text-cyberBlue">↓</span> EXPORT_VAULT
               </button>
               <div className="flex items-center gap-3 px-4 py-2 bg-matrixGreen/10 border border-matrixGreen/40 rounded-xl">
                    <div className="w-2 h-2 bg-matrixGreen rounded-full animate-pulse shadow-[0_0_10px_#00ff41]"></div>
                    <span className="text-[10px] font-bold text-matrixGreen tracking-widest uppercase">Nodes_Live: 24/24</span>
               </div>
           </div>
       </nav>

       <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Main Sales Engine Queue */}
          <div className="md:col-span-8 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
              >
                 <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyberBlue/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyberBlue/20 transition duration-1000"></div>
                 
                 <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white tracking-tight">AI Qualification Queue</h2>
                        <p className="text-xs text-gray-500 font-mono mt-2 uppercase tracking-widest">Processing Leads via Llama-3-70B Matrix</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-cyberBlue/20 text-cyberBlue rounded-full text-[10px] font-bold border border-cyberBlue/30">BYOK_LAYER_ACTIVE</span>
                    </div>
                 </header>

                 <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                       <motion.div 
                          key={i} 
                          whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.06)' }}
                          className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 transition-all cursor-pointer group/item"
                       >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyberBlue/20 to-purple-500/20 opacity-0 group-hover/item:opacity-100 transition"></div>
                                <span className="font-bold text-cyberBlue z-10">{i}</span>
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover/item:text-cyberBlue transition">Prospect Entity #{9923 + i}</p>
                              <div className="flex gap-4 mt-1">
                                 <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-matrixGreen rounded-full"></span> SSL_CERT_VALID
                                 </span>
                                 <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span> DNS_DMARC_GAP
                                 </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-2xl font-bold font-display text-white group-hover/item:text-matrixGreen transition tracking-tighter">8{i}%</div>
                             <p className="text-[9px] font-mono text-gray-600 uppercase">Match Score</p>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
          </div>

          {/* Right Statistics & Background Task Hub */}
          <div className="md:col-span-4 space-y-6">
             
             {/* Dynamic Pipeline Velocity */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-matrixGreen text-black p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,255,65,0.15)] relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-45 transition duration-1000">
                    <span className="text-6xl font-black italic tracking-tighter hover:scale-110">REVENUE</span>
                </div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">Pipeline_Velocity (MTD)</h3>
                <p className="text-5xl font-black tracking-tighter my-4">$1.42M</p>
                <div className="flex items-center gap-2">
                    <span className="bg-black/10 px-2 py-0.5 rounded text-[10px] font-bold">↑ 24.2% Growth</span>
                </div>
             </motion.div>

             {/* Background Process Monitor (FLOATING STYLE) */}
             <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
                <h3 className="text-[10px] font-bold text-gray-500 mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyberBlue rounded-full animate-ping"></div>
                    Live Background Operations
                </h3>
                <div className="space-y-6">
                   {tasks.map(task => (
                       <div key={task.id} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                             <span className="font-bold text-gray-400">{task.name}</span>
                             <span className={`font-mono ${task.status === 'Complete' ? 'text-matrixGreen' : 'text-cyberBlue animate-pulse'}`}>{task.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                className={`h-full ${task.status === 'Complete' ? 'bg-matrixGreen' : 'bg-cyberBlue Shadow-[0_0_8px_#00f3ff]'}`}
                             />
                          </div>
                       </div>
                   ))}
                </div>
             </div>

             {/* ROI Heatmap Widget */}
             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 text-center group cursor-pointer hover:border-purple-500/30 transition">
                <div className="w-full aspect-video bg-[#050505] rounded-2xl flex items-center justify-center border border-dashed border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 to-transparent"></div>
                    <span className="text-[10px] font-mono text-gray-600 group-hover:text-gray-400 transition">View Consolidated Compliance Heatmap</span>
                </div>
             </div>

          </div>
       </div>

       {/* Persistent System Footer */}
       <footer className="fixed bottom-6 left-6 right-6 z-50 pointer-events-none flex justify-between items-center">
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full font-mono text-[9px] text-gray-500 pointer-events-auto hover:text-white transition cursor-help flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-matrixGreen rounded-full"></span>
                    SYSTEM_STABLE: NODE-AE-102
                </div>
                <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full font-mono text-[9px] text-gray-500 pointer-events-auto hover:text-white transition cursor-help flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyberBlue rounded-full animate-pulse"></span>
                    OLLAMA_MESH: CONNECTED
                </div>
            </div>
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 pointer-events-auto flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter uppercase whitespace-nowrap">Press ⌘ K for Vanguard Omni-Terminal</span>
            </div>
       </footer>

    </main>
  );
}

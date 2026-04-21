"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

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
      { id: 'task_01', name: 'Stark Analysis: Lead #992', progress: 65, status: 'Running', type: 'AI_SIM' },
      { id: 'task_02', name: 'Global DNS Shadow Audit', progress: 40, status: 'Running', type: 'SHADOW_AUDIT' },
      { id: 'task_03', name: 'CRM Pipeline Handshake', progress: 100, status: 'Complete', type: 'CRM_SYNC' },
  ]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setTenants(stored);
    setCurrentEntity(stored[0] || { name: 'Lear Cyber tech', email: 'admin@lct.com', tier: 'PRO', status: 'Active' });

    const interval = setInterval(() => {
        setTasks(prev => prev.map(t => ({
            ...t,
            progress: t.progress < 100 ? t.progress + Math.floor(Math.random() * 5) : 100,
            status: t.progress >= 99 ? 'Complete' : 'Running'
        })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <main className="min-h-screen bg-transparent p-6 overflow-hidden flex flex-col relative selection:bg-red-500 selection:text-white transition-colors duration-1000">
       
       {/* Cinematic Theme-Sensitive Overlays */}
       <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
           {/* Ironman Energy Rings */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-500/10 rounded-full animate-[spin_60s_linear_infinite] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-gold-500/5 border-dashed rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>
           
           {/* Background Glows */}
           <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,var(--accent-color)_0%,transparent_70%)] opacity-[0.08]"></div>
           <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,#00f3ff10_0%,transparent_60%)] opacity-[0.05]"></div>
       </div>

       <OmniCommandBar />

       {/* Navigation */}
       <nav className="flex justify-between items-center w-full max-w-7xl mx-auto mb-10 relative z-20">
           <div className="flex items-center gap-8">
                <div onClick={() => window.location.href='/admin'} className="group cursor-pointer flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl glass-panel iron-glow flex items-center justify-center border-t-red-500/50">
                        <span className="text-white font-black text-xs">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-gray-500 hidden md:block">COMMAND_NODE</span>
                        <span className="text-xs font-bold uppercase hover:text-white transition">Admin Portal</span>
                    </div>
                </div>
           </div>

           <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end mr-4">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Active Sovereign Link</span>
                    <span className="text-sm font-bold text-white tracking-tight">{currentEntity?.name}</span>
                </div>
                <button onClick={exportDataExcel} className="px-6 py-2.5 glass-panel iron-glow rounded-xl hover:bg-white/5 text-[10px] font-black tracking-[0.2em] uppercase transition">
                    Export Data
                </button>
           </div>
       </nav>

       <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          
          {/* Main Display: Extreme Glassmorphism */}
          <div className="md:col-span-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="glass-panel iron-glow rounded-[3rem] p-12 relative overflow-hidden group border-white/5"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
                 
                 <header className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-none mb-4">
                            Sovereign HUD <span className="text-red-500">v4.0</span>
                        </h2>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                                <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_red]"></div> ARC_CORE: READY
                            </span>
                            <span className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                                <div className="w-1 h-1 bg-cyberBlue rounded-full shadow-[0_0_8px_#00f3ff]"></div> FRIDAY_LINK: ACTIVE
                            </span>
                        </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.1em]">Security Protocol 14-B</span>
                    </div>
                 </header>

                 <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((i) => (
                       <motion.div 
                          key={i} 
                          whileHover={{ x: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          className="flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/[0.01] transition-all cursor-pointer group/item relative"
                       >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center relative overflow-hidden group-hover/item:border-red-500/50 transition">
                                <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                                <span className="font-mono text-white z-10 text-xl">#0{i}</span>
                            </div>
                            <div>
                              <p className="font-black text-gray-400 group-hover/item:text-white transition tracking-tight text-lg">PROSPECT_MARK_{100 + i}</p>
                              <div className="flex gap-4 mt-1 opacity-50">
                                 <span className="text-[10px] font-mono uppercase">SSL_ENCRYPTED</span>
                                 <span className="text-[10px] font-mono uppercase text-red-500">DMARC_FAILURE</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-3xl font-black text-white group-hover/item:text-red-500 transition tracking-tighter">9{i}%</div>
                             <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Match Score</p>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
          </div>

          {/* Right Panels: Extreme Glass */}
          <div className="md:col-span-4 space-y-8">
             
             {/* Iron Revenue Card */}
             <motion.div 
                whileHover={{ scale: 1.02 }}
                className="glass-panel iron-glow rounded-[2.5rem] p-10 relative overflow-hidden border-t-red-500/50"
             >
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full"></div>
                <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">Core_Revenue_Target</h3>
                <p className="text-6xl font-black tracking-tighter text-white mb-2">$1.42M</p>
                <p className="text-[10px] font-mono text-gray-500 italic uppercase tracking-wider">Projected Yield 2026</p>
             </motion.div>

             {/* Background Operations Widget */}
             <div className="glass-panel iron-glow rounded-[2.5rem] p-8">
                <h3 className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                    BACKGROUND_THREADS
                </h3>
                <div className="space-y-8">
                   {tasks.map(task => (
                       <div key={task.id} className="space-y-3">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                             <span className="font-bold text-gray-400 uppercase tracking-widest">{task.name}</span>
                             <span className="text-red-500">{task.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                             />
                          </div>
                       </div>
                   ))}
                </div>
             </div>

          </div>
       </div>

       {/* Iron Footer */}
       <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="glass-panel iron-glow px-10 py-3 rounded-full pointer-events-auto border-t-red-500/40">
                <div className="flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] font-black uppercase">
                    <span className="text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> ARC: STABLE
                    </span>
                    <span className="text-gray-500">Nodes: AE-102-DXB</span>
                    <span className="text-red-500 underline decoration-red-500/50">Press ⌘ K to Command</span>
                </div>
            </div>
       </footer>

    </main>
  );
}

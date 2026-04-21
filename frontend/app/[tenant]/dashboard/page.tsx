"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

// Types for deep drill-down
interface DrillDetail {
    type: 'LEAD' | 'REVENUE' | 'TASK' | 'COMPLIANCE';
    id: string;
    title: string;
    data: any;
}

export default function CommandDashboard() {
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<DrillDetail | null>(null);
  const [tasks, setTasks] = useState([
      { id: 'task_01', name: 'Stark Analysis: Lead #992', progress: 75, status: 'Running', details: 'Evaluating PII scrubbing hooks...' },
      { id: 'task_02', name: 'Global DNS Shadow Audit', progress: 52, status: 'Running', details: 'Scanning DMARC/SPF for 42 domains' },
      { id: 'task_03', name: 'CRM Pipeline Handshake', progress: 100, status: 'Complete', details: 'HubSpot Sync Successful' },
  ]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setCurrentEntity(stored[0] || { name: 'Lear Cyber tech', email: 'admin@lct.com', tier: 'PRO', status: 'Active' });
  }, []);

  const leads = [
      { id: '9924', name: 'Fortune 500 Prospect', match: 88, risk: 'SSL/DNS Gaps Detected', transcript: "User: We need ISO 27001... \nAI: I noticed your SSL expires in 48 hours..." },
      { id: '9925', name: 'Government Entity', match: 92, risk: 'DMARC Failure', transcript: "User: Security is priority... \nAI: Your public DNS records are missing SPF..." },
      { id: '9926', name: 'Fintech Startup', match: 74, risk: 'Zero-Knowledge Vault Issue', transcript: "User: How do you handle PII? \nAI: We redact everything locally..." }
  ];

  return (
    <main className="min-h-screen bg-transparent p-6 overflow-hidden flex flex-col relative selection:bg-red-500 selection:text-white transition-all duration-1000">
       
       <OmniCommandBar />

       {/* GLOBAL DRILL-DOWN MODAL */}
       <AnimatePresence>
          {selectedDetail && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-3xl overflow-y-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="w-full max-w-5xl glass-panel iron-glow rounded-[3rem] p-12 relative overflow-hidden"
                  >
                        <button onClick={() => setSelectedDetail(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-red-500/20 transition">×</button>
                        
                        <div className="flex gap-4 items-center mb-8">
                            <span className="bg-red-500 text-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">{selectedDetail.type}</span>
                            <h2 className="text-4xl font-black tracking-tighter uppercase">{selectedDetail.title}</h2>
                        </div>

                        {selectedDetail.type === 'LEAD' && (
                            <div className="grid md:grid-cols-2 gap-12 font-mono">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.3em]">AI Ghost-Protocol Transcript</h3>
                                    <div className="bg-black/50 border border-white/10 p-6 rounded-2xl h-[300px] overflow-y-auto text-xs leading-relaxed text-cyberBlue">
                                        {selectedDetail.data.transcript}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.3em]">Shadow Audit Findings</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-red-500 font-bold mb-1">DANGER: {selectedDetail.data.risk}</p>
                                            <p className="text-[10px] text-gray-400">Status: Exposure detected. Sales hook prioritized.</p>
                                        </div>
                                        <div className="p-4 bg-matrixGreen/10 border border-matrixGreen/20 rounded-xl opacity-50">
                                            <p className="text-matrixGreen font-bold mb-1">PASS: Local PII Redaction</p>
                                            <p className="text-[10px] text-gray-400">All data Scrubbed via Ghost-Protocol Vault.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedDetail.type === 'REVENUE' && (
                            <div className="space-y-8 font-mono">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="p-6 glass-panel rounded-2xl">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Current MRR</p>
                                        <p className="text-3xl font-black text-white">$142,800</p>
                                    </div>
                                    <div className="p-6 glass-panel rounded-2xl">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Churn Risk</p>
                                        <p className="text-3xl font-black text-matrixGreen">0.4%</p>
                                    </div>
                                    <div className="p-6 glass-panel rounded-2xl">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Expansion</p>
                                        <p className="text-3xl font-black text-red-500">+12%</p>
                                    </div>
                                </div>
                                <div className="bg-black/40 border border-white/5 h-48 rounded-2xl flex items-center justify-center italic text-xs text-gray-600">
                                    (Growth Chart Rendering via Speculative GPU Node...)
                                </div>
                            </div>
                        )}

                        {selectedDetail.type === 'TASK' && (
                            <div className="space-y-6">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <p className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest leading-relaxed">Operation Stream:</p>
                                    <div className="space-y-3 font-mono text-[10px] text-cyberBlue">
                                        <p>[09:21:04] Initializing Ollama:Llama-3-70b-v2</p>
                                        <p>[09:21:08] Context Injection: Tenant_{currentEntity?.name}</p>
                                        <p>[09:21:12] Performing Speculative Inference Path B</p>
                                        <p className="animate-pulse">[09:22:01] {selectedDetail.data.details}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                  </motion.div>
              </div>
          )}
       </AnimatePresence>

       {/* Navigation */}
       <nav className="flex justify-between items-center w-full max-w-7xl mx-auto mb-10 relative z-20">
           <div className="flex items-center gap-8">
                <div onClick={() => window.location.href='/admin'} className="group cursor-pointer flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl glass-panel iron-glow flex items-center justify-center border-t-red-500/50">
                        <span className="text-white font-black text-xs">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-gray-500">BACK_TO_HQ</span>
                        <span className="text-xs font-bold uppercase hover:text-white transition">Admin Portal</span>
                    </div>
                </div>
           </div>
           <div className="flex items-center gap-6">
                <div 
                   onClick={() => setSelectedDetail({ type: 'REVENUE', id: 'global', title: 'Revenue Analytics', data: {} })}
                   className="hidden md:flex flex-col items-end mr-4 cursor-pointer hover:opacity-80 transition"
                >
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Sovereign Node Link</span>
                    <span className="text-sm font-bold text-white tracking-tight">{currentEntity?.name}</span>
                </div>
                <button id="btn-export" className="px-6 py-2.5 glass-panel iron-glow rounded-xl hover:bg-white/5 text-[10px] font-black tracking-[0.2em] uppercase transition">
                    Export Data
                </button>
           </div>
       </nav>

       <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          
          <div className="md:col-span-8">
              <motion.div className="glass-panel iron-glow rounded-[3rem] p-12 relative overflow-hidden group border-white/5 h-full">
                 <header className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-none mb-4">
                            Sovereign HUD <span className="text-red-500">v5.0</span>
                        </h2>
                    </div>
                    <div 
                      onClick={() => setSelectedDetail({ type: 'COMPLIANCE', id: 'overview', title: 'Compliance Matrix', data: {} })}
                      className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-500 transition"
                    >
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.1em] group-hover:text-black">Zero-Exposure Audit Active</span>
                    </div>
                 </header>

                 <div className="grid grid-cols-1 gap-4">
                    {leads.map((lead, i) => (
                       <motion.div 
                          key={lead.id} 
                          whileHover={{ x: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          onClick={() => setSelectedDetail({ type: 'LEAD', id: lead.id, title: `Audit: ${lead.name}`, data: lead })}
                          className="flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/[0.01] transition-all cursor-pointer group/item"
                       >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center font-mono text-white text-xl">#0{i+1}</div>
                            <div>
                              <p className="font-black text-gray-200 uppercase tracking-tight text-lg">{lead.name}</p>
                              <p className="text-[10px] font-mono text-red-500 uppercase">{lead.risk}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-3xl font-black text-white group-hover/item:text-red-500 transition tracking-tighter">{lead.match}%</div>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
          </div>

          <div className="md:col-span-4 space-y-8 h-full">
             
             {/* Drill-down Revenue */}
             <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDetail({ type: 'REVENUE', id: 'global', title: 'Revenue Breakdown', data: {} })}
                className="glass-panel iron-glow rounded-[2.5rem] p-10 cursor-pointer border-t-red-500/50"
             >
                <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">Pipeline Velocity</h3>
                <p className="text-6xl font-black tracking-tighter text-white mb-2">$1.42M</p>
                <p className="text-[10px] font-mono text-matrixGreen uppercase">Click to Drill-Down MRR &rarr;</p>
             </motion.div>

             {/* Background Tasks Hub */}
             <div className="glass-panel iron-glow rounded-[2.5rem] p-8">
                <h3 className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.4em]">Background_Threads</h3>
                <div className="space-y-8">
                   {tasks.map(task => (
                       <div 
                         key={task.id} 
                         className="space-y-2 cursor-pointer group"
                         onClick={() => setSelectedDetail({ type: 'TASK', id: task.id, title: task.name, data: task })}
                       >
                          <div className="flex justify-between items-center text-[9px] font-mono">
                             <span className="font-bold text-gray-400 group-hover:text-white transition">{task.name}</span>
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

    </main>
  );
}

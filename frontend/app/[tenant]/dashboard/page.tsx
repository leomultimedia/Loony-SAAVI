"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

// Deep Drill-Down Detail Types
interface DrillDetail {
    type: 'LEAD' | 'REVENUE' | 'TASK' | 'COMPLIANCE' | 'MODEL_GARDEN' | 'SECURITY';
    id: string;
    title: string;
    data: any;
}

export default function CommandDashboard() {
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<DrillDetail | null>(null);
  const [activeModel, setActiveModel] = useState<'LOCAL' | 'CLOUD'>('LOCAL');
  const [pdplShield, setPdplShield] = useState(true);

  const [tasks, setTasks] = useState([
      { id: 'task_01', name: 'Stark Analysis: Lead #992', progress: 85, status: 'Running', details: 'Analyzing PII scrubbing hooks...' },
      { id: 'task_02', name: 'Shadow Audit: ADHICS V2.0', progress: 100, status: 'Complete', details: 'Generated PDF Compliance Scorecard' },
      { id: 'task_03', name: 'CRM Pipeline Handshake', progress: 100, status: 'Complete', details: 'WhatsApp API Credentials Validated' },
  ]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setCurrentEntity(stored[0] || { name: 'Lear Cyber tech', email: 'admin@lct.com', tier: 'PRO', status: 'Active' });
  }, []);

  const leads = [
      { id: '9924', name: 'Fortune 500 Prospect', match: 88, risk: 'ISO 27001 Gap', status: 'Engaged', transcript: "User: Data residancy? \nAI: Vanguard ensures UAE PDPL local persistence..." },
      { id: '9925', name: 'Government Center', match: 92, risk: 'ADHICS Warning', status: 'Negotiating', transcript: "User: Audit log needed. \nAI: Every message is anchored with a Confidence Score..." },
  ];

  const toggleModel = () => setActiveModel(prev => prev === 'LOCAL' ? 'CLOUD' : 'LOCAL');

  return (
    <main className="min-h-screen bg-transparent p-6 overflow-hidden flex flex-col relative selection:bg-red-500 selection:text-white transition-all duration-1000">
       
       <OmniCommandBar />

       {/* GLOBAL HUD DRILL-DOWN MODAL */}
       <AnimatePresence>
          {selectedDetail && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-5xl glass-panel iron-glow rounded-[3rem] p-12 relative border-red-500/20"
                  >
                        <button onClick={() => setSelectedDetail(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-red-500 hover:text-black transition">×</button>
                        
                        <div className="flex gap-4 items-center mb-10">
                            <span className="bg-red-500 text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">{selectedDetail.type}</span>
                            <h2 className="text-4xl font-black tracking-tighter uppercase">{selectedDetail.title}</h2>
                        </div>

                        {selectedDetail.type === 'MODEL_GARDEN' && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className={`p-8 rounded-[2rem] border transition-all ${activeModel === 'LOCAL' ? 'bg-red-500/10 border-red-500' : 'bg-white/5 border-white/10 opacity-50'}`}>
                                        <h3 className="text-2xl font-black mb-2 uppercase">Llama-3 (Local Hub)</h3>
                                        <p className="text-xs text-gray-400 mb-6 font-mono">Running on Private GPU Node. 90% Cost Efficiency.</p>
                                        <div className="text-[10px] font-mono space-y-1">
                                            <p className="text-matrixGreen">Status: Low Latency Optimized</p>
                                            <p>Engine: Flash Attention 2</p>
                                        </div>
                                    </div>
                                    <div className={`p-8 rounded-[2rem] border transition-all ${activeModel === 'CLOUD' ? 'bg-cyberBlue/10 border-cyberBlue' : 'bg-white/5 border-white/10 opacity-50'}`}>
                                        <h3 className="text-2xl font-black mb-2 uppercase">GPT-4o (Cloud Link)</h3>
                                        <p className="text-xs text-gray-400 mb-6 font-mono">Global Scale. Max Complexity Depth.</p>
                                        <div className="text-[10px] font-mono space-y-1">
                                            <p className="text-cyberBlue">Status: High Capacity Active</p>
                                            <p>LPU: Groq Orchestration Enabled</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={toggleModel} className="w-full py-6 glass-panel rounded-2xl font-black text-xs tracking-[0.5em] uppercase hover:bg-red-500 hover:text-black transition">
                                    SWITCH_HUD_CORE
                                </button>
                            </div>
                        )}

                        {selectedDetail.type === 'SECURITY' && (
                            <div className="space-y-8 font-mono">
                                <div className="p-10 border border-red-500/30 rounded-[2.5rem] bg-red-500/5 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-6xl rotate-12">SHIELD</div>
                                     <h3 className="text-2xl font-black mb-4">GDPR / UAE PDPL SHIELD</h3>
                                     <p className="text-sm text-gray-400 mb-8 max-w-xl leading-relaxed">
                                         When active, the system automatically runs all PII through a local anonymization middleware. No unmasked phone numbers or addresses hit the AI brain.
                                     </p>
                                     <div className="flex items-center gap-6">
                                         <button 
                                            onClick={() => setPdplShield(!pdplShield)}
                                            className={`px-10 py-4 rounded-xl font-black text-xs tracking-widest uppercase transition ${pdplShield ? 'bg-red-500 text-black' : 'bg-white/10 text-white'}`}
                                         >
                                             {pdplShield ? 'SHIELD_DEPLOYED' : 'ENGAGE_PROTOCOL'}
                                         </button>
                                         <span className="text-[10px] text-gray-500 italic">Level: Zero-Knowledge Vaulting Active</span>
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* Fallback for other drill-downs */}
                        {!['MODEL_GARDEN', 'SECURITY'].includes(selectedDetail.type) && (
                            <div className="text-gray-400 italic text-center py-20 font-mono">
                                Loading dynamic trace for system entity {selectedDetail.id}...
                            </div>
                        )}
                  </motion.div>
              </div>
          )}
       </AnimatePresence>

       {/* COMMAND NAV BAR */}
       <nav className="flex justify-between items-center w-full max-w-7xl mx-auto mb-10 relative z-20">
           <div className="flex items-center gap-10">
                <div onClick={() => window.location.href='/admin'} className="group cursor-pointer flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel iron-glow flex items-center justify-center border-red-500/40 relative">
                        <div className="absolute inset-0 bg-red-500/10 blur-xl opacity-0 group-hover:opacity-100 transition"></div>
                        <span className="text-white font-black text-xl z-20">V</span>
                    </div>
                </div>

                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em]">Active Leads</span>
                        <span className="text-2xl font-black text-white">422</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em]">Meetings</span>
                        <span className="text-2xl font-black text-matrixGreen">24</span>
                    </div>
                </div>
           </div>

           <div className="flex items-center gap-6">
                <div onClick={toggleModel} className="px-6 py-2.5 glass-panel iron-glow rounded-xl hover:bg-white/5 cursor-pointer transition flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${activeModel === 'LOCAL' ? 'bg-red-500 animate-pulse' : 'bg-cyberBlue'}`}></span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{activeModel === 'LOCAL' ? 'Llama_Local' : 'Groq_Cloud'}</span>
                </div>
                <button 
                  onClick={() => setSelectedDetail({ type: 'SECURITY', id: 'pdpl', title: 'Security Shield', data: {} })}
                  className={`px-6 py-2.5 glass-panel iron-glow rounded-xl transition flex items-center gap-3 ${pdplShield ? 'border-red-500/50' : 'opacity-40'}`}
                >
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">PDPL_SHIELD</span>
                </button>
           </div>
       </nav>

       <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
          
          {/* Main Sales HUD */}
          <div className="md:col-span-8">
              <motion.div className="glass-panel iron-glow rounded-[3.5rem] p-12 relative overflow-hidden group h-full border-white/5">
                 
                 <header className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                            Vanguard <span className="text-red-500">Node</span>
                        </h2>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">Sovereign Context: {currentEntity?.name}</p>
                    </div>
                    <div 
                      onClick={() => setSelectedDetail({ type: 'MODEL_GARDEN', id: 'garden', title: 'AI Model Garden', data: {} })}
                      className="glass-panel px-6 py-3 rounded-2xl cursor-pointer hover:bg-red-500/10 transition group/btn"
                    >
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest group-hover/btn:text-white transition">Enter_Model_Garden</span>
                    </div>
                 </header>

                 <div className="grid grid-cols-1 gap-6">
                    {leads.map((lead, i) => (
                       <motion.div 
                          key={lead.id} 
                          whileHover={{ x: 20, backgroundColor: 'rgba(255,255,255,0.04)' }}
                          className="flex items-center justify-between p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] transition-all cursor-pointer group/item hover:border-red-500/40"
                       >
                          <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-3xl glass-panel flex items-center justify-center font-black text-white text-2xl group-hover/item:border-red-500 transition">0{i+1}</div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight text-xl mb-1">{lead.name}</p>
                              <div className="flex gap-4">
                                <span className={`text-[10px] font-bold uppercase ${lead.status === 'Engaged' ? 'text-matrixGreen' : 'text-cyberBlue'}`}>{lead.status}</span>
                                <span className="text-[10px] font-mono text-gray-600 uppercase">|</span>
                                <span className="text-[10px] font-black text-red-500 uppercase">{lead.risk}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-4xl font-black text-white group-hover/item:text-red-500 transition tracking-tighter">{lead.match}%</div>
                             <p className="text-[9px] font-mono text-gray-600 uppercase">Lead_Score</p>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
          </div>

          {/* Right Statistics Hub */}
          <div className="md:col-span-4 space-y-10">
             
             {/* Model Health Monitor */}
             <div className="glass-panel iron-glow rounded-[3rem] p-10 border-t-matrixGreen/50">
                <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-matrixGreen rounded-full"></span> Model Health Monitor
                </h3>
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                            <span>Local GPU Load</span>
                            <span className="text-matrixGreen">34%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-matrixGreen shadow-[0_0_10px_#00ff41] w-[34%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                            <span>Token Velocity (T/s)</span>
                            <span className="text-cyberBlue">120.4</span>
                        </div>
                        <p className="text-[9px] text-gray-600 font-mono italic">Speculative Execution: Active</p>
                    </div>
                </div>
             </div>

             {/* Background Operation Hub */}
             <div className="glass-panel iron-glow rounded-[3rem] p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-4xl rotate-12 font-black">THREADS</div>
                <h3 className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.4em]">Background_Threads</h3>
                <div className="space-y-8">
                   {tasks.map(task => (
                       <div key={task.id} className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                             <span className="text-gray-400">{task.name}</span>
                             <span className="text-red-500">{task.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                className="h-full bg-red-500 shadow-[0_0_15px_red]"
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

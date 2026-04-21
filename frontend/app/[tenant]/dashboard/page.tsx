"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

// Drill Detail Types
interface DrillDetail {
    type: 'LEAD' | 'REVENUE' | 'TASK' | 'COMPLIANCE' | 'MODEL_GARDEN' | 'SECURITY' | 'SIMULATOR' | 'AUDIT_LOG';
    id: string;
    title: string;
    data: any;
}

export default function CommandDashboard() {
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<DrillDetail | null>(null);
  const [activeModel, setActiveModel] = useState<'LOCAL' | 'CLOUD'>('LOCAL');
  const [pdplShield, setPdplShield] = useState(true);

  // Chat Simulator State
  const [simMessage, setSimMessage] = useState('');
  const [simChat, setSimChat] = useState<{role: string, text: string}[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setCurrentEntity(stored[0] || { name: 'Lear Cyber tech', email: 'admin@lct.com', tier: 'PRO', status: 'Active' });
  }, []);

  const auditLogs = [
      { id: 'msg_01', time: '14:21:04', content: 'suggested ISO 27001 Roadmap', confidence: 0.98 },
      { id: 'msg_02', time: '14:22:15', content: 'redacted PII (Phone Number)', confidence: 1.00 },
      { id: 'msg_03', time: '14:25:30', content: 'Closed meeting via Cal.com', confidence: 0.94 },
  ];

  const handleSimSubmit = (e: any) => {
    e.preventDefault();
    if (!simMessage) return;
    const userMsg = { role: 'USER', text: simMessage };
    setSimChat(prev => [...prev, userMsg]);
    setSimMessage('');
    
    // Simulate AI response
    setTimeout(() => {
        setSimChat(prev => [...prev, { role: 'VANGUARD_AI', text: "Analysis: User sentiment is 'Inquisitive'. Triggering 'Expert-Authority' persona. Suggested ADHICS compliance path established." }]);
    }, 1000);
  };

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

                        {selectedDetail.type === 'SIMULATOR' && (
                            <div className="space-y-6">
                                <div className="bg-black/50 border border-white/10 rounded-2xl p-6 h-[400px] overflow-y-auto font-mono text-xs space-y-4">
                                    <p className="text-gray-500 italic uppercase tracking-[0.2em] mb-4">Initializing AI Persona Testbed...</p>
                                    {simChat.length === 0 && <p className="text-gray-600">Enter a lead query to test 'Self-Healing' logic.</p>}
                                    {simChat.map((msg, i) => (
                                        <div key={i} className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                                            <span className={`text-[10px] font-bold ${msg.role === 'USER' ? 'text-cyberBlue' : 'text-red-500'} mb-1`}>{msg.role}</span>
                                            <div className={`p-4 rounded-xl max-w-lg ${msg.role === 'USER' ? 'bg-cyberBlue/10 border border-cyberBlue/30 text-white' : 'bg-red-500/10 border border-red-500/30 text-red-500'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSimSubmit} className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={simMessage}
                                        onChange={e => setSimMessage(e.target.value)}
                                        placeholder="Type like a lead (e.g., 'Is your data storage in the UAE?')"
                                        className="flex-1 bg-black border border-white/10 rounded-xl p-4 focus:border-red-500 outline-none text-sm transition"
                                    />
                                    <button type="submit" className="px-8 bg-red-500 text-black font-black uppercase text-xs rounded-xl hover:bg-red-600 transition">Test_Persona</button>
                                </form>
                            </div>
                        )}

                        {selectedDetail.type === 'AUDIT_LOG' && (
                            <div className="space-y-6">
                                <div className="w-full overflow-hidden glass-panel rounded-3xl">
                                    <table className="w-full text-left font-mono">
                                        <thead className="bg-white/5 border-b border-white/10 text-gray-500 text-[10px] uppercase">
                                            <tr>
                                                <th className="p-6">Timestamp</th>
                                                <th className="p-6">Action_Core</th>
                                                <th className="p-6">Confidence</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditLogs.map(log => (
                                                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                                    <td className="p-6 text-gray-400">{log.time}</td>
                                                    <td className="p-6 font-bold text-cyberBlue">{log.content}</td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                <div className="h-full bg-matrixGreen" style={{width: `${log.confidence * 100}%`}}></div>
                                                            </div>
                                                            <span className="text-matrixGreen">{(log.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Existing Modals (Garden/Security) would go here too */}
                        {selectedDetail.type === 'MODEL_GARDEN' && (
                            <div className="text-center py-20 text-gray-500">Garden Implementation Active. (Logic retained from previous state)</div>
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
                        <span className="text-white font-black text-xl">V</span>
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
                <button 
                  onClick={() => setSelectedDetail({ type: 'SIMULATOR', id: 'sim', title: 'AI Persona Chat Simulator', data: {} })}
                  className="px-6 py-2.5 glass-panel iron-glow rounded-xl hover:bg-red-500/10 transition text-[10px] font-black tracking-[0.2em] uppercase"
                >
                    Test_Persona
                </button>
                <button 
                   onClick={() => setSelectedDetail({ type: 'AUDIT_LOG', id: 'logs', title: 'Sovereign Audit Log', data: {} })}
                   className="px-6 py-2.5 glass-panel iron-glow rounded-xl hover:bg-white/5 transition text-[10px] font-black tracking-[0.2em] uppercase"
                >
                    Audit_Logs
                </button>
           </div>
       </nav>

       <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
          
          {/* Main Sales HUD with CENTRAL HEATMAP */}
          <div className="md:col-span-8">
              <motion.div className="glass-panel iron-glow rounded-[3.5rem] p-12 relative overflow-hidden group h-full border-white/5 flex flex-col">
                 
                 <header className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Vanguard <span className="text-red-500">HUD</span></h2>
                        <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.4em]">Local_Mesh: {currentEntity?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2 glass-panel rounded-full text-[10px] font-black text-matrixGreen border-matrixGreen/30">REVENUE_TARGET: $2.4M</div>
                    </div>
                 </header>

                 {/* INTERACTIVE SALES HEATMAP (Central) */}
                 <div className="flex-1 min-h-[300px] mb-12 glass-panel rounded-[2.5rem] relative overflow-hidden border-t-red-500/50 flex items-center justify-center group/map">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] animate-pulse"></div>
                     <div className="absolute inset-0 p-8 flex items-center justify-center">
                        {/* Mock World Map with glowing nodes */}
                        <div className="w-full h-full relative opacity-40">
                             <div className="absolute top-[40%] left-[60%] w-4 h-4 bg-red-500 rounded-full blur-md animate-ping"></div>
                             <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-cyberBlue rounded-full blur-sm"></div>
                             <div className="absolute top-[70%] left-[80%] w-2 h-2 bg-matrixGreen rounded-full blur-sm"></div>
                        </div>
                     </div>
                     <div className="z-10 text-center space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Interactive Global Sales Heatmap</p>
                         <h3 className="text-white font-black text-lg uppercase tracking-tighter">Live Traffic Matrix Engaged</h3>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 border border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                        <p className="text-[9px] font-mono text-gray-600 uppercase mb-4 tracking-widest">Active Revenue Pipeline</p>
                        <p className="text-5xl font-black text-white tracking-tighter">$1.42M</p>
                    </div>
                    <div className="p-8 border border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                         <p className="text-[9px] font-mono text-gray-600 uppercase mb-4 tracking-widest">Autonomous ROI</p>
                         <p className="text-5xl font-black text-matrixGreen tracking-tighter">+248%</p>
                    </div>
                 </div>
              </motion.div>
          </div>

          {/* Right Statistics / Model Health */}
          <div className="md:col-span-4 space-y-10">
             
             {/* Model Health Monitor */}
             <div className="glass-panel iron-glow rounded-[3rem] p-10 border-t-matrixGreen/50">
                <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-8">Model Hub Health</h3>
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
                            <span>Token Velocity</span>
                            <span className="text-cyberBlue">120.4 T/s</span>
                        </div>
                        <p className="text-[9px] text-gray-600 font-mono italic">Speculative Execution: [ENABLED]</p>
                    </div>
                </div>
             </div>

             {/* Background Operations */}
             <div className="glass-panel iron-glow rounded-[3rem] p-10">
                <h3 className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.4em]">Background_Threads</h3>
                <div className="space-y-8">
                   {[1,2,3].map(i => (
                       <div key={i} className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase">
                             <span className="text-gray-400">Thread_IDX_{i*100}</span>
                             <span className="text-red-500">8{i}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${80 + i}%` }}
                                className="h-full bg-red-500"
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

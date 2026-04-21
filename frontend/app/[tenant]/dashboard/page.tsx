"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

export default function CommandDashboard() {
  const { tenant } = useParams();
  const router = useRouter();
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [activeModel, setActiveModel] = useState<'LOCAL' | 'CLOUD'>('LOCAL');
  const [pdplShield, setPdplShield] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    setCurrentEntity(stored[0] || { name: 'Lear Cyber tech', email: 'admin@lct.com', tier: 'PRO', status: 'Active' });
  }, []);

  const nav = (path: string) => router.push(`/${tenant}/${path}`);

  const tiles = [
    { title: 'Lead Vault', desc: '422 Active · Import Excel / CRM / GSheet', stat: '422', unit: 'LEADS', color: 'from-red-500/10 to-transparent', border: 'border-red-500/20', action: () => nav('leads'), icon: '🎯' },
    { title: 'WhatsApp Engine', desc: 'Auto-Pilot conversations running', stat: '38', unit: 'ACTIVE_CHATS', color: 'from-matrixGreen/10 to-transparent', border: 'border-matrixGreen/20', action: () => nav('whatsapp'), icon: '💬' },
    { title: 'Meetings', desc: 'AI-arranged via Cal.com', stat: '24', unit: 'BOOKED', color: 'from-cyberBlue/10 to-transparent', border: 'border-cyberBlue/20', action: () => nav('meetings'), icon: '📅' },
    { title: 'Revenue Pipeline', desc: 'Annualized Run Rate', stat: '$1.42M', unit: 'ARR', color: 'from-purple-500/10 to-transparent', border: 'border-purple-500/20', action: () => {}, icon: '💰' },
  ];

  const tasks = [
    { name: 'Shadow Audit: ADNOC Digital', progress: 88, status: 'Running' },
    { name: 'WhatsApp Campaign: Batch #7', progress: 100, status: 'Complete' },
    { name: 'HITL Alert: Lead #9924 Pricing', progress: 50, status: 'Waiting_Human' },
  ];

  return (
    <main className="min-h-screen bg-transparent p-6 flex flex-col relative font-sans text-white">
      <OmniCommandBar />

      {/* Nav */}
      <nav className="flex justify-between items-center w-full max-w-7xl mx-auto mb-10 relative z-20">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Vanguard <span className="text-red-500">OS</span></h1>
          <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.4em] mt-1">Sovereign Node · {currentEntity?.name}</p>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setActiveModel(m => m === 'LOCAL' ? 'CLOUD' : 'LOCAL')}
            className={`px-5 py-2.5 glass-panel iron-glow rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition ${activeModel === 'LOCAL' ? 'border-red-500/50' : 'border-cyberBlue/50'}`}>
            <span className={`w-2 h-2 rounded-full ${activeModel === 'LOCAL' ? 'bg-red-500 animate-pulse' : 'bg-cyberBlue'}`}></span>
            {activeModel === 'LOCAL' ? 'Llama_Local' : 'Groq_Cloud'}
          </button>
          <button onClick={() => setPdplShield(s => !s)}
            className={`px-5 py-2.5 glass-panel rounded-xl text-[10px] font-black tracking-widest uppercase transition ${pdplShield ? 'text-matrixGreen border-matrixGreen/30' : 'text-gray-500 opacity-50'}`}>
            {pdplShield ? '🛡️ PDPL_ON' : '⚠️ PDPL_OFF'}
          </button>
          <button onClick={() => router.push('/admin')} className="px-5 py-2.5 glass-panel rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition">
            Admin HQ →
          </button>
        </div>
      </nav>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8 flex-1 relative z-10">

        {/* 4 Feature Tiles */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {tiles.map((tile, i) => (
            <motion.button
              key={tile.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={tile.action}
              className={`text-left p-8 glass-panel rounded-[2.5rem] border ${tile.border} bg-gradient-to-br ${tile.color} hover:scale-105 transition group relative overflow-hidden`}
            >
              <div className="absolute top-4 right-6 text-4xl opacity-30 group-hover:opacity-60 transition">{tile.icon}</div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">{tile.title}</p>
              <p className="text-4xl font-black tracking-tighter mb-1">{tile.stat}</p>
              <p className="text-[9px] font-mono text-gray-600 uppercase">{tile.unit}</p>
              <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">{tile.desc}</p>
              <div className="mt-6 text-[10px] font-black text-gray-500 group-hover:text-white transition uppercase tracking-widest">
                Open →
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quick-Launch WhatsApp Campaign */}
        <div className="col-span-8">
          <div className="glass-panel iron-glow rounded-[3rem] p-10 h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Self-Healing Sales Engine</h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1">AI-driven WhatsApp → Voice → Meeting → Win</p>
              </div>
              <button onClick={() => nav('leads')} className="px-6 py-3 bg-red-500 text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-red-400 transition">
                + Launch Campaign
              </button>
            </div>
            
            {/* Pipeline visual */}
            <div className="flex items-center gap-0 mb-10 overflow-x-auto">
              {['Lead Import', 'Auto WhatsApp', 'Shadow Audit', 'Persuasion AI', 'HITL If Needed', 'Meeting Set', 'Contract Won'].map((s, i, arr) => (
                <div key={s} className="flex items-center flex-shrink-0">
                  <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase whitespace-nowrap ${i < 4 ? 'bg-matrixGreen/10 text-matrixGreen border border-matrixGreen/20' : i === 4 ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                    {s}
                  </div>
                  {i < arr.length - 1 && <div className="w-6 h-0.5 bg-white/10 flex-shrink-0"></div>}
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="space-y-3">
              {[
                { lead: 'Ahmed Al Mansoori', event: 'Meeting confirmed for 2026-04-23 10:00 AM', color: 'text-matrixGreen', time: '2 min' },
                { lead: 'Priya Sharma', event: 'HITL triggered — Awaiting SPOC response on pricing', color: 'text-yellow-400', time: '8 min' },
                { lead: 'Khalid Bin Rashid', event: 'Shadow Audit: 3 ISO gaps found, Persuasion Protocol engaged', color: 'text-cyberBlue', time: '22 min' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 glass-panel rounded-2xl hover:bg-white/5 transition cursor-pointer" onClick={() => nav('whatsapp')}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.color.replace('text-', 'bg-')}`}></div>
                  <span className="font-bold text-sm flex-shrink-0">{a.lead}</span>
                  <span className="text-xs text-gray-500 flex-1">{a.event}</span>
                  <span className="text-[9px] text-gray-600 font-mono flex-shrink-0">{a.time} ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Background Threads + Model Health */}
        <div className="col-span-4 space-y-6">
          <div className="glass-panel iron-glow rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-[0.4em]">Background Threads</h3>
            <div className="space-y-6">
              {tasks.map(t => (
                <div key={t.name} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-gray-400 truncate flex-1 mr-2">{t.name}</span>
                    <span className={t.status === 'Waiting_Human' ? 'text-yellow-400 animate-pulse' : t.status === 'Complete' ? 'text-matrixGreen' : 'text-red-400'}>
                      {t.status === 'Waiting_Human' ? 'HITL ⚠' : t.progress + '%'}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.progress}%` }}
                      className={`h-full ${t.status === 'Waiting_Human' ? 'bg-yellow-400' : t.status === 'Complete' ? 'bg-matrixGreen' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel iron-glow rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.4em]">Model Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black mb-1 uppercase">
                  <span>GPU Load</span><span className="text-matrixGreen">34%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-matrixGreen w-[34%] shadow-[0_0_10px_#00ff41]"></div>
                </div>
              </div>
              <p className="text-[9px] text-gray-600 font-mono">Ollama · Llama-3-70B · Speculative: ON</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

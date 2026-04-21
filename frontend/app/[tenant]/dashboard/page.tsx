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
  const [agents, setAgents] = useState<any[]>([]);

  const AGENT_META: Record<string, { color: string; emoji: string }> = {
    Leo: { color: '#ef4444', emoji: '🦁' }, Eva: { color: '#8b5cf6', emoji: '🌸' },
    Lia: { color: '#06b6d4', emoji: '🔬' }, James: { color: '#f59e0b', emoji: '🎯' },
    Mary: { color: '#10b981', emoji: '🌿' },
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    const entity = stored[0] || { id: 'demo-tenant', name: 'Lear Cyber tech', email: 'admin@lct.com' };
    setCurrentEntity(entity);

    fetch(`/api/agents?tenantId=${entity.id}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAgents(data); })
      .catch(() => {});
  }, []);

  const nav = (path: string) => router.push(`/${tenant}/${path}`);

  const tiles = [
    { title: 'Lead Vault', desc: 'Import · Assign · Launch Campaigns', stat: '422', unit: 'LEADS', border: 'border-red-500/20', action: () => nav('leads'), icon: '🎯', bg: 'from-red-500/10' },
    { title: 'WhatsApp Engine', desc: 'AI Auto-Pilot · HITL Takeover', stat: '38', unit: 'ACTIVE_CHATS', border: 'border-matrixGreen/20', action: () => nav('whatsapp'), icon: '💬', bg: 'from-matrixGreen/10' },
    { title: 'Meetings', desc: 'AI-Arranged · Cal.com Sync', stat: '24', unit: 'BOOKED', border: 'border-cyberBlue/20', action: () => nav('meetings'), icon: '📅', bg: 'from-cyberBlue/10' },
    { title: 'Settings', desc: 'Plugins · Agents · Team · Security', stat: '8', unit: 'INTEGRATIONS', border: 'border-purple-500/20', action: () => nav('settings'), icon: '⚙️', bg: 'from-purple-500/10' },
  ];

  const recentActivity = [
    { lead: 'Ahmed Al Mansoori', agent: 'Leo', event: 'Meeting confirmed: 23 Apr 10:00 AM', color: 'text-matrixGreen', time: '2 min' },
    { lead: 'Priya Sharma', agent: 'Mary', event: 'HITL triggered — pricing threshold reached', color: 'text-yellow-400', time: '8 min' },
    { lead: 'Khalid Bin Rashid', agent: 'Lia', event: '3 ISO 27001 gaps exposed in Shadow Audit', color: 'text-cyberBlue', time: '22 min' },
    { lead: 'Sarah Mitchell', agent: 'Eva', event: 'First contact made — Reassurance mode active', color: 'text-purple-400', time: '1 hr' },
  ];

  const tasks = [
    { name: 'Shadow Audit: ADNOC Digital', progress: 88, state: 'Running' },
    { name: 'WhatsApp Batch Campaign #7', progress: 100, state: 'Complete' },
    { name: 'HITL: Lead #9924 Pricing', progress: 50, state: 'HITL' },
  ];

  const activeAgents = agents.filter(a => a.isActive);

  return (
    <main className="min-h-screen bg-transparent p-6 flex flex-col relative font-sans text-white">
      <OmniCommandBar />

      {/* Nav */}
      <nav className="flex justify-between items-center w-full max-w-7xl mx-auto mb-10 relative z-20">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Vanguard <span className="text-red-500">OS</span></h1>
          <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.4em] mt-1">{currentEntity?.name} · Sovereign Node</p>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => setActiveModel(m => m === 'LOCAL' ? 'CLOUD' : 'LOCAL')}
            className="px-5 py-2.5 glass-panel iron-glow rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition">
            <span className={`w-2 h-2 rounded-full ${activeModel === 'LOCAL' ? 'bg-red-500 animate-pulse' : 'bg-cyberBlue'}`}></span>
            {activeModel === 'LOCAL' ? 'Llama_Local' : 'Groq_Cloud'}
          </button>
          <button onClick={() => setPdplShield(s => !s)}
            className={`px-5 py-2.5 glass-panel rounded-xl text-[10px] font-black tracking-widest uppercase transition ${pdplShield ? 'text-matrixGreen border-matrixGreen/30' : 'text-gray-500'}`}>
            {pdplShield ? '🛡️ PDPL ON' : '⚠️ PDPL OFF'}
          </button>
          <button onClick={() => nav('settings')} className="px-5 py-2.5 glass-panel rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition">⚙️ Settings</button>
          <button onClick={() => router.push('/admin')} className="px-5 py-2.5 glass-panel rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition">Admin HQ →</button>
        </div>
      </nav>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8 flex-1 relative z-10">

        {/* 4 Tiles */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {tiles.map((tile, i) => (
            <motion.button key={tile.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={tile.action}
              className={`text-left p-8 glass-panel rounded-[2.5rem] border ${tile.border} bg-gradient-to-br ${tile.bg} to-transparent hover:scale-105 transition group relative overflow-hidden`}>
              <div className="absolute top-4 right-6 text-4xl opacity-20 group-hover:opacity-50 transition">{tile.icon}</div>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">{tile.title}</p>
              <p className="text-4xl font-black tracking-tighter mb-1">{tile.stat}</p>
              <p className="text-[9px] font-mono text-gray-600 uppercase">{tile.unit}</p>
              <p className="text-[10px] text-gray-400 mt-4">{tile.desc}</p>
              <div className="mt-6 text-[10px] font-black text-gray-500 group-hover:text-white transition uppercase">Open →</div>
            </motion.button>
          ))}
        </div>

        {/* Active Agents Strip */}
        <div className="col-span-12">
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-6">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex-shrink-0">Active Agents</span>
            <div className="flex gap-4 flex-1">
              {activeAgents.length === 0 && (
                <button onClick={() => nav('settings')} className="text-[10px] text-gray-600 hover:text-white transition font-mono italic">No agents active — enable in Settings →</button>
              )}
              {activeAgents.map(agent => {
                const meta = AGENT_META[agent.agentName];
                return (
                  <div key={agent.id} className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl border border-white/10">
                    <span>{meta?.emoji}</span>
                    <div>
                      <p className="text-xs font-black">{agent.agentName}</p>
                      <p className="text-[9px] text-gray-500 font-mono">{agent.model}</p>
                    </div>
                    <div className="w-1.5 h-1.5 bg-matrixGreen rounded-full animate-pulse ml-2"></div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => nav('settings')} className="text-[9px] font-mono text-gray-500 hover:text-white transition uppercase tracking-widest flex-shrink-0">Configure →</button>
          </div>
        </div>

        {/* Main Activity Feed */}
        <div className="col-span-8">
          <div className="glass-panel iron-glow rounded-[3rem] p-10 h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Sales Activity Feed</h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1">AI Agent Actions · HITL Events · Meeting Confirmations</p>
              </div>
              <button onClick={() => nav('leads')} className="px-6 py-3 bg-red-500 text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-red-400 transition">
                + Launch Campaign
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 glass-panel rounded-2xl hover:bg-white/5 transition cursor-pointer" onClick={() => nav('whatsapp')}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.color.replace('text-', 'bg-')}`}></div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-sm">{a.lead}</span>
                    <span className={`text-[9px] glass-panel px-2 py-0.5 rounded-full font-black uppercase`}>via {a.agent}</span>
                  </div>
                  <span className="text-xs text-gray-500 flex-1">{a.event}</span>
                  <span className="text-[9px] text-gray-600 font-mono flex-shrink-0">{a.time} ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Threads + Model */}
        <div className="col-span-4 space-y-6">
          <div className="glass-panel iron-glow rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-[0.4em]">Background Threads</h3>
            <div className="space-y-6">
              {tasks.map(t => (
                <div key={t.name} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-gray-400 truncate flex-1 mr-2">{t.name}</span>
                    <span className={t.state === 'HITL' ? 'text-yellow-400 animate-pulse font-black' : t.state === 'Complete' ? 'text-matrixGreen' : 'text-red-400'}>
                      {t.state === 'HITL' ? '⚠ HITL' : t.progress + '%'}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${t.progress}%` }}
                      className={`h-full ${t.state === 'HITL' ? 'bg-yellow-400' : t.state === 'Complete' ? 'bg-matrixGreen' : 'bg-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel iron-glow rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.4em]">Model Health</h3>
            <div>
              <div className="flex justify-between text-[10px] font-black mb-2 uppercase"><span>GPU Load</span><span className="text-matrixGreen">34%</span></div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-matrixGreen shadow-[0_0_10px_#00ff41] w-[34%]"></div></div>
            </div>
            <p className="text-[9px] text-gray-600 font-mono mt-4">Ollama · Llama-3-70B · Speculative: ON</p>
          </div>
        </div>

      </div>
    </main>
  );
}

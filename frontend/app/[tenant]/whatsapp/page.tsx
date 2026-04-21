"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

type MsgRole = 'AI' | 'LEAD' | 'HUMAN';

interface WaMsg {
  id: string;
  role: MsgRole;
  text: string;
  time: string;
  auditTag?: string;
  confidence?: number;
  isTyping?: boolean;
}

const PIPELINE_STAGES = ['IMPORTED', 'CONTACTED', 'SHADOW_AUDIT', 'ENGAGED', 'MEETING_SET', 'WON'];

const TypingBubble = () => (
  <div className="flex gap-1 items-center p-3">
    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>)}
  </div>
);

export default function WhatsAppPage() {
  const { tenant } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadName = searchParams.get('name') || 'Ahmed Al Mansoori';
  const chatRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState(2); // SHADOW_AUDIT
  const [messages, setMessages] = useState<WaMsg[]>([]);
  const [hitlMode, setHitlMode] = useState(false);
  const [humanInput, setHumanInput] = useState('');
  const [pendingHITL, setPendingHITL] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const addMsg = (msg: Omit<WaMsg, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Math.random().toString(36).slice(2) }]);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 100);
  };

  // Simulate the auto-conversation on load
  useEffect(() => {
    const script: Array<{ delay: number; msg: Omit<WaMsg, 'id'> }> = [
      { delay: 500, msg: { role: 'AI', text: `Hello ${leadName}! I'm the Vanguard AI assistant for Lear Cyber tech. I noticed you showed interest in cybersecurity certification. Is now a good time to chat?`, time: '10:01 AM', confidence: 0.97 } },
      { delay: 2500, msg: { role: 'LEAD', text: "Yes, we've been trying to get ISO 27001 sorted for a while now.", time: '10:02 AM' } },
      { delay: 4000, msg: { role: 'AI', text: `Perfect. While we chat, I ran a quick Shadow Audit on your domain. I found:\n\n⚠️ SSL certificate expires in 4 days\n❌ DMARC record missing\n⚠️ Port 3389 (RDP) exposed publicly\n\nThese would be critical fail-points in an ISO audit. We can remediate all three this week.`, time: '10:02 AM', auditTag: 'SHADOW_AUDIT_COMPLETE', confidence: 0.99 } },
      { delay: 6500, msg: { role: 'LEAD', text: "That's alarming. How did you find all that?", time: '10:03 AM' } },
      { delay: 8000, msg: { role: 'AI', text: `Our Ghost-Hunter engine performs passive reconnaissance on publicly available records — no access to your systems. 100% UAE PDPL compliant.\n\nWould you like a full remediation roadmap sent to your email?`, time: '10:04 AM', confidence: 0.95 } },
      { delay: 10000, msg: { role: 'LEAD', text: "Yes please. What would this engagement look like?", time: '10:05 AM' } },
      { delay: 12000, msg: { role: 'AI', text: `Great question. Here's what I'd suggest based on your profile:\n\n📋 Phase 1: Gap Assessment (Week 1–2)\n🔧 Phase 2: Remediation Sprint (Week 3–6)\n✅ Phase 3: Certification Audit (Week 7–10)\n\nShall I pull 3 available slots for a discovery call with our consultant?`, time: '10:06 AM', confidence: 0.93 } },
      { delay: 14000, msg: { role: 'LEAD', text: "Actually I need to know about pricing first before committing.", time: '10:07 AM' } },
      // HITL Trigger — AI confidence drops on pricing
    ];

    script.forEach(({ delay, msg }) => {
      setTimeout(() => addMsg(msg), delay);
    });

    // Trigger HITL alert after pricing question
    setTimeout(() => {
      setPendingHITL(true);
      setStage(4); // MEETING_SET stage move
    }, 15000);
  }, []);

  const sendHuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanInput.trim()) return;
    addMsg({ role: 'HUMAN', text: humanInput, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) });
    setHumanInput('');
    // After human replies, simulate closing
    setTimeout(() => {
      addMsg({ role: 'AI', text: `✅ Your SPOC has taken over this conversation. Meeting proposal sent to ${leadName}. Cal.com booking link delivered via WhatsApp.`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), confidence: 1.0 });
      setStage(5);
      setPendingHITL(false);
    }, 2000);
  };

  const resumeAI = () => {
    setHitlMode(false);
    setPendingHITL(false);
    addMsg({ role: 'AI', text: `Our standard engagement starts at $499/month which covers the full ISO 27001 implementation roadmap, continuous monitoring, and 3 audits annually. Would you like to see 3 booking slots with our consultant to discuss this in detail?`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), confidence: 0.91 });
    setTimeout(() => setStage(5), 500);
  };

  const msgBg: Record<MsgRole, string> = {
    AI: 'bg-[#202c33] rounded-tl-none',
    LEAD: 'bg-[#005c4b] rounded-tr-none ml-auto',
    HUMAN: 'bg-purple-900/60 border border-purple-500/40 rounded-tl-none',
  };

  return (
    <main className="min-h-screen bg-transparent flex flex-col font-sans text-white relative overflow-hidden">

      {/* HITL Alert Banner */}
      <AnimatePresence>
        {pendingHITL && !hitlMode && (
          <motion.div
            initial={{ y: -80 }} animate={{ y: 0 }} exit={{ y: -80 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-red-600/90 backdrop-blur-md p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center font-black animate-pulse">H</div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest">Human-In-The-Loop Required</p>
                <p className="text-[10px] text-red-200">AI confidence below threshold on pricing. Lead {leadName} awaiting human response.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={resumeAI} className="px-5 py-2 bg-white/20 rounded-lg text-xs font-bold uppercase hover:bg-white/30 transition">Let AI Handle</button>
              <button onClick={() => setHitlMode(true)} className="px-5 py-2 bg-white text-black rounded-lg text-xs font-black uppercase hover:bg-red-100 transition">Take Over</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-screen max-w-7xl mx-auto w-full p-6 pt-16">
        
        {/* TopNav */}
        <nav className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push(`/${tenant}/leads`)} className="text-[10px] font-mono text-gray-500 hover:text-white transition uppercase tracking-widest">← Leads</button>
            <span className="text-gray-600">/</span>
            <span className="text-[10px] font-mono text-red-400 uppercase">WhatsApp_Auto_Engine</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className={`px-5 py-2 glass-panel rounded-xl text-[10px] font-black uppercase transition ${voiceActive ? 'bg-cyberBlue text-black' : ''}`}
            >
              {voiceActive ? '🔴 Voice Active' : '🎙️ Voice Mode'}
            </button>
            <button onClick={() => router.push(`/${tenant}/meetings`)} className="px-5 py-2 glass-panel rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition">
              📅 Meetings
            </button>
          </div>
        </nav>

        {/* Pipeline Progress */}
        <div className="glass-panel rounded-2xl p-6 mb-6 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {PIPELINE_STAGES.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex flex-col items-center ${i <= stage ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${i < stage ? 'bg-matrixGreen text-black' : i === stage ? 'bg-red-500 text-black animate-pulse' : 'bg-white/10'}`}>
                    {i < stage ? '✓' : i + 1}
                  </div>
                  <p className="text-[9px] font-mono mt-1 uppercase whitespace-nowrap text-gray-400">{s.replace('_', ' ')}</p>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${i < stage ? 'bg-matrixGreen' : 'bg-white/10'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* WhatsApp Chat Panel */}
          <div className="col-span-7 flex flex-col glass-panel iron-glow rounded-[2.5rem] overflow-hidden">
            {/* WA Header */}
            <div className="bg-[#202c33] p-5 flex items-center gap-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center font-black">
                {leadName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold">{leadName}</p>
                <p className="text-[10px] text-matrixGreen">{hitlMode ? '🟣 Human Agent Active' : '🟢 Vanguard AI Handling'}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${hitlMode ? 'bg-purple-500/20 text-purple-400' : 'bg-matrixGreen/20 text-matrixGreen'}`}>
                {hitlMode ? 'HITL_MODE' : 'AUTO_PILOT'}
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'LEAD' ? 'items-end' : 'items-start'}`}>
                  {msg.role !== 'LEAD' && (
                    <span className={`text-[9px] font-mono mb-1 ${msg.role === 'AI' ? 'text-red-400' : 'text-purple-400'}`}>
                      {msg.role === 'AI' ? 'VANGUARD_AI' : '👤 HUMAN_AGENT'}
                    </span>
                  )}
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${msgBg[msg.role]}`}>
                    {msg.text}
                    <div className="flex justify-between items-center mt-2 gap-4">
                      <span className="text-[9px] text-gray-500">{msg.time}</span>
                      {msg.confidence && (
                        <span className={`text-[9px] font-black ${msg.confidence > 0.9 ? 'text-matrixGreen' : msg.confidence > 0.8 ? 'text-yellow-400' : 'text-red-400'}`}>
                          AI: {(msg.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  {msg.auditTag && (
                    <div className="mt-1 px-3 py-1 bg-matrixGreen/10 border border-matrixGreen/20 rounded-full">
                      <p className="text-[9px] font-mono text-matrixGreen">⚡ {msg.auditTag}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#202c33] border-t border-white/5">
              {hitlMode ? (
                <form onSubmit={sendHuman} className="flex gap-3">
                  <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-purple-400 text-xs font-black">HUMAN →</span>
                    <input
                      autoFocus
                      value={humanInput}
                      onChange={e => setHumanInput(e.target.value)}
                      placeholder="Type your message as the SPOC..."
                      className="flex-1 bg-transparent text-sm outline-none text-white"
                    />
                  </div>
                  <button type="submit" className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-black">→</button>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-3 text-xs text-gray-500 italic">AI is handling this conversation automatically…</div>
                  <button onClick={() => setHitlMode(true)} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-black uppercase hover:bg-purple-500 hover:text-black transition">
                    Take Over
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Live Audit + Voice */}
          <div className="col-span-5 flex flex-col gap-6 overflow-y-auto">
            
            {/* Voice Status */}
            <AnimatePresence>
              {voiceActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel iron-glow rounded-3xl p-8 border-cyberBlue/30">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-cyberBlue mb-6">🎙️ AI Voice Call Active</h3>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1 bg-cyberBlue rounded-full animate-bounce"
                        style={{ height: `${Math.random() * 30 + 5}px`, animationDelay: `${i * 0.08}s` }}>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono text-center">Vapi WebRTC → {leadName} · +971 50 *** 4567</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Shadow Audit Stream */}
            <div className="glass-panel iron-glow rounded-3xl p-8 flex-1">
              <h3 className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-[0.4em]">Shadow Audit Log</h3>
              <div className="space-y-4">
                {[
                  { icon: '🔍', label: 'DOMAIN_PROBE', detail: 'prospect-entity.ae scanned', status: 'done' },
                  { icon: '🔒', label: 'SSL_CHECK', detail: 'Cert expires in 4 days', status: 'warn' },
                  { icon: '📧', label: 'DMARC_CHECK', detail: 'Record missing', status: 'fail' },
                  { icon: '🌐', label: 'PORT_SCAN', detail: 'RDP 3389 exposed', status: 'fail' },
                  { icon: '🛡️', label: 'PII_REDACTED', detail: 'Phone/email masked before AI', status: 'done' },
                  { icon: '📋', label: 'ISO_MAPPING', detail: 'A.12.6.1 + A.10.1.1 gaps flagged', status: 'done' },
                  { icon: '📅', label: 'MEETING_PROBE', detail: 'Cal.com slot fetched: 3 available', status: 'done' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-base">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-white uppercase">{item.label}</p>
                      <p className="text-[9px] text-gray-500 font-mono">{item.detail}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${item.status === 'done' ? 'bg-matrixGreen/10 text-matrixGreen' : item.status === 'warn' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button onClick={() => router.push(`/${tenant}/meetings`)} className="w-full py-4 bg-matrixGreen text-black font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-green-300 transition">
                📅 View Booked Meetings
              </button>
              <button onClick={() => router.push(`/${tenant}/leads`)} className="w-full py-4 glass-panel rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/5 transition">
                ← Back to Lead Vault
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

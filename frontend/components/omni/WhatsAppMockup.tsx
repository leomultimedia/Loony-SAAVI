"use client";

import { motion } from 'framer-motion';

const WhatsAppMessage = ({ role, text, time, audit }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: role === 'user' ? 20 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`flex flex-col mb-4 ${role === 'user' ? 'items-end' : 'items-start'}`}
  >
    <div className={`max-w-[80%] p-4 rounded-2xl text-sm relative ${role === 'user' ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none'}`}>
      {text}
      <div className="text-[9px] text-gray-400 mt-1 text-right">{time}</div>
      {audit && (
          <div className="mt-3 pt-3 border-t border-white/10 bg-matrixGreen/10 p-2 rounded-lg">
             <p className="text-[10px] font-black text-matrixGreen uppercase mb-1 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-matrixGreen rounded-full animate-pulse"></span>
                 Shadow_Audit_Active
             </p>
             <p className="text-[9px] text-gray-400 italic">{audit}</p>
          </div>
      )}
    </div>
  </motion.div>
);

export const WhatsAppMockup = () => {
  return (
    <div className="w-[360px] h-[640px] bg-[#0b141a] rounded-[3rem] border-[10px] border-[#1f2c34] shadow-2xl overflow-hidden flex flex-col relative font-sans">
      
      {/* Header */}
      <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-cyberBlue/20 flex items-center justify-center font-bold text-cyberBlue">V</div>
        <div>
           <p className="text-white text-sm font-bold">Vanguard_AI_LCT</p>
           <p className="text-matrixGreen text-[10px]">online (Secure_Node-AE)</p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
         <div className="bg-[#182229] p-2 rounded text-[10px] text-gray-500 text-center uppercase tracking-widest mb-6">Today</div>
         
         <WhatsAppMessage 
            role="ai" 
            time="10:01 AM" 
            text="Hello! I'm the Vanguard Assistant for Lear Cyber tech. I see you're interested in ISO 27001 implementation. How can I assist today?"
         />

         <WhatsAppMessage 
            role="user" 
            time="10:02 AM" 
            text="Yeah, we need to get certified. What's the first step?"
         />

         <WhatsAppMessage 
            role="ai" 
            time="10:02 AM" 
            audit="Behavioral Analysis: 'Direct' sentiment detected. Skipping fluff. Triggering Shadow Audit."
            text="Great. While I retrieve your service catalog, I performed a quick Shadow Audit on your domain. I noticed your SSL certificate is expiring in 4 days and you lack a DMARC policy. This would be a high-priority gap in your ISO 27001 audit."
         />

         <WhatsAppMessage 
            role="user" 
            time="10:03 AM" 
            text="Wow, I didn't know that. Can you help fix it?"
         />

         <WhatsAppMessage 
            role="ai" 
            time="10:03 AM" 
            audit="Qualification Level: HIGH. Ready for Close."
            text="Absolutely. Our Ghost-Hunter agent can automate the fix. Would you like to book 15 minutes with our lead consultant to finalize the roadmap?"
         />

         <WhatsAppMessage 
            role="ai" 
            time="10:03 AM" 
            text="Available slots for tomorrow:
🔘 10:00 AM
🔘 02:30 PM
🔘 04:00 PM
(Click a slot to book via Cal.com)"
         />
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#202c33] flex items-center gap-2">
         <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2 text-xs text-gray-500">Type a message...</div>
         <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">→</div>
      </div>

    </div>
  );
};

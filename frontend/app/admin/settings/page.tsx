"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ResellerAdminSettings() {
  const [shieldsActive, setShieldsActive] = useState(true);
  const [modelGarden, setModelGarden] = useState('local_optimized');
  
  return (
    <main className="min-h-screen bg-black text-white font-sans p-8 selection:bg-matrixGreen selection:text-black">
      <header className="border-b border-white/10 pb-6 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Settings <span className="text-gray-500">/ Reseller Portal</span></h1>
          <p className="font-mono text-sm text-cyberBlue mt-2 animate-pulse">Global Compliance Shields: ONLINE</p>
        </div>
        
        {/* The Security Kill Switch */}
        <button className="px-6 py-2 bg-red-900/40 text-red-500 hover:bg-red-900/80 hover:text-white border border-red-500/50 rounded transition font-mono font-bold">
          GDPR KILL-SWITCH (Wipe Tenant)
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COMPLIANCE CONTROLS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-cyberBlue rounded-full shadow-[0_0_10px_#00f3ff]"></span>
            Data Residency & Compliance
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Global Compliance Shields (PII Redaction)</p>
                <p className="text-sm text-gray-500 font-mono mt-1">Intercepts and masks WhatsApp numbers/emails before Model Inference.</p>
              </div>
              <button 
                onClick={() => setShieldsActive(!shieldsActive)}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${shieldsActive ? 'bg-matrixGreen' : 'bg-gray-800'}`}
              >
                <motion.div 
                  layout 
                  className={`w-6 h-6 bg-white rounded-full ${shieldsActive ? 'ml-auto' : ''}`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* MODEL GARDEN CONTROLS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur bg-white/5 border border-white/10 rounded-xl p-6"
        >
           <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
            The Model Garden Preference
          </h2>

          <div className="space-y-4">
             <label className="flex items-center gap-4 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                <input 
                  type="radio" 
                  name="model" 
                  checked={modelGarden === 'local_optimized'} 
                  onChange={() => setModelGarden('local_optimized')}
                  className="w-5 h-5 accent-purple-500"
                />
                <div>
                  <p className="font-bold text-cyberBlue">Vanguard Local (Zero-Cost)</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">Uses Phi-3 & Llama-3 70B via local Docker vLLM.</p>
                </div>
             </label>

             <label className="flex items-center gap-4 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                <input 
                  type="radio" 
                  name="model" 
                  checked={modelGarden === 'cloud_turbo'} 
                  onChange={() => setModelGarden('cloud_turbo')}
                  className="w-5 h-5 accent-purple-500"
                />
                <div>
                  <p className="font-bold text-gray-300">Cloud Turbo API (Failover)</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">Routes via Groq LPU (Metered Usage).</p>
                </div>
             </label>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

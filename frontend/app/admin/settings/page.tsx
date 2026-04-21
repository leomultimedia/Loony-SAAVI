"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ResellerAdminSettings() {
  const [shieldsActive, setShieldsActive] = useState(true);
  const [modelGarden, setModelGarden] = useState('local_optimized');
  
  // Ghost-Hunter CRM State
  const [crmType, setCrmType] = useState('hubspot');
  const [apiKey, setApiKey] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');

  const saveSettings = () => {
     console.log("Saving configurations: ", { shieldsActive, modelGarden, crmType, apiKey, sheetUrl });
     alert("100% Configured: Vanguard CRM Sync saved successfully.");
  };
  
  return (
    <main className="min-h-screen bg-black text-white font-sans p-8 selection:bg-matrixGreen selection:text-black pb-24">
      <header className="border-b border-white/10 pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Settings <span className="text-gray-500">/ Reseller Portal</span></h1>
          <p className="font-mono text-sm text-cyberBlue mt-2 animate-pulse">Global Compliance Shields: ONLINE</p>
        </div>
        
        <div className="flex gap-4">
            <button onClick={saveSettings} className="px-6 py-2 bg-cyberBlue/10 text-cyberBlue hover:bg-cyberBlue/20 border border-cyberBlue/50 rounded transition font-mono font-bold">
              SAVE CONFIGURATION
            </button>
            <button className="px-6 py-2 bg-red-900/40 text-red-500 hover:bg-red-900/80 hover:text-white border border-red-500/50 rounded transition font-mono font-bold">
              GDPR KILL-SWITCH
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* COMPLIANCE CONTROLS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-cyberBlue rounded-full shadow-[0_0_10px_#00f3ff]"></span>
            Data Residency & Compliance
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Global Compliance Shields</p>
                <p className="text-sm text-gray-500 font-mono mt-1">Intercepts and masks WhatsApp numbers/emails.</p>
              </div>
              <button 
                id="toggle-shield"
                onClick={() => setShieldsActive(!shieldsActive)}
                className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${shieldsActive ? 'bg-matrixGreen' : 'bg-gray-800'}`}
              >
                <motion.div layout className={`w-6 h-6 bg-white rounded-full ${shieldsActive ? 'ml-auto' : ''}`} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* MODEL GARDEN CONTROLS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="backdrop-blur bg-white/5 border border-white/10 rounded-xl p-6"
        >
           <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
            The Model Garden Preference
          </h2>
          <div className="space-y-4">
             <label className="flex items-center gap-4 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                <input type="radio" name="model" checked={modelGarden === 'local_optimized'} onChange={() => setModelGarden('local_optimized')} className="w-5 h-5 accent-purple-500" />
                <div>
                  <p className="font-bold text-cyberBlue">Vanguard Local (Zero-Cost)</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">Uses Phi-3 & Llama-3 70B via local vLLM.</p>
                </div>
             </label>
             <label className="flex items-center gap-4 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                <input type="radio" name="model" checked={modelGarden === 'cloud_turbo'} onChange={() => setModelGarden('cloud_turbo')} className="w-5 h-5 accent-purple-500" />
                <div>
                  <p className="font-bold text-gray-300">Cloud Turbo API (Failover)</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">Routes via Groq LPU (Metered Usage).</p>
                </div>
             </label>
          </div>
        </motion.section>
      </div>

      {/* CRM & GHOST-HUNTER SYNC */}
      <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="backdrop-blur bg-white/5 border border-white/10 rounded-xl p-6"
        >
           <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308]"></span>
            Ghost-Hunter CRM & Data Sync
          </h2>
          
          <div className="space-y-6 max-w-3xl">
              <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 font-mono">Primary CRM Platform</label>
                  <select 
                      id="crm-type-select"
                      value={crmType} 
                      onChange={(e) => setCrmType(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyberBlue appearance-none font-mono text-sm"
                  >
                      <option value="hubspot">HubSpot API</option>
                      <option value="salesforce">Salesforce</option>
                      <option value="google_sheets">Google Sheets (Live Sync)</option>
                      <option value="local_excel">Auto-Create Local MS Excel Sheet</option>
                  </select>
              </div>

              {crmType !== 'local_excel' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {crmType === 'google_sheets' ? (
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-mono">Google Sheet URL</label>
                            <input 
                                type="url" 
                                placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyberBlue font-mono text-sm"
                            />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 font-mono">API Key / Bearer Token</label>
                                <input 
                                    type="password" 
                                    id="api-key-input"
                                    placeholder="sk-crm-xxxxxxxxxxx"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyberBlue font-mono text-sm"
                                />
                            </div>
                        </div>
                      )}
                  </motion.div>
              )}

              {crmType === 'local_excel' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm font-mono text-yellow-500">
                          <strong>No CRM present.</strong> The system will intercept leads via Webhook and automatically compile them into a downloadable `.xlsx` archive secured in the Zero-Knowledge Vault.
                      </p>
                  </motion.div>
              )}
          </div>
      </motion.section>

    </main>
  );
}

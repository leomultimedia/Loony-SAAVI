// e:\SAAVI\Repo\frontend\app\page.tsx
import React from 'react';

export default function GodModeDashboard() {
  return (
    <main className="min-h-screen bg-background text-white font-sans p-8 selection:bg-cyberBlue selection:text-black">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Loony Heads <span className="text-cyberBlue">Vanguard</span></h1>
          <p className="text-sm text-gray-400 mt-1 font-mono hover:text-matrixGreen transition-colors flex items-center">
            <span className="w-2 h-2 bg-matrixGreen rounded-full animate-pulse mr-2"></span>
            Zero-Knowledge Mode: ACTIVE
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 border border-white/20 rounded-lg hover:border-cyberBlue hover:bg-cyberBlue/10 transition backdrop-blur-md bg-glass-gradient ring-1 ring-white/10 font-mono text-sm">
            System Logs
          </button>
          <button className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
            Reseller Portal
          </button>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WIDGET 1: Continuous Shadow Audit */}
        <section className="col-span-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyberBlue/10 blur-3xl rounded-full group-hover:bg-cyberBlue/20 transition duration-700"></div>
          <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
            Continuous Shadow Audit
            <span className="text-[10px] bg-matrixGreen/20 text-matrixGreen px-2 py-1 rounded font-mono uppercase tracking-wider border border-matrixGreen/50">Live</span>
          </h2>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-400">Target Tenant</span>
              <span>Acme Corp L.L.C</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-400">Risk Heatmap</span>
              <span className="text-red-400 flex items-center gap-2">
                <div className="w-16 h-1 bg-red-900 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-red-500"></div>
                </div>
                75% (CRITICAL)
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-400">Identified Gaps</span>
              <span className="text-cyberBlue">ADHICS V2.0 (Missing MFA)</span>
            </div>
          </div>
        </section>

        {/* WIDGET 2: Speculative Inference Pipeline */}
        <section className="col-span-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 font-display">Model Garden Router</h2>
          
          <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span>Fast Track</span>
              <span className="text-matrixGreen">Phi-3 (14B)</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Deep Analysis</span>
              <span className="text-cyberBlue">Llama-3 (70B)</span>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <span>Tokens Used:</span>
              <span>0 (Local AI)</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

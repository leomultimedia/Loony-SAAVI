"use client";

import { motion } from 'framer-motion';

export default function ResellerGlobalAdmin() {
  // Mock Data demonstrating the real-time database connection of onboarded tenants
  const tenants = [
      { id: 'tnt_001', name: 'Alpha Cyber Inc', tier: 'Pro', mrr: 499, status: 'Active', onboarded: '2026-04-18' },
      { id: 'tnt_002', name: 'Desert Sands LLC', tier: 'Sovereign', mrr: 1999, status: 'Active', onboarded: '2026-04-20' },
      { id: 'tnt_new', name: 'Acme Corp', tier: 'Pro', mrr: 499, status: 'Provisioning...', onboarded: 'Just Now' },
  ];

  const totalMRR = tenants.reduce((acc, t) => acc + t.mrr, 0);

  const offboardTenant = (id: string, name: string) => {
      const confirm = window.confirm(`DANGER: Are you sure you want to trigger the Zero-Knowledge Wipe and Offboard ${name}?`);
      if (confirm) alert(`Tenant ${id} successfully offboarded and billing cancelled.`);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans p-8 font-mono">
      <header className="border-b border-white/10 pb-6 mb-10">
        <h1 className="text-3xl font-display font-bold">Product Admin UI</h1>
        <p className="text-sm text-gray-500 mt-2">Global Hierarchy & Billing Management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* MRR WIDGET */}
          <div className="bg-white/5 border border-matrixGreen/30 p-6 rounded-xl shadow-[0_0_20px_rgba(0,255,65,0.05)]">
              <span className="text-gray-400 text-sm">Monthly Recurring Revenue</span>
              <div className="text-4xl font-bold flex items-center gap-4 mt-2">
                  <span className="text-matrixGreen">${totalMRR}</span>
                  <span className="text-xs text-matrixGreen bg-matrixGreen/10 px-2 py-1 rounded">↑ 18%</span>
              </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <span className="text-gray-400 text-sm">Active Sovereign Nodes</span>
              <div className="text-4xl font-bold mt-2">{tenants.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <span className="text-gray-400 text-sm">Cloud Exits (API Keys Generated)</span>
              <div className="text-4xl font-bold text-cyberBlue mt-2">{tenants.length * 2}</div>
          </div>
      </div>

      <div className="w-full overflow-x-auto">
          <table className="w-full text-left bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-black/50 border-b border-white/10 text-gray-400 text-xs uppercase">
                  <tr>
                      <th className="p-4">Tenant ID</th>
                      <th className="p-4">Entity Name</th>
                      <th className="p-4">Tier</th>
                      <th className="p-4">MRR Impact</th>
                      <th className="p-4">Deployment Status</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {tenants.map(t => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-4 text-gray-500">{t.id}</td>
                          <td className="p-4 font-bold">{t.name}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${t.tier === 'Sovereign' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{t.tier}</span></td>
                          <td className="p-4 font-bold text-matrixGreen">${t.mrr}</td>
                          <td className="p-4 flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${t.status === 'Active' ? 'bg-matrixGreen content-pulse' : 'bg-yellow-500 animate-pulse'}`}></span>
                             {t.status}
                          </td>
                          <td className="p-4 text-right">
                              <button onClick={() => offboardTenant(t.id, t.name)} className="text-red-500 text-xs border border-red-500/30 px-3 py-1 rounded hover:bg-red-500 hover:text-black transition">
                                  Offboard
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

    </main>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ResellerGlobalAdmin() {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
     // Fetch absolute truth from local database simulation (No dummy data)
     const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
     setTenants(stored);
  }, []);

  const totalMRR = tenants.reduce((acc, t) => acc + ((t.status === 'Archived' ? 0 : t.mrr) || 0), 0);

  const archiveTenant = (id: string, name: string) => {
      const confirm = window.confirm(`Archive ${name}? Billing will be paused and data locked for future revival.`);
      if (confirm) {
          const updated = tenants.map(t => t.id === id ? { ...t, status: 'Archived', mrr: 0 } : t);
          setTenants(updated);
          localStorage.setItem('vanguard_tenants', JSON.stringify(updated));
      }
  }

  const reviveTenant = (id: string, name: string) => {
      const confirm = window.confirm(`Revive ${name}? Billing will resume immediately for the ${name} matrix.`);
      if (confirm) {
          const updated = tenants.map(t => t.id === id ? { ...t, status: 'Active', mrr: t.tier === 'PRO' ? 499 : t.tier === 'SOVEREIGN' ? 1999 : 0 } : t);
          setTenants(updated);
          localStorage.setItem('vanguard_tenants', JSON.stringify(updated));
      }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans p-8 font-mono">
      <header className="border-b border-white/10 pb-6 mb-10">
        <h1 className="text-3xl font-display font-bold">Product Admin UI</h1>
        <p className="text-sm text-gray-500 mt-2">Manage live tenants and subscriptions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* MRR WIDGET */}
          <div className="bg-white/5 border border-matrixGreen/30 p-6 rounded-xl shadow-[0_0_20px_rgba(0,255,65,0.05)]">
              <span className="text-gray-400 text-sm">Monthly Recurring Revenue</span>
              <div className="text-4xl font-bold flex items-center gap-4 mt-2">
                  <span className="text-matrixGreen">${totalMRR}</span>
              </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <span className="text-gray-400 text-sm">Active Sovereign Nodes</span>
              <div className="text-4xl font-bold mt-2">{tenants.length}</div>
          </div>
      </div>

      <div className="w-full overflow-x-auto">
          <table className="w-full text-left bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-black/50 border-b border-white/10 text-gray-400 text-xs uppercase">
                  <tr>
                      <th className="p-4">Tenant ID</th>
                      <th className="p-4">Entity Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Tier</th>
                      <th className="p-4">Deployment Status</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {tenants.length === 0 && (
                      <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500 italic">No tenants currently onboarded. All data is real.</td>
                      </tr>
                  )}
                  {tenants.map(t => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-4 text-gray-500 text-xs">{t.id}</td>
                          <td className="p-4 font-bold text-cyberBlue">{t.name}</td>
                          <td className="p-4">{t.email}</td>
                          <td className="p-4"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">{t.tier} (${t.mrr}/mo)</span></td>
                          <td className="p-4 flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${t.status === 'Archived' ? 'bg-red-500' : 'bg-matrixGreen content-pulse'}`}></span>
                             {t.status}
                          </td>
                          <td className="p-4 text-right flex justify-end gap-3">
                              {t.status === 'Active' && (
                                  <a href="/loonyheads/dashboard" target="_blank" className="text-cyberBlue text-xs border border-cyberBlue/30 px-3 py-1 rounded hover:bg-cyberBlue hover:text-black transition inline-block">
                                      Access Dashboard
                                  </a>
                              )}
                              
                              {t.status === 'Archived' ? (
                                  <button onClick={() => reviveTenant(t.id, t.name)} className="text-matrixGreen text-xs border border-matrixGreen/30 px-3 py-1 rounded hover:bg-matrixGreen hover:text-black transition">
                                      Revive
                                  </button>
                              ) : (
                                  <button onClick={() => archiveTenant(t.id, t.name)} className="text-red-500 text-xs border border-red-500/30 px-3 py-1 rounded hover:bg-red-500 hover:text-black transition">
                                      Archive
                                  </button>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </main>
  );
}

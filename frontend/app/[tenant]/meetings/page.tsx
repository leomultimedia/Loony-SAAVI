"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

const MEETINGS = [
  { id: 'M001', lead: 'Ahmed Al Mansoori', company: 'Dubai Fintech Group', date: '2026-04-23', time: '10:00 AM', spoc: 'admin@lct.com', status: 'CONFIRMED', channel: 'Teams' },
  { id: 'M002', lead: 'Priya Sharma', company: 'Axiom Telecom', date: '2026-04-24', time: '02:30 PM', spoc: 'admin@lct.com', status: 'PENDING', channel: 'Zoom' },
  { id: 'M003', lead: 'Khalid Bin Rashid', company: 'ADNOC Digital', date: '2026-04-25', time: '11:00 AM', spoc: 'admin@lct.com', status: 'CONFIRMED', channel: 'Google Meet' },
];

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'bg-matrixGreen/10 text-matrixGreen',
  PENDING: 'bg-yellow-400/10 text-yellow-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
};

export default function MeetingsPage() {
  const { tenant } = useParams();
  const router = useRouter();
  const [meetings] = useState(MEETINGS);

  return (
    <main className="min-h-screen bg-transparent p-8 font-sans text-white">
      <div className="max-w-5xl mx-auto">
        
        <nav className="flex items-center gap-3 mb-2 text-[10px] font-mono text-gray-500 uppercase">
          <button onClick={() => router.push(`/${tenant}/dashboard`)} className="hover:text-white transition">← Dashboard</button>
          <span>/</span>
          <span className="text-red-400">Meetings</span>
        </nav>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Booked <span className="text-matrixGreen">Meetings</span></h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.3em] mt-2">AI-Arranged via Cal.com · Auto-confirmed by Vanguard</p>
          </div>
          <div className="flex gap-3">
            <div className="px-6 py-3 glass-panel rounded-xl text-center">
              <p className="text-3xl font-black text-matrixGreen">{meetings.filter(m => m.status === 'CONFIRMED').length}</p>
              <p className="text-[9px] font-mono text-gray-500 uppercase">Confirmed</p>
            </div>
            <div className="px-6 py-3 glass-panel rounded-xl text-center">
              <p className="text-3xl font-black text-yellow-400">{meetings.filter(m => m.status === 'PENDING').length}</p>
              <p className="text-[9px] font-mono text-gray-500 uppercase">Pending</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {meetings.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel iron-glow rounded-[2.5rem] p-8 flex items-center gap-8 group hover:border-red-500/30 transition cursor-pointer"
            >
              <div className="w-20 h-20 flex-shrink-0 flex flex-col items-center justify-center glass-panel rounded-2xl border-t-red-500/40">
                <p className="text-xs font-bold text-gray-500">{m.date.split('-')[2]} {new Date(m.date).toLocaleString('en', { month: 'short' })}</p>
                <p className="text-xl font-black">{m.time}</p>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black tracking-tight">{m.lead}</h3>
                <p className="text-gray-400 text-sm">{m.company}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-mono text-gray-500">SPOC: {m.spoc}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-[10px] font-mono text-cyberBlue">{m.channel}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                <button className="px-4 py-2 glass-panel text-xs font-black uppercase rounded-xl hover:bg-white/5 transition opacity-0 group-hover:opacity-100">
                  Join / Reschedule
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Close Rate Widget */}
        <div className="mt-12 glass-panel iron-glow rounded-[2.5rem] p-10 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-5xl font-black text-white">83<span className="text-2xl text-gray-500">%</span></p>
            <p className="text-[10px] font-mono text-gray-500 uppercase mt-2">Meeting-to-Close Rate</p>
          </div>
          <div>
            <p className="text-5xl font-black text-matrixGreen">4.2h</p>
            <p className="text-[10px] font-mono text-gray-500 uppercase mt-2">Avg Time to Book</p>
          </div>
          <div>
            <p className="text-5xl font-black text-cyberBlue">$18K</p>
            <p className="text-[10px] font-mono text-gray-500 uppercase mt-2">Avg Contract Value</p>
          </div>
        </div>

      </div>
    </main>
  );
}

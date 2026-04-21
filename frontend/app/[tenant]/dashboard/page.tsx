"use client";
import { motion } from 'framer-motion';
import { OmniCommandBar } from '../../../components/omni/OmniCommandBar';

export default function CommandDashboard() {
  const exportDataExcel = () => {
      // Generates a native structured CSV format natively recognized by MS Excel
      const csvData = "Lead ID,Lead Phone,Risk Score,ISO 27001 Gaps,Pipeline Status\nIDX-992,+971501234567,HIGH,Missing SSL/DMARC,Negotiating\nIDX-993,+44812345678,LOW,None,Closed";
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'Vanguard_Tenant_Data_Export.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 font-sans p-6 overflow-hidden flex flex-col relative">
       
       {/* Global Cmd+K Palette */}
       <OmniCommandBar />

       <div className="flex justify-end w-full max-w-6xl mx-auto mb-4 relative z-20">
           <button onClick={exportDataExcel} className="font-mono text-xs bg-black border border-cyberBlue/40 text-cyberBlue px-4 py-2 rounded-lg hover:bg-cyberBlue hover:text-black transition flex items-center gap-2">
              ↓ Download Tenant Data (Excel)
           </button>
       </div>

       {/* OMNI-BAR / NO MENUS */}
       <header className="flex justify-center mb-8 pt-4 z-10 w-full relative">
           <div className="absolute inset-x-0 -top-10 h-32 bg-cyberBlue/5 blur-3xl rounded-full"></div>
           <div className="w-full max-w-3xl flex flex-col items-center">
             <div className="w-full backdrop-blur-2xl bg-white/5 border border-white/10 rounded-full px-8 py-4 flex justify-between shadow-2xl z-20">
               <span className="font-mono text-gray-500">Search leads, command audits...</span>
               <span className="font-mono text-cyberBlue border border-cyberBlue/30 rounded px-2 text-sm bg-cyberBlue/10">Press ⌘ K</span>
             </div>
           </div>
       </header>

       {/* HEATMAP GRID */}
       <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 z-10">
           
           <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-8 flex flex-col justify-between"
           >
               <h2 className="text-2xl font-display font-semibold mb-6 flex items-center justify-between">
                   AI Sales Qualification Queue
                   <span className="w-3 h-3 bg-matrixGreen rounded-full animate-pulse shadow-[0_0_10px_#00ff41]"></span>
               </h2>
               <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 font-mono text-sm relative overflow-hidden flex items-center justify-center">
                   <p className="text-gray-500">Autonomous Speculative Executions Realigning Slots...</p>
               </div>
           </motion.div>

           <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-8 flex flex-col"
           >
               <h2 className="text-xl font-mono text-red-500/80 mb-6 flex items-center gap-2">
                   [LIVE] Risk & Compliance Heatmap
               </h2>
               
               <div className="flex-1 flex flex-col justify-end space-y-4">
                   <div className="space-y-1">
                       <div className="flex justify-between text-xs text-gray-500 uppercase"><span>ADHICS V2.0</span> <span>Critical</span></div>
                       <div className="w-full h-3 bg-red-900/30 rounded-full overflow-hidden">
                           <div className="w-[85%] h-full bg-gradient-to-r from-red-500 to-red-600"></div>
                       </div>
                   </div>
                   <div className="space-y-1">
                       <div className="flex justify-between text-xs text-gray-500 uppercase"><span>ISO 27001 Access Control</span> <span>Moderate</span></div>
                       <div className="w-full h-3 bg-yellow-900/30 rounded-full overflow-hidden">
                           <div className="w-[45%] h-full bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                       </div>
                   </div>
               </div>
           </motion.div>

       </div>
    </main>
  );
}

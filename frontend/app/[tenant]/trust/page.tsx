"use client";
import { motion } from 'framer-motion';

export default function TrustCenter() {
  return (
     <main className="min-h-screen bg-black text-white font-sans p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-matrixGreen/10 blur-[100px] rounded-full"></div>

        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 text-center max-w-2xl backdrop-blur-xl bg-black/40 p-12 rounded-3xl border border-white/10 ring-1 ring-matrixGreen/20 shadow-2xl shadow-matrixGreen/5"
        >
            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-matrixGreen to-cyberBlue mb-4">
                Verified Trust Center
            </h1>
            <p className="font-mono text-gray-400 mb-8 border-b border-white/10 pb-8">
                Your data is cryptographically isolated and never leaves the target region.
            </p>
            
            <div className="space-y-4 text-left font-mono text-sm font-medium">
                <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <span>Active LLM Framework:</span>
                    <span className="text-cyberBlue bg-cyberBlue/10 px-3 py-1 rounded-full">100% Local (Vanguard Swarm)</span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <span>Cloud Syncing:</span>
                    <span className="text-red-400">DISABLED (Zero Exfiltration)</span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <span>PII Scrubber Subroutines:</span>
                    <span className="text-matrixGreen">AES-256-GCM Armed</span>
                </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-8 italic">Validated by ISO 27001 Standards</p>
        </motion.div>
     </main>
  );
}

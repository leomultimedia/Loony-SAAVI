"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function OmniCommandBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-32"
                onClick={() => setIsOpen(false)}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                        <span className="text-cyberBlue">⌘</span>
                        <input 
                            autoFocus
                            placeholder="Omni-Search: Search leads, launch audits, or manage tenants..."
                            className="bg-transparent border-none w-full text-white focus:outline-none text-lg font-mono placeholder:text-gray-600"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="p-2">
                        {/* Quick Commands List */}
                        <div className="text-xs text-gray-500 font-mono uppercase px-3 py-2">Suggested Actions</div>
                        
                        <button className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-lg flex items-center justify-between group transition">
                            <span className="font-mono text-sm text-gray-300 group-hover:text-cyberBlue">Trigger Compliance Shadow Audit</span>
                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-500">Run</span>
                        </button>

                        <button className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-lg flex items-center justify-between group transition">
                            <span className="font-mono text-sm text-gray-300 group-hover:text-purple-400">Switch Model Garden (Llama-3 70B &rarr; Groq)</span>
                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-500">Toggle</span>
                        </button>
                        
                        <button className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-lg flex items-center justify-between group transition">
                            <span className="font-mono text-sm text-gray-300 group-hover:text-red-500">Deploy Ghost-Protocol Vault Wipe</span>
                            <span className="text-xs bg-red-900/40 text-red-500 px-2 py-1 rounded border border-red-900/50">Danger</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TenantOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [masters, setMasters] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        groqKey: '',
        hubspotKey: '',
        plan: 'pro',
        mrr: 499,
        isMaster: false,
        parentId: ''
    });

    useEffect(() => {
        // Fetch masters from real API for hierarchy assignment
        fetch('/api/tenants')
            .then(res => res.json())
            .then(data => setMasters(Array.isArray(data) ? data.filter((t: any) => t.isMaster) : []));
    }, []);

    const handleOnboard = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.companyName,
                    email: formData.email,
                    isMaster: formData.isMaster,
                    parentId: formData.parentId,
                    groqKey: formData.groqKey,
                    hubspotKey: formData.hubspotKey,
                    tier: formData.isMaster ? 'SOVEREIGN' : 'PRO'
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Identity Sync Failed');
            }

            alert(`PROVISIONING COMPLETE: [${formData.companyName}] is persistent in the SQL Grid.`);
            router.push('/admin');
        } catch (e: any) {
            setError(e.message);
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-transparent text-white flex justify-center items-center p-6 font-mono relative">
            
            {loading && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-3xl">
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 border-t-4 border-cyberBlue rounded-full animate-[spin_1s_linear_infinite] mx-auto shadow-[0_0_20px_#00f3ff]"></div>
                        <p className="text-sm font-black tracking-[0.5em] animate-pulse">VAULT_INJECTING_GHOST_PII...</p>
                    </div>
                </div>
            )}

            <motion.div layout className="w-full max-w-2xl glass-panel p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8 p-6 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-xs font-black tracking-tight leading-relaxed">
                            {error.toUpperCase()}
                        </motion.div>
                    )}
                </AnimatePresence>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h1 className="text-4xl font-black mb-2 tracking-tight group">ENTITY_SYNC <span className="text-cyberBlue">v1.0</span></h1>
                        <p className="text-gray-500 text-[10px] mb-12 font-mono uppercase tracking-[0.3em]">Phase 1: Establishing Global Vault Hook</p>
                        
                        <div className="space-y-8">
                            <div className="relative group">
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">Unique Legal Entity Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black border border-white/10 rounded-2xl p-5 focus:border-cyberBlue outline-none text-xl transition shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                                    value={formData.companyName}
                                    onChange={e => { setFormData({...formData, companyName: e.target.value}); setError(''); }}
                                    placeholder="Enter unique name..."
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">Master Administrator Email</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-black border border-white/10 rounded-2xl p-5 focus:border-cyberBlue outline-none text-xl transition shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="admin@entity.com"
                                />
                            </div>
                        </div>

                        <button onClick={() => setStep(2)} disabled={!formData.companyName || !formData.email} className="w-full mt-12 bg-white text-black font-black py-5 rounded-2xl hover:bg-cyberBlue transition disabled:opacity-20 uppercase text-sm tracking-[0.2em] shadow-2xl">
                            Next Stage: Architecture Setup
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h1 className="text-4xl font-black mb-2 tracking-tight">HIERARCHY_MAP</h1>
                        <p className="text-gray-500 text-[10px] mb-12 uppercase tracking-[0.3em]">Phase 2: Defining Entity Relationships</p>
                        
                        <div className="flex gap-6 mb-8">
                            <button 
                                onClick={() => setFormData({...formData, isMaster: true, parentId: ''})}
                                className={`flex-1 p-8 border rounded-3xl transition relative group ${formData.isMaster ? 'border-purple-500 bg-purple-500/5' : 'border-white/10'}`}
                            >
                                <div className="font-black text-xl mb-1 text-white uppercase tracking-tighter">Master</div>
                                <div className="text-[9px] text-gray-500 uppercase font-mono">Consolidated Fleet</div>
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, isMaster: false})}
                                className={`flex-1 p-8 border rounded-3xl transition relative group ${!formData.isMaster ? 'border-cyberBlue bg-cyberBlue/10' : 'border-white/10'}`}
                            >
                                <div className="font-black text-xl mb-1 text-white uppercase tracking-tighter">Standalone</div>
                                <div className="text-[9px] text-gray-500 uppercase font-mono">Sovereign Node</div>
                            </button>
                        </div>

                        {(!formData.isMaster && masters.length > 0) && (
                            <div className="mt-8 transition-all">
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest pl-1">Assign to Existing Fleet</label>
                                <select 
                                    className="w-full bg-black border border-white/10 rounded-2xl p-5 focus:border-cyberBlue outline-none text-xs transition cursor-pointer appearance-none"
                                    value={formData.parentId}
                                    onChange={e => setFormData({...formData, parentId: e.target.value})}
                                >
                                    <option value="">Independent Sovereign Node</option>
                                    {masters.map((m: any) => (
                                        <option key={m.id} value={m.id}>{m.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(1)} className="flex-1 glass-panel text-gray-500 py-4 rounded-2xl uppercase font-black text-[10px]">Previous</button>
                            <button onClick={() => setStep(3)} className="flex-[2] bg-white text-black font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-2xl">Step 3: BYOK Independence</button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h1 className="text-4xl font-black mb-12 tracking-tight uppercase">Launch Node</h1>
                        
                        <div className="p-8 bg-matrixGreen/5 border border-matrixGreen/30 rounded-3xl mb-10 flex justify-between items-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">REVENUE_ACTIVE</div>
                            <div>
                                <h3 className="text-matrixGreen font-black text-2xl uppercase tracking-tighter">
                                    {formData.isMaster ? 'SOVEREIGN_MASTER' : 'PRO_NODE'}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-mono mt-1 italic">Annualized Contract: ${formData.isMaster ? '23,988' : '5,988'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-white tracking-tighter">${formData.isMaster ? '1,999' : '499'}</p>
                                <p className="text-[9px] text-gray-600 uppercase font-mono">Monthly_Sovereignty</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 glass-panel text-gray-500 py-5 rounded-2xl uppercase font-black text-[10px]">Back</button>
                            <button onClick={handleOnboard} className="flex-[3] bg-matrixGreen text-black font-black py-5 rounded-2xl uppercase text-lg tracking-tighter shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                                Execute Deployment
                            </button>
                        </div>
                    </motion.div>
                )}

            </motion.div>
        </main>
    );
}

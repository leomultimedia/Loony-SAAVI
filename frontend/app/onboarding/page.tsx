"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TenantOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
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

    // Student-level helper text
    const tips = [
        "Create your core identity. Remember: Your Entity Name must be unique globally!",
        "Master Entities can oversee many sub-entities. Perfect for holding companies.",
        "Your BYOK keys keep you independent. We can't see your data!",
        "Finalize your node deployment. All systems are green."
    ];

    const validateName = (name: string) => {
        const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
        return !stored.some((t: any) => t.name.toLowerCase() === name.toLowerCase());
    };

    const handleOnboard = () => {
        if (!validateName(formData.companyName)) {
            setError("CRITICAL ERROR: This Entity Name is already registered in the Vanguard Grid. Please choose a unique name.");
            setStep(1);
            return;
        }

        const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
        const newEntity = {
            id: 'tnt_' + Math.random().toString(36).substring(2, 9),
            name: formData.companyName,
            email: formData.email,
            tier: formData.plan.toUpperCase(),
            mrr: formData.mrr,
            status: 'Active',
            onboarded: new Date().toISOString().split('T')[0],
            isMaster: formData.isMaster,
            parentId: formData.parentId || null
        };
        
        localStorage.setItem('vanguard_tenants', JSON.stringify([...stored, newEntity]));

        alert(`PROVISIONING COMPLETE: [${formData.companyName}] is now a Sovereign Node. Accessing Master Console...`);
        router.push('/admin');
    };

    const masters = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('vanguard_tenants') || '[]' : '[]').filter((t: any) => t.isMaster);

    return (
        <main className="min-h-screen bg-[#050505] text-white flex justify-center items-center p-6 font-mono">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div className="h-full bg-cyberBlue" initial={{ width: "0%" }} animate={{ width: `${(step / 4) * 100}%` }}></motion.div>
            </div>

            <motion.div layout className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyberBlue/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold font-mono overflow-hidden">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {step === 1 && (
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-2">Entity Registration</h1>
                        <p className="text-gray-500 text-sm mb-10">Step 1: Global Identity Mapping</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Entity Name (Must be Unique)</label>
                                <input 
                                    type="text" 
                                    className={`w-full bg-black border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl p-4 focus:border-cyberBlue outline-none text-lg transition shadow-inner`}
                                    value={formData.companyName}
                                    onChange={e => { setFormData({...formData, companyName: e.target.value}); setError(''); }}
                                    placeholder="Acme Systems"
                                />
                                <p className="mt-2 text-[10px] text-gray-600 italic">Vanguard check: Name determines your unique cryptographic vault address.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Master Admin Email</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-cyberBlue outline-none text-lg transition shadow-inner"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="admin@acme.com"
                                />
                            </div>
                        </div>

                        <button onClick={() => setStep(2)} disabled={!formData.companyName || !formData.email} className="w-full mt-10 bg-white text-black font-extrabold py-4 rounded-2xl hover:bg-cyberBlue transition disabled:opacity-30 group shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            Next Stage: Hierarchy Setup &rarr;
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-2">Hierarchy Mapping</h1>
                        <p className="text-gray-500 text-sm mb-10">Step 2: Defining Entity Relationships</p>
                        
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setFormData({...formData, isMaster: true, parentId: ''})}
                                    className={`flex-1 p-6 border rounded-3xl transition text-left group ${formData.isMaster ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-white/10'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg mb-4 flex items-center justify-center font-bold text-xs ${formData.isMaster ? 'bg-purple-500 text-black' : 'bg-white/10 text-white'}`}>M</div>
                                    <div className={`font-bold mb-1 ${formData.isMaster ? 'text-white' : 'text-gray-400'}`}>Master Entity</div>
                                    <p className="text-[10px] text-gray-500 leading-tight">Controls multiple sub-entities and consolidated billing.</p>
                                </button>
                                <button 
                                    onClick={() => setFormData({...formData, isMaster: false})}
                                    className={`flex-1 p-6 border rounded-3xl transition text-left group ${!formData.isMaster ? 'border-cyberBlue bg-cyberBlue/5 shadow-[0_0_20px_rgba(0,243,255,0.2)]' : 'border-white/10'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg mb-4 flex items-center justify-center font-bold text-xs ${!formData.isMaster ? 'bg-cyberBlue text-black' : 'bg-white/10 text-white'}`}>S</div>
                                    <div className={`font-bold mb-1 ${!formData.isMaster ? 'text-white' : 'text-gray-400'}`}>Standalone / Sub</div>
                                    <p className="text-[10px] text-gray-500 leading-tight">Individual node. Can optionally be controlled by a Master.</p>
                                </button>
                            </div>

                            {(!formData.isMaster && masters.length > 0) && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Assign to Master (Optional)</label>
                                    <select 
                                        className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-cyberBlue outline-none text-sm transition appearance-none cursor-pointer"
                                        value={formData.parentId}
                                        onChange={e => setFormData({...formData, parentId: e.target.value})}
                                    >
                                        <option value="">Standalone Sovereign Entity</option>
                                        {masters.map((m: any) => (
                                            <option key={m.id} value={m.id}>{m.name} (Master)</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(1)} className="flex-1 bg-transparent border border-white/10 text-gray-500 py-4 rounded-2xl hover:text-white transition uppercase font-bold text-xs">Previous</button>
                            <button onClick={() => setStep(3)} className="flex-[2] bg-white text-black font-extrabold py-4 rounded-2xl hover:bg-cyberBlue transition text-sm">Next Stage: BYOK Setup &rarr;</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-2">BYOK Independence</h1>
                        <p className="text-gray-500 text-sm mb-10">Step 3: Plugging in Dynamic Infra</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.2em] px-1">Cloud Inference (Groq Key)</label>
                                <input type="password" placeholder="Leave empty for local GPU node" className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none text-sm shadow-inner transition" value={formData.groqKey} onChange={e => setFormData({...formData, groqKey: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.2em] px-1">CRM Sync (Hubspot PAT)</label>
                                <input type="password" placeholder="Leave empty for Excel CSV logs" className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-orange-500 outline-none text-sm shadow-inner transition" value={formData.hubspotKey} onChange={e => setFormData({...formData, hubspotKey: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(2)} className="flex-1 bg-transparent border border-white/10 text-gray-500 py-4 rounded-2xl hover:text-white transition uppercase font-bold text-xs">Previous</button>
                            <button onClick={() => setStep(4)} className="flex-[2] bg-white text-black font-extrabold py-4 rounded-2xl hover:bg-cyberBlue transition text-sm">Review & Launch &rarr;</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div id="step-4">
                        <h1 className="text-3xl font-display font-bold mb-2">Vanguard Activation</h1>
                        <p className="text-gray-500 text-sm mb-10">Step 4: Final Subscription Lock-in</p>
                        
                        <div className="bg-cyberBlue/10 border border-cyberBlue/30 p-6 rounded-3xl mb-8 relative group cursor-default shadow-[0_0_40px_rgba(0,243,255,0.05)]">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="font-bold text-cyberBlue">
                                     {formData.isMaster ? 'SOVEREIGN MASTER HUB' : 'OMNI-SAAS PRO NODE'}
                                 </span>
                                 <span className="text-xl font-bold">${formData.isMaster ? 1999 : 499} / mo</span>
                             </div>
                             <p className="text-[10px] text-gray-600 font-mono tracking-tighter">Unlimited Shadow Audits + Ghost-Hunter Pipeline Enabled.</p>
                             <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyberBlue rounded-full shadow-[0_0_8px_#00f3ff]"></div>
                        </div>

                        <div className="mb-10 p-1 font-mono text-[9px] text-gray-600 bg-white/5 rounded px-2 py-1 flex items-center justify-between">
                            <span>MOCK_STRIPE_HANDSHAKE: ACTIVE</span>
                            <span className="text-matrixGreen">STATUS: SECURE_VAULT_ENABLED</span>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(3)} className="flex-1 bg-transparent border border-white/10 text-gray-500 py-4 rounded-2xl hover:text-white transition uppercase font-bold text-xs">Back</button>
                            <button id="btn-complete" onClick={handleOnboard} className="flex-[3] bg-matrixGreen text-black font-extrabold py-4 rounded-2xl hover:bg-[#00cc33] flex justify-center items-center gap-3 transition shadow-[0_0_40px_rgba(0,255,65,0.2)] text-lg">
                                EXECUTE DEPLOYMENT
                                <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Helpful Student Insight */}
                <div className="mt-12 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-[10px] font-bold text-gray-400 font-mono">STUDENT INSIGHT</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">{tips[step-1]}</p>
                </div>
            </motion.div>
        </main>
    );
}

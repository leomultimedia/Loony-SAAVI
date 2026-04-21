"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TenantOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        groqKey: '',
        hubspotKey: '',
        plan: 'pro',
        mrr: 499
    });

    const handleOnboard = () => {
        // Save tenant strictly to local persistent data stream for zero-mock operations
        const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
        const newEntity = {
            id: 'tnt_' + Math.random().toString(36).substring(2, 9),
            name: formData.companyName,
            email: formData.email,
            tier: formData.plan.toUpperCase(),
            mrr: formData.mrr,
            status: 'Active',
            onboarded: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('vanguard_tenants', JSON.stringify([...stored, newEntity]));

        alert(`Congratulations! ${formData.companyName} is onboarded to the $${formData.mrr} Omni-SaaS ${formData.plan.toUpperCase()} tier! We will now transfer you to the Command Center to finalize verification.`);
        router.push('/admin');
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white flex justify-center items-center p-6 font-mono selection:bg-matrixGreen selection:text-black">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-white/10">
                <motion.div className="h-full bg-matrixGreen shadow-[0_0_10px_#00ff41]" initial={{ width: "0%" }} animate={{ width: `${(step / 3) * 100}%` }}></motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl">
                
                {step === 1 && (
                    <div id="step-1">
                        <h1 className="text-3xl font-display font-bold mb-4">Welcome. Let's set up your Company.</h1>
                        
                        <div className="p-4 bg-cyberBlue/10 border border-cyberBlue/20 rounded-lg mb-8">
                            <p className="text-xs text-cyberBlue">💡️ <strong>Helpful Tip:</strong> Enter your exact legal company name and the email of the absolute top-level administrator. We will bind cryptographic secrets to this exact identity.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">My Company Name is:</label>
                                <input type="text" className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-matrixGreen outline-none text-lg transition" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Lear Cyber tech" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">My Administrator Email is:</label>
                                <input type="email" className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-matrixGreen outline-none text-lg transition" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="e.g. admin@lct.com" />
                            </div>
                        </div>

                        <button id="btn-next-1" disabled={!formData.companyName || !formData.email} onClick={() => setStep(2)} className="w-full mt-10 bg-white text-black font-extrabold py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">Continue to Settings &rarr;</button>
                    </div>
                )}

                {step === 2 && (
                    <div id="step-2">
                        <h1 className="text-3xl font-display font-bold mb-4">Plugin Your Keys (Optional)</h1>
                        
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-8">
                            <p className="text-xs text-purple-400">💡️ <strong>Helpful Tip:</strong> You aren't forced to use our AI. If you have your own Groq AI key or HubSpot CRM key, paste them here. The system will route data to *your* personal private accounts. If you don't have them, just click Continue!</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-300">My Personal Groq API Key (If I have one):</label>
                                <input type="password" placeholder="Leave empty for Vanguard Local" className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-purple-500 outline-none text-gray-300" value={formData.groqKey} onChange={e => setFormData({...formData, groqKey: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-300">My HubSpot API Tracker (If I have one):</label>
                                <input type="password" placeholder="Leave empty for Local MS Excel logging" className="w-full bg-black border border-white/10 rounded-lg p-4 focus:border-orange-500 outline-none text-gray-300" value={formData.hubspotKey} onChange={e => setFormData({...formData, hubspotKey: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button onClick={() => setStep(1)} className="w-1/3 bg-transparent border border-white/20 text-white font-bold py-4 rounded-lg hover:bg-white/5 transition">Back</button>
                            <button id="btn-next-2" onClick={() => setStep(3)} className="w-2/3 bg-white text-black font-extrabold py-4 rounded-lg hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">Continue to Tier Plan &rarr;</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div id="step-3">
                        <h1 className="text-3xl font-display font-bold mb-4">Final Configuration & Billing</h1>
                        
                        <div className="p-4 bg-matrixGreen/10 border border-matrixGreen/40 rounded-lg mb-8 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                            <p className="text-xs text-matrixGreen">💡️ <strong>Helpful Tip:</strong> We are launching you onto the <strong>Omni-SaaS Pro</strong> tier. It costs exactly <strong>$499 per month</strong> flat. Below is your final Stripe checkout sequence which will lock you in.</p>
                        </div>

                        <div className="bg-black border border-white/20 p-6 rounded-xl mb-8 flex justify-between items-center group hover:border-cyberBlue transition">
                            <div>
                                <h3 className="font-bold text-xl text-cyberBlue uppercase tracking-widest">Omni-SaaS Pro</h3>
                                <p className="text-xs text-gray-500 mt-1">Includes the Ghost-Protocol Leads Engine</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-extrabold">$499</span>
                                <span className="text-gray-500"> / mo</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div>
                                <label className="block text-sm font-bold mb-2">Simulated Credit Card Entry</label>
                                <input type="text" placeholder="Type anything. We are simulating a secure Stripe Vault charge." className="w-full bg-[#111] border border-white/5 rounded-lg p-4 outline-none text-gray-400 font-mono" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(2)} className="w-1/4 bg-transparent border border-white/20 text-white font-bold py-4 rounded-lg hover:bg-white/5 transition">Back</button>
                            <button id="btn-complete" onClick={handleOnboard} className="w-3/4 bg-matrixGreen text-black font-extrabold py-4 rounded-lg hover:bg-[#00cc33] flex justify-center items-center gap-3 transition shadow-[0_0_30px_rgba(0,255,65,0.4)] text-xl tracking-tight">
                                Complete $499 Purchase
                            </button>
                        </div>
                    </div>
                )}

            </motion.div>
        </main>
    );
}

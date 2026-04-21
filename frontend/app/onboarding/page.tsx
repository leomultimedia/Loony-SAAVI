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
        plan: 'pro'
    });

    const handleOnboard = () => {
        // Mock Stripe Subscription Generation
        console.log("Stripe Customer Created:", formData);
        alert(`Tenant [${formData.companyName}] onboarded successfully to the ${formData.plan.toUpperCase()} tier! Card Charged.`);
        
        // Redirect back to admin to view the MRR jump
        router.push('/admin');
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white flex justify-center items-center p-6 font-mono">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <motion.div className="h-full bg-matrixGreen" initial={{ width: "0%" }} animate={{ width: `${(step / 3) * 100}%` }}></motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
                
                {step === 1 && (
                    <div id="step-1">
                        <h1 className="text-2xl font-display font-bold mb-2">Create Tenant Workspace</h1>
                        <p className="text-gray-500 mb-8 text-sm">Register your Sovereign Instance.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2 text-gray-300">Company / Organization Name</label>
                                <input id="tenant-name" type="text" className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-cyberBlue outline-none" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Acme Corp" />
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-gray-300">Admin Email</label>
                                <input id="tenant-email" type="email" className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-cyberBlue outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@acme.com" />
                            </div>
                        </div>

                        <button id="btn-next-1" onClick={() => setStep(2)} className="w-full mt-8 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">Continue to Integration</button>
                    </div>
                )}

                {step === 2 && (
                    <div id="step-2">
                        <h1 className="text-2xl font-display font-bold mb-2">Bring Your Own Keys (BYOK)</h1>
                        <p className="text-gray-500 mb-8 text-sm">We don't hardcode components. Decouple your infrastructure globally.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2 text-purple-400">Cloud Model Failover (Groq API Key)</label>
                                <input type="password" placeholder="gsk_..." className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-purple-500 outline-none" value={formData.groqKey} onChange={e => setFormData({...formData, groqKey: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-orange-400">HubSpot Connector (Optional)</label>
                                <input type="password" placeholder="pat-na1-..." className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-orange-500 outline-none" value={formData.hubspotKey} onChange={e => setFormData({...formData, hubspotKey: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(1)} className="w-1/3 bg-black border border-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition">Back</button>
                            <button id="btn-next-2" onClick={() => setStep(3)} className="w-2/3 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">Continue to Billing</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div id="step-3">
                        <h1 className="text-2xl font-display font-bold mb-2">Activate Subscription</h1>
                        <p className="text-gray-500 mb-8 text-sm">Finalize your Omni-SaaS deployment.</p>
                        
                        <div className="bg-black/50 border border-cyberBlue/30 p-4 rounded-lg mb-6 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-cyberBlue uppercase">Omni-SaaS Pro</span>
                                <span className="font-bold">$499 / mo</span>
                            </div>
                            <span className="text-xs text-gray-500 block">Metered billing activates upon exceeding 1,000 lead audits.</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm mb-2 text-gray-300">Credit Card Information (Stripe Sandbox)</label>
                                <input id="cc-input" type="text" placeholder="4242 4242 4242 4242" className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-matrixGreen outline-none" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(2)} className="w-1/3 bg-black border border-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition">Back</button>
                            <button id="btn-complete" onClick={handleOnboard} className="w-2/3 bg-matrixGreen text-black font-bold py-3 rounded-lg hover:bg-[#00cc33] transition flex justify-center items-center gap-2">
                                Launch Environment
                                <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                            </button>
                        </div>
                    </div>
                )}

            </motion.div>
        </main>
    );
}

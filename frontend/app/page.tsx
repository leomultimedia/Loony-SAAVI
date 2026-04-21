"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-matrixGreen selection:text-black">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
          <div className="text-xl font-display font-bold flex items-center gap-2">
            <div className="w-4 h-4 bg-matrixGreen rounded-full shadow-[0_0_15px_#00ff41]"></div>
            Vanguard Omni-SaaS
          </div>
          <div className="flex gap-6 items-center font-mono text-sm">
             <Link href="#pricing" className="hover:text-cyberBlue transition">Pricing</Link>
             <Link href="/login" className="hover:text-cyberBlue transition">Sign In</Link>
             <Link href="/onboarding" className="px-5 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
                Deploy Now
             </Link>
          </div>
      </nav>

      {/* Hero Section */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyberBlue/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight leading-tight">
                The Sovereign <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyberBlue to-purple-500">
                   Sales Infrastructure.
                </span>
            </h1>
            <p className="text-xl text-gray-400 font-mono mb-10 max-w-2xl mx-auto">
                No token costs. No data exfiltration. Build a world-class AI sales funnel mapped directly to your local hardware with military-grade encryption.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/onboarding" className="px-8 py-4 bg-matrixGreen text-black font-bold rounded-lg hover:bg-[#00cc33] transition shadow-[0_0_20px_rgba(0,255,65,0.4)] text-lg">
                   Start 14-Day Zero-Risk Trial
                </Link>
            </div>
          </motion.div>
      </section>

      {/* The World's Best Subscription Plan */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold">Unprecedented Control & Pricing</h2>
              <p className="text-gray-500 font-mono mt-4">Metered solely on successful pipeline generated. Not AI tokens.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Core Tier */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyberBlue/50 transition relative">
                  <h3 className="text-2xl font-bold font-display mb-2">Vanguard Edge</h3>
                  <p className="text-gray-400 text-sm h-12">For startups building locally.</p>
                  <div className="my-6">
                      <span className="text-5xl font-bold">$0</span>
                      <span className="text-gray-500 font-mono">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm font-mono text-gray-300">
                      <li className="flex items-center gap-3">✓ Unlimited Local Inferences</li>
                      <li className="flex items-center gap-3">✓ Community n8n Logic</li>
                      <li className="flex items-center gap-3">✓ Bring Your Own Keys (BYOK)</li>
                  </ul>
                  <Link href="/onboarding?plan=edge" className="block w-full py-3 text-center border border-white/20 rounded-lg hover:bg-white/5 transition font-bold">
                      Deploy Free
                  </Link>
              </div>

              {/* The "World's Best" Tier */}
              <div className="p-8 rounded-2xl border-2 border-matrixGreen bg-matrixGreen/[0.05] relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(0,255,65,0.1)]">
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-matrixGreen text-black px-4 py-1 text-xs font-bold rounded-full">
                      THE WORLD'S BEST
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-2">Omni-SaaS Pro</h3>
                  <p className="text-gray-400 text-sm h-12">The ultimate revenue engine.</p>
                  <div className="my-6">
                      <span className="text-5xl font-bold">$499</span>
                      <span className="text-gray-500 font-mono">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm font-mono text-gray-300">
                      <li className="flex items-center gap-3">✓ Zero-Knowledge Lead Vault</li>
                      <li className="flex items-center gap-3">✓ Dark Scarcity Speculative AI</li>
                      <li className="flex items-center gap-3">✓ Shadow Audit Engine (ISO/SSL)</li>
                      <li className="flex items-center gap-3">✓ Interactive Voice (TTFT)</li>
                  </ul>
                  <Link href="/onboarding?plan=pro" className="block w-full py-3 text-center bg-matrixGreen text-black rounded-lg hover:bg-[#00cc33] transition font-bold">
                      Launch Omni-Pro
                  </Link>
              </div>

              {/* Enterprise Tier */}
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-500/50 transition">
                  <h3 className="text-2xl font-bold font-display mb-2">Sovereign</h3>
                  <p className="text-gray-400 text-sm h-12">Full white-labeling & GCC Compliance.</p>
                  <div className="my-6">
                      <span className="text-5xl font-bold">$1,999</span>
                      <span className="text-gray-500 font-mono">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm font-mono text-gray-300">
                      <li className="flex items-center gap-3">✓ Dedicated Subdomains</li>
                      <li className="flex items-center gap-3">✓ Local UAE Cloud Hosting</li>
                      <li className="flex items-center gap-3">✓ SLA & Direct Support</li>
                  </ul>
                  <Link href="/onboarding?plan=sovereign" className="block w-full py-3 text-center border border-white/20 rounded-lg hover:bg-white/5 transition font-bold">
                      Contact Sales
                  </Link>
              </div>

          </div>
      </section>
    </main>
  );
}

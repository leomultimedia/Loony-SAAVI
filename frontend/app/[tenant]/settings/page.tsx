"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────
interface Integration { id: string; plugin: string; isEnabled: boolean; config: string }
interface Agent { id: string; agentName: string; isActive: boolean; model: string; vapiVoiceId?: string; persona: any }
interface SalesUser { id: string; name: string; email: string; phone?: string; role: string; _count?: { leads: number } }

// ── Plugin catalogue ──────────────────────────────────────────
const PLUGINS = [
  { key: 'WHATSAPP', label: 'WhatsApp Cloud API', icon: '💬', category: 'Communication',
    fields: [{ name: 'phoneNumberId', label: 'Phone Number ID', type: 'text' }, { name: 'wabaId', label: 'WABA ID', type: 'text' }, { name: 'accessToken', label: 'Permanent Access Token', type: 'password' }, { name: 'webhookVerifyToken', label: 'Webhook Verify Token', type: 'text' }],
    docUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api' },
  { key: 'VAPI', label: 'Vapi Voice AI', icon: '🎙️', category: 'Communication',
    fields: [{ name: 'apiKey', label: 'Vapi API Key', type: 'password' }, { name: 'assistantId', label: 'Default Assistant ID', type: 'text' }],
    docUrl: 'https://docs.vapi.ai' },
  { key: 'HUBSPOT', label: 'HubSpot CRM', icon: '🔗', category: 'CRM',
    fields: [{ name: 'accessToken', label: 'Private App Access Token', type: 'password' }, { name: 'portalId', label: 'Portal ID', type: 'text' }],
    docUrl: 'https://developers.hubspot.com' },
  { key: 'GSHEET', label: 'Google Sheets', icon: '📊', category: 'Data',
    fields: [{ name: 'serviceAccountJson', label: 'Service Account JSON', type: 'textarea' }, { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text' }, { name: 'sheetName', label: 'Sheet Name', type: 'text' }],
    docUrl: 'https://developers.google.com/sheets/api' },
  { key: 'CALCOM', label: 'Cal.com Scheduling', icon: '📅', category: 'Scheduling',
    fields: [{ name: 'apiKey', label: 'Cal.com API Key', type: 'password' }, { name: 'eventTypeId', label: 'Event Type ID', type: 'text' }, { name: 'username', label: 'Cal.com Username', type: 'text' }],
    docUrl: 'https://cal.com/docs/api-reference' },
  { key: 'STRIPE', label: 'Stripe Billing', icon: '💳', category: 'Billing',
    fields: [{ name: 'publishableKey', label: 'Publishable Key', type: 'text' }, { name: 'secretKey', label: 'Secret Key', type: 'password' }, { name: 'webhookSecret', label: 'Webhook Secret', type: 'password' }],
    docUrl: 'https://stripe.com/docs' },
  { key: 'GROQ', label: 'Groq Cloud LPU', icon: '⚡', category: 'AI Engine',
    fields: [{ name: 'apiKey', label: 'Groq API Key', type: 'password' }, { name: 'model', label: 'Default Model', type: 'select', options: ['llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'] }],
    docUrl: 'https://console.groq.com' },
  { key: 'OLLAMA', label: 'Ollama (Local LLM)', icon: '🖥️', category: 'AI Engine',
    fields: [{ name: 'endpoint', label: 'Ollama Endpoint', type: 'text' }, { name: 'model', label: 'Model Name', type: 'text' }],
    docUrl: 'https://ollama.ai' },
];

const AGENT_META: Record<string, { color: string; emoji: string; tagline: string }> = {
  Leo:   { color: '#ef4444', emoji: '🦁', tagline: 'Confident & Direct · Enterprise Deals' },
  Eva:   { color: '#8b5cf6', emoji: '🌸', tagline: 'Empathetic & Warm · SME Onboarding' },
  Lia:   { color: '#06b6d4', emoji: '🔬', tagline: 'Technical & Precise · ISO/Compliance' },
  James: { color: '#f59e0b', emoji: '🎯', tagline: 'Persuasive & Bold · Sales Closing' },
  Mary:  { color: '#10b981', emoji: '🌿', tagline: 'Friendly & Nurturing · Lead Qualification' },
};

const VOICE_IDS: Record<string, string> = {
  Leo: '11labs-will', Eva: '11labs-bella', Lia: '11labs-elli', James: '11labs-adam', Mary: '11labs-rachel',
};

// Safe fetch helper — never throws on empty/error responses
async function safeFetch(url: string, opts?: RequestInit) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function SettingsPage() {
  const { tenant } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PLUGINS' | 'AGENTS' | 'TEAM' | 'SECURITY'>('PLUGINS');
  const [tenantData, setTenantData] = useState<any>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);
  const [pluginConfigs, setPluginConfigs] = useState<Record<string, any>>({});
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'SALES_REP' });
  const [addingUser, setAddingUser] = useState(false);
  // Security toggles — must be hooks at component level, NOT inside .map()
  const [secPdpl, setSecPdpl] = useState(true);
  const [secAudit, setSecAudit] = useState(true);
  const [secAdhics, setSecAdhics] = useState(false);
  const [secZkp, setSecZkp] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vanguard_tenants') || '[]');
    const entity = stored[0] || { id: 'demo-tenant', name: 'Lear Cyber tech', email: 'admin@lct.com' };
    setTenantData(entity);
    const tid = entity.id;
    Promise.all([
      safeFetch(`/api/integrations?tenantId=${tid}`),
      safeFetch(`/api/agents?tenantId=${tid}`),
      safeFetch(`/api/sales-users?tenantId=${tid}`),
    ]).then(([ints, ags, users]) => {
      if (Array.isArray(ints)) setIntegrations(ints);
      if (Array.isArray(ags)) setAgents(ags);
      if (Array.isArray(users)) setSalesUsers(users);
    });
  }, []);

  const savePlugin = async (pluginKey: string, isEnabled: boolean) => {
    setSaving(pluginKey);
    const config = pluginConfigs[pluginKey] || {};
    const updated = await safeFetch('/api/integrations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenantData?.id, plugin: pluginKey, isEnabled, config }),
    });
    if (updated) setIntegrations(prev => prev.map(i => i.plugin === pluginKey ? updated : i));
    else setIntegrations(prev => prev.map(i => i.plugin === pluginKey ? { ...i, isEnabled } : i));
    setSaving(null);
  };

  const toggleAgent = async (agentName: string, isActive: boolean) => {
    setSaving(agentName);
    await safeFetch('/api/agents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenantData?.id, agentName, isActive }),
    });
    setAgents(prev => prev.map(a => a.agentName === agentName ? { ...a, isActive } : a));
    setSaving(null);
  };

  const saveAgentModel = async (agentName: string, model: string) => {
    await safeFetch('/api/agents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenantData?.id, agentName, model, vapiVoiceId: VOICE_IDS[agentName] }),
    });
    setAgents(prev => prev.map(a => a.agentName === agentName ? { ...a, model } : a));
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);
    const user = await safeFetch('/api/sales-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newUser, tenantId: tenantData?.id }),
    });
    if (user) setSalesUsers(prev => [user, ...prev]);
    setNewUser({ name: '', email: '', phone: '', role: 'SALES_REP' });
    setAddingUser(false);
  };

  const removeUser = async (id: string) => {
    await fetch(`/api/sales-users?id=${id}`, { method: 'DELETE' });
    setSalesUsers(prev => prev.filter(u => u.id !== id));
  };

  const pluginIntegration = (key: string) => integrations.find(i => i.plugin === key);

  const tabs = [
    { key: 'PLUGINS', label: 'Integrations', icon: '🔌' },
    { key: 'AGENTS', label: 'AI Agents', icon: '🤖' },
    { key: 'TEAM', label: 'Sales Team', icon: '👥' },
    { key: 'SECURITY', label: 'Security', icon: '🛡️' },
  ] as const;

  return (
    <main className="min-h-screen bg-transparent p-8 font-sans text-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <nav className="flex items-center gap-3 mb-2 text-[10px] font-mono text-gray-500 uppercase">
          <button onClick={() => router.push(`/${tenant}/dashboard`)} className="hover:text-white transition">← Dashboard</button>
          <span>/</span>
          <span className="text-red-400">Settings</span>
        </nav>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Tenant <span className="text-red-500">Settings</span></h1>
            <p className="text-gray-500 text-xs font-mono mt-2">{tenantData?.name} · {tenantData?.email}</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 glass-panel rounded-xl font-mono text-xs text-center">
              <p className="text-matrixGreen font-black">{integrations.filter(i => i.isEnabled).length}/{PLUGINS.length}</p>
              <p className="text-gray-500 uppercase tracking-widest mt-0.5">Plugins Active</p>
            </div>
            <div className="px-6 py-3 glass-panel rounded-xl font-mono text-xs text-center">
              <p className="text-cyberBlue font-black">{agents.filter(a => a.isActive).length}</p>
              <p className="text-gray-500 uppercase tracking-widest mt-0.5">Agents Online</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 glass-panel p-1.5 rounded-2xl mb-10 w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-2 ${activeTab === t.key ? 'bg-red-500 text-black' : 'text-gray-500 hover:text-white'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── PLUGINS TAB ──────────────────────────────────── */}
        {activeTab === 'PLUGINS' && (
          <div className="space-y-4">
            {['Communication', 'CRM', 'Data', 'Scheduling', 'Billing', 'AI Engine'].map(cat => {
              const catPlugins = PLUGINS.filter(p => p.category === cat);
              return (
                <div key={cat}>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3">{cat}</h3>
                  <div className="space-y-3">
                    {catPlugins.map(plugin => {
                      const integration = pluginIntegration(plugin.key);
                      const isEnabled = integration?.isEnabled ?? false;
                      const existingConfig = integration?.config ? JSON.parse(integration.config) : {};
                      const localConfig = pluginConfigs[plugin.key] || existingConfig;
                      const isExpanded = expandedPlugin === plugin.key;

                      return (
                        <div key={plugin.key} className={`glass-panel rounded-3xl border transition ${isEnabled ? 'border-matrixGreen/20' : 'border-white/5'}`}>
                          <div className="flex items-center gap-6 p-6 cursor-pointer" onClick={() => setExpandedPlugin(isExpanded ? null : plugin.key)}>
                            <span className="text-3xl">{plugin.icon}</span>
                            <div className="flex-1">
                              <p className="font-black text-sm">{plugin.label}</p>
                              <a href={plugin.docUrl} target="_blank" className="text-[10px] text-gray-500 hover:text-cyberBlue transition font-mono" onClick={e => e.stopPropagation()}>
                                {plugin.docUrl} ↗
                              </a>
                            </div>
                            <div className="flex items-center gap-4">
                              {saving === plugin.key && <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>}
                              <button
                                onClick={e => { e.stopPropagation(); savePlugin(plugin.key, !isEnabled); }}
                                className={`w-14 h-7 rounded-full relative transition ${isEnabled ? 'bg-matrixGreen' : 'bg-white/10'}`}>
                                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${isEnabled ? 'left-7' : 'left-0.5'}`}></div>
                              </button>
                              <span className={`text-[9px] font-black uppercase ${isEnabled ? 'text-matrixGreen' : 'text-gray-600'}`}>{isEnabled ? 'LIVE' : 'OFF'}</span>
                              <span className="text-gray-600 text-sm">{isExpanded ? '▲' : '▼'}</span>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-6">
                                  {plugin.fields.map(field => (
                                    <div key={field.name}>
                                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">{field.label}</label>
                                      {field.type === 'textarea' ? (
                                        <textarea
                                          rows={4}
                                          placeholder={`Paste ${field.label} here...`}
                                          defaultValue={localConfig[field.name] || ''}
                                          onChange={e => setPluginConfigs(prev => ({ ...prev, [plugin.key]: { ...prev[plugin.key], [field.name]: e.target.value } }))}
                                          className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-mono focus:border-red-500 outline-none resize-none"
                                        />
                                      ) : field.type === 'select' ? (
                                        <select
                                          defaultValue={localConfig[field.name] || field.options![0]}
                                          onChange={e => setPluginConfigs(prev => ({ ...prev, [plugin.key]: { ...prev[plugin.key], [field.name]: e.target.value } }))}
                                          className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none appearance-none">
                                          {field.options!.map(o => <option key={o}>{o}</option>)}
                                        </select>
                                      ) : (
                                        <input
                                          type={field.type}
                                          placeholder={field.type === 'password' ? '••••••••••••' : `Enter ${field.label}...`}
                                          defaultValue={localConfig[field.name] || ''}
                                          onChange={e => setPluginConfigs(prev => ({ ...prev, [plugin.key]: { ...prev[plugin.key], [field.name]: e.target.value } }))}
                                          className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none"
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => savePlugin(plugin.key, true)}
                                    className="px-6 py-3 bg-red-500 text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-red-400 transition">
                                    Save & Enable Plugin
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── AGENTS TAB ──────────────────────────────────── */}
        {activeTab === 'AGENTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Leo', 'Eva', 'Lia', 'James', 'Mary'].map(name => {
              const agent = agents.find(a => a.agentName === name);
              const meta = AGENT_META[name];
              return (
                <motion.div key={name} whileHover={{ scale: 1.02 }} className={`glass-panel rounded-[2.5rem] p-8 border transition ${agent?.isActive ? 'border-red-500/40' : 'border-white/5'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}40` }}>
                        {meta.emoji}
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{name}</h3>
                        <p className="text-[9px] text-gray-500 font-mono">{meta.tagline}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAgent(name, !agent?.isActive)}
                      className={`w-12 h-6 rounded-full relative transition flex-shrink-0 ${agent?.isActive ? 'bg-matrixGreen' : 'bg-white/10'}`}>
                      {saving === name && <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>}
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${agent?.isActive ? 'left-6' : 'left-0.5'}`}></div>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">AI Model</label>
                      <select
                        value={agent?.model || 'llama3'}
                        onChange={e => saveAgentModel(name, e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs focus:border-red-500 outline-none appearance-none">
                        <option value="llama3">Ollama · Llama-3-8B (Local)</option>
                        <option value="llama3-70b">Ollama · Llama-3-70B (Local GPU)</option>
                        <option value="groq/llama3-70b-8192">Groq · Llama-3-70B (Cloud)</option>
                        <option value="gpt-4o">OpenAI · GPT-4o (Cloud)</option>
                      </select>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl font-mono text-[9px] text-gray-500">
                      Voice: {VOICE_IDS[name]} <span className="text-cyberBlue">(Vapi)</span><br/>
                      Leads handled: {agent ? '—' : '0'}<br />
                      Status: <span className={agent?.isActive ? 'text-matrixGreen' : 'text-gray-600'}>{agent?.isActive ? 'ONLINE' : 'STANDBY'}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── TEAM TAB ──────────────────────────────────── */}
        {activeTab === 'TEAM' && (
          <div className="space-y-8">
            {/* Add User Form */}
            <div className="glass-panel iron-glow rounded-3xl p-8">
              <h3 className="font-black text-lg mb-6 uppercase tracking-tight">Add Sales Team Member</h3>
              <form onSubmit={addUser} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input required value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full Name" className="bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none" />
                <input required type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                  placeholder="Email" className="bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none" />
                <input value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone (Optional)" className="bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none" />
                <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                  className="bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none appearance-none">
                  <option value="SALES_REP">Sales Rep</option>
                  <option value="TENANT_ADMIN">Tenant Admin</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                <button type="submit" disabled={addingUser} className="md:col-span-4 py-4 bg-red-500 text-black font-black rounded-xl uppercase text-xs tracking-widest hover:bg-red-400 transition disabled:opacity-50">
                  {addingUser ? 'Adding...' : '+ Add Team Member'}
                </button>
              </form>
            </div>

            {/* Team Table */}
            <div className="glass-panel iron-glow rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-black/40 border-b border-white/10">
                  <tr className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    <th className="p-5 text-left">Name</th>
                    <th className="p-5 text-left">Email</th>
                    <th className="p-5 text-left">Role</th>
                    <th className="p-5 text-left">Leads</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesUsers.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-600 italic font-mono text-xs">No team members added yet.</td></tr>
                  )}
                  {salesUsers.map(u => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-5 font-bold">{u.name}</td>
                      <td className="p-5 text-gray-400 font-mono text-xs">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'TENANT_ADMIN' ? 'bg-purple-500/10 text-purple-400' : u.role === 'VIEWER' ? 'bg-white/10 text-gray-400' : 'bg-cyberBlue/10 text-cyberBlue'}`}>{u.role.replace('_', ' ')}</span>
                      </td>
                      <td className="p-5 font-bold">{u._count?.leads ?? 0}</td>
                      <td className="p-5 text-right">
                        <button onClick={() => removeUser(u.id)} className="px-4 py-2 glass-panel rounded-lg text-[10px] font-black text-red-500 hover:bg-red-500 hover:text-black transition uppercase">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SECURITY TAB ──────────────────────────────── */}
        {activeTab === 'SECURITY' && (
          <div className="space-y-6 max-w-2xl">
            {[
              { label: 'GDPR / UAE PDPL Shield', desc: 'Auto-redacts PII (phone, email) before AI processing. Required for TDRA compliance.', on: secPdpl, set: setSecPdpl },
              { label: 'ISO 27001 Audit Logging', desc: 'Every automated message logged with timestamp and confidence score.', on: secAudit, set: setSecAudit },
              { label: 'ADHICS V2.0 Compliance Mode', desc: 'Maps lead conversations to health sector standards automatically.', on: secAdhics, set: setSecAdhics },
              { label: 'Zero-Knowledge AI Inference', desc: 'Processed locally — no data sent to external models without explicit BYOK.', on: secZkp, set: setSecZkp },
            ].map(item => (
              <div key={item.label} className="glass-panel rounded-3xl p-8 flex items-center gap-8">
                <div className="flex-1">
                  <p className="font-black">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{item.desc}</p>
                </div>
                <button onClick={() => item.set(!item.on)} className={`w-14 h-7 rounded-full relative transition flex-shrink-0 ${item.on ? 'bg-matrixGreen' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${item.on ? 'left-7' : 'left-0.5'}`}></div>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

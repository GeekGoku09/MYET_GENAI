import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Role, Industry, Geography, FormatPreference, TimeAvailable } from '../types';
import { MOCK_COMPANIES, TOPICS, PEOPLE } from '../mockData';
import { Check, ChevronRight, Briefcase, Globe, BarChart3, Clock, Layout, Search, Plus, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const ROLES: Role[] = ['Investor', 'Founder', 'Executive', 'Policy Analyst', 'Student', 'Journalist', 'Other'];
const INDUSTRIES: Industry[] = ['FinTech', 'Energy', 'AI & Tech', 'Healthcare', 'Markets', 'Real Estate', 'Manufacturing', 'Global Trade'];
const GEOGRAPHIES: Geography[] = ['India', 'USA', 'Europe', 'Asia-Pacific', 'Global'];
const FORMATS: { id: FormatPreference; label: string; icon: string }[] = [
  { id: 'Narrative', label: 'Narrative story', icon: '📰' },
  { id: 'Data-first', label: 'Data-first', icon: '📊' },
  { id: 'Bullet summary', label: 'Bullet summary', icon: '🧵' },
  { id: 'Podcast-style', label: 'Podcast-style', icon: '🎙' },
];
const TIMES: TimeAvailable[] = ['< 5 min', '10–15 min', '30+ min'];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    role: 'Investor',
    industries: [],
    geography: 'India',
    depth: 50,
    format: 'Narrative',
    timeAvailable: '10–15 min',
    watchlistCompanies: [],
    watchlistTopics: [],
    watchlistPeople: [],
    isInvestor: false,
    portfolio: [],
  });

  const [companySearch, setCompanySearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const msgs = [
      "Calibrating your intelligence layer...",
      "Mapping 3,400 stories to your profile...",
      "Building your briefing...",
    ];
    for (const msg of msgs) {
      setLoadingMsg(msg);
      await new Promise(r => setTimeout(r, 800));
    }
    onComplete(profile);
  };

  const toggleIndustry = (ind: Industry) => {
    setProfile(p => ({
      ...p,
      industries: p.industries.includes(ind)
        ? p.industries.filter(i => i !== ind)
        : [...p.industries, ind],
    }));
  };

  const toggleCompany = (comp: string) => {
    setProfile(p => ({
      ...p,
      watchlistCompanies: p.watchlistCompanies.includes(comp)
        ? p.watchlistCompanies.filter(c => c !== comp)
        : [...p.watchlistCompanies, comp],
    }));
  };

  const toggleTopic = (top: string) => {
    setProfile(p => ({
      ...p,
      watchlistTopics: p.watchlistTopics.includes(top)
        ? p.watchlistTopics.filter(t => t !== top)
        : [...p.watchlistTopics, top],
    }));
  };

  const togglePerson = (per: string) => {
    setProfile(p => ({
      ...p,
      watchlistPeople: p.watchlistPeople.includes(per)
        ? p.watchlistPeople.filter(p => p !== per)
        : [...p.watchlistPeople, per],
    }));
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0F] flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
        <motion.p
          key={loadingMsg}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-medium text-gray-300"
        >
          {loadingMsg}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Who are you?</h1>
                <p className="text-gray-400">We'll tailor your newsroom to your professional identity.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#1A1A26] border border-[#2A2A3A] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Your Role</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ROLES.map(role => (
                      <button
                        key={role}
                        onClick={() => setProfile({ ...profile, role })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          profile.role === role
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Industries of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind}
                        onClick={() => toggleIndustry(ind)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          profile.industries.includes(ind)
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Geography Focus</label>
                  <div className="flex flex-wrap gap-2">
                    {GEOGRAPHIES.map(geo => (
                      <button
                        key={geo}
                        onClick={() => setProfile({ ...profile, geography: geo })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          profile.geography === geo
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {geo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!profile.name || profile.industries.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                Next Step <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Your reading style</h1>
                <p className="text-gray-400">How do you prefer to consume information?</p>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                    <span>Give me headlines</span>
                    <span>Deep analysis</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={profile.depth}
                    onChange={e => setProfile({ ...profile, depth: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Preferred Format</label>
                  <div className="grid grid-cols-2 gap-4">
                    {FORMATS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setProfile({ ...profile, format: f.id })}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          profile.format === f.id
                            ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-[#1A1A26] border-[#2A2A3A] hover:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{f.icon}</span>
                        <span className={`font-bold block ${profile.format === f.id ? 'text-white' : 'text-gray-400'}`}>
                          {f.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Time available per session</label>
                  <div className="flex gap-3">
                    {TIMES.map(t => (
                      <button
                        key={t}
                        onClick={() => setProfile({ ...profile, timeAvailable: t })}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                          profile.timeAvailable === t
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-transparent border border-[#2A2A3A] text-gray-400 font-bold py-4 rounded-xl transition-all">Back</button>
                <button onClick={nextStep} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">Next Step <ChevronRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Your watchlist</h1>
                <p className="text-gray-400">Track the entities that drive your world.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Add Companies</label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={companySearch}
                      onChange={e => setCompanySearch(e.target.value)}
                      placeholder="Search companies (e.g. Reliance, TCS)"
                      className="w-full bg-[#1A1A26] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                    {MOCK_COMPANIES.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase())).map(comp => (
                      <button
                        key={comp.id}
                        onClick={() => toggleCompany(comp.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          profile.watchlistCompanies.includes(comp.name)
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {profile.watchlistCompanies.includes(comp.name) ? <Check size={12} /> : <Plus size={12} />}
                        {comp.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Add Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map(topic => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          profile.watchlistTopics.includes(topic)
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {profile.watchlistTopics.includes(topic) ? <Check size={12} /> : <Plus size={12} />}
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Follow People</label>
                  <div className="flex flex-wrap gap-2">
                    {PEOPLE.map(person => (
                      <button
                        key={person}
                        onClick={() => togglePerson(person)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          profile.watchlistPeople.includes(person)
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-[#1A1A26] border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {profile.watchlistPeople.includes(person) ? <Check size={12} /> : <Plus size={12} />}
                        {person}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-transparent border border-[#2A2A3A] text-gray-400 font-bold py-4 rounded-xl transition-all">Back</button>
                <button onClick={nextStep} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">Next Step <ChevronRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Your portfolio context</h1>
                <p className="text-gray-400">Personalize news for your specific holdings.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#1A1A26] border border-[#2A2A3A] rounded-2xl">
                  <div>
                    <h3 className="font-bold">Investor Mode</h3>
                    <p className="text-sm text-gray-500">Flag news that directly affects your holdings.</p>
                  </div>
                  <button
                    onClick={() => setProfile({ ...profile, isInvestor: !profile.isInvestor })}
                    className={`w-12 h-6 rounded-full transition-all relative ${profile.isInvestor ? 'bg-blue-500' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.isInvestor ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {profile.isInvestor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Add Tickers & Allocation</p>
                    {[0, 1, 2].map(i => (
                      <div key={i} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Ticker (e.g. RELIANCE)"
                          className="flex-[2] bg-[#1A1A26] border border-[#2A2A3A] rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
                          value={profile.portfolio[i]?.ticker || ''}
                          onChange={e => {
                            const newPort = [...profile.portfolio];
                            newPort[i] = { ticker: e.target.value.toUpperCase(), allocation: newPort[i]?.allocation || 0 };
                            setProfile({ ...profile, portfolio: newPort });
                          }}
                        />
                        <input
                          type="number"
                          placeholder="%"
                          className="flex-1 bg-[#1A1A26] border border-[#2A2A3A] rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
                          value={profile.portfolio[i]?.allocation || ''}
                          onChange={e => {
                            const newPort = [...profile.portfolio];
                            newPort[i] = { ticker: newPort[i]?.ticker || '', allocation: parseInt(e.target.value) || 0 };
                            setProfile({ ...profile, portfolio: newPort });
                          }}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-transparent border border-[#2A2A3A] text-gray-400 font-bold py-4 rounded-xl transition-all">Back</button>
                <button onClick={nextStep} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">Next Step <ChevronRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Confirm & generate</h1>
                <p className="text-gray-400">Your personalized newsroom is ready to be built.</p>
              </div>

              <div className="bg-[#1A1A26] border border-[#2A2A3A] rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Identity</label>
                    <p className="font-bold text-lg">{profile.name}</p>
                    <p className="text-blue-400 text-sm">{profile.role}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Geography</label>
                    <p className="font-bold text-lg">{profile.geography}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-2">Sectors</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.industries.map(ind => (
                      <span key={ind} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{ind}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Style</label>
                    <p className="font-bold">{profile.format}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Time</label>
                    <p className="font-bold">{profile.timeAvailable}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-transparent border border-[#2A2A3A] text-gray-400 font-bold py-4 rounded-xl transition-all">Back</button>
                <button onClick={handleGenerate} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20">Generate My Newsroom →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, Filter, Save, Share2, MessageSquare, BarChart2, 
  ChevronRight, ChevronDown, Plus, X, Send, ThumbsUp, ThumbsDown, 
  Bookmark, RefreshCw, LayoutGrid, List, FileText, TrendingUp, 
  TrendingDown, Globe, Briefcase, Activity, Brain, Info
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import { UserProfile, Article, Company, MarketIndex, Message, FormatPreference, UserEngagement, ProcessingStep, Industry } from './types';
import { MOCK_ARTICLES, MOCK_COMPANIES, MOCK_INDICES, TOPICS, PEOPLE } from './mockData';
import { callClaude, getSystemPrompt, rankArticles, generateSynthesis } from './services/aiService';

// --- Main App Component ---

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState('briefing');
  const [focusedItem, setFocusedItem] = useState<any>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const [briefingFormat, setBriefingFormat] = useState<FormatPreference>('Narrative');
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingContent, setBriefingContent] = useState<string>('');
  const [feedFilter, setFeedFilter] = useState('All');
  const [visibleArticles, setVisibleArticles] = useState(10);
  const [aiChatMessages, setAiChatMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your ET Intelligence assistant. How can I help you navigate today's markets?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [engagement, setEngagement] = useState<UserEngagement>({
    clickedIds: [],
    savedIds: [],
    preferredSectors: {}
  });
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 'ingest', label: 'Ingesting News', status: 'pending' },
    { id: 'extract', label: 'Entity Extraction', status: 'pending' },
    { id: 'rank', label: 'Personalized Ranking', status: 'pending' },
    { id: 'synthesize', label: 'AI Synthesis', status: 'pending' }
  ]);
  const [briefingLanguage, setBriefingLanguage] = useState('English');

  // --- Effects ---

  useEffect(() => {
    if (profile) {
      generateBriefing();
    }
  }, [profile, briefingFormat]);

  // --- Handlers ---

  const generateBriefing = async () => {
    if (!profile) return;
    setIsBriefingLoading(true);
    
    // Reset processing steps
    setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    try {
      // Step 1: Ingest
      setProcessingSteps(prev => prev.map(s => s.id === 'ingest' ? { ...s, status: 'processing' } : s));
      await new Promise(r => setTimeout(r, 600));
      setProcessingSteps(prev => prev.map(s => s.id === 'ingest' ? { ...s, status: 'completed' } : s));

      // Step 2: Extract (Mocked as completed since data has entities)
      setProcessingSteps(prev => prev.map(s => s.id === 'extract' ? { ...s, status: 'processing' } : s));
      await new Promise(r => setTimeout(r, 800));
      setProcessingSteps(prev => prev.map(s => s.id === 'extract' ? { ...s, status: 'completed' } : s));

      // Step 3: Rank
      setProcessingSteps(prev => prev.map(s => s.id === 'rank' ? { ...s, status: 'processing' } : s));
      const ranked = rankArticles(MOCK_ARTICLES, profile, engagement);
      await new Promise(r => setTimeout(r, 1000));
      setProcessingSteps(prev => prev.map(s => s.id === 'rank' ? { ...s, status: 'completed' } : s));

      // Step 4: Synthesize
      setProcessingSteps(prev => prev.map(s => s.id === 'synthesize' ? { ...s, status: 'processing' } : s));
      const topArticles = ranked.slice(0, 5);
      const response = await generateSynthesis(topArticles, profile, briefingFormat, briefingLanguage);
      setBriefingContent(response);
      setProcessingSteps(prev => prev.map(s => s.id === 'synthesize' ? { ...s, status: 'completed' } : s));
    } catch (error) {
      console.error(error);
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: s.status === 'processing' ? 'error' : s.status })));
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !profile) return;

    const userMsg: Message = { role: 'user', content: chatInput };
    setAiChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const context = `Current news: ${MOCK_ARTICLES.slice(0, 5).map(a => a.headline).join(', ')}`;
      const response = await callClaude(getSystemPrompt(profile, context), [...aiChatMessages, userMsg]);
      setAiChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    const isSaved = savedArticles.includes(id);
    setSavedArticles(prev => isSaved ? prev.filter(i => i !== id) : [...prev, id]);
    
    // Track engagement
    if (!isSaved) {
      const article = MOCK_ARTICLES.find(a => a.id === id);
      if (article) {
        setEngagement(prev => ({
          ...prev,
          savedIds: [...prev.savedIds, id],
          preferredSectors: {
            ...prev.preferredSectors,
            [article.sector]: (prev.preferredSectors[article.sector] || 0) + 2
          }
        }));
      }
    }
  };

  const trackClick = (id: string) => {
    if (!engagement.clickedIds.includes(id)) {
      const article = MOCK_ARTICLES.find(a => a.id === id);
      if (article) {
        setEngagement(prev => ({
          ...prev,
          clickedIds: [...prev.clickedIds, id],
          preferredSectors: {
            ...prev.preferredSectors,
            [article.sector]: (prev.preferredSectors[article.sector] || 0) + 1
          }
        }));
      }
    }
  };

  const rankedArticles = useMemo(() => {
    if (!profile) return MOCK_ARTICLES;
    return rankArticles(MOCK_ARTICLES, profile, engagement);
  }, [profile, engagement]);

  // --- Render Helpers ---

  if (!profile) {
    return <Onboarding onComplete={setProfile} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* Sidebar */}
      <Sidebar 
        user={profile} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onReset={() => setProfile(null)} 
      />

      {/* Main Content */}
      <main className="flex-1 ml-[240px] mr-[300px] min-h-screen relative">
        {/* Header */}
        <header className="h-20 border-b border-[#2A2A3A] flex items-center justify-between px-8 sticky top-0 bg-[#0A0A0F]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize">{activeSection.replace('-', ' ')}</h2>
            <div className="h-4 w-px bg-[#2A2A3A]" />
            <p className="text-sm text-gray-500 font-medium">March 29, 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search intelligence..." 
                className="bg-[#1A1A26] border border-[#2A2A3A] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button className="p-2 bg-[#1A1A26] border border-[#2A2A3A] rounded-xl text-gray-400 hover:text-white transition-all relative">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#1A1A26]" />
            </button>
          </div>
        </header>

        {/* Section Content */}
        <div className="p-8 pb-24">
          <AnimatePresence mode="wait">
            {activeSection === 'briefing' && (
              <motion.div 
                key="briefing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Good morning, {profile.name.split(' ')[0]}.</h1>
                    <p className="text-gray-500 mt-1">Here's what matters to you today — 6 signals across your priority sectors.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex bg-[#1A1A26] p-1 rounded-xl border border-[#2A2A3A]">
                      {['English', 'Hindi', 'Marathi', 'Gujarati'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => {
                            setBriefingLanguage(lang);
                            generateBriefing();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${briefingLanguage === lang ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="flex bg-[#1A1A26] p-1 rounded-xl border border-[#2A2A3A]">
                      {[
                        { id: 'Narrative', icon: FileText },
                        { id: 'Data-first', icon: BarChart2 },
                        { id: 'Bullet summary', icon: List },
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setBriefingFormat(f.id as FormatPreference)}
                          className={`p-2 rounded-lg transition-all ${briefingFormat === f.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                          title={f.id}
                        >
                          <f.icon size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#1A1A26] border border-[#2A2A3A] rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
                    <Brain size={120} className="text-blue-500" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        <Brain size={16} />
                        AI Intelligence Briefing
                      </div>
                      
                      {/* Agentic Pipeline Status */}
                      <div className="flex items-center gap-4">
                        {processingSteps.map((step) => (
                          <div key={step.id} className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              step.status === 'completed' ? 'bg-emerald-500' : 
                              step.status === 'processing' ? 'bg-blue-500 animate-pulse' : 
                              step.status === 'error' ? 'bg-rose-500' : 'bg-gray-700'
                            }`} />
                            <span className={`text-[9px] font-bold uppercase tracking-tighter ${
                              step.status === 'completed' ? 'text-emerald-500' : 
                              step.status === 'processing' ? 'text-blue-500' : 'text-gray-600'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isBriefingLoading ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-gray-800 rounded w-3/4" />
                        <div className="h-4 bg-gray-800 rounded w-full" />
                        <div className="h-4 bg-gray-800 rounded w-5/6" />
                      </div>
                    ) : (
                      <p className="text-xl leading-relaxed text-gray-200 font-medium">
                        {briefingContent || "Generating your personalized briefing..."}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      {rankedArticles.slice(0, 3).map(art => (
                        <div 
                          key={art.id} 
                          onMouseEnter={() => setFocusedItem(art)}
                          onClick={() => trackClick(art.id)}
                          className="p-4 bg-[#0A0A0F] border border-[#2A2A3A] rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{art.relevance}</span>
                            <div className={`w-2 h-2 rounded-full ${art.sentiment === 'Bullish' ? 'bg-emerald-400' : art.sentiment === 'Bearish' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                          </div>
                          <h4 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{art.headline}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2">{art.summary}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button 
                        onClick={generateBriefing}
                        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-400 transition-all"
                      >
                        <RefreshCw size={14} className={isBriefingLoading ? 'animate-spin' : ''} />
                        REGENERATE BRIEFING
                      </button>
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all">
                        FULL ANALYSIS →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'feed' && (
              <motion.div 
                key="feed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['All', 'Portfolio Alerts', 'My Sectors', 'My Watchlist', 'Trending', 'Deep Reads'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFeedFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          feedFilter === f 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-[#1A1A26] border border-[#2A2A3A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <button className="p-2 bg-[#1A1A26] border border-[#2A2A3A] rounded-xl text-gray-400">
                    <Filter size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {rankedArticles
                    .filter(art => {
                      if (feedFilter === 'All') return true;
                      if (feedFilter === 'Portfolio Alerts') return art.relevance === 'Portfolio Alert';
                      if (feedFilter === 'My Sectors') return profile.industries.includes(art.sector);
                      if (feedFilter === 'My Watchlist') return art.relevance === 'Watchlist';
                      return true;
                    })
                    .slice(0, visibleArticles).map(art => (
                    <motion.div 
                      key={art.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onMouseEnter={() => setFocusedItem(art)}
                      onClick={() => trackClick(art.id)}
                      className={`p-6 bg-[#1A1A26] border-l-4 rounded-2xl border border-[#2A2A3A] hover:border-blue-500/30 transition-all group ${
                        art.sentiment === 'Bullish' ? 'border-l-emerald-500' : art.sentiment === 'Bearish' ? 'border-l-rose-500' : 'border-l-amber-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">{art.category}</span>
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{art.relevance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-medium">
                          <span>{art.source}</span>
                          <span>•</span>
                          <span>{art.timeAgo}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{art.headline}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">{art.summary}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleSave(art.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all ${savedArticles.includes(art.id) ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            <Bookmark size={14} fill={savedArticles.includes(art.id) ? 'currentColor' : 'none'} />
                            {savedArticles.includes(art.id) ? 'SAVED' : 'SAVE'}
                          </button>
                          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-300 transition-all">
                            <Share2 size={14} />
                            SHARE
                          </button>
                          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-300 transition-all">
                            <BarChart2 size={14} />
                            DATA
                          </button>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                          <Brain size={14} />
                          ASK AI
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {visibleArticles < rankedArticles.length && (
                  <button 
                    onClick={() => setVisibleArticles(v => v + 5)}
                    className="w-full py-4 bg-[#1A1A26] border border-[#2A2A3A] rounded-2xl text-sm font-bold text-gray-500 hover:text-white hover:border-gray-600 transition-all"
                  >
                    LOAD MORE STORIES
                  </button>
                )}
              </motion.div>
            )}

            {activeSection === 'watchlist' && (
              <motion.div 
                key="watchlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_COMPANIES.map(comp => (
                    <div 
                      key={comp.id}
                      onMouseEnter={() => setFocusedItem(comp)}
                      className="p-6 bg-[#1A1A26] border border-[#2A2A3A] rounded-3xl hover:border-blue-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center font-bold text-lg text-blue-400">
                          {comp.logo}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{comp.price.toLocaleString()}</p>
                          <p className={`text-xs font-bold ${comp.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {comp.change >= 0 ? '+' : ''}{comp.change}%
                          </p>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{comp.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">{comp.description}</p>
                      
                      <div className="pt-4 border-t border-[#2A2A3A] space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <span>Sentiment</span>
                          <span className={comp.sentiment > 50 ? 'text-emerald-400' : 'text-rose-400'}>{comp.sentiment}%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${comp.sentiment > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${comp.sentiment}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'markets' && (
              <motion.div 
                key="markets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_INDICES.map(idx => (
                    <div key={idx.name} className="p-4 bg-[#1A1A26] border border-[#2A2A3A] rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{idx.name}</span>
                        <span className={`text-xs font-bold ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {idx.change >= 0 ? '+' : ''}{idx.changePercent}%
                        </span>
                      </div>
                      <p className="text-xl font-bold mb-4">{idx.value.toLocaleString()}</p>
                      <div className="h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={idx.sparkline}>
                            <defs>
                              <linearGradient id={`grad-${idx.name}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={idx.change >= 0 ? '#10B981' : '#F43F5E'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={idx.change >= 0 ? '#10B981' : '#F43F5E'} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke={idx.change >= 0 ? '#10B981' : '#F43F5E'} 
                              fillOpacity={1} 
                              fill={`url(#grad-${idx.name})`} 
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#1A1A26] border border-[#2A2A3A] rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Market Performance</h3>
                    <select className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-4 py-2 text-sm font-bold focus:outline-none">
                      <option>Nifty 50</option>
                      <option>Sensex</option>
                      <option>Nifty Bank</option>
                    </select>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_INDICES[1].sparkline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1A1A26', border: '1px solid #2A2A3A', borderRadius: '12px' }}
                          itemStyle={{ color: '#3B82F6' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'digest' && (
              <motion.div 
                key="digest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-160px)]"
              >
                {/* Left: Digest Panels */}
                <div className="space-y-6 overflow-y-auto pr-4 no-scrollbar">
                  <div className="p-6 bg-[#1A1A26] border border-[#2A2A3A] rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        <Activity size={16} />
                        Today's Thesis
                      </div>
                      <button className="text-gray-500 hover:text-white transition-all"><RefreshCw size={14} /></button>
                    </div>
                    <h3 className="text-lg font-bold">The AI-Manufacturing Convergence</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Observation: PLI schemes are maturing just as GenAI reaches enterprise scale in India.<br/><br/>
                      Implication: Manufacturing margins could expand by 400bps through predictive maintenance and automated supply chains.<br/><br/>
                      Action Signal: Overweight industrial tech and specialized EMS providers.
                    </p>
                  </div>

                  <div className="p-6 bg-[#1A1A26] border border-rose-500/20 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
                        <ThumbsDown size={16} />
                        Contrarian View
                      </div>
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded text-[10px] font-bold">DEVIL'S ADVOCATE</span>
                    </div>
                    <h3 className="text-lg font-bold">The Case for a Market Correction</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      While the Nifty hits record highs, the mid-cap valuation premium is at a 10-year peak. Historical patterns suggest a 10-15% mean reversion is overdue.
                    </p>
                  </div>

                  <div className="p-6 bg-[#1A1A26] border border-emerald-500/20 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                        <LayoutGrid size={16} />
                        Connected Dots
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 bg-[#0A0A0F] rounded-xl border border-[#2A2A3A] text-[10px] font-medium">
                        RBI Rate Decision
                      </div>
                      <Plus size={14} className="text-gray-600" />
                      <div className="flex-1 p-3 bg-[#0A0A0F] rounded-xl border border-[#2A2A3A] text-[10px] font-medium">
                        Zomato Logistics AI
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      The link: Lower borrowing costs will accelerate capital expenditure for AI infrastructure in high-volume logistics.
                    </p>
                  </div>
                </div>

                {/* Right: AI Chat */}
                <div className="bg-[#12121A] border border-[#2A2A3A] rounded-3xl flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-[#2A2A3A] flex items-center justify-between bg-[#1A1A26]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-sm font-bold">Intelligence Assistant</span>
                    </div>
                    <button className="text-gray-500 hover:text-white"><Bookmark size={16} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                    {aiChatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-[#1A1A26] border border-[#2A2A3A] text-gray-300 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#1A1A26] border border-[#2A2A3A] p-4 rounded-2xl rounded-tl-none flex gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75" />
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-[#1A1A26] border-t border-[#2A2A3A]">
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                      {["RBI Risk?", "Tech Outlook?", "Portfolio Impact?"].map(chip => (
                        <button 
                          key={chip}
                          onClick={() => setChatInput(chip)}
                          className="px-3 py-1.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-full text-[10px] font-bold text-gray-500 hover:text-blue-400 transition-all whitespace-nowrap"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="relative">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Ask anything about the markets..."
                        className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || isChatLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-all"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'saved' && (
              <motion.div 
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {savedArticles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-[#1A1A26] rounded-full flex items-center justify-center text-gray-600">
                      <Bookmark size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">No saved stories yet</h3>
                    <p className="text-gray-600 max-w-xs">Save articles from your feed to build your personal intelligence library.</p>
                    <button 
                      onClick={() => setActiveSection('feed')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all"
                    >
                      BROWSE FEED
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_ARTICLES.filter(a => savedArticles.includes(a.id)).map(art => (
                      <div key={art.id} className="p-6 bg-[#1A1A26] border border-[#2A2A3A] rounded-3xl space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">{art.category}</span>
                          <button onClick={() => toggleSave(art.id)} className="text-blue-400"><Bookmark size={18} fill="currentColor" /></button>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">{art.headline}</h3>
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">SAVED ON MAR 29</span>
                          <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-all">ASK AI ABOUT THIS</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl space-y-8"
              >
                <div className="bg-[#1A1A26] border border-[#2A2A3A] rounded-3xl p-8 space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-[#2A2A3A] pb-4">Profile Intelligence</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Role</label>
                        <p className="font-bold">{profile.role}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Geography</label>
                        <p className="font-bold">{profile.geography}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sectors</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.industries.map(ind => (
                          <span key={ind} className="px-3 py-1 bg-[#0A0A0F] border border-[#2A2A3A] rounded-full text-xs text-gray-400">{ind}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-[#2A2A3A] pb-4">Notification Preferences</h3>
                    {[
                      { label: 'Portfolio Alerts', desc: 'Real-time updates on your holdings' },
                      { label: 'Daily Briefing', desc: 'Morning intelligence summary' },
                      { label: 'AI Digest', desc: 'Weekly deep-dive insights' },
                    ].map(pref => (
                      <div key={pref.label} className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm">{pref.label}</p>
                          <p className="text-xs text-gray-500">{pref.desc}</p>
                        </div>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all">SAVE CHANGES</button>
                    <button 
                      onClick={() => setProfile(null)}
                      className="flex-1 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-sm hover:bg-rose-500 hover:text-white transition-all"
                    >
                      RESET PROFILE
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-3xl">
                  <h3 className="font-bold mb-4">Intelligence Report</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">3,412</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Stories Personalized</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Avg Relevance</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">AI & Tech</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Top Topic</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">7 Days</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Reading Streak 🔥</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Right Panel */}
      <RightPanel user={profile} focusedItem={focusedItem} />
    </div>
  );
}

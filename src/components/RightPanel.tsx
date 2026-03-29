import React from 'react';
import { UserProfile, Company } from '../types';
import { MOCK_INDICES } from '../mockData';
import { Brain, Zap, TrendingUp, TrendingDown, ChevronRight, Info } from 'lucide-react';

interface RightPanelProps {
  user: UserProfile;
  focusedItem?: any;
}

export default function RightPanel({ user, focusedItem }: RightPanelProps) {
  return (
    <div className="w-[300px] h-screen bg-[#12121A] border-l border-[#2A2A3A] flex flex-col fixed right-0 top-0 z-20">
      {/* Markets Ticker */}
      <div className="h-12 border-b border-[#2A2A3A] flex items-center overflow-hidden whitespace-nowrap px-4 bg-[#0A0A0F]">
        <div className="flex gap-6 animate-marquee">
          {MOCK_INDICES.map(idx => (
            <div key={idx.name} className="flex items-center gap-2 text-[10px] font-bold">
              <span className="text-gray-400 uppercase">{idx.name}</span>
              <span className="text-white">{idx.value.toLocaleString()}</span>
              <span className={idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {idx.change >= 0 ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {MOCK_INDICES.map(idx => (
            <div key={`${idx.name}-dup`} className="flex items-center gap-2 text-[10px] font-bold">
              <span className="text-gray-400 uppercase">{idx.name}</span>
              <span className="text-white">{idx.value.toLocaleString()}</span>
              <span className={idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {idx.change >= 0 ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {focusedItem ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-400">
              <Brain size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">AI Context</h3>
            </div>
            
            <div className="bg-[#1A1A26] border border-blue-500/30 rounded-2xl p-4 space-y-4">
              <h4 className="font-bold text-lg leading-tight">{focusedItem.headline || focusedItem.name}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {focusedItem.summary || focusedItem.description}
              </p>
              <div className="pt-4 border-t border-[#2A2A3A] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Relevance to you</span>
                  <span className="text-blue-400 font-bold">94%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[94%]" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Key Signals</h4>
              {[
                { label: 'Market Sentiment', value: 'Bullish', color: 'text-emerald-400' },
                { label: 'Policy Impact', value: 'Moderate', color: 'text-amber-400' },
                { label: 'Portfolio Risk', value: 'Low', color: 'text-emerald-400' },
              ].map(sig => (
                <div key={sig.label} className="flex items-center justify-between p-3 bg-[#1A1A26] rounded-xl border border-[#2A2A3A]">
                  <span className="text-xs text-gray-400">{sig.label}</span>
                  <span className={`text-xs font-bold ${sig.color}`}>{sig.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Today's Intelligence</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Earnings Season Peak',
                  desc: '7 watchlist companies report this week. Expect volatility in your portfolio.',
                  icon: TrendingUp,
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/10'
                },
                {
                  title: 'RBI Policy Shift',
                  desc: 'Hawkish tone detected in recent minutes. FinTech sector may face headwinds.',
                  icon: Info,
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10'
                },
                {
                  title: 'AI Adoption Surge',
                  desc: 'TCS and Infosys showing 40% growth in GenAI pipeline. Bullish for your Tech focus.',
                  icon: Brain,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-400/10'
                }
              ].map((card, i) => (
                <div key={i} className="group p-4 bg-[#1A1A26] border border-[#2A2A3A] rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                      <card.icon size={16} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">{card.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-[10px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                    EXPLORE <ChevronRight size={12} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-600/20">
              <h4 className="font-bold mb-1">Weekly Briefing</h4>
              <p className="text-xs text-blue-100 mb-4">Your personalized summary for the week is ready.</p>
              <button className="w-full py-2 bg-white text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all">
                DOWNLOAD PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

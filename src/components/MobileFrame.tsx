import React, { ReactNode } from 'react';
import { 
  Wifi, Battery, ShieldAlert, Sparkles, Smartphone, Layers, 
  MapPin, ShieldCheck, Heart, Radio, ShoppingBag, Shield, BellRing
} from 'lucide-react';
import { UserProfile, SOSAlert, NearbyDistressSignal } from '../types';

interface MobileFrameProps {
  children: ReactNode;
  activeTab: 'sos' | 'guardians' | 'marketplace' | 'distress' | 'profile';
  onSelectTab: (tab: 'sos' | 'guardians' | 'marketplace' | 'distress' | 'profile') => void;
  activeSOS: SOSAlert | null;
  activeDistress: NearbyDistressSignal | null;
  onOpenWidgetSimulator: () => void;
  onOpenAuthorityMatrix: () => void;
  onOpenVerification: () => void;
  userProfile: UserProfile;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onSelectTab,
  activeSOS,
  activeDistress,
  onOpenWidgetSimulator,
  onOpenAuthorityMatrix,
  onOpenVerification,
  userProfile
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start sm:py-6 sm:px-4">
      {/* Top Desktop Helper Bar */}
      <header className="w-full max-w-md hidden sm:flex items-center justify-between mb-3 px-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Tahaffuz Karachi (تحفظ کراچی)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWidgetSimulator}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
          >
            <Smartphone className="w-3 h-3 text-cyan-400" />
            <span>Mobile Widgets</span>
          </button>
          <button
            onClick={onOpenAuthorityMatrix}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Authorities Matrix</span>
          </button>
        </div>
      </header>

      {/* NATIVE SMARTPHONE FRAME */}
      <main 
        id="mobile-phone-container"
        className="w-full sm:max-w-[420px] h-screen sm:h-[860px] bg-slate-950 sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col relative overflow-hidden ring-1 ring-slate-700/50"
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="shrink-0 bg-slate-950 pt-3 pb-1 px-6 flex items-center justify-between text-slate-300 text-xs font-semibold select-none z-50">
          <span>9:41</span>

          {/* Dynamic Island Capsule */}
          <div className="w-28 h-6 bg-black rounded-full border border-slate-800/80 flex items-center justify-center gap-2 px-2 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[9px] font-mono text-slate-300 tracking-wider">
              {activeSOS ? 'SOS ACTIVE' : 'TAHAFFUZ'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-bold text-cyan-400">Jazz 5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="shrink-0 px-4 py-2 bg-slate-950 border-b border-slate-900 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white font-black text-xs shadow-md">
              TK
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1">
                <span>Tahaffuz Karachi</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800 font-normal">
                  تحفظ
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                <span>Karachi South • Sindh Police 15 & 1094</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenWidgetSimulator}
              title="Test Lock Screen & Android Widgets"
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onOpenVerification}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                userProfile.isVerified 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
                  : 'bg-amber-950/60 border-amber-500 text-amber-400 animate-pulse'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE SCREEN CONTENT */}
        <div className="flex-1 overflow-hidden relative bg-slate-950">
          {children}
        </div>

        {/* NATIVE BOTTOM NAVIGATION BAR */}
        <nav 
          aria-label="Mobile Navigation"
          className="shrink-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around z-50"
        >
          {/* SOS Tab */}
          <button
            onClick={() => onSelectTab('sos')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'sos' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition ${
              activeTab === 'sos' ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 shadow-md' : ''
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">SOS Help</span>
            {activeSOS && <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
          </button>

          {/* Rent-a-Guardian Tab */}
          <button
            onClick={() => onSelectTab('guardians')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'guardians' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition ${
              activeTab === 'guardians' ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-md' : ''
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Guardian</span>
          </button>

          {/* 100m Nearby Distress Tab */}
          <button
            onClick={() => onSelectTab('distress')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'distress' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition ${
              activeTab === 'distress' ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 shadow-md' : ''
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">100m Radar</span>
            {activeDistress && <span className="absolute top-1 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border-2 border-slate-950"></span>}
          </button>

          {/* Self-Defense Mart Tab */}
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'marketplace' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition ${
              activeTab === 'marketplace' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-md' : ''
            }`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Gear Mart</span>
          </button>
        </nav>

        {/* iPhone Home Bar indicator */}
        <div className="shrink-0 h-4 bg-slate-950 flex items-center justify-center pb-1">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </main>
    </div>
  );
};

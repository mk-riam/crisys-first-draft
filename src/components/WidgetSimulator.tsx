import React, { useState } from 'react';
import { 
  AlertTriangle, Shield, Radio, Lock, Zap, Sparkles, 
  Smartphone, Apple, Bot, CheckCircle2, ChevronRight, EyeOff
} from 'lucide-react';
import { Coordinates, SOSAlert } from '../types';

interface WidgetSimulatorProps {
  userLocation: Coordinates;
  activeSOS: SOSAlert | null;
  onTriggerSOS: (isCovert: boolean) => void;
  onClose: () => void;
}

export const WidgetSimulator: React.FC<WidgetSimulatorProps> = ({
  userLocation,
  activeSOS,
  onTriggerSOS,
  onClose
}) => {
  const [widgetType, setWidgetType] = useState<'ios-lock' | 'ios-home' | 'android'>('ios-lock');
  const [triggeredFromWidget, setTriggeredFromWidget] = useState(false);

  const handleWidgetTrigger = (isCovert: boolean = false) => {
    setTriggeredFromWidget(true);
    onTriggerSOS(isCovert);
    setTimeout(() => setTriggeredFromWidget(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Mobile OS Widget Simulator</span>
            </h3>
            <p className="text-[10px] text-slate-400">Interactive preview for iOS Lock Screen, Home Screen & Android</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1">
            ✕
          </button>
        </div>

        {/* Widget Mode Selector */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setWidgetType('ios-lock')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              widgetType === 'ios-lock' ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>iOS Lock Screen</span>
          </button>

          <button
            onClick={() => setWidgetType('ios-home')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              widgetType === 'ios-home' ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iOS Home Screen</span>
          </button>

          <button
            onClick={() => setWidgetType('android')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              widgetType === 'android' ? 'bg-slate-800 text-white shadow-md border border-slate-600' : 'text-slate-400'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Android Material</span>
          </button>
        </div>

        {/* 1. iOS LOCK SCREEN WIDGET PREVIEW */}
        {widgetType === 'ios-lock' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 rounded-3xl border border-slate-800 text-center relative overflow-hidden shadow-2xl">
              {/* iPhone Clock Face */}
              <div className="text-5xl font-extrabold text-slate-200 tracking-tight font-mono opacity-90">
                11:52
              </div>
              <div className="text-xs text-slate-400 font-medium mb-5">
                Sunday, 23 August • Karachi
              </div>

              {/* iOS Lock Screen Circular Widgets Shelf */}
              <div className="flex items-center justify-center gap-3 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs mx-auto">
                {/* Circular One-Tap SOS Widget */}
                <button
                  onClick={() => handleWidgetTrigger(false)}
                  className="w-16 h-16 rounded-full bg-rose-600/90 border-2 border-white/40 flex flex-col items-center justify-center text-white shadow-lg active:scale-90 transition cursor-pointer hover:bg-rose-500"
                >
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <span className="text-[9px] font-black tracking-widest mt-0.5">SOS</span>
                </button>

                {/* Covert Lock Screen Widget */}
                <button
                  onClick={() => handleWidgetTrigger(true)}
                  className="w-16 h-16 rounded-full bg-slate-800/90 border border-white/20 flex flex-col items-center justify-center text-slate-200 shadow-md active:scale-90 transition cursor-pointer hover:bg-slate-700"
                >
                  <EyeOff className="w-4 h-4 text-cyan-400" />
                  <span className="text-[8px] font-bold text-slate-300 mt-0.5">SILENT</span>
                </button>

                {/* 100m Radar Status Widget */}
                <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-white/10 flex flex-col items-center justify-center text-slate-300 p-1">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[7px] font-semibold text-center text-slate-400 mt-0.5">100m MESH</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-4">
                📱 <b className="text-slate-200">iOS Lock Screen WidgetKit</b> allows instant SOS triggering without unlocking the iPhone or entering FaceID.
              </p>
            </div>
          </div>
        )}

        {/* 2. iOS HOME SCREEN WIDGET PREVIEW */}
        {widgetType === 'ios-home' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-black p-5 rounded-3xl border border-slate-800 space-y-4">
              {/* 2x2 Small Widget */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                  iOS Home Screen 2x2 Small Widget
                </span>
                <div className="w-40 h-40 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-3xl p-3.5 shadow-2xl flex flex-col justify-between mx-auto relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-rose-400 tracking-wider">TAHAFFUZ</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>

                  <button
                    onClick={() => handleWidgetTrigger(false)}
                    className="w-16 h-16 rounded-full bg-gradient-to-b from-rose-500 to-red-700 border-2 border-rose-300/40 flex flex-col items-center justify-center text-white mx-auto shadow-lg active:scale-95 transition"
                  >
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-[9px] font-black">SOS</span>
                  </button>

                  <div className="text-center text-[9px] text-slate-400 truncate">
                    Karachi 100m Mesh
                  </div>
                </div>
              </div>

              {/* 4x2 Medium Widget */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                  iOS Home Screen 4x2 Medium Widget
                </span>
                <div className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-black text-white">Tahaffuz Karachi</span>
                    </div>
                    <p className="text-[11px] text-slate-300">DHA Phase 5 • {userLocation.district || 'Karachi South'}</p>
                    <p className="text-[10px] text-emerald-400">✓ 5 Public Helplines Hotwired</p>
                  </div>

                  <button
                    onClick={() => handleWidgetTrigger(false)}
                    className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 active:scale-95 transition shrink-0"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>BROADCAST SOS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ANDROID MATERIAL YOU WIDGET */}
        {widgetType === 'android' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-black p-5 rounded-3xl border border-slate-800 space-y-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Android Material You Quick Tile & App Widget
              </span>

              <div className="bg-amber-950/30 border border-amber-500/40 rounded-3xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Android Quick Settings Tile</h4>
                    <p className="text-[10px] text-slate-400">Swipe notification bar down & trigger instantly</p>
                  </div>
                </div>

                <button
                  onClick={() => handleWidgetTrigger(false)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md active:scale-95 transition"
                >
                  Quick SOS
                </button>
              </div>
            </div>
          </div>
        )}

        {triggeredFromWidget && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Emergency SOS successfully triggered via Mobile Widget!</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
        >
          Return to App
        </button>
      </div>
    </div>
  );
};

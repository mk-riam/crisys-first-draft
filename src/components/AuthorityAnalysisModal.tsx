import React, { useState } from 'react';
import { 
  ShieldAlert, HeartHandshake, Radio, Eye, Ambulance, PhoneCall, 
  MapPin, CheckCircle2, Award, FileSpreadsheet, ArrowRight, ExternalLink
} from 'lucide-react';
import { SecurityAuthority } from '../types';
import { SECURITY_AUTHORITIES } from '../data/karachiData';

interface AuthorityAnalysisModalProps {
  selectedAuthority?: SecurityAuthority | null;
  onClose: () => void;
}

export const AuthorityAnalysisModal: React.FC<AuthorityAnalysisModalProps> = ({
  selectedAuthority,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedAuthority?.id || SECURITY_AUTHORITIES[0].id);

  const currentAuth = SECURITY_AUTHORITIES.find((a) => a.id === activeTab) || SECURITY_AUTHORITIES[0];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Karachi Public Security Landscape Study</span>
            </h3>
            <p className="text-[10px] text-slate-400">FYP Authority Evaluation & Collaboration Decision Matrix</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1">
            ✕
          </button>
        </div>

        {/* Quick Tabs for 5 Major Karachi Helplines */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {SECURITY_AUTHORITIES.map((auth) => (
            <button
              key={auth.id}
              onClick={() => setActiveTab(auth.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === auth.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <span>{auth.shortName}</span>
            </button>
          ))}
        </div>

        {/* Authority In-Depth Analysis Card */}
        <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md border border-rose-500/40">
                {currentAuth.category}
              </span>
              <h4 className="text-sm font-bold text-white mt-1">{currentAuth.name}</h4>
              <p className="text-[11px] text-slate-400">{currentAuth.headquarters}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-black text-rose-400 font-mono">
                {currentAuth.emergencyNumber}
              </div>
              <span className="text-[9px] text-slate-500">Emergency Hotwire</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentAuth.description}
          </p>

          {/* Key Operational Features */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <h5 className="text-xs font-bold text-slate-300">Operational Strengths in Karachi:</h5>
            {currentAuth.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Best Suited For */}
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
            <span className="font-bold text-amber-400 block mb-0.5">Best Suited In Crisis:</span>
            <span className="text-slate-300">{currentAuth.recommendedFor}</span>
          </div>

          {/* FYP Collaboration Recommendation */}
          <div className="p-3 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 text-xs space-y-1">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Recommended Collaboration Pitch for FYP:</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {currentAuth.id === 'sindh-women-protection-cell' && 
                "Primary Recommended Partner! The Sindh Police Women Protection Cell (Helpline 1094) has dedicated female officers, trauma sensitivity, and active desks at Karachi South/East. Pitching Tahaffuz as an automated direct digital intake bridge will give maximum institutional buy-in."}
              {currentAuth.id === 'sindh-police-madadgar-15' && 
                "Essential Rapid Interdiction Partner! Madadgar 15 has the largest physical fleet of Eagle Squad motorbikes in Karachi. Integrate our automated 100m SOS telemetry directly to their 15 dispatch console for fastest physical arrival."}
              {currentAuth.id === 'cplc-karachi' && 
                "Excellent Citizen-Police Bridge! CPLC operates inside Governor House Karachi and already has a strong IT/Geospatial division. They welcome university FYP tech collaborations with established MOUs."}
              {currentAuth.id === 'sindh-safe-cities-authority' && 
                "High-Tech Video Grounding! Safe City cameras can be programmed to automatically pan and zoom toward any active Tahaffuz GPS coordinate when an SOS is sent."}
              {currentAuth.id === 'rescue-1122-sindh' && 
                "Trauma & Post-Assault Care! For physical injury or severe medical emergencies, Rescue 1122 provides free ACLS ambulances with female EMT staff."}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
        >
          Close Evaluation Matrix
        </button>
      </div>
    </div>
  );
};

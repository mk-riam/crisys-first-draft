import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, Mic, MicOff, Zap, ZapOff, Volume2, VolumeX, 
  MapPin, Radio, PhoneCall, Lock, CheckCircle2, ChevronRight, EyeOff, 
  Info, BellRing, Compass, ShieldAlert, HeartHandshake, Eye
} from 'lucide-react';
import { Coordinates, SecurityAuthority, SOSAlert, UserProfile } from '../types';
import { SECURITY_AUTHORITIES, KARACHI_CENTER } from '../data/karachiData';
import { KarachiMapView } from './KarachiMapView';
import { soundEffects } from '../utils/soundEffects';
import { torchController } from '../utils/torchController';
import { emergencyAudioRecorder } from '../utils/audioRecorder';

interface SOSScreenProps {
  userProfile: UserProfile;
  userLocation: Coordinates;
  activeSOS: SOSAlert | null;
  onTriggerSOS: (isCovert: boolean) => void;
  onCancelSOS: (pin: string) => boolean;
  onOpenAuthorityDetails: (auth: SecurityAuthority) => void;
  onOpenVerification: () => void;
}

export const SOSScreen: React.FC<SOSScreenProps> = ({
  userProfile,
  userLocation,
  activeSOS,
  onTriggerSOS,
  onCancelSOS,
  onOpenAuthorityDetails,
  onOpenVerification
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [strobeActive, setStrobeActive] = useState<boolean>(false);
  const [sirenAudible, setSirenAudible] = useState<boolean>(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isCovertMode, setIsCovertMode] = useState(false);
  const [audioRecordingTimer, setAudioRecordingTimer] = useState<number>(0);
  const [screenStrobeOverlay, setScreenStrobeOverlay] = useState(false);

  // Press & hold timer for instant trigger
  useEffect(() => {
    let interval: any = null;
    if (isPressing && !activeSOS) {
      interval = setInterval(() => {
        setPressProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleTriggerEmergency(isCovertMode);
            return 0;
          }
          return prev + 15;
        });
      }, 50);
    } else {
      setPressProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing, activeSOS, isCovertMode]);

  // Audio timer during active SOS
  useEffect(() => {
    let timer: any = null;
    if (activeSOS) {
      timer = setInterval(() => {
        setAudioRecordingTimer((t) => t + 1);
      }, 1000);

      // Start device flashlight strobe & screen strobe if not covert
      if (!activeSOS.isCovert) {
        setStrobeActive(true);
        torchController.startStrobe(120);
        setScreenStrobeOverlay(true);
        if (sirenAudible) {
          soundEffects.playEmergencySiren(0.8);
        }
      }

      // Start automatic microphone recording
      emergencyAudioRecorder.startRecording((level) => {
        setAudioVolume(level);
      });
    } else {
      setAudioRecordingTimer(0);
      setStrobeActive(false);
      setScreenStrobeOverlay(false);
      torchController.stopStrobe();
      soundEffects.stopSound();
    }

    return () => {
      if (timer) clearInterval(timer);
      torchController.stopStrobe();
      soundEffects.stopSound();
    };
  }, [activeSOS]);

  const handleTriggerEmergency = (covert: boolean = false) => {
    if (!userProfile.isVerified) {
      // Prompt verification gently or allow emergency anyway
    }
    soundEffects.playConfirmationBeep();
    onTriggerSOS(covert);
  };

  const handleStrobeToggle = () => {
    if (strobeActive) {
      torchController.stopStrobe();
      setStrobeActive(false);
      setScreenStrobeOverlay(false);
    } else {
      torchController.startStrobe(100);
      setStrobeActive(true);
      setScreenStrobeOverlay(true);
    }
  };

  const handleSirenToggle = () => {
    if (sirenAudible) {
      soundEffects.stopSound();
      setSirenAudible(false);
    } else {
      soundEffects.playEmergencySiren(0.8);
      setSirenAudible(true);
    }
  };

  const handleStopWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onCancelSOS(pinInput);
    if (success) {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      emergencyAudioRecorder.stopRecording();
      torchController.stopStrobe();
      soundEffects.stopSound();
    } else {
      setPinError(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* Rapid Blinking Visual Flash Overlay when active */}
      {screenStrobeOverlay && activeSOS && !activeSOS.isCovert && (
        <div 
          onClick={() => setScreenStrobeOverlay(false)}
          className="fixed inset-0 z-[999] pointer-events-auto animate-strobe opacity-90 flex flex-col items-center justify-center p-6 text-center cursor-pointer"
        >
          <div className="bg-black/90 p-6 rounded-3xl border-4 border-white text-white shadow-2xl max-w-xs">
            <ShieldAlert className="w-16 h-16 mx-auto mb-2 text-red-500 animate-bounce" />
            <h2 className="text-2xl font-black tracking-tight">SOS HIGH-VISIBILITY STROBE ACTIVE</h2>
            <p className="text-xs text-slate-300 mt-2 font-medium">Blinking device screen & flashlight to deter attacker and signal nearby Karachi citizens.</p>
            <p className="text-[10px] text-amber-400 mt-3 font-semibold">(Tap anywhere to dismiss strobe overlay)</p>
          </div>
        </div>
      )}

      {/* Verification Status Banner */}
      {!userProfile.isVerified ? (
        <div 
          onClick={onOpenVerification}
          className="bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-transparent border border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>CNIC Verification Required</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              </div>
              <p className="text-[11px] text-slate-300">Women-only safety network. Upload CNIC for instant badge.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-2.5 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">CNIC Verified Citizen ID: {userProfile.cnicNumber}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">SECURE</span>
        </div>
      )}

      {/* Emergency State Header or Normal Status */}
      {activeSOS ? (
        <div className="bg-rose-950/80 border-2 border-rose-500 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-300">CRITICAL DISTRESS BROADCAST ACTIVE</span>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-900/80 text-rose-200 px-2.5 py-1 rounded-lg border border-rose-700">
              {formatSeconds(audioRecordingTimer)}
            </span>
          </div>

          <p className="text-sm font-semibold text-white mt-2">
            Broadcasting to 100m radius in {userLocation.district || 'Karachi South'} & Dispatched to Karachi Police Authorities.
          </p>

          {/* Audio Waveform & Status */}
          <div className="mt-4 bg-slate-950/80 border border-rose-500/30 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Microphone Recording Evidence</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Audio Input: {audioVolume}%
              </span>
            </div>
            
            {/* Live Audio Visualizer Bars */}
            <div className="flex items-end justify-between gap-1 h-8 px-1">
              {[15, 30, 45, 60, 80, 100, 75, 50, 65, 85, 40, 25, 55, 90, 70, 40, 60, 30].map((h, i) => {
                const dynamicHeight = Math.max(12, Math.min(100, (audioVolume * 1.5) + (i % 3) * 10));
                return (
                  <div
                    key={i}
                    style={{ height: `${dynamicHeight}%` }}
                    className="flex-1 bg-gradient-to-t from-rose-600 to-rose-400 rounded-full transition-all duration-75"
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <span>🔒 Encrypted cloud evidence link</span>
              <span className="text-rose-300 font-semibold">Locked until PIN entered</span>
            </div>
          </div>

          {/* Live Action Controls */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={handleStrobeToggle}
              className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                strobeActive 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-900/90 text-slate-300 border-slate-700'
              }`}
            >
              {strobeActive ? <Zap className="w-4 h-4 animate-bounce" /> : <ZapOff className="w-4 h-4" />}
              <span>{strobeActive ? 'Strobe ON' : 'Strobe OFF'}</span>
            </button>

            <button
              onClick={handleSirenToggle}
              className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                sirenAudible 
                  ? 'bg-rose-600 text-white border-rose-400' 
                  : 'bg-slate-900/90 text-slate-300 border-slate-700'
              }`}
            >
              {sirenAudible ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span>{sirenAudible ? 'Siren 130dB' : 'Mute Siren'}</span>
            </button>

            <button
              onClick={() => setShowPinModal(true)}
              className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-950/50 text-xs font-bold flex flex-col items-center justify-center gap-1 transition shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>Cancel (PIN)</span>
            </button>
          </div>
        </div>
      ) : (
        /* BIG RED SOS BUTTON CONTAINER */
        <div className="flex flex-col items-center justify-center py-4 relative">
          {/* Circular Pulse Waves */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 rounded-full border border-rose-500/20 animate-sos-ring-1 pointer-events-none"></div>
            <div className="absolute w-80 h-80 rounded-full border border-rose-500/10 animate-sos-ring-2 pointer-events-none"></div>

            {/* Giant Tactile Button */}
            <button
              id="main-sos-button"
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onTouchStart={() => setIsPressing(true)}
              onTouchEnd={() => setIsPressing(false)}
              onClick={() => handleTriggerEmergency(false)}
              className={`relative z-10 w-52 h-52 sm:w-60 sm:h-60 rounded-full p-2.5 bg-gradient-to-b from-rose-500 via-rose-600 to-red-800 shadow-[0_0_50px_rgba(225,29,72,0.65)] active:scale-95 transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer border-4 border-rose-300/40 select-none ${
                isPressing ? 'scale-95 shadow-[0_0_70px_rgba(225,29,72,0.9)] ring-8 ring-rose-400/50' : 'animate-sos-pulse'
              }`}
            >
              {/* Inner Bezel */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-rose-600 to-red-900 flex flex-col items-center justify-center p-4 border border-rose-400/50 shadow-inner">
                <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-white mb-1 drop-shadow-md" />
                <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider drop-shadow-lg">
                  SOS
                </span>
                <span className="text-[11px] font-bold text-rose-100 uppercase tracking-widest mt-0.5">
                  100m Broadcast
                </span>
                <span className="text-[9px] text-rose-200/80 mt-1 font-medium">
                  {isPressing ? `Triggering in ${Math.max(1, Math.ceil((100 - pressProgress) / 30))}s...` : 'TAP OR HOLD TO ALERT'}
                </span>
              </div>
            </button>
          </div>

          {/* Quick Covert Silent Option */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => handleTriggerEmergency(true)}
              className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition flex items-center gap-2 shadow-sm"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Silent / Covert SOS (No Siren)</span>
            </button>
          </div>
        </div>
      )}

      {/* LIVE LOCATION TELEMETRY CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Karachi GPS Telemetry</h3>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            GPS ±{userLocation.accuracy || 4}m
          </span>
        </div>

        <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{userLocation.address || 'DHA Phase 5 / Clifton, Karachi'}</p>
            <p className="text-[11px] text-slate-400 truncate">{userLocation.landmark || 'Near Khayaban-e-Mujahid / 26th Commercial'}</p>
            <p className="text-[10px] text-cyan-400/90 font-mono mt-0.5">
              Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)} ({userLocation.district || 'Karachi South'})
            </p>
          </div>
        </div>

        {/* Embedded Dynamic Mesh Map */}
        <KarachiMapView 
          userLocation={userLocation}
          sosLocation={activeSOS ? activeSOS.location : null}
          radiusMeters={100}
          height="190px"
          zoom={16}
        />
      </div>

      {/* KARACHI PUBLIC SECURITY AUTHORITIES DIRECT HOTWIRES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Karachi Public Security Integration</h3>
          </div>
          <span className="text-[10px] text-slate-400">All 7 Districts</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Integrated emergency bridges with Karachi’s specialized female protection desks & police command centers:
        </p>

        <div className="space-y-2">
          {SECURITY_AUTHORITIES.map((auth) => {
            const isDispatched = activeSOS?.dispatchedAuthorities.includes(auth.shortName);
            return (
              <div 
                key={auth.id}
                onClick={() => onOpenAuthorityDetails(auth)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isDispatched 
                    ? 'bg-rose-950/40 border-rose-500/80 shadow-md' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                    auth.category === 'Specialized Desk' 
                      ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                      : auth.category === 'Surveillance'
                      ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                      : 'bg-rose-950/60 text-rose-300 border-rose-800'
                  }`}>
                    {auth.emergencyNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{auth.name}</h4>
                      {isDispatched && (
                        <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold">DISPATCHED</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{auth.coverage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400 shrink-0 pl-2">
                  <span className="text-[10px] font-semibold text-slate-300">{auth.integrationStatus}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Passcode Unlock Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Emergency Override PIN</h3>
              </div>
              <button 
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter your 4-digit secret security PIN to stop evidence audio recording, disable flashing strobe, and mark alert as resolved.
            </p>

            <form onSubmit={handleStopWithPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  placeholder="Enter 4-digit PIN (default 1234)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full text-center tracking-[1em] text-2xl font-mono py-3 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                />
                {pinError && (
                  <p className="text-xs text-rose-400 font-semibold mt-2 text-center">
                    Incorrect PIN. Default PIN is 1234.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  Back to Emergency
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
                >
                  Verify & Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

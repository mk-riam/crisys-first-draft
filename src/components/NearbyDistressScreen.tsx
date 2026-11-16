import React, { useState, useEffect } from 'react';
import { 
  BellRing, Radio, MapPin, Compass, Navigation, Volume2, VolumeX, 
  Users, CheckCircle2, ShieldAlert, AlertTriangle, ArrowUpRight, 
  Flame, PhoneCall, ExternalLink, HeartHandshake
} from 'lucide-react';
import { NearbyDistressSignal, Coordinates } from '../types';
import { KarachiMapView } from './KarachiMapView';
import { soundEffects } from '../utils/soundEffects';

interface NearbyDistressScreenProps {
  userLocation: Coordinates;
  activeDistress: NearbyDistressSignal | null;
  onSimulateNewDistress: () => void;
  onRespondToDistress: (distressId: string) => void;
  isResponding: boolean;
}

export const NearbyDistressScreen: React.FC<NearbyDistressScreenProps> = ({
  userLocation,
  activeDistress,
  onSimulateNewDistress,
  onRespondToDistress,
  isResponding
}) => {
  const [alarmRinging, setAlarmRinging] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(45);

  useEffect(() => {
    let timer: any = null;
    if (activeDistress) {
      if (alarmRinging) {
        soundEffects.playResponderAlertChime();
      }
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      soundEffects.stopSound();
    }
    return () => {
      if (timer) clearInterval(timer);
      soundEffects.stopSound();
    };
  }, [activeDistress, alarmRinging]);

  const toggleAlarmRing = () => {
    if (alarmRinging) {
      soundEffects.stopSound();
      setAlarmRinging(false);
    } else {
      soundEffects.playResponderAlertChime();
      setAlarmRinging(true);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>100-METER HYPERLOCAL CRISIS RADAR</span>
          </div>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded-full border border-rose-500/40 font-bold">
            MESH PROXIMITY
          </span>
        </div>
        <h2 className="text-lg font-black text-white mt-1">Nearby SOS Community Receiver</h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          When any woman in Karachi triggers an SOS, all verified female citizens within a 100-meter physical radius receive an instant audible crisis alert with live GPS navigation to intervene or support.
        </p>
      </div>

      {activeDistress ? (
        /* ACTIVE INCOMING 100M DISTRESS CALL */
        <div className="bg-rose-950/80 border-2 border-rose-500 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping"></span>
              <div>
                <span className="text-xs font-black tracking-wider text-rose-300 uppercase block">
                  DISTRESS SIGNAL WITHIN 100 METERS
                </span>
                <span className="text-[10px] text-rose-200">Broadcasted {elapsedSeconds}s ago</span>
              </div>
            </div>

            <button
              onClick={toggleAlarmRing}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                alarmRinging
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {alarmRinging ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{alarmRinging ? 'Mute Alert' : 'Unmute'}</span>
            </button>
          </div>

          {/* Victim Details Pill */}
          <div className="p-3 bg-slate-950/90 rounded-2xl border border-rose-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400 font-bold text-xs">
                  SOS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{activeDistress.victimName}</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold">✓ Verified Female CNIC ID</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-rose-400 font-display">
                  {activeDistress.distanceMeters}m away
                </span>
                <span className="text-[9px] text-slate-400 block">{activeDistress.direction}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 space-y-0.5">
              <p className="font-semibold text-slate-200">{activeDistress.location.address}</p>
              <p className="text-[11px] text-slate-400">{activeDistress.location.landmark}</p>
            </div>
          </div>

          {/* Map with 100m Radius */}
          <KarachiMapView
            userLocation={userLocation}
            sosLocation={activeDistress.location}
            radiusMeters={100}
            height="220px"
            zoom={16}
          />

          {/* Live Responder Counter */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Community Responders En Route:</span>
            </div>
            <span className="font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-lg border border-cyan-800">
              {activeDistress.respondersOnWay + (isResponding ? 1 : 0)} Citizens Active
            </span>
          </div>

          {/* Action Trigger */}
          <div className="flex gap-2">
            <button
              onClick={() => onRespondToDistress(activeDistress.id)}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
                isResponding
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-rose-600/30 active:scale-95'
              }`}
            >
              {isResponding ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Am On My Way (Navigation Active)</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 animate-bounce" />
                  <span>Respond & Navigate to Victim</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* IDLE SCANNING STATE */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"></div>
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Radio className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Hyperlocal 100m Radar Active</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              No active distress signals in your immediate 100m vicinity in Karachi. Your phone will ring persistently if an emergency is triggered nearby.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Current Radius:</span>
            <span className="font-bold text-cyan-400">100 Meters Precision</span>
          </div>

          <button
            onClick={onSimulateNewDistress}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Simulate Incoming 100m SOS Alert</span>
          </button>
        </div>
      )}
    </div>
  );
};

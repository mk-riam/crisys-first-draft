import React, { useState } from 'react';
import { 
  Shield, Star, Clock, Car, MapPin, Calendar, CheckCircle2, 
  Phone, MessageSquare, AlertOctagon, UserCheck, ChevronRight,
  Sparkles, BadgeCheck, ShieldAlert, Award, Navigation, DollarSign
} from 'lucide-react';
import { GuardProfile, GuardBooking, Coordinates } from '../types';
import { CERTIFIED_GUARDS, KARACHI_DISTRICTS } from '../data/karachiData';
import { KarachiMapView } from './KarachiMapView';

interface GuardianBookingScreenProps {
  userLocation: Coordinates;
  activeBooking: GuardBooking | null;
  onBookGuard: (booking: GuardBooking) => void;
  onCancelBooking: (bookingId: string) => void;
  onTriggerSOS: (isCovert: boolean) => void;
}

export const GuardianBookingScreen: React.FC<GuardianBookingScreenProps> = ({
  userLocation,
  activeBooking,
  onBookGuard,
  onCancelBooking,
  onTriggerSOS
}) => {
  const [selectedGuard, setSelectedGuard] = useState<GuardProfile | null>(null);
  const [durationHours, setDurationHours] = useState<number>(4);
  const [durationPreset, setDurationPreset] = useState<'hours' | 'days'>('hours');
  const [selectedDays, setSelectedDays] = useState<number>(1);
  const [pickupAddress, setPickupAddress] = useState<string>(userLocation.address || 'Khayaban-e-Shahbaz, DHA Phase 6, Karachi');
  const [destinationAddress, setDestinationAddress] = useState<string>('Dolmen Mall Clifton / Karachi Seaview');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(KARACHI_DISTRICTS[0]);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female Only' | 'Male'>('Female Only');
  const [notes, setNotes] = useState<string>('');
  const [bookingConfirmedStep, setBookingConfirmedStep] = useState<boolean>(false);
  const [isRequestingAnimation, setIsRequestingAnimation] = useState<boolean>(false);

  // Filter guards
  const filteredGuards = CERTIFIED_GUARDS.filter((g) => {
    if (genderFilter === 'Female Only') return g.gender === 'Female';
    if (genderFilter === 'Male') return g.gender === 'Male';
    return true;
  });

  const totalCalculatedHours = durationPreset === 'hours' ? durationHours : selectedDays * 24;
  const activeRate = selectedGuard ? selectedGuard.hourlyRatePKR : 1400;
  // Apply a progressive multi-day flat discount if >= 24 hours
  const totalCost = durationPreset === 'hours' 
    ? durationHours * activeRate 
    : Math.round(selectedDays * 24 * activeRate * 0.85); // 15% discount for multi-day assignments

  const handleStartBookingFlow = (guard: GuardProfile) => {
    setSelectedGuard(guard);
  };

  const handleConfirmAndDeploy = () => {
    if (!selectedGuard) return;

    setIsRequestingAnimation(true);

    setTimeout(() => {
      const newBooking: GuardBooking = {
        id: `GB-${Date.now().toString().slice(-6)}`,
        guardId: selectedGuard.id,
        guardName: selectedGuard.name,
        guardPhoto: selectedGuard.photo,
        guardBadge: selectedGuard.badgeType,
        userId: 'current-user',
        pickupLocation: pickupAddress,
        pickupCoords: userLocation,
        destinationLocation: destinationAddress,
        durationHours: totalCalculatedHours,
        startDate: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
        startTime: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
        totalPricePKR: totalCost,
        status: 'en_route',
        notes: notes
      };

      onBookGuard(newBooking);
      setIsRequestingAnimation(false);
      setSelectedGuard(null);
    }, 1600);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* Active Assignment Uber-Style HUD */}
      {activeBooking ? (
        <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black tracking-wider text-amber-400 uppercase">
                GUARDIAN ON ASSIGNMENT (ACTIVE ESCORT)
              </span>
            </div>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/40">
              ETA: 8 mins
            </span>
          </div>

          {/* Assigned Guard Profile Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <img 
              src={activeBooking.guardPhoto} 
              alt={activeBooking.guardName} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate">{activeBooking.guardName}</h3>
                <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>
              <p className="text-[11px] text-amber-300 font-semibold">{activeBooking.guardBadge}</p>
              <p className="text-[10px] text-slate-400">Duration: {activeBooking.durationHours} Hours • Total: PKR {activeBooking.totalPricePKR.toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <a 
                href="tel:03001234567" 
                className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-300 hover:bg-emerald-600 transition"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button 
                className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-500 flex items-center justify-center text-cyan-300 hover:bg-cyan-600 transition"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Route Info */}
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1 shrink-0"></div>
              <div>
                <p className="text-[10px] text-slate-400">Pickup Location:</p>
                <p className="font-semibold text-slate-200">{activeBooking.pickupLocation}</p>
              </div>
            </div>
            {activeBooking.destinationLocation && (
              <div className="flex items-start gap-2 pt-1 border-t border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1 shrink-0"></div>
                <div>
                  <p className="text-[10px] text-slate-400">Destination:</p>
                  <p className="font-semibold text-slate-200">{activeBooking.destinationLocation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Live Escort Radar Map */}
          <KarachiMapView
            userLocation={userLocation}
            radiusMeters={100}
            guards={[{
              id: activeBooking.guardId,
              name: activeBooking.guardName,
              gender: 'Female',
              location: { lat: userLocation.lat + 0.002, lng: userLocation.lng + 0.002 }
            }]}
            height="180px"
          />

          {/* Direct Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onTriggerSOS(false)}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Escort Panic SOS</span>
            </button>
            <button
              onClick={() => onCancelBooking(activeBooking.id)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs border border-slate-700 transition"
            >
              End Mission
            </button>
          </div>
        </div>
      ) : (
        /* Normal Booking Catalog & Uber Request Engine */
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>ON-DEMAND PERSONAL PROTECTION • KARACHI</span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">Rent-a-Guardian (2 Hours – 7 Days)</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Verified security for middle-class women: discrete personal chaperones, university transit, medical visits, court hearings, or late-night corporate commutes.
            </p>
          </div>

          {/* Gender Filter Pills */}
          <div className="flex items-center gap-2">
            {(['Female Only', 'All', 'Male'] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  genderFilter === gender
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {gender === 'Female Only' && <Sparkles className="w-3.5 h-3.5" />}
                <span>{gender}</span>
              </button>
            ))}
          </div>

          {/* Guardian Cards List */}
          <div className="space-y-3">
            {filteredGuards.map((guard) => (
              <div
                key={guard.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-4 shadow-xl space-y-3 transition group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={guard.photo}
                    alt={guard.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-500/70 transition shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white truncate">{guard.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-amber-300">{guard.rating}</span>
                        <span className="text-[10px] text-slate-400">({guard.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.2 rounded-md border border-amber-800/60">
                        {guard.badgeType}
                      </span>
                      <span className="text-[10px] text-slate-400">{guard.age} yrs • {guard.completedMissions} missions</span>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Sindh License: <span className="text-slate-300">{guard.sindhSecurityLicense}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {guard.bio}
                </p>

                {/* Skills & Perks Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {guard.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                      {skill}
                    </span>
                  ))}
                  {guard.vehicleAvailable && (
                    <span className="text-[10px] bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-800 flex items-center gap-1">
                      <Car className="w-3 h-3" /> Vehicle Included
                    </span>
                  )}
                  {guard.weaponLicensed && (
                    <span className="text-[10px] bg-rose-950/50 text-rose-300 px-2 py-0.5 rounded-md border border-rose-800">
                      Licensed Carry
                    </span>
                  )}
                </div>

                {/* Pricing & Booking Trigger */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Flat Hourly Rate:</div>
                    <div className="text-base font-black text-amber-400 font-display">
                      PKR {guard.hourlyRatePKR.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ hour</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartBookingFlow(guard)}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Escort</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Booking Customizer Modal */}
      {selectedGuard && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Customize Escort Schedule</h3>
              </div>
              <button
                onClick={() => setSelectedGuard(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1"
              >
                ✕ Cancel
              </button>
            </div>

            {/* Selected Guard Pill */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <img src={selectedGuard.photo} alt={selectedGuard.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">{selectedGuard.name}</h4>
                <p className="text-[10px] text-amber-400 font-semibold">{selectedGuard.badgeType}</p>
                <p className="text-[10px] text-slate-400">PKR {selectedGuard.hourlyRatePKR}/hr • {selectedGuard.gender}</p>
              </div>
            </div>

            {/* Duration Selector: 2 hours to 7 days */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Assignment Duration</label>
              
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDurationPreset('hours')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    durationPreset === 'hours' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Hourly (2 - 24 hrs)
                </button>
                <button
                  type="button"
                  onClick={() => setDurationPreset('days')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    durationPreset === 'days' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Multi-Day (1 - 7 Days)
                </button>
              </div>

              {durationPreset === 'hours' ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Duration: <b className="text-amber-400">{durationHours} Hours</b></span>
                    <span className="text-slate-400">Min 2h • Max 24h</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={24}
                    step={1}
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>2h (Quick Transit)</span>
                    <span>6h (Event)</span>
                    <span>12h (Shift)</span>
                    <span>24h (Full Day)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Duration: <b className="text-amber-400">{selectedDays} Days</b> (24h/day coverage)</span>
                    <span className="text-emerald-400 font-semibold">15% Multi-Day Discount</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDays(d)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          selectedDays === d
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Karachi Pickup & Destination */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Pickup & Route Details</label>
              
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Karachi District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  {KARACHI_DISTRICTS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Pickup Address / Landmark</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Block 4 Clifton / IBA Karachi Campus"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Destination (Optional)</label>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Jinnah International Airport / High Court"
                />
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Base Rate ({selectedGuard.hourlyRatePKR}/hr × {totalCalculatedHours}h)</span>
                <span>PKR {(selectedGuard.hourlyRatePKR * totalCalculatedHours).toLocaleString()}</span>
              </div>
              {durationPreset === 'days' && (
                <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                  <span>Multi-Day Discount (15%)</span>
                  <span>- PKR {Math.round(selectedGuard.hourlyRatePKR * totalCalculatedHours * 0.15).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Payable:</span>
                <span className="text-lg font-black text-amber-400 font-display">PKR {totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Deploy Button */}
            <button
              onClick={handleConfirmAndDeploy}
              disabled={isRequestingAnimation}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRequestingAnimation ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Dispatching {selectedGuard.name}...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Confirm & Dispatch Guardian</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, Camera, Upload, CheckCircle2, AlertCircle, 
  Lock, UserCheck, Sparkles, FileText, Info
} from 'lucide-react';
import { UserProfile } from '../types';

interface CnicVerificationModalProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export const CnicVerificationModal: React.FC<CnicVerificationModalProps> = ({
  userProfile,
  onSaveProfile,
  onClose
}) => {
  const [step, setStep] = useState<'form' | 'scan' | 'verifying' | 'success'>('form');
  const [fullName, setFullName] = useState(userProfile.fullName || 'Mariam Tariq');
  const [phone, setPhone] = useState(userProfile.phone || '0300-8241920');
  const [cnicNumber, setCnicNumber] = useState(userProfile.cnicNumber || '42201-8392014-2');
  const [emergencyPin, setEmergencyPin] = useState(userProfile.emergencyPin || '1234');
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    userProfile.cnicFrontImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check NADRA CNIC format (13 digits: XXXXX-XXXXXXX-X)
    const cleanCnic = cnicNumber.replace(/[^0-9]/g, '');
    if (cleanCnic.length !== 13) {
      setValidationError('CNIC must be exactly 13 digits (e.g. 42201-1234567-2)');
      return;
    }

    // In Pakistan NADRA CNIC standard: Last digit is EVEN for females (0, 2, 4, 6, 8) and ODD for males (1, 3, 5, 7, 9)
    const lastDigit = parseInt(cleanCnic[cleanCnic.length - 1]);
    const isFemaleByNadraCode = lastDigit % 2 === 0;

    if (!isFemaleByNadraCode) {
      setValidationError('NADRA CNIC Verification Notice: The last digit indicates a male CNIC series. Tahaffuz Karachi is strictly for women safety.');
      return;
    }

    setValidationError(null);
    setStep('verifying');

    setTimeout(() => {
      setStep('success');
      const updatedProfile: UserProfile = {
        ...userProfile,
        fullName,
        phone,
        cnicNumber,
        gender: 'female',
        isVerified: true,
        verificationDate: new Date().toLocaleDateString('en-PK'),
        emergencyPin,
        cnicFrontImage: frontImagePreview || undefined
      };
      onSaveProfile(updatedProfile);
    }, 1800);
  };

  const handleSimulateScan = () => {
    setFrontImagePreview('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80');
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Women-Only CNIC Verification</h3>
              <p className="text-[10px] text-slate-400">NADRA ID Female Gatekeeper</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1">
            ✕
          </button>
        </div>

        {step === 'verifying' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto"></div>
            <h4 className="text-base font-bold text-white">Verifying Female CNIC with NADRA Format...</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Checking optical card parameters, gender checksum digit, and Karachi residency match.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-white">Identity Verified Successfully!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your profile is now marked as a verified female citizen of Karachi. 100m SOS broadcasts and guardian escort features are unlocked.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg"
            >
              Continue to Tahaffuz App
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-xs text-purple-200 leading-relaxed">
              <span className="font-bold block mb-1">🔒 High-Privacy Safeguard:</span>
              To maintain the integrity of Karachi’s women safety circle, all users must submit their National Identity Card (CNIC). In Pakistan’s NADRA system, the last digit distinguishes gender.
            </div>

            {/* CNIC Card Photo Upload Simulation */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                CNIC Photo (Front Scan)
              </label>
              <div 
                onClick={handleSimulateScan}
                className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/60 transition space-y-2"
              >
                {frontImagePreview ? (
                  <div className="space-y-2">
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 relative">
                      <img src={frontImagePreview} alt="CNIC Front" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        CARD CAPTURED
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400">Click to re-take or upload different photo</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Camera className="w-8 h-8 text-purple-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-200">Tap to Capture / Upload CNIC</p>
                    <p className="text-[10px] text-slate-400">Front side with photo & 13-digit number visible</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Full Legal Name (as on CNIC)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">CNIC Number (13 digits)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42201-8392014-2"
                  value={cnicNumber}
                  onChange={(e) => {
                    setCnicNumber(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">Note: Female CNICs end in an even digit (0, 2, 4, 6, 8)</span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Phone Number (Karachi Cellular)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Emergency 4-Digit Override PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={emergencyPin}
                  onChange={(e) => setEmergencyPin(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
                  placeholder="1234"
                />
                <span className="text-[10px] text-slate-500">Used to stop emergency audio recording and resolve alerts</span>
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-xl shadow-purple-600/30 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Verify & Activate Safe Network</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

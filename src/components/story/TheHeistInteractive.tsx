import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  ShieldCheck,
  Heart,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  Send,
  Lock,
  Headphones,
  Smartphone,
  ChevronRight,
  Clock,
  HelpCircle,
  MessageSquare,
  KeyRound,
  LogIn,
  Award,
  Info,
} from 'lucide-react';
import { Ollie } from '../Ollie';
import { PhoneFrame } from '../PhoneFrame';
import { SoundAppShell } from '../SoundAppShell';
import { SmsThread } from '../SmsThread';
import { StaffConsole } from '../staff/StaffConsole';
import { sound } from '../../lib/audio';
import type { Member, BankEvent, Case } from '../../types';

interface TheHeistInteractiveProps {
  onBackToDashboard?: () => void;
  members?: Member[];
  events?: BankEvent[];
  cases?: Case[];
}

export const TheHeistInteractive: React.FC<TheHeistInteractiveProps> = ({
  onBackToDashboard,
  members = [],
  events = [],
  cases = [],
}) => {
  // 5 Step Interactive Flow
  // 1 = Onboarding / First-Time Drill
  // 2 = The Incoming Imposter Call
  // 3 = The High-Pressure Wire Transfer Attempt
  // 4 = Sound CU Safety Measurement (Before Money Moves)
  // 5 = Money Saved & Safe Outcome
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [onboardingStage, setOnboardingStage] = useState<'login' | 'drill' | 'shield_ready'>('login');
  const [drillCardsChecked, setDrillCardsChecked] = useState<number[]>([0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stressBpm, setStressBpm] = useState(72);
  const [scammerTurn, setScammerTurn] = useState(0);
  const [companionView, setCompanionView] = useState<'phone_only' | 'with_sms' | 'tri_view'>('phone_only');
  const [answeredChecks, setAnsweredChecks] = useState<number[]>([]);
  const [callConnected, setCallConnected] = useState(false);

  const defaultMember: Member = members[0] || {
    member_id: 'ANCHOR-A',
    display_name: 'Eleanor Vance',
    role: 'anchor',
    age_band: '65–74',
    usual_payment: 800,
    balance: 14200,
    trusted_contact: {
      name: 'Maya',
      relation: 'daughter',
      phone: '(253) 555-0147',
    },
    own_rules: [],
    practice_history: [],
    placeholder: false,
    phone_on_file: '(253) 555-0113',
    email_on_file: 'eleanor.v@example.com',
    story: 'Impersonation scam prevention target',
  };

  // Sound sync
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Audio handlers based on step
  useEffect(() => {
    if (step === 2 && !callConnected && soundEnabled) {
      sound.startRinging();
    } else {
      sound.stopRinging();
    }

    return () => {
      sound.stopRinging();
      sound.stopSpeaking();
    };
  }, [step, callConnected, soundEnabled]);

  // Scammer lines
  const scammerLines = [
    {
      text: "Eleanor! This is Sound Credit Union Fraud Operations. A suspicious $9,800 wire to an offshore account is pending right now! Did you authorize this?!",
      stress: 115,
    },
    {
      text: "Do NOT disconnect! Federal regulations require us to secure your balance into the Federal Escrow Lockbox immediately. Open your Sound app now!",
      stress: 138,
    },
  ];

  // Play scammer voice when in call
  useEffect(() => {
    if (step === 2 && callConnected) {
      const line = scammerLines[scammerTurn];
      setStressBpm(line.stress);
      sound.playAlert();
      sound.speakScammer(line.text);
    }
  }, [step, callConnected, scammerTurn]);

  // Heartbeat loop when stressed
  useEffect(() => {
    let timer: any;
    if (stressBpm > 100) {
      timer = setInterval(() => {
        sound.playHeartbeat();
      }, 60000 / stressBpm);
    }
    return () => clearInterval(timer);
  }, [stressBpm]);

  // Navigation handlers
  const handleAnswerCall = () => {
    sound.stopRinging();
    setCallConnected(true);
    setScammerTurn(0);
  };

  const handleProceedToTransfer = () => {
    sound.stopSpeaking();
    setStep(3);
    setStressBpm(142);
  };

  const handleAttemptSendWire = () => {
    sound.playCalmChord();
    setStep(4);
    setStressBpm(72); // Calmed by Ollie!
  };

  const handleCompleteSafetyCheck = () => {
    sound.playSuccess();
    setStep(5);
  };

  const handleReset = () => {
    sound.stopRinging();
    sound.stopSpeaking();
    setStep(1);
    setOnboardingStage('login');
    setDrillCardsChecked([0]);
    setCallConnected(false);
    setScammerTurn(0);
    setStressBpm(72);
    setAnsweredChecks([]);
  };

  return (
    <div className="min-h-[88vh] flex flex-col justify-between max-w-7xl mx-auto px-2 sm:px-4 py-4 select-none">
      {/* Top Controller Strip */}
      <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-sm space-y-3 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Mascot */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1">
              <Ollie mood="wave" size={32} animated={false} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-black text-sm text-navy-900 leading-none">
                  Sound Credit Union
                </span>
              </div>
              <span className="text-[11px] font-heading font-extrabold text-otter-700">
                Interactive Story: "Stop the Scam Before the Money Moves"
              </span>
            </div>
          </div>

          {/* View Toggles & Sound */}
          <div className="flex items-center space-x-2">
            {/* View Selector */}
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-xs font-heading font-extrabold">
              <button
                type="button"
                onClick={() => setCompanionView('phone_only')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                  companionView === 'phone_only'
                    ? 'bg-white shadow-xs text-navy-900'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Phone Only</span>
              </button>
              <button
                type="button"
                onClick={() => setCompanionView('with_sms')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                  companionView === 'with_sms'
                    ? 'bg-white shadow-xs text-navy-900'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Phone + Family SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setCompanionView('tri_view')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                  companionView === 'tri_view'
                    ? 'bg-white shadow-xs text-navy-900'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Phone + Staff Console</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (soundEnabled) {
                  sound.stopRinging();
                  sound.stopSpeaking();
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-heading font-bold flex items-center space-x-1.5 transition-colors ${
                soundEnabled
                  ? 'bg-sand-100 text-kelp-800 border-kelp-300'
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-kelp-700" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              title="Reset Story to Step 1"
              className="p-2 rounded-xl border border-slate-200 hover:bg-sand-100 text-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-3 py-1.5 rounded-xl bg-navy-900 text-white font-heading font-bold text-xs hover:bg-slate-800"
              >
                Full Dashboard
              </button>
            )}
          </div>
        </div>

        {/* 5-Step Story Progression Bar */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs font-heading font-extrabold pt-1">
          {[
            { s: 1, title: '1. First-Time Sign Up' },
            { s: 2, title: '2. The Imposter Call' },
            { s: 3, title: '3. Wire Under Duress' },
            { s: 4, title: '4. Safety Measurement Check' },
            { s: 5, title: '5. Money Stays Safe' },
          ].map((item) => (
            <button
              key={item.s}
              type="button"
              onClick={() => {
                sound.stopRinging();
                sound.stopSpeaking();
                setStep(item.s as any);
                if (item.s === 2) setCallConnected(false);
                if (item.s === 4) setStressBpm(72);
              }}
              className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center min-h-[46px] ${
                step === item.s
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-xs'
                  : step > item.s
                    ? 'bg-safe-50 text-safe-800 border-safe-300'
                    : 'bg-sand-50 text-slate-600 border-slate-200 hover:bg-sand-100'
              }`}
            >
              <span className="text-[11px] leading-tight">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Row */}
      <div className="flex-1 flex items-start justify-center gap-6 pb-2">
        {/* HERO: The Mobile Phone (390×844) */}
        <div className="shrink-0 transition-all">
          <PhoneFrame title="Sound Credit Union Mobile App">
            {/* SCREEN 1: FIRST-TIME SIGN UP & ONBOARDING DRILL */}
            {step === 1 && (
              <div className="flex-1 flex flex-col justify-between p-4 bg-sand-50 text-navy-900 font-body animate-fadeIn">
                {/* 1A: Mobile Login / Activation Screen */}
                {onboardingStage === 'login' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
                    <div className="pt-2 text-center space-y-2">
                      <div className="w-14 h-14 mx-auto rounded-3xl bg-kelp-50 border-2 border-kelp-200 flex items-center justify-center p-2 shadow-2xs">
                        <Ollie mood="wave" size={48} animated={false} />
                      </div>
                      <div>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <KeyRound className="w-3 h-3 text-amber-700" />
                          <span>First-Time Mobile Sign-In Detected</span>
                        </span>
                        <h2 className="font-heading font-black text-xl text-navy-900 mt-1">
                          Sound Mobile Banking
                        </h2>
                        <p className="text-xs text-slate-500">
                          Welcome, Eleanor Vance (Member #••••-8821)
                        </p>
                      </div>
                    </div>

                    {/* Member Credentials Card */}
                    <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2.5 text-xs shadow-2xs">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                          Member ID / Username
                        </label>
                        <div className="p-2.5 bg-sand-50 rounded-xl border border-slate-200 font-mono text-xs text-navy-900 flex items-center justify-between">
                          <span>eleanor.vance</span>
                          <CheckCircle2 className="w-4 h-4 text-safe-600" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                          Password
                        </label>
                        <div className="p-2.5 bg-sand-50 rounded-xl border border-slate-200 font-mono text-xs text-navy-900 flex items-center justify-between">
                          <span>••••••••••••</span>
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>

                      {/* First-Time Policy Callout */}
                      <div className="p-2.5 rounded-xl bg-foam-50 border border-kelp-200 text-slate-700 space-y-1">
                        <div className="flex items-center space-x-1.5 text-kelp-900 font-heading font-extrabold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-kelp-700" />
                          <span>First-Time Sign-Up Safety Policy:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Under Sound Credit Union's <strong>Otter Shield</strong> charter, all first-time members complete an interactive 30-second scam defense drill before funds transfers are enabled.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playSuccess();
                          setOnboardingStage('drill');
                        }}
                        className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In & Begin Defense Activity</span>
                      </button>
                      <span className="text-[10px] text-center text-slate-400 font-mono block">
                        🛡️ 30-second interactive defense drill with Ollie
                      </span>
                    </div>
                  </div>
                )}

                {/* 1B: Interactive Scam Defense Drill */}
                {onboardingStage === 'drill' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-2.5">
                    <div className="pt-1 text-center space-y-1.5">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1 shadow-2xs">
                        <Ollie mood="wave" size={42} animated={false} />
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-kelp-100 text-kelp-900">
                        First-Time Safety Activity ({drillCardsChecked.length}/3 Rehearsed)
                      </span>
                      <h3 className="font-heading font-black text-base text-navy-900">
                        Spot the 3 Scammer Tricks
                      </h3>
                      <p className="text-[11px] text-slate-600 px-2">
                        Tap each card to rehearse how you and Sound Credit Union defend your funds:
                      </p>
                    </div>

                    {/* 3 Interactive Cards */}
                    <div className="space-y-2 text-xs">
                      {[
                        {
                          id: 0,
                          icon: '🚨',
                          title: '1. Urgency Panic Tactic',
                          scammerSays: '"Emergency! Wire $9,800 immediately or your account is frozen!"',
                          defenseLearned: 'Sound CU never rushes you. We always give you time to stop and verify.',
                        },
                        {
                          id: 1,
                          icon: '🏛️',
                          title: '2. The "Safe Escrow" Trap',
                          scammerSays: '"Move your money to the Federal Safe Lockbox to protect it!"',
                          defenseLearned: 'Sound CU will NEVER ask you to wire money to an outside account to protect it.',
                        },
                        {
                          id: 2,
                          icon: '🤐',
                          title: '3. Secrecy & Isolation Order',
                          scammerSays: '"Stay on the phone! Do NOT tell branch staff or your daughter Maya!"',
                          defenseLearned: 'Real financial safety is transparent. Maya is linked as your trusted guardian.',
                        },
                      ].map((card) => {
                        const isLearned = drillCardsChecked.includes(card.id);
                        return (
                          <div
                            key={card.id}
                            onClick={() => {
                              if (!drillCardsChecked.includes(card.id)) {
                                sound.playAlert();
                                setDrillCardsChecked([...drillCardsChecked, card.id]);
                              }
                            }}
                            className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                              isLearned
                                ? 'bg-white border-kelp-400 shadow-2xs'
                                : 'bg-sand-50 border-slate-300 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-1">
                              <span className="font-heading font-extrabold text-[11px] text-navy-900 flex items-center space-x-1.5">
                                <span>{card.icon}</span>
                                <span>{card.title}</span>
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isLearned
                                  ? 'bg-safe-100 text-safe-800'
                                  : 'bg-sand-200 text-slate-600'
                              }`}>
                                {isLearned ? '✓ Learned' : 'Tap to Learn'}
                              </span>
                            </div>
                            <p className="text-[10px] text-red-700 italic font-medium">
                              {card.scammerSays}
                            </p>
                            {isLearned && (
                              <p className="text-[10px] text-kelp-800 font-semibold pt-1 border-t border-slate-100 mt-1">
                                🛡️ {card.defenseLearned}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        disabled={drillCardsChecked.length < 3}
                        onClick={() => {
                          sound.playSuccess();
                          setOnboardingStage('shield_ready');
                        }}
                        className={`w-full min-h-[46px] font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform ${
                          drillCardsChecked.length >= 3
                            ? 'bg-kelp-700 hover:bg-kelp-800 text-white active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Lock In Defense Rules & Activate Otter Shield</span>
                      </button>
                      <span className="text-[10px] text-center text-slate-400 font-mono block">
                        {drillCardsChecked.length < 3 ? 'Tap all 3 defense cards above' : 'Ready to activate!'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 1C: Otter Shield Certified & Family Guardian Setup */}
                {onboardingStage === 'shield_ready' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
                    <div className="pt-2 text-center space-y-2">
                      <div className="w-14 h-14 mx-auto rounded-3xl bg-safe-50 border-2 border-safe-200 flex items-center justify-center p-2 shadow-2xs">
                        <Ollie mood="cheer" size={50} animated={true} />
                      </div>
                      <div>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-safe-100 text-safe-800 border border-safe-300">
                          <Award className="w-3 h-3 text-safe-700" />
                          <span>Otter Shield Certified</span>
                        </span>
                        <h2 className="font-heading font-black text-xl text-navy-900 mt-1">
                          Defense Shield Active!
                        </h2>
                        <p className="text-xs text-slate-600 px-2 leading-relaxed">
                          Eleanor's Sound Credit Union account is now protected with proactive pre-movement circuit breakers.
                        </p>
                      </div>
                    </div>

                    {/* Active Protections Summary */}
                    <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs shadow-2xs">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-navy-900 font-heading block">Pre-Movement Pause Rule</strong>
                          <span className="text-[11px] text-slate-500">
                            If Sound detects scam tricks (active call, urgency, unfamiliar escrow wire), funds pause instantly in your account.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-navy-900 font-heading block">Safety Measurement Check</strong>
                          <span className="text-[11px] text-slate-500">
                            The exact 3 questions you just practiced will appear before money moves to verify safety.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-navy-900 font-heading block">Family Circle Guardian (Maya)</strong>
                          <span className="text-[11px] text-slate-500">
                            Daughter Maya ({defaultMember.trusted_contact?.phone}) linked for instant SMS if high-risk wires are attempted.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(2);
                          setCallConnected(false);
                        }}
                        className="w-full min-h-[48px] bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95 animate-pulse"
                      >
                        <span>Simulate Real-World Attack (Imposter Call)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-center text-slate-400 font-mono block">
                        🔊 Sound enabled: Test your defense against the imposter
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCREEN 2: INCOMING CALL OR ACTIVE CALL */}
            {step === 2 && !callConnected && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white text-center font-body animate-fadeIn">
                <div className="pt-8 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-900/60 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold uppercase tracking-wider animate-pulse">
                    Incoming Call · Spoofed Number
                  </span>
                  <h3 className="font-heading font-black text-2xl text-white">
                    Sound CU Fraud Alert
                  </h3>
                  <p className="font-mono text-xs text-slate-400">(253) 555-0199 (Spoofed)</p>
                </div>

                {/* Ringing Visualizer */}
                <div className="my-auto py-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-ping">
                    <PhoneCall className="w-10 h-10 text-red-400" />
                  </div>
                  <p className="text-xs text-slate-400 italic pt-6 px-4">
                    The imposter uses a spoofed caller ID pretending to be Sound Credit Union security.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="min-h-[48px] rounded-full bg-slate-800 text-slate-300 font-heading font-bold text-xs flex items-center justify-center"
                  >
                    <PhoneOff className="w-4 h-4 mr-1 text-red-400" />
                    <span>Decline</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAnswerCall}
                    className="min-h-[48px] rounded-full bg-safe-600 hover:bg-safe-700 text-white font-heading font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg animate-pulse"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Answer Call</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2 (CONNECTED): SCAMMER DIALOGUE & LIVE PRESSURE */}
            {step === 2 && callConnected && (
              <div className="flex-1 flex flex-col justify-between p-4 bg-white text-navy-900 font-body animate-fadeIn">
                {/* Active Call Status Bar */}
                <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-md border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-1.5 text-red-400">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>CALL IN PROGRESS (0:34)</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">Speaker ON</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-heading font-black text-sm text-white">
                        Fake Agent Miller (Imposter)
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">Claims to be Sound Fraud Dept</div>
                    </div>
                    <div className="flex items-center space-x-1 text-red-400 font-mono text-xs font-bold">
                      <Heart className="w-4 h-4 animate-ping fill-current" />
                      <span>{stressBpm} BPM</span>
                    </div>
                  </div>
                </div>

                {/* Spoken Text from Caller */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3.5 space-y-1.5 my-auto">
                  <span className="font-heading font-extrabold text-[10px] uppercase text-red-700 tracking-wider block">
                    Scammer Is Shouting Over Phone:
                  </span>
                  <p className="font-heading font-bold text-navy-900 text-xs leading-snug">
                    "{scammerLines[scammerTurn].text}"
                  </p>
                  <span className="text-[10px] text-red-600 font-mono block pt-1">
                    ⚡ Psychological Weapon: High urgency + fear of 90-day account freeze.
                  </span>
                </div>

                {/* Ollie's Whisper Guidance */}
                <div className="bg-foam-50 border border-kelp-200 rounded-2xl p-2.5 flex items-start space-x-2">
                  <div className="shrink-0 mt-0.5">
                    <Ollie mood="think" size={30} animated={false} />
                  </div>
                  <div className="text-[11px] text-navy-900 leading-tight">
                    <strong className="text-kelp-800 font-heading block">Ollie's Gut-Check Radar:</strong>
                    <span>
                      Notice how the caller refuses to let you hang up? Real banks always encourage direct callbacks.
                    </span>
                  </div>
                </div>

                {/* Interactive Player Action */}
                <div className="pt-2">
                  {scammerTurn === 0 ? (
                    <button
                      type="button"
                      onClick={() => setScammerTurn(1)}
                      className="w-full min-h-[46px] bg-red-600 hover:bg-red-700 text-white font-heading font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <span>Eleanor Panics: "What should I do?!"</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleProceedToTransfer}
                      className="w-full min-h-[48px] bg-red-700 hover:bg-red-800 text-white font-heading font-black text-xs rounded-full shadow-lg flex items-center justify-center space-x-2 animate-pulse"
                    >
                      <span>Open Sound App to Wire Funds (Under Duress)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 3: IN-APP TRANSFER FORM (UNDER DURESS) */}
            {step === 3 && (
              <SoundAppShell
                member={defaultMember}
                lang="en"
                onToggleLang={() => {}}
                activeNav="pay"
              >
                <div className="flex-1 flex flex-col justify-between py-1 space-y-3 animate-fadeIn">
                  {/* Phone Call Active Banner in Sound App */}
                  <div className="bg-red-600 text-white p-2 rounded-xl text-xs flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-1.5">
                      <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                      <span className="font-heading font-bold text-[11px]">
                        Active Call: "Agent Miller" (138 BPM)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-red-100">"Hurry, hit send!"</span>
                  </div>

                  {/* Wire Transfer Details Form */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs">
                    <span className="font-heading font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block">
                      Transfer Money
                    </span>

                    <div className="p-2.5 rounded-xl bg-sand-50 border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 block">RECIPIENT</span>
                      <span className="font-heading font-bold text-navy-900 block truncate">
                        Federal Reserve Escrow Lockbox (example)
                      </span>
                      <span className="text-[10px] font-bold text-check-700 font-mono">
                        * First time paying this recipient
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-sand-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block">AMOUNT</span>
                        <span className="text-xl font-heading font-black text-navy-900">$9,800.00</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        WIRE TRANSFER
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 px-1">
                      Available checking: <strong>$14,200.00</strong> (Payment represents 69% of balance)
                    </div>
                  </div>

                  {/* The Trigger Button */}
                  <div className="space-y-1.5 pt-2">
                    <button
                      type="button"
                      onClick={handleAttemptSendWire}
                      className="w-full min-h-[48px] bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs rounded-full shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>Authorize $9,800 Wire Transfer</span>
                    </button>
                    <span className="text-[10px] text-center text-slate-400 font-mono block">
                      ⚡ Sound Credit Union rules analyze the transaction before funds move
                    </span>
                  </div>
                </div>
              </SoundAppShell>
            )}

            {/* SCREEN 4: SOUND CU SAFETY MEASUREMENT CHECK (BEFORE MONEY MOVES) */}
            {step === 4 && (
              <SoundAppShell
                member={defaultMember}
                lang="en"
                onToggleLang={() => {}}
                activeNav="pay"
              >
                <div className="flex-1 flex flex-col justify-between py-1 space-y-2.5 animate-slideUp">
                  {/* Ollie Calm Interruption Header */}
                  <div className="bg-foam-50 border-2 border-kelp-400 rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-kelp-200 flex items-center justify-center p-0.5 shadow-2xs">
                        <Ollie mood="concerned" size={40} animated={true} />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.2 rounded-full bg-check-200 text-check-800 text-[9px] font-mono font-bold uppercase">
                          Payment Paused · Money Safe
                        </span>
                        <h3 className="font-heading font-black text-base text-navy-900 leading-tight">
                          Hold on, Eleanor.
                        </h3>
                        <p className="text-[11px] text-slate-600">
                          Your $9,800 is still safely in your account.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Safety Measurement Activity (Echoing First-Time Sign-Up Drill) */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-heading font-extrabold text-[11px] text-kelp-800 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-kelp-700" />
                        <span>Pre-Movement Safety Measurement Check</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Echoing Day 1 Drill</span>
                    </div>

                    <p className="text-[10px] text-slate-600 leading-tight">
                      Sound's risk rules flagged an active call during an unusual wire. Answer the 3 safety checks to confirm whether you are safe:
                    </p>

                    <div className="space-y-1.5">
                      {[
                        {
                          id: 0,
                          q: '1. Urgency: Did a caller claim your funds are in danger right now?',
                          tag: 'Urgency Trap',
                        },
                        {
                          id: 1,
                          q: '2. Safe Escrow: Did they tell you to wire funds to "Federal Escrow"?',
                          tag: 'Escrow Trap',
                        },
                        {
                          id: 2,
                          q: '3. Isolation: Did they command you NOT to tell Sound staff or Maya?',
                          tag: 'Secrecy Trap',
                        },
                      ].map((item) => {
                        const isAnswered = answeredChecks.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (!answeredChecks.includes(item.id)) {
                                sound.playAlert();
                                setAnsweredChecks([...answeredChecks, item.id]);
                              }
                            }}
                            className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              isAnswered
                                ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-2xs'
                                : 'bg-sand-50 border-slate-200 hover:bg-white text-slate-700'
                            }`}
                          >
                            <div className="pr-2">
                              <span className="text-[10.5px] block leading-tight">{item.q}</span>
                              <span className="text-[9px] font-mono text-slate-400">{item.tag}</span>
                            </div>
                            <span className={`font-mono text-[10px] uppercase font-bold shrink-0 px-2 py-0.5 rounded-full ${
                              isAnswered ? 'bg-amber-200 text-amber-900' : 'bg-sand-200 text-slate-600'
                            }`}>
                              {isAnswered ? 'YES ⚠️' : 'Tap Yes'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Red Flag Assessment Reassurance */}
                  {answeredChecks.length > 0 ? (
                    <div className="p-2.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-xs space-y-1 animate-pulse">
                      <div className="flex items-center space-x-1.5 font-heading font-black text-[11px] text-red-800">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{answeredChecks.length} of 3 Scam Signatures Confirmed!</span>
                      </div>
                      <p className="text-[10px] leading-tight text-red-700">
                        The caller is an imposter. Sound Credit Union will NEVER ask you to wire money to protect your account. Your $9,800 is safely held.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="text-[11px] font-semibold leading-tight">
                        Real credit unions will never ask you to move money to keep it safe.
                      </span>
                    </div>
                  )}

                  {/* Protective Choices: No "Send Anyway" Button! */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={handleCompleteSafetyCheck}
                      className="w-full min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cancel Payment & Keep My $9,800 Safe</span>
                    </button>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                      <span>🔒 Zero bypass lane</span>
                      <span className="text-kelp-700 font-bold">Maya notified via SMS</span>
                    </div>
                  </div>
                </div>
              </SoundAppShell>
            )}

            {/* SCREEN 5: SCAM STOPPED & PROTECTED OUTCOME */}
            {step === 5 && (
              <div className="flex-1 flex flex-col justify-between p-5 bg-white text-navy-900 text-center font-body animate-fadeIn">
                <div className="pt-4 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-safe-50 border-2 border-safe-200 flex items-center justify-center p-2 shadow-2xs">
                    <Ollie mood="cheer" size={60} animated={true} />
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-safe-100 text-safe-800 border border-safe-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero Dollars Lost · $9,800 Safe</span>
                    </span>
                    <h2 className="font-heading font-black text-xl text-navy-900">
                      Scam Stopped Cold!
                    </h2>
                    <p className="text-xs text-slate-600 px-2 leading-relaxed">
                      Because Sound Credit Union enforced the safety check before the money moved, Eleanor's
                      savings remained completely intact.
                    </p>
                  </div>
                </div>

                {/* 2-Pillar Verification Shield */}
                <div className="bg-sand-50 rounded-2xl p-3 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy-900 font-heading block">Family Contact (Maya) Alerted</strong>
                      <span className="text-[11px] text-slate-500">
                        SMS dispatched: <em>"Sound paused a payment for Eleanor. Please call her directly."</em>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy-900 font-heading block">Sound Care Staff Case Held</strong>
                      <span className="text-[11px] text-slate-500">
                        Employee verified imposter scam signature and engaged <strong>Keep Holding</strong>.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay Interactive Journey</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    HuskyHack 2026 · Sound Credit Union & UW Tacoma
                  </span>
                </div>
              </div>
            )}
          </PhoneFrame>
        </div>

        {/* COMPANION 1: Second Phone (Maya's SMS Thread) */}
        {(companionView === 'with_sms' || companionView === 'tri_view') && (
          <div className="shrink-0 hidden lg:block animate-fadeIn">
            <SmsThread
              member={defaultMember}
              mode="sms"
              lang="en"
              scenario="scam"
            />
          </div>
        )}

        {/* COMPANION 2: Staff Console Panel */}
        {companionView === 'tri_view' && (
          <div className="flex-1 min-w-[360px] max-w-xl shrink-0 hidden md:block animate-fadeIn">
            <StaffConsole
              cases={cases}
              events={events}
              members={members}
              selectedCaseId="CASE-DEMO-SCAM"
              onSelectCase={() => {}}
              onDecision={() => {}}
            />
          </div>
        )}
      </div>

      {/* Narrative Footer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 text-center text-xs text-slate-500 font-mono">
        💡 <strong>The Core Innovation:</strong> Training members on day one, and replaying the exact matching safety activity before high-risk payments move.
      </div>
    </div>
  );
};

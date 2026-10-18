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
                <span className="text-[10px] font-mono font-medium text-slate-500 bg-sand-100 px-2 py-0.2 rounded-full border border-sand-200">
                  (prototype)
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
                <div className="pt-2 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-kelp-50 border-2 border-kelp-200 flex items-center justify-center p-2 shadow-2xs">
                    <Ollie mood="wave" size={56} animated={true} />
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-kelp-100 text-kelp-900">
                      <Sparkles className="w-3 h-3 text-kelp-700" />
                      <span>Sound Member First-Time Sign Up</span>
                    </span>
                    <h2 className="font-heading font-black text-xl text-navy-900 leading-tight">
                      Welcome to Sound, {defaultMember.display_name}!
                    </h2>
                    <p className="text-xs text-slate-600 px-2 leading-relaxed">
                      At Sound Credit Union, your security starts on day one. Before you make your first transfer,
                      Ollie trains you to spot imposter calls.
                    </p>
                  </div>
                </div>

                {/* 3 Protection Commitments */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy-900 font-heading block">Interactive Defense Drill</strong>
                      <span className="text-[11px] text-slate-500">
                        Practice resisting urgent social engineering calls in a zero-risk sandbox.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy-900 font-heading block">Pre-Movement Circuit Breaker</strong>
                      <span className="text-[11px] text-slate-500">
                        If a payment looks like a scam, funds pause in your account while you review.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy-900 font-heading block">Family Circle Guardian</strong>
                      <span className="text-[11px] text-slate-500">
                        Maya is alerted automatically if an unfamiliar large transfer is held.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      setCallConnected(false);
                    }}
                    className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                  >
                    <span>Simulate Incoming Imposter Call</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-center text-slate-400 font-mono block">
                    🔊 Turn on audio to hear the live call & ringtone
                  </span>
                </div>
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

                  {/* Safety Measurement Activity (Memory Replay) */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-heading font-extrabold text-[11px] text-kelp-800">
                        Ollie's 30-Second Safety Measurement
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Remember Oct 3 drill</span>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        'Did someone call or text and tell you to send this?',
                        'Did they say to act fast or keep it secret?',
                        'Did they claim your money is in danger?',
                      ].map((questionText, idx) => {
                        const isAnswered = answeredChecks.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!answeredChecks.includes(idx)) {
                                sound.playAlert();
                                setAnsweredChecks([...answeredChecks, idx]);
                              }
                            }}
                            className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              isAnswered
                                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                                : 'bg-sand-50 border-slate-200 hover:bg-sand-100 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] pr-2">{questionText}</span>
                            <span className="font-mono text-[10px] uppercase font-bold text-kelp-700 shrink-0">
                              {isAnswered ? 'YES ⚠️' : 'Tap Yes'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Red Flag Assessment Reassurance */}
                  <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-[11px] font-semibold leading-tight">
                      Real credit unions will never ask you to move money to keep it safe.
                    </span>
                  </div>

                  {/* Protective Choices: No "Send Anyway" Button! */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={handleCompleteSafetyCheck}
                      className="w-full min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cancel Payment & Talk to Sound</span>
                    </button>
                    <span className="text-[10px] text-center text-slate-500 font-mono block">
                      🔒 Zero bypass lane: Funds cannot move until confirmed safe.
                    </span>
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

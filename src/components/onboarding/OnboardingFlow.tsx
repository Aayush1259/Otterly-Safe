import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneOff,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { Ollie } from '../Ollie';
import { OllieBubble } from '../OllieBubble';
import type { Lang, Member } from '../../types';

interface OnboardingFlowProps {
  member: Member;
  lang: Lang;
  onComplete: () => void;
  onExit: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  member,
  lang,
  onComplete,
  onExit,
}) => {
  const [phase, setPhase] = useState<'welcome' | 'roleplay' | 'trusted_contact' | 'badge'>('welcome');
  const [callTurn, setCallTurn] = useState(0);
  const [manipulationScore, setManipulationScore] = useState(0);
  const [callOutcome, setCallOutcome] = useState<'in_progress' | 'defended' | 'compromised'>('in_progress');
  const [trustedName, setTrustedName] = useState(member.trusted_contact?.name || 'Maya');
  const [trustedPhone, setTrustedPhone] = useState(member.trusted_contact?.phone || '(253) 555-0147');
  const [shieldActive, setShieldActive] = useState(false);

  // Scripted Role-Play Scenario: "The Imposter Security Officer"
  const callTurns = [
    {
      scammerLine:
        "Emergency alert from Sound Security. We detect a $3,450 wire to Miami right now. Did you authorize this?!",
      tactic: "Artificial Urgency & Panic",
      tacticExpl: "Scammers create panic so you act before thinking.",
      choices: [
        {
          text: "No! Please stop it! What do I need to do?!",
          type: "panicked",
          deltaScore: 35,
          ollieTip: "Take a deep breath. Scammers manufacture panic to hijack your decisions.",
        },
        {
          text: "Which account ending in what numbers? Can you verify my zip code?",
          type: "cautious",
          deltaScore: 0,
          ollieTip: "Smart! Ask them to verify Sound information. Never volunteer your details.",
        },
        {
          text: "I'm hanging up and calling Sound Credit Union directly at (253) 555-0100.",
          type: "defensive",
          deltaScore: -10,
          ollieTip: "The #1 move! Real financial institutions encourage you to call back directly.",
        },
      ],
    },
    {
      scammerLine:
        "Don't hang up! If you disconnect, federal rules require us to freeze all your accounts for 90 days. We need your 6-digit OTP code to reverse it.",
      tactic: "Fear of Penalty & Secrecy",
      tacticExpl: "Threatening account freezes and demanding one-time codes.",
      choices: [
        {
          text: "Okay, the code just texted to me is 829-104. Fix it quickly!",
          type: "compromised",
          deltaScore: 50,
          ollieTip: "Danger! Sound will NEVER ask for your one-time text verification codes.",
        },
        {
          text: "Sound text says: 'NEVER share this code with anyone, including staff.'",
          type: "cautious",
          deltaScore: 5,
          ollieTip: "Spot on! The warning text in the SMS explicitly warns about callers.",
        },
        {
          text: "I am disconnecting now. Real credit unions never threaten 90-day freezes.",
          type: "defensive",
          deltaScore: -20,
          ollieTip: "Golden rule: Any caller demanding you stay on the line is a scammer.",
        },
      ],
    },
    {
      scammerLine:
        "Your branch manager is currently under internal investigation. You must move your funds to the Federal Safe Lockbox wire immediately. Do not tell anyone.",
      tactic: "Isolation & Safe Account Trap",
      tacticExpl: "Telling you branch staff can't be trusted and asking you to wire money.",
      choices: [
        {
          text: "How do I wire it? Give me the Federal Lockbox account number.",
          type: "compromised",
          deltaScore: 40,
          ollieTip: "Real banks never ask you to move money to keep it safe.",
        },
        {
          text: "There is no such thing as a 'Federal Safe Account' for retail deposits.",
          type: "defensive",
          deltaScore: -30,
          ollieTip: "100% correct! Deposits in Sound are already NCUA insured up to $250,000.",
        },
        {
          text: "I am walking into my local Sound branch right now to verify this in person.",
          type: "defensive",
          deltaScore: -30,
          ollieTip: "Game over for the scammer! Face-to-face verification stops scams cold.",
        },
      ],
    },
  ];

  const handleChoice = (choice: (typeof callTurns)[0]['choices'][0]) => {
    const nextScore = Math.min(100, Math.max(0, manipulationScore + choice.deltaScore));
    setManipulationScore(nextScore);

    if (choice.type === 'compromised' && nextScore >= 80) {
      setCallOutcome('compromised');
      return;
    }

    if (callTurn < callTurns.length - 1) {
      setCallTurn((prev) => prev + 1);
    } else {
      setCallOutcome('defended');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-sand-50 min-h-full font-body">
      {/* Top Bar with Step Dots */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-1.5">
          <div className="w-7 h-7 rounded-lg bg-kelp-100 flex items-center justify-center">
            <Ollie mood="wave" size={24} animated={false} />
          </div>
          <div>
            <span className="text-xs font-heading font-black text-navy-900 block leading-tight">
              Member First-Time Sign Up
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Otter Shield Activation</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="text-xs font-heading font-bold text-slate-500 hover:text-navy-900 bg-sand-100 px-2.5 py-1 rounded-full border border-slate-200"
        >
          Exit Demo
        </button>
      </div>

      {/* PHASE 1: Welcome Screen */}
      {phase === 'welcome' && (
        <div className="my-auto space-y-4 text-center animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-kelp-50 border-2 border-kelp-200 flex items-center justify-center p-2 shadow-sm">
            <Ollie mood="wave" size={68} animated={true} />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading font-black text-xl text-navy-900">
              Welcome to Sound Credit Union, {member.display_name}!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Before you make your first transfer, let's practice with <strong>Ollie</strong> so
              scammers can never trick you into sending your hard-earned money.
            </p>
          </div>

          {/* Quick Perks */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-900 block font-heading">Interactive Imposter Simulation</strong>
                <span className="text-slate-500 text-[11px]">
                  Experience a 60-second high-pressure scammer call in a safe sandbox.
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-900 block font-heading">Family Trusted Circle</strong>
                <span className="text-slate-500 text-[11px]">
                  Designate a family guardian who gets alerted only if payment pauses.
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-900 block font-heading">Automatic Safety Rule</strong>
                <span className="text-slate-500 text-[11px]">
                  Lock down new payees over $1,000 to keep funds safe.
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('roleplay')}
            className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-sm rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <span>Start 60-Second Security Role-Play</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PHASE 2: Interactive Imposter Call Mini-Game */}
      {phase === 'roleplay' && callOutcome === 'in_progress' && (
        <div className="flex-1 flex flex-col justify-between py-2 space-y-3 animate-fadeIn">
          {/* Simulated Incoming Call Header */}
          <div className="bg-navy-900 text-white rounded-2xl p-3 shadow-md border border-navy-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="font-mono text-[11px] font-bold text-red-300 uppercase tracking-wider">
                  Live Imposter Call Simulator
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-300">
                <Volume2 className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">Turn {callTurn + 1} of 3</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-heading font-black text-sm text-white">
                  "Federal Fraud Prevention Unit"
                </div>
                <div className="text-[11px] font-mono text-slate-400">Caller ID: (800) 555-0199 (Spoofed)</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>

            {/* Scammer Tactic Tag */}
            <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-amber-300 font-semibold">Tactic: {callTurns[callTurn].tactic}</span>
              <span className="text-slate-400 font-mono text-[10px]">
                Pressure Level: {manipulationScore}%
              </span>
            </div>
          </div>

          {/* Scammer Speech Bubble */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-xs space-y-1">
            <span className="font-heading font-bold text-red-900 uppercase tracking-wide text-[10px] block">
              Caller insists:
            </span>
            <p className="font-heading font-bold text-navy-900 leading-snug">
              "{callTurns[callTurn].scammerLine}"
            </p>
            <span className="text-[10px] text-red-700 italic block pt-0.5">
              💡 {callTurns[callTurn].tacticExpl}
            </span>
          </div>

          {/* Ollie's Whispered Coaching Bubble */}
          <div className="flex items-start space-x-2 bg-foam-50 border border-kelp-200 rounded-2xl p-2.5">
            <div className="shrink-0 mt-0.5">
              <Ollie mood="think" size={32} animated={false} />
            </div>
            <div className="text-[11px] text-navy-900">
              <strong className="text-kelp-800 font-heading block">Ollie's Gut-Check Radar:</strong>
              <span>
                Look out for urgency or threats. Real credit unions never rush you or ask for secret codes.
              </span>
            </div>
          </div>

          {/* Player Interactive Response Choices */}
          <div className="space-y-2">
            <span className="text-[11px] font-heading font-extrabold text-slate-500 uppercase tracking-wider block">
              How do you respond?
            </span>
            {callTurns[callTurn].choices.map((choice, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-kelp-600 bg-white hover:bg-kelp-50/50 transition-all text-xs font-heading font-bold text-navy-900 shadow-2xs min-h-[44px] flex items-center justify-between group"
              >
                <span className="pr-2">{choice.text}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-kelp-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 2 Outcomes */}
      {phase === 'roleplay' && callOutcome === 'defended' && (
        <div className="my-auto space-y-4 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-safe-50 border-2 border-safe-200 flex items-center justify-center p-2 shadow-sm text-safe-700">
            <Ollie mood="cheer" size={60} animated={true} />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-safe-100 text-safe-800 border border-safe-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Scammer Neutralized</span>
            </span>
            <h3 className="font-heading font-black text-xl text-navy-900">
              Incredible instincts, {member.display_name}!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              You spotted the artificial urgency, protected your verification code, and refused to move money to a fake "safe account."
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200 text-left text-xs space-y-1.5">
            <strong className="text-navy-900 font-heading block">Three Takeaways Remembered:</strong>
            <div className="text-[11px] text-slate-600 space-y-1">
              <div>✓ Sound never asks for your one-time passwords over the phone.</div>
              <div>✓ Real banks never tell you to wire funds to keep them safe.</div>
              <div>✓ Hanging up and calling the number on your debit card always protects you.</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('trusted_contact')}
            className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-2"
          >
            <span>Next: Enroll Trusted Family Guardian</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {phase === 'roleplay' && callOutcome === 'compromised' && (
        <div className="my-auto space-y-4 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center p-2 text-amber-700">
            <Ollie mood="concerned" size={60} animated={false} />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading font-black text-lg text-navy-900">
              Tricky one! That was a close call.
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              The caller applied psychological pressure and asked for your private verification code.
              Let's replay with Ollie's safety net!
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCallTurn(0);
              setManipulationScore(0);
              setCallOutcome('in_progress');
            }}
            className="w-full min-h-[46px] bg-sand-200 hover:bg-sand-300 text-navy-900 font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try the Role-Play Again</span>
          </button>
        </div>
      )}

      {/* PHASE 3: Trusted Contact Setup */}
      {phase === 'trusted_contact' && (
        <div className="my-auto space-y-4 text-center animate-fadeIn">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sand-100 border border-slate-300 flex items-center justify-center text-otter-700">
            <Users className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading font-black text-lg text-navy-900">
              Add a Trusted Family Contact
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              If rules ever pause an unfamiliar large payment, Sound sends a text to your trusted contact asking them to call you. 
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200 text-left space-y-2.5 text-xs">
            <div>
              <label className="text-[11px] font-heading font-bold text-slate-600 block mb-1">
                Trusted Contact Name
              </label>
              <input
                type="text"
                value={trustedName}
                onChange={(e) => setTrustedName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-navy-900"
                placeholder="e.g. Maya (daughter)"
              />
            </div>
            <div>
              <label className="text-[11px] font-heading font-bold text-slate-600 block mb-1">
                Mobile Number (for SMS Alerts)
              </label>
              <input
                type="text"
                value={trustedPhone}
                onChange={(e) => setTrustedPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-mono text-navy-900"
                placeholder="(253) 555-01xx"
              />
            </div>
            <div className="p-2 rounded-xl bg-foam-50 text-[11px] text-kelp-800 border border-kelp-200">
              🔒 <strong>Privacy Guard:</strong> Your trusted contact never sees your account balances, transaction amounts, or payee names.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('badge')}
            className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-2"
          >
            <span>Confirm & Activate Protection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PHASE 4: Badge & Rule Activation Confirmation */}
      {phase === 'badge' && (
        <div className="my-auto space-y-4 text-center animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center p-2 shadow-md">
            <Award className="w-12 h-12 text-amber-600 animate-bounce" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Otter Shield Certified · Level 1</span>
            </span>
            <h3 className="font-heading font-black text-xl text-navy-900">
              Otterly Safe Protection Active!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your member profile has been calibrated with custom protective rules.
            </p>
          </div>

          {/* Activated Policies */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-kelp-700" />
                <span className="font-heading font-bold text-navy-900 text-[11px]">
                  Safety Rule: Hold new payees over $1,000
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-safe-700 bg-safe-50 px-1.5 py-0.5 rounded">
                ENABLED
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-kelp-700" />
                <span className="font-heading font-bold text-navy-900 text-[11px]">
                  Family Guardian: {trustedName} ({trustedPhone})
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-safe-700 bg-safe-50 px-1.5 py-0.5 rounded">
                LINKED
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="w-full min-h-[48px] bg-safe-700 hover:bg-safe-800 text-white font-heading font-extrabold text-sm rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Go to Sound Account Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );
};

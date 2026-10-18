import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  PhoneCall,
  Volume2,
  VolumeX,
  Send,
  Heart,
  KeyRound,
  LogIn,
  Award,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Headphones,
  Gamepad2,
  Home,
  ArrowLeftRight,
} from 'lucide-react';
import { Ollie } from '../Ollie';
import { PhoneFrame } from '../PhoneFrame';
import { SoundAppShell } from '../SoundAppShell';
import { SmsThread } from '../SmsThread';
import { StaffConsole } from '../staff/StaffConsole';
import { ScamOrLegitDeck } from '../practice/ScamOrLegitDeck';
import { RolePlayChat } from '../practice/RolePlayChat';
import { QuickQuiz } from '../practice/QuickQuiz';
import { sound } from '../../lib/audio';
import type { Member, BankEvent, Case, Card, Lang } from '../../types';

interface OtterlySafeMobileAppProps {
  member?: Member;
  cards?: Card[];
  events?: BankEvent[];
  cases?: Case[];
}

export const OtterlySafeMobileApp: React.FC<OtterlySafeMobileAppProps> = ({
  member: initialMember,
  cards = [],
  events = [],
  cases = [],
}) => {
  const defaultMember: Member = initialMember || {
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

  const [member, setMember] = useState<Member>(defaultMember);
  const [lang, setLang] = useState<Lang>('en');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // App Level Mode
  // 'onboarding' = First-time sign up & learning activity
  // 'app' = Main Sound Credit Union mobile banking app
  const [appMode, setAppMode] = useState<'onboarding' | 'app'>('onboarding');

  // In-App Navigation Tab: 'accounts' | 'pay' | 'practice' | 'support'
  const [activeNav, setActiveNav] = useState<'accounts' | 'pay' | 'practice' | 'support'>('accounts');

  // First-Time Sign-Up Sub-Stages
  const [onboardingStage, setOnboardingStage] = useState<'login' | 'drill' | 'certified'>('login');
  const [drillCardsChecked, setDrillCardsChecked] = useState<number[]>([0]);

  // Payment & Scam Trigger Points
  const [payeeName, setPayeeName] = useState('Federal Reserve Escrow Lockbox');
  const [paymentAmount, setPaymentAmount] = useState(9800);
  const [triggerNewUser, setTriggerNewUser] = useState(true);
  const [triggerBigAmount, setTriggerBigAmount] = useState(true);
  const [triggerActiveCall, setTriggerActiveCall] = useState(true);
  const [paymentState, setPaymentState] = useState<'form' | 'paused_check' | 'saved_confirmed'>('form');
  const [answeredSafetyChecks, setAnsweredSafetyChecks] = useState<number[]>([]);
  const [stressBpm, setStressBpm] = useState(72);

  // Practice & In-App Activities
  const [practiceGame, setPracticeGame] = useState<'menu' | 'cards' | 'roleplay' | 'trivia'>('menu');

  // Ask Ollie (AI Chat inside the app)
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; sender: 'ollie' | 'user'; text: string; time: string; chips?: string[] }>
  >([
    {
      id: 1,
      sender: 'ollie',
      text: "Hi Eleanor! I'm Ollie, your Sound Credit Union safety companion. How can I help you today? You can ask about our app features, scam warning signs, or how Sound pauses suspicious transfers before money moves.",
      time: 'Just now',
      chips: [
        'How does Sound CU stop scams?',
        'What are the trigger points?',
        'What if a caller demands a wire?',
        'Who is my trusted contact?',
      ],
    },
  ]);

  // Optional Companion View (SMS Thread or Staff Console next to phone)
  const [companionView, setCompanionView] = useState<'none' | 'sms' | 'staff'>('none');

  // Audio Sync
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Heartbeat sound when duress stress is elevated
  useEffect(() => {
    let timer: any;
    if (stressBpm > 100 && soundEnabled) {
      timer = setInterval(() => {
        sound.playHeartbeat();
      }, 60000 / stressBpm);
    }
    return () => clearInterval(timer);
  }, [stressBpm, soundEnabled]);

  // Send Money Trigger Handling
  const handleAuthorizeTransfer = () => {
    const hasTrigger = triggerNewUser || triggerBigAmount || triggerActiveCall;
    if (hasTrigger) {
      // Trigger detected! Stop the scam before money moves!
      sound.playAlert();
      sound.playCalmChord();
      setPaymentState('paused_check');
      setStressBpm(72); // Ollie calms the situation
      setAnsweredSafetyChecks([]);
    } else {
      // Normal transfer
      sound.playSuccess();
      setPaymentState('saved_confirmed');
    }
  };

  const handleCancelScamPayment = () => {
    sound.playSuccess();
    setPaymentState('saved_confirmed');
  };

  const handleResetToFirstTime = () => {
    sound.stopRinging();
    sound.stopSpeaking();
    setAppMode('onboarding');
    setOnboardingStage('login');
    setDrillCardsChecked([0]);
    setPaymentState('form');
    setAnsweredSafetyChecks([]);
    setActiveNav('accounts');
    setStressBpm(72);
  };

  // AI Chat message sender
  const handleSendChatMessage = (textToSend?: string) => {
    const message = textToSend || chatInput;
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user' as const,
      text: message,
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // Formulate Ollie's intelligent response
    setTimeout(() => {
      let reply = "I'm always watching out for your safety! You can review your account rules anytime in the app.";
      const lower = message.toLowerCase();

      if (lower.includes('stop scam') || lower.includes('how does sound')) {
        reply =
          "Sound Credit Union uses pre-movement circuit breakers! If you're on a call or sending a high amount to an unfamiliar person, we pause the payment in your account before a single dollar moves, and run a quick 3-point safety check with you.";
      } else if (lower.includes('trigger') || lower.includes('points') || lower.includes('flag')) {
        reply =
          "Great question! Sound's key trigger points are: (1) Sending money to a new recipient for the first time, (2) Sending a large percentage of your balance ($9,800), and (3) Active phone calls during transfer entry. Any of these triggers a safety pause.";
      } else if (lower.includes('caller') || lower.includes('wire') || lower.includes('hacked') || lower.includes('escrow')) {
        reply =
          "⚠️ Immediate Red Flag! Real credit unions NEVER call and tell you to wire funds to an 'escrow lockbox' or 'safe account' to protect your money. If anyone asks you to do that, hang up immediately!";
      } else if (lower.includes('trusted') || lower.includes('maya') || lower.includes('daughter')) {
        reply = `Your trusted contact is your daughter, ${defaultMember.trusted_contact?.name} (${defaultMember.trusted_contact?.phone}). If an unusual wire is ever held, she receives a gentle SMS alert so you both stay in control.`;
      } else if (lower.includes('feature') || lower.includes('app')) {
        reply =
          "Our mobile app features: (1) Instant account overview, (2) Scam-protected transfers with pre-movement circuit breakers, (3) In-app practice mini-games & trivia, and (4) Direct AI chat with me, Ollie!";
      }

      sound.playSuccess();
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ollie' as const,
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-sand-50 text-navy-900 flex flex-col justify-between max-w-7xl mx-auto px-2 sm:px-4 py-3 select-none">
      {/* Sleek, Creative, Accessible Top Toolbar (Zero Horizontal Scrollbar) */}
      <header className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm mb-3 shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Brand, Wordmark & Synthetic Data Guardrail */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1 shrink-0 shadow-2xs">
              <Ollie mood="wave" size={34} animated={false} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading font-black text-sm sm:text-base text-navy-900 leading-none tracking-tight">
                  Sound Credit Union (prototype)
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-sand-100 px-2.5 py-0.5 rounded-full border border-sand-200 shadow-2xs">
                  Prototype · synthetic data
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-heading font-extrabold text-otter-700">
                  Otterly Safe · "Otterly safe, every wave of life"
                </span>
                <span className="text-slate-300">|</span>
                <div className="inline-flex items-center space-x-1 text-[11px] font-medium text-safe-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-safe-700 animate-pulse" />
                  <span>Pre-Movement Protection Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Experience Switchers & Accessibility Controls (Wrap-friendly, no ugly scrollbar) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-heading font-extrabold">
            <button
              type="button"
              onClick={handleResetToFirstTime}
              aria-label="First-Time Sign Up and defensive roleplay activity"
              className={`min-h-[48px] px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-2 shrink-0 ${
                appMode === 'onboarding'
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm ring-2 ring-kelp-700/20'
                  : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>1. First-Time Sign Up</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAppMode('app');
                setActiveNav('pay');
                setPaymentState('form');
              }}
              aria-label="Send Money and test scam triggers before money moves"
              className={`min-h-[48px] px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-2 shrink-0 ${
                appMode === 'app' && activeNav === 'pay'
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm ring-2 ring-kelp-700/20'
                  : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-kelp-700 shrink-0" />
              <span>2. Send Money (Test Scam Triggers)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAppMode('app');
                setActiveNav('practice');
                setPracticeGame('menu');
              }}
              aria-label="Practice mini games and scam trivia inside the app"
              className={`min-h-[48px] px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-2 shrink-0 ${
                appMode === 'app' && activeNav === 'practice'
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm ring-2 ring-kelp-700/20'
                  : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-otter-600 shrink-0" />
              <span>3. Mini-Games & Trivia</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAppMode('app');
                setActiveNav('support');
              }}
              aria-label="Ask Ollie AI assistant inside the mobile app"
              className={`min-h-[48px] px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-2 shrink-0 ${
                appMode === 'app' && activeNav === 'support'
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm ring-2 ring-kelp-700/20'
                  : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-kelp-600 shrink-0" />
              <span>4. Ask Ollie (AI Chat)</span>
            </button>

            {/* Language Switch */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              aria-label={`Switch language. Currently ${lang === 'en' ? 'English' : 'Spanish'}`}
              className="min-h-[48px] px-3 py-2 rounded-xl border border-slate-200 bg-sand-50 hover:bg-white text-navy-900 transition-colors flex items-center space-x-1"
            >
              <span className={lang === 'en' ? 'underline font-black text-kelp-700' : 'opacity-60'}>EN</span>
              <span className="opacity-30">|</span>
              <span className={lang === 'es' ? 'underline font-black text-kelp-700' : 'opacity-60'}>ES</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? 'Mute audio sound effects' : 'Enable audio sound effects'}
              className={`min-h-[48px] px-3 py-2 rounded-xl border text-xs font-heading font-bold flex items-center space-x-1.5 transition-colors shrink-0 ${
                soundEnabled
                  ? 'bg-sand-100 text-kelp-800 border-kelp-300 shadow-2xs'
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-kelp-700" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>

            {/* Side-by-side Companion Layout Toggle */}
            <button
              type="button"
              onClick={() => {
                if (companionView === 'none') setCompanionView('sms');
                else if (companionView === 'sms') setCompanionView('staff');
                else setCompanionView('none');
              }}
              aria-label="Toggle side-by-side companion views: Phone Only, Phone with Family SMS, or Phone with Staff Log"
              className={`min-h-[48px] px-3 py-2 rounded-xl border text-xs font-heading font-bold flex items-center space-x-1.5 transition-colors shrink-0 ${
                companionView !== 'none'
                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                  : 'bg-sand-50 text-slate-600 border-slate-200 hover:bg-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {companionView === 'none'
                  ? 'Phone Only'
                  : companionView === 'sms'
                  ? 'Phone + Family SMS'
                  : 'Phone + Staff Log'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Mobile App Stage */}
      <main className="flex-1 flex items-start justify-center gap-6 pb-2">
        {/* Centered Mobile Phone Frame */}
        <div className="shrink-0 transition-all">
          <PhoneFrame title="Sound Credit Union Mobile App">
            {/* =========================================================================
                SCENARIO A: FIRST-TIME SIGN-UP & SCAM AWARENESS ACTIVITY
               ========================================================================= */}
            {appMode === 'onboarding' && (
              <div className="flex-1 flex flex-col justify-between p-4 bg-sand-50 text-navy-900 font-body animate-fadeIn">
                {/* 1A: Mobile First-Time Login */}
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

                    {/* Member Credentials */}
                    <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs shadow-2xs">
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

                      {/* Scam Awareness Policy */}
                      <div className="p-2.5 rounded-xl bg-foam-50 border border-kelp-200 text-slate-700 space-y-1">
                        <div className="flex items-center space-x-1.5 text-kelp-900 font-heading font-extrabold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-kelp-700" />
                          <span>First-Time Sign-Up Scam Awareness Policy:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Under Sound Credit Union's <strong>Otter Shield</strong> charter, all first-time members complete an interactive 30-second scam defense activity before funds transfers are enabled.
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
                        <span>Sign In & Begin Scam Awareness Activity</span>
                      </button>
                      <span className="text-[10px] text-center text-slate-400 font-mono block">
                        🛡️ 30-second interactive learning with Ollie
                      </span>
                    </div>
                  </div>
                )}

                {/* 1B: Interactive Scam Defense Drill Activity */}
                {onboardingStage === 'drill' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-2.5">
                    <div className="pt-1 text-center space-y-1.5">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1 shadow-2xs">
                        <Ollie mood="wave" size={42} animated={false} />
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-kelp-100 text-kelp-900">
                        First-Time Safety Activity ({drillCardsChecked.length}/3 Learned)
                      </span>
                      <h3 className="font-heading font-black text-base text-navy-900">
                        Spot the 3 Scammer Tricks
                      </h3>
                      <p className="text-[11px] text-slate-600 px-2">
                        Tap each card to learn how scammers manipulate members and how Sound protects you:
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
                          scammerSays: '"Stay on the phone! Do NOT tell branch staff or daughter Maya!"',
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
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  isLearned ? 'bg-safe-100 text-safe-800' : 'bg-sand-200 text-slate-600'
                                }`}
                              >
                                {isLearned ? '✓ Learned' : 'Tap to Learn'}
                              </span>
                            </div>
                            <p className="text-[10px] text-red-700 italic font-medium">{card.scammerSays}</p>
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
                          setOnboardingStage('certified');
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

                {/* 1C: Certified & Enter Mobile App */}
                {onboardingStage === 'certified' && (
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
                          Eleanor's account is now protected. If Sound Credit Union detects these scam triggers on any payment, this exact safety check will pause funds before money moves.
                        </p>
                      </div>
                    </div>

                    {/* Active Protections */}
                    <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs shadow-2xs">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-navy-900 font-heading block">Pre-Movement Pause Rule</strong>
                          <span className="text-[11px] text-slate-500">
                            Funds pause instantly in your checking account if any scam flag is triggered.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-navy-900 font-heading block">Safety Measurement Check</strong>
                          <span className="text-[11px] text-slate-500">
                            The 3 questions you just practiced will appear to verify safety before money moves.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-navy-900 font-heading block">Family Circle Guardian (Maya)</strong>
                          <span className="text-[11px] text-slate-500">
                            Daughter Maya ({defaultMember.trusted_contact?.phone}) receives an instant SMS if a held payment occurs.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playSuccess();
                          setAppMode('app');
                          setActiveNav('accounts');
                        }}
                        className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                      >
                        <span>Enter Sound Mobile Banking Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                SCENARIO B: MAIN MOBILE BANKING APP (ALL IN THE APP ITSELF)
               ========================================================================= */}
            {appMode === 'app' && (
              <SoundAppShell
                member={member}
                lang={lang}
                onToggleLang={() => setLang(lang === 'en' ? 'es' : 'en')}
                activeNav={activeNav}
                onNavSelect={(nav) => {
                  setActiveNav(nav);
                  if (nav === 'pay') setPaymentState('form');
                  if (nav === 'practice') setPracticeGame('menu');
                }}
              >
                {/* ---------------- TAB 1: ACCOUNTS (HOME) ---------------- */}
                {activeNav === 'accounts' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-3 animate-fadeIn">
                    <div className="space-y-3">
                      {/* Member Greeting & Shield Badge */}
                      <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">
                            Welcome Back
                          </span>
                          <span className="font-heading font-black text-sm text-navy-900 block">
                            {member.display_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-safe-50 border border-safe-300 text-safe-800 text-[10px] font-heading font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Otter Shield Active</span>
                        </div>
                      </div>

                      {/* Checking Account Balance Card */}
                      <div className="bg-navy-900 text-white rounded-3xl p-4 shadow-md space-y-3">
                        <div className="flex justify-between items-center text-xs text-slate-300">
                          <span className="font-heading font-bold uppercase tracking-wider text-[10px]">
                            Sound Primary Checking (••••-4401)
                          </span>
                          <span className="bg-kelp-700 text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                            PROTECTED
                          </span>
                        </div>
                        <div>
                          <span className="text-3xl font-heading font-black tracking-tight block">
                            ${member.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[11px] text-slate-300">
                            Available funds · Zero fraudulent losses
                          </span>
                        </div>
                        <div className="pt-1 border-t border-slate-800 flex justify-between text-[11px] text-slate-300">
                          <span>High-Risk Wire Pause: <strong>Enabled</strong></span>
                          <span>Family Guardian: <strong>Maya</strong></span>
                        </div>
                      </div>

                      {/* Quick In-App Activity Cards */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-slate-500 block px-1">
                          Quick In-App Actions
                        </span>

                        <div
                          onClick={() => {
                            setActiveNav('pay');
                            setPaymentState('form');
                          }}
                          className="bg-white rounded-2xl p-3 border border-slate-200 hover:border-kelp-400 cursor-pointer flex items-center justify-between transition-all shadow-2xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-kelp-50 flex items-center justify-center text-kelp-700">
                              <ArrowLeftRight className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs font-heading font-bold text-navy-900 block">
                                Send Money / Test Scam Triggers
                              </strong>
                              <span className="text-[10px] text-slate-500">
                                Experience how Sound CU pauses payments before money moves
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>

                        <div
                          onClick={() => {
                            setActiveNav('practice');
                            setPracticeGame('menu');
                          }}
                          className="bg-white rounded-2xl p-3 border border-slate-200 hover:border-kelp-400 cursor-pointer flex items-center justify-between transition-all shadow-2xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                              <Gamepad2 className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs font-heading font-bold text-navy-900 block">
                                In-App Mini-Games & Trivia
                              </strong>
                              <span className="text-[10px] text-slate-500">
                                Play Scam or Legit cards, role-play call, and trivia
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>

                        <div
                          onClick={() => setActiveNav('support')}
                          className="bg-white rounded-2xl p-3 border border-slate-200 hover:border-kelp-400 cursor-pointer flex items-center justify-between transition-all shadow-2xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-foam-100 flex items-center justify-center text-otter-700">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs font-heading font-bold text-navy-900 block">
                                Ask Ollie (AI Chat Assistant)
                              </strong>
                              <span className="text-[10px] text-slate-500">
                                Get info about app features and scam warning signs
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-sand-100 text-[10px] font-mono text-slate-500 text-center">
                      Sound Credit Union · Member Session Active
                    </div>
                  </div>
                )}

                {/* ---------------- TAB 2: PAY & TRANSFER (WITH SCAM TRIGGER POINTS) ---------------- */}
                {activeNav === 'pay' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-2 animate-fadeIn">
                    {/* FORM VIEW: USER ENTERS PAYMENT & SCAM TRIGGER POINTS */}
                    {paymentState === 'form' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-extrabold text-xs text-navy-900 uppercase tracking-wider">
                            Transfer Money
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">From Checking ($14,200)</span>
                        </div>

                        {/* Recipient & Amount Inputs */}
                        <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 text-xs shadow-2xs">
                          <div>
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                              Recipient Payee
                            </label>
                            <input
                              type="text"
                              value={payeeName}
                              onChange={(e) => setPayeeName(e.target.value)}
                              className="w-full p-2 rounded-xl bg-sand-50 border border-slate-200 font-heading font-bold text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-kelp-700"
                            />
                          </div>

                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                                Amount ($)
                              </label>
                              <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                className="w-full p-2 rounded-xl bg-sand-50 border border-slate-200 font-heading font-black text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-kelp-700"
                              />
                            </div>
                            <div className="w-28">
                              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                                Method
                              </label>
                              <div className="p-2 rounded-xl bg-red-100 border border-red-200 font-mono font-bold text-[11px] text-red-800 text-center">
                                Wire Transfer
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SCAM TRIGGER POINTS SELECTOR (Direct user requirement!) */}
                        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                            <span className="font-heading font-extrabold text-[11px] text-amber-950 flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                              <span>System Scam Trigger Points</span>
                            </span>
                            <span className="text-[9px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                              Sound Risk Engine
                            </span>
                          </div>

                          <p className="text-[10px] text-amber-900 leading-tight">
                            Select which scam flags to simulate. If any trigger is active, Sound Credit Union halts the money and runs the safety measurement check:
                          </p>

                          <div className="space-y-1.5">
                            <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200 cursor-pointer hover:bg-amber-100/50">
                              <span className="text-[10.5px] font-medium text-slate-800">
                                👤 Sending money to a new user for the first time
                              </span>
                              <input
                                type="checkbox"
                                checked={triggerNewUser}
                                onChange={(e) => setTriggerNewUser(e.target.checked)}
                                className="w-4 h-4 rounded text-kelp-700"
                              />
                            </label>

                            <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200 cursor-pointer hover:bg-amber-100/50">
                              <span className="text-[10.5px] font-medium text-slate-800">
                                💰 Sending a big amount ($9,800 is 69% of balance)
                              </span>
                              <input
                                type="checkbox"
                                checked={triggerBigAmount}
                                onChange={(e) => setTriggerBigAmount(e.target.checked)}
                                className="w-4 h-4 rounded text-kelp-700"
                              />
                            </label>

                            <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200 cursor-pointer hover:bg-amber-100/50">
                              <span className="text-[10.5px] font-medium text-slate-800">
                                📞 Active imposter phone call / duress coercion
                              </span>
                              <input
                                type="checkbox"
                                checked={triggerActiveCall}
                                onChange={(e) => setTriggerActiveCall(e.target.checked)}
                                className="w-4 h-4 rounded text-kelp-700"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <button
                            type="button"
                            onClick={handleAuthorizeTransfer}
                            className="w-full min-h-[46px] bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                            <span>Authorize ${paymentAmount.toLocaleString()} Transfer</span>
                          </button>
                          <span className="text-[10px] text-center text-slate-400 font-mono block">
                            ⚡ Sound CU checks for scam flags before funds leave your account
                          </span>
                        </div>
                      </div>
                    )}

                    {/* PAUSED SAFETY CHECK VIEW: RUNS WHEN A SCAM TRIGGER IS DETECTED */}
                    {paymentState === 'paused_check' && (
                      <div className="space-y-2.5 animate-slideUp">
                        {/* Ollie Intervention Header */}
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
                                Your ${paymentAmount.toLocaleString()} is still safely in your account.
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
                            Sound's risk rules flagged {triggerNewUser ? 'a new user, ' : ''}
                            {triggerBigAmount ? 'a large amount, ' : ''}
                            {triggerActiveCall ? 'and an active call' : ''}. Answer the 3 safety checks to confirm whether you are safe:
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
                              const isAnswered = answeredSafetyChecks.includes(item.id);
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => {
                                    if (!answeredSafetyChecks.includes(item.id)) {
                                      sound.playAlert();
                                      setAnsweredSafetyChecks([...answeredSafetyChecks, item.id]);
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
                                  <span
                                    className={`font-mono text-[10px] uppercase font-bold shrink-0 px-2 py-0.5 rounded-full ${
                                      isAnswered ? 'bg-amber-200 text-amber-900' : 'bg-sand-200 text-slate-600'
                                    }`}
                                  >
                                    {isAnswered ? 'YES ⚠️' : 'Tap Yes'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Confirmation of Imposter Scam */}
                        {answeredSafetyChecks.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-xs space-y-1 animate-pulse">
                            <div className="flex items-center space-x-1.5 font-heading font-black text-[11px] text-red-800">
                              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                              <span>{answeredSafetyChecks.length} of 3 Scam Signatures Confirmed!</span>
                            </div>
                            <p className="text-[10px] leading-tight text-red-700">
                              The caller is an imposter. Sound Credit Union will NEVER ask you to wire money to protect your account. Your ${paymentAmount.toLocaleString()} is safely held in your account.
                            </p>
                          </div>
                        )}

                        {/* Protective Action (Zero Bypass Button!) */}
                        <div className="space-y-1.5 pt-1">
                          <button
                            type="button"
                            onClick={handleCancelScamPayment}
                            className="w-full min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Cancel Payment & Keep My ${paymentAmount.toLocaleString()} Safe</span>
                          </button>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                            <span>🔒 Zero bypass lane</span>
                            <span className="text-kelp-700 font-bold">Maya alerted via SMS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONFIRMED SAFE VIEW */}
                    {paymentState === 'saved_confirmed' && (
                      <div className="flex-1 flex flex-col justify-between py-2 text-center animate-fadeIn">
                        <div className="space-y-3 pt-2">
                          <div className="w-16 h-16 mx-auto rounded-3xl bg-safe-50 border-2 border-safe-200 flex items-center justify-center p-2 shadow-2xs">
                            <Ollie mood="cheer" size={56} animated={true} />
                          </div>
                          <div>
                            <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-safe-100 text-safe-800 border border-safe-300">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Zero Dollars Lost · ${paymentAmount.toLocaleString()} Safe</span>
                            </span>
                            <h2 className="font-heading font-black text-xl text-navy-900 mt-1">
                              Scam Stopped Cold!
                            </h2>
                            <p className="text-xs text-slate-600 px-2 leading-relaxed">
                              Because Sound Credit Union enforced the safety check before the money moved, Eleanor's
                              savings remained completely intact in checking.
                            </p>
                          </div>

                          <div className="bg-sand-50 rounded-2xl p-3 border border-slate-200 text-left space-y-2 text-xs">
                            <div className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-navy-900 font-heading block">
                                  Checking Balance Intact
                                </strong>
                                <span className="text-[11px] font-mono text-slate-600 font-bold">
                                  ${member.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-navy-900 font-heading block">
                                  Maya (Daughter) Informed
                                </strong>
                                <span className="text-[11px] text-slate-500">
                                  Automated reassuring SMS sent to {defaultMember.trusted_contact?.phone}.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentState('form');
                              setActiveNav('accounts');
                            }}
                            className="w-full min-h-[46px] bg-navy-900 hover:bg-slate-800 text-white font-heading font-bold text-xs rounded-full shadow-sm"
                          >
                            Return to Accounts
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- TAB 3: IN-APP ACTIVITIES & TRIVIA ---------------- */}
                {activeNav === 'practice' && (
                  <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
                    {/* Activity Menu */}
                    {practiceGame === 'menu' && (
                      <div className="space-y-3">
                        <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Gamepad2 className="w-5 h-5 text-kelp-700" />
                            <h3 className="font-heading font-extrabold text-sm text-navy-900">
                              Ollie's In-App Activities
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-tight">
                            Choose an activity to practice your scam detection skills right inside your Sound app:
                          </p>
                        </div>

                        <div className="space-y-2">
                          {/* Mini-Game: Scam or Legit Cards */}
                          <div
                            onClick={() => setPracticeGame('cards')}
                            className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-kelp-400 cursor-pointer flex items-center justify-between shadow-2xs transition-all"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
                                🃏
                              </div>
                              <div>
                                <strong className="text-xs font-heading font-black text-navy-900 block">
                                  Mini-Game: "Scam or Legit?"
                                </strong>
                                <span className="text-[11px] text-slate-500">
                                  Review suspicious texts & requests. Tap Scam or Legit!
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>

                          {/* Role-Play Activity */}
                          <div
                            onClick={() => setPracticeGame('roleplay')}
                            className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-kelp-400 cursor-pointer flex items-center justify-between shadow-2xs transition-all"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-lg">
                                🎭
                              </div>
                              <div>
                                <strong className="text-xs font-heading font-black text-navy-900 block">
                                  Role-Play: Imposter Caller Defense
                                </strong>
                                <span className="text-[11px] text-slate-500">
                                  Simulated call drill with audio and safe choices.
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>

                          {/* Trivia */}
                          <div
                            onClick={() => setPracticeGame('trivia')}
                            className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-kelp-400 cursor-pointer flex items-center justify-between shadow-2xs transition-all"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-safe-50 border border-safe-200 flex items-center justify-center text-lg">
                                ❓
                              </div>
                              <div>
                                <strong className="text-xs font-heading font-black text-navy-900 block">
                                  Mini Trivia: Quick Scam Quiz
                                </strong>
                                <span className="text-[11px] text-slate-500">
                                  3-question trivia challenge on credit union safeguards.
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sub-Game 1: Scam or Legit Deck */}
                    {practiceGame === 'cards' && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setPracticeGame('menu')}
                          className="text-xs font-heading font-bold text-kelp-700 flex items-center space-x-1 py-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Activities Menu</span>
                        </button>
                        <ScamOrLegitDeck cards={cards} member={member} lang={lang} />
                      </div>
                    )}

                    {/* Sub-Game 2: Role-Play Chat */}
                    {practiceGame === 'roleplay' && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setPracticeGame('menu')}
                          className="text-xs font-heading font-bold text-kelp-700 flex items-center space-x-1 py-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Activities Menu</span>
                        </button>
                        <RolePlayChat lang={lang} />
                      </div>
                    )}

                    {/* Sub-Game 3: Quick Quiz Trivia */}
                    {practiceGame === 'trivia' && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setPracticeGame('menu')}
                          className="text-xs font-heading font-bold text-kelp-700 flex items-center space-x-1 py-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Activities Menu</span>
                        </button>
                        <QuickQuiz lang={lang} />
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- TAB 4: ASK OLLIE (AI CHAT INSIDE THE APP) ---------------- */}
                {activeNav === 'support' && (
                  <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
                    {/* Header */}
                    <div className="bg-white rounded-2xl p-2.5 border border-slate-200 flex items-center justify-between shadow-2xs mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-0.5">
                          <Ollie mood="wave" size={26} animated={false} />
                        </div>
                        <div>
                          <strong className="text-xs font-heading font-bold text-navy-900 block leading-tight">
                            Ask Ollie (AI Assistant)
                          </strong>
                          <span className="text-[10px] text-safe-700 font-mono">● Online · Scam Safety Guide</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-sand-100 px-2 py-0.5 rounded-full">
                        AI Powered
                      </span>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[460px]">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs ${
                              msg.sender === 'user'
                                ? 'bg-kelp-700 text-white rounded-br-none'
                                : 'bg-white text-navy-900 border border-slate-200 rounded-bl-none'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.text}</p>

                            {/* Prompt Chips if provided */}
                            {msg.chips && msg.chips.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2 mt-2 border-t border-slate-100">
                                {msg.chips.map((chip, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSendChatMessage(chip)}
                                    className="text-[10px] font-heading font-bold bg-foam-50 hover:bg-foam-100 text-kelp-800 border border-kelp-200 px-2 py-1 rounded-full text-left transition-colors"
                                  >
                                    {chip}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 pt-0.5 px-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="pt-2 border-t border-slate-200 mt-2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendChatMessage();
                        }}
                        className="flex items-center space-x-1.5"
                      >
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask Ollie about app features or scams..."
                          className="flex-1 p-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-kelp-700"
                        />
                        <button
                          type="submit"
                          className="w-10 h-10 rounded-2xl bg-kelp-700 hover:bg-kelp-800 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0"
                          title="Send Message"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </SoundAppShell>
            )}
          </PhoneFrame>
        </div>

        {/* Optional Companion Panel (Family SMS or Staff Console) */}
        {companionView !== 'none' && (
          <aside className="w-[380px] shrink-0 hidden lg:flex flex-col space-y-3 animate-fadeIn">
            {companionView === 'sms' && (
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-otter-700" />
                    <span className="font-heading font-extrabold text-xs text-navy-900">
                      Family Circle Guardian: Maya (Daughter)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">(253) 555-0147</span>
                </div>
                <SmsThread
                  member={defaultMember}
                  mode="sms"
                  lang={lang}
                  scenario={paymentState === 'paused_check' || paymentState === 'saved_confirmed' ? 'scam' : 'onboarding'}
                />
              </div>
            )}

            {companionView === 'staff' && (
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3 max-h-[780px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-navy-900" />
                    <span className="font-heading font-extrabold text-xs text-navy-900">
                      Sound CU Staff Console Log
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                    Incident Held
                  </span>
                </div>
                <StaffConsole
                  cases={cases}
                  events={events}
                  members={[defaultMember]}
                  onSelectCase={() => {}}
                  onDecision={() => {}}
                />
              </div>
            )}
          </aside>
        )}
      </main>
    </div>
  );
};

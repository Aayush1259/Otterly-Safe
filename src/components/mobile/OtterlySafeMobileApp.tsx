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
  Bell,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { Ollie } from '../Ollie';
import { PhoneFrame } from '../PhoneFrame';
import { SoundAppShell } from '../SoundAppShell';
import { SmsThread } from '../SmsThread';
import { StaffConsole } from '../staff/StaffConsole';
import { ScamOrLegitDeck } from '../practice/ScamOrLegitDeck';
import { RolePlayChat } from '../practice/RolePlayChat';
import { QuickQuiz } from '../practice/QuickQuiz';
import { RiverBranchGame } from '../practice/RiverBranchGame';
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

  // App Level Mode: Starts directly on the main dashboard ('app')
  const [appMode, setAppMode] = useState<'onboarding' | 'app'>('app');

  // In-App Navigation Tab: 'accounts' | 'pay' | 'practice' | 'support'
  const [activeNav, setActiveNav] = useState<'accounts' | 'pay' | 'practice' | 'support'>('accounts');

  // First-Time Sign-Up Sub-Stages: 'login' | 'warmup'
  const [onboardingStage, setOnboardingStage] = useState<'login' | 'warmup'>('login');
  const [warmupAnswer, setWarmupAnswer] = useState<number | null>(null);

  // Notification Bell & Hamburger Drawer states
  const [unreadNotifications, setUnreadNotifications] = useState(1);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showHamburgerDrawer, setShowHamburgerDrawer] = useState(false);

  // Payment & Scam Trigger Points
  const [payeeName, setPayeeName] = useState('Federal Reserve Escrow Lockbox');
  const [paymentAmount, setPaymentAmount] = useState(9800);
  const [triggerNewUser, setTriggerNewUser] = useState(true);
  const [triggerBigAmount, setTriggerBigAmount] = useState(true);
  const [triggerActiveCall, setTriggerActiveCall] = useState(true);
  const [paymentState, setPaymentState] = useState<'form' | 'paused_check' | 'saved_confirmed'>('form');
  const [answeredSafetyChecks, setAnsweredSafetyChecks] = useState<number[]>([]);
  const [stressBpm, setStressBpm] = useState(72);

  // Practice & In-App Activities (Defaults to 'river' for today's daily 30s challenge)
  const [practiceGame, setPracticeGame] = useState<'river' | 'menu' | 'cards' | 'roleplay' | 'trivia'>('river');

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
    setWarmupAnswer(null);
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
    <div className="w-full flex-1 flex flex-col justify-start max-w-7xl mx-auto px-1 sm:px-4 py-1 sm:py-2 select-none">
      {/* Main Mobile App Stage */}
      <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-6 pb-2 pt-1">
        {/* Centered Mobile Phone Frame */}
        <div className="w-full max-w-md sm:max-w-[390px] shrink-0 transition-all flex flex-col items-center space-y-2">
          {/* Subtle, Minimal Device Utility Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-heading font-extrabold bg-white border border-slate-200/90 px-2.5 sm:px-3 py-1 rounded-full shadow-2xs max-w-full">
            <button
              type="button"
              onClick={handleResetToFirstTime}
              aria-label="Restart onboarding demo"
              className="px-2 py-0.5 rounded-full hover:bg-sand-100 text-slate-700 hover:text-navy-900 flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-kelp-700" />
              <span>Reset Demo</span>
            </button>

            <span className="text-slate-200">|</span>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
              className="px-2 py-0.5 rounded-full hover:bg-sand-100 text-slate-700 hover:text-navy-900 flex items-center space-x-1 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-kelp-700" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>

            <span className="text-slate-200">|</span>

            <button
              type="button"
              onClick={() => {
                if (companionView === 'none') setCompanionView('sms');
                else if (companionView === 'sms') setCompanionView('staff');
                else setCompanionView('none');
              }}
              aria-label="Toggle companion phone view"
              className="px-2 py-0.5 rounded-full hover:bg-sand-100 text-slate-700 hover:text-navy-900 flex items-center space-x-1 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-navy-900" />
              <span>{companionView === 'none' ? 'Phone Only' : companionView === 'sms' ? '+ Family SMS' : '+ Staff Log'}</span>
            </button>
          </div>

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

                      {/* Member Sign-In Notice */}
                      <div className="p-2.5 rounded-xl bg-foam-50 border border-kelp-200 text-slate-700 space-y-1">
                        <div className="flex items-center space-x-1.5 text-kelp-900 font-heading font-extrabold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-safe-700" />
                          <span>Otter Shield Protection Active:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Your account is guarded by Sound Credit Union's <strong>Pre-Movement Circuit Breakers</strong>. Suspicious wire transfers pause automatically before any funds leave your checking account.
                        </p>
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
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Mobile Banking</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-center text-slate-400 font-mono block">
                        🔒 Direct 1-tap sign in to your dashboard
                      </span>
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
                  if (nav === 'practice') setPracticeGame('river');
                }}
                notificationCount={unreadNotifications}
                onOpenNotifications={() => setShowNotificationModal(!showNotificationModal)}
                onOpenMenu={() => setShowHamburgerDrawer(true)}
              >
                {/* Left-to-Right Hamburger Drawer (Simple resource list) */}
                {showHamburgerDrawer && (
                  <div className="absolute inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                      onClick={() => setShowHamburgerDrawer(false)}
                      className="absolute inset-0 bg-navy-950/40 backdrop-blur-xs animate-fadeIn"
                    />

                    {/* Left Slide Panel (Slides open from left to right) */}
                    <div className="relative mr-auto w-72 h-full bg-white shadow-2xl flex flex-col justify-between p-4 z-10 animate-slideRight">
                      <div className="space-y-4">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-0.5">
                              <Ollie mood="wave" size={26} animated={false} />
                            </div>
                            <div>
                              <span className="font-heading font-black text-xs text-navy-900 block leading-tight">
                                Sound Credit Union
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Member Resources</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowHamburgerDrawer(false)}
                            aria-label="Close menu"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Simplified Resource List */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block px-2 mb-1">
                            App Resources
                          </span>

                          <nav className="space-y-1 text-xs font-heading font-extrabold" aria-label="Resources menu">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('accounts');
                                setShowHamburgerDrawer(false);
                              }}
                              className={`w-full p-2.5 rounded-xl flex items-center space-x-3 transition-colors ${
                                activeNav === 'accounts' ? 'bg-kelp-50 text-kelp-900 font-black' : 'text-slate-700 hover:bg-sand-50'
                              }`}
                            >
                              <Home className="w-4 h-4 text-kelp-700 shrink-0" />
                              <span>Accounts & Balances</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('pay');
                                setPaymentState('form');
                                setShowHamburgerDrawer(false);
                              }}
                              className={`w-full p-2.5 rounded-xl flex items-center space-x-3 transition-colors ${
                                activeNav === 'pay' ? 'bg-kelp-50 text-kelp-900 font-black' : 'text-slate-700 hover:bg-sand-50'
                              }`}
                            >
                              <ArrowLeftRight className="w-4 h-4 text-kelp-700 shrink-0" />
                              <span>Send Money & Safe Checks</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('practice');
                                setPracticeGame('river');
                                setShowHamburgerDrawer(false);
                              }}
                              className={`w-full p-2.5 rounded-xl flex items-center space-x-3 transition-colors ${
                                activeNav === 'practice' && practiceGame === 'river'
                                  ? 'bg-sky-50 text-sky-900 font-black border border-sky-200'
                                  : 'text-slate-700 hover:bg-sand-50'
                              }`}
                            >
                              <span className="text-base">🌊</span>
                              <span>River Challenge: Password Fork</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('practice');
                                setPracticeGame('roleplay');
                                setShowHamburgerDrawer(false);
                              }}
                              className={`w-full p-2.5 rounded-xl flex items-center space-x-3 transition-colors ${
                                activeNav === 'practice' && practiceGame === 'roleplay'
                                  ? 'bg-red-50 text-red-900 font-black border border-red-200'
                                  : 'text-slate-700 hover:bg-sand-50'
                              }`}
                            >
                              <span className="text-base">🎭</span>
                              <span>Role-Play Drill: Imposter Call</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('practice');
                                setPracticeGame('cards');
                                setShowHamburgerDrawer(false);
                              }}
                              className="w-full p-2.5 rounded-xl flex items-center space-x-3 text-slate-700 hover:bg-sand-50 transition-colors"
                            >
                              <Gamepad2 className="w-4 h-4 text-amber-700 shrink-0" />
                              <span>Mini-Games & Trivia Hub</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('practice');
                                setPracticeGame('cards');
                                setShowHamburgerDrawer(false);
                              }}
                              className="w-full p-2.5 rounded-xl flex items-center space-x-3 text-slate-700 hover:bg-sand-50 transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-otter-700 shrink-0" />
                              <span>Scam Trick Playbook</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveNav('support');
                                setShowHamburgerDrawer(false);
                              }}
                              className={`w-full p-2.5 rounded-xl flex items-center space-x-3 transition-colors ${
                                activeNav === 'support' ? 'bg-kelp-50 text-kelp-900 font-black' : 'text-slate-700 hover:bg-sand-50'
                              }`}
                            >
                              <MessageSquare className="w-4 h-4 text-otter-700 shrink-0" />
                              <span>Ask Ollie (AI Assistant)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCompanionView(companionView === 'sms' ? 'none' : 'sms');
                                setShowHamburgerDrawer(false);
                              }}
                              className="w-full p-2.5 rounded-xl flex items-center space-x-3 text-slate-700 hover:bg-sand-50 transition-colors"
                            >
                              <Users className="w-4 h-4 text-safe-700 shrink-0" />
                              <span>Family Guardian: Maya</span>
                            </button>
                          </nav>
                        </div>
                      </div>

                      {/* Footer Controls */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs font-heading font-extrabold">
                          <button
                            type="button"
                            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-sand-50 hover:bg-white text-navy-900 flex items-center space-x-1"
                          >
                            <span>Language:</span>
                            <span className="text-kelp-700 uppercase font-black">{lang}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-sand-50 hover:bg-white text-navy-900 flex items-center space-x-1"
                          >
                            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-kelp-700" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleResetToFirstTime();
                            setShowHamburgerDrawer(false);
                          }}
                          className="w-full py-1.5 text-center text-xs font-mono text-slate-400 hover:text-navy-900 transition-colors"
                        >
                          🔄 Reset Demo View
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top-Right Notification Popover with Red Dot & 96% Metric */}
                {showNotificationModal && (
                  <div className="absolute top-12 right-2 w-80 bg-white border border-slate-200 rounded-3xl shadow-xl p-3.5 z-40 animate-slideDown text-navy-900 font-body">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <Bell className="w-4 h-4 text-kelp-700" />
                        <span className="font-heading font-extrabold text-xs text-navy-900">
                          Notifications & Reminders
                        </span>
                        {unreadNotifications > 0 && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>1 New</span>
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNotificationModal(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Daily Trivia & Game Challenge Suggestion */}
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-sky-50 border border-amber-200 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-black text-xs text-navy-900 flex items-center space-x-1">
                            <span>🌊</span>
                            <span>Today's 30s River Challenge</span>
                          </span>
                          <span className="text-[9px] font-mono text-amber-800 bg-amber-200 px-1.5 py-0.2 rounded-full font-bold">
                            Unread
                          </span>
                        </div>

                        {/* Metric & Leaderboard Prompt */}
                        <div className="bg-white/80 rounded-xl p-2 border border-amber-100 space-y-1">
                          <div className="flex items-center space-x-1.5 text-kelp-800 font-heading font-black text-[11px]">
                            <Users className="w-3.5 h-3.5 text-kelp-700" />
                            <span>96% of members played today!</span>
                          </div>
                          <p className="text-[10.5px] text-slate-600 leading-tight">
                            Take 30 seconds to guide Ollie past the scammer's password trap and see your Puget Sound safety leaderboard position!
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUnreadNotifications(0);
                            setShowNotificationModal(false);
                            setActiveNav('practice');
                            setPracticeGame('river');
                          }}
                          className="w-full py-2 bg-kelp-700 hover:bg-kelp-800 text-white rounded-xl font-heading font-black text-xs shadow-sm transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
                        >
                          <span>Play River Challenge (30s)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Active Protection Status */}
                      <div className="p-2.5 rounded-2xl bg-sand-50 border border-slate-200 space-y-1">
                        <div className="flex items-center space-x-1.5 font-heading font-extrabold text-[11px] text-navy-900">
                          <ShieldCheck className="w-3.5 h-3.5 text-safe-700" />
                          <span>Pre-Movement Safety Active</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Checking account is protected. High-risk wire transfers pause automatically before money leaves your account.
                        </p>
                      </div>
                    </div>

                    {unreadNotifications > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setUnreadNotifications(0)}
                          className="text-[10px] font-mono text-slate-400 hover:text-navy-900 font-bold"
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* ---------------- TAB 1: ACCOUNTS (HOME) ---------------- */}
                {activeNav === 'accounts' && (
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-3 animate-fadeIn">
                    <div className="space-y-3">
                      {/* Member Greeting & Shield Badge */}
                      <div className="flex items-center justify-between bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs">
                        <div>
                          <span className="text-xs font-heading font-bold text-slate-500 uppercase tracking-wider block">
                            Welcome Back
                          </span>
                          <span className="font-heading font-extrabold text-base text-navy-900 block mt-0.5">
                            {member.display_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-safe-50 border border-safe-300 text-safe-800 text-xs font-heading font-extrabold shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-safe-700" />
                          <span>Otter Shield Active</span>
                        </div>
                      </div>

                      {/* Checking Account Balance Card */}
                      <div className="bg-navy-900 text-white rounded-3xl p-4 sm:p-5 shadow-md space-y-3">
                        <div className="flex justify-between items-center text-xs text-slate-300">
                          <span className="font-heading font-extrabold uppercase tracking-wider text-xs text-slate-300">
                            Sound Primary Checking (••••-4401)
                          </span>
                          <span className="bg-kelp-700 text-white text-xs font-heading font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                            PROTECTED
                          </span>
                        </div>
                        <div>
                          <span className="text-3xl font-heading font-black tracking-tight block">
                            ${member.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs font-body text-slate-300 mt-0.5 block">
                            Available funds · Zero fraudulent losses
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-body text-slate-300">
                          <span>High-Risk Wire Pause: <strong>Enabled</strong></span>
                          <span>Family Guardian: <strong>Maya</strong></span>
                        </div>
                      </div>

                      {/* Quick In-App Activity Cards */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500 block px-1">
                          Quick In-App Actions
                        </span>

                        <div
                          onClick={() => {
                            setActiveNav('pay');
                            setPaymentState('form');
                          }}
                          className="bg-white rounded-2xl p-3.5 border border-slate-200/90 hover:border-kelp-400 cursor-pointer flex items-center justify-between transition-all shadow-2xs active:scale-98"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-kelp-50 flex items-center justify-center text-kelp-700 shrink-0">
                              <ArrowLeftRight className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs sm:text-sm font-heading font-extrabold text-navy-900 block leading-tight">
                                Send Money / Test Scam Triggers
                              </strong>
                              <span className="text-xs font-body text-slate-600 block mt-0.5">
                                Experience how Sound CU pauses payments before money moves
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                        </div>

                        {/* Featured Daily River Challenge Card */}
                        <div
                          onClick={() => {
                            setActiveNav('practice');
                            setPracticeGame('river');
                          }}
                          className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl p-3.5 border border-sky-300 hover:border-sky-400 cursor-pointer flex items-center justify-between transition-all shadow-2xs active:scale-98"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-white border border-sky-300 flex items-center justify-center text-lg shadow-2xs shrink-0">
                              🌊
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <strong className="text-xs sm:text-sm font-heading font-extrabold text-navy-900 truncate">
                                  Daily River Challenge
                                </strong>
                                <span className="shrink-0 whitespace-nowrap bg-sky-200 text-sky-900 text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-full">
                                  96% Played
                                </span>
                              </div>
                              <span className="text-xs font-body text-slate-600 block mt-0.5 truncate">
                                Guide Ollie down the Password Fork (Rank #14)
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-sky-600 shrink-0 ml-2" />
                        </div>

                        {/* Featured Scenario Role-Play Drill Card */}
                        <div
                          onClick={() => {
                            setActiveNav('practice');
                            setPracticeGame('roleplay');
                          }}
                          className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-3.5 border border-red-200 hover:border-red-400 cursor-pointer flex items-center justify-between transition-all shadow-2xs group active:scale-98"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-white border border-red-200 flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                              🎭
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <strong className="text-xs sm:text-sm font-heading font-extrabold text-navy-900 truncate">
                                  Imposter Call Drill
                                </strong>
                                <span className="shrink-0 whitespace-nowrap bg-red-200 text-red-900 text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-full">
                                  Role-Play
                                </span>
                              </div>
                              <span className="text-xs font-body text-slate-600 block mt-0.5 truncate">
                                Practice defusing high-pressure caller tactics
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-red-600 shrink-0 ml-2" />
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
                              Sound Pre-Movement Safety Review
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
                    {/* Top Segmented Activity Switcher */}
                    <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl gap-1 mb-2 border border-slate-200 shrink-0 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setPracticeGame('river')}
                        className={`flex-1 min-h-[38px] px-1.5 py-1 rounded-xl text-xs font-heading font-extrabold flex items-center justify-center space-x-1 transition-all whitespace-nowrap ${
                          practiceGame === 'river'
                            ? 'bg-white text-navy-900 shadow-sm border border-sky-300'
                            : 'text-slate-600 hover:text-navy-900'
                        }`}
                      >
                        <span className="text-xs">🌊</span>
                        <span>River</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPracticeGame('roleplay')}
                        className={`flex-1 min-h-[38px] px-1.5 py-1 rounded-xl text-xs font-heading font-extrabold flex items-center justify-center space-x-1 transition-all whitespace-nowrap ${
                          practiceGame === 'roleplay'
                            ? 'bg-white text-navy-900 shadow-sm border border-red-300'
                            : 'text-slate-600 hover:text-navy-900'
                        }`}
                      >
                        <span className="text-xs">🎭</span>
                        <span>Call</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPracticeGame('cards')}
                        className={`flex-1 min-h-[38px] px-1.5 py-1 rounded-xl text-xs font-heading font-extrabold flex items-center justify-center space-x-1 transition-all whitespace-nowrap ${
                          practiceGame === 'cards'
                            ? 'bg-white text-navy-900 shadow-sm border border-amber-300'
                            : 'text-slate-600 hover:text-navy-900'
                        }`}
                      >
                        <span className="text-xs">🃏</span>
                        <span>Cards</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPracticeGame('trivia')}
                        className={`flex-1 min-h-[38px] px-1.5 py-1 rounded-xl text-xs font-heading font-extrabold flex items-center justify-center space-x-1 transition-all whitespace-nowrap ${
                          practiceGame === 'trivia'
                            ? 'bg-white text-navy-900 shadow-sm border border-safe-300'
                            : 'text-slate-600 hover:text-navy-900'
                        }`}
                      >
                        <span className="text-xs">❓</span>
                        <span>Trivia</span>
                      </button>
                    </div>

                    {/* The 3-Step Defense Loop Card for Members & Judges */}
                    <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs mb-2">
                      <div className="flex items-center justify-between text-xs font-heading font-extrabold text-navy-900 pb-1.5 border-b border-slate-100">
                        <span className="flex items-center space-x-1.5 text-kelp-800">
                          <Sparkles className="w-3.5 h-3.5 text-kelp-700" />
                          <span>The Otter Defense Loop</span>
                        </span>
                        <span className="text-[10px] font-heading font-extrabold text-slate-500 bg-sand-100 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                          How It Protects
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 pt-2">
                        <div className="flex-1 bg-sand-50/90 rounded-xl py-2 px-1 border border-slate-200/80 flex items-center justify-center space-x-1 shadow-2xs">
                          <span className="text-sm">🌊</span>
                          <strong className="text-[11px] font-heading font-extrabold text-navy-900 whitespace-nowrap">
                            1. Drills
                          </strong>
                        </div>
                        <span className="text-slate-400 font-extrabold text-xs shrink-0">→</span>
                        <div className="flex-1 bg-sand-50/90 rounded-xl py-2 px-1 border border-slate-200/80 flex items-center justify-center space-x-1 shadow-2xs">
                          <span className="text-sm">📖</span>
                          <strong className="text-[11px] font-heading font-extrabold text-navy-900 whitespace-nowrap">
                            2. Rules
                          </strong>
                        </div>
                        <span className="text-slate-400 font-extrabold text-xs shrink-0">→</span>
                        <div className="flex-1 bg-sand-50/90 rounded-xl py-2 px-1 border border-slate-200/80 flex items-center justify-center space-x-1 shadow-2xs">
                          <span className="text-sm">🛡️</span>
                          <strong className="text-[11px] font-heading font-extrabold text-navy-900 whitespace-nowrap">
                            3. Guard
                          </strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-center text-slate-500 font-body mt-2 leading-tight">
                        Drills train reflexes · Rules set limits · Ollie stops scam wires
                      </p>
                    </div>

                    {/* Featured Daily River Challenge Game (Password Fork) */}
                    {practiceGame === 'river' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <RiverBranchGame
                          onComplete={() => setUnreadNotifications(0)}
                          onReturnToDashboard={() => setActiveNav('accounts')}
                          onGoToRolePlay={() => setPracticeGame('roleplay')}
                        />
                      </div>
                    )}

                    {/* Sub-Game 1: Scam or Legit Deck */}
                    {practiceGame === 'cards' && (
                      <div className="space-y-2">
                        <ScamOrLegitDeck cards={cards} member={member} lang={lang} />
                      </div>
                    )}

                    {/* Sub-Game 2: Role-Play Caller Drill */}
                    {practiceGame === 'roleplay' && (
                      <div className="space-y-2">
                        <RolePlayChat
                          lang={lang}
                          onReturnToDashboard={() => setActiveNav('accounts')}
                        />
                      </div>
                    )}

                    {/* Sub-Game 3: Quick Quiz Trivia */}
                    {practiceGame === 'trivia' && (
                      <div className="space-y-2">
                        <QuickQuiz lang={lang} />
                      </div>
                    )}

                    {/* Activity Menu Fallback */}
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
                            Choose a bite-sized activity to practice your scam detection skills right inside your Sound app:
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div
                            onClick={() => setPracticeGame('river')}
                            className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl p-3.5 border-2 border-sky-300 hover:border-sky-400 cursor-pointer flex items-center justify-between shadow-2xs transition-all"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-white border border-sky-300 flex items-center justify-center text-xl shadow-2xs">
                                🌊
                              </div>
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <strong className="text-xs font-heading font-black text-navy-900 block">
                                    River Challenge: Password Fork
                                  </strong>
                                  <span className="bg-sky-200 text-sky-900 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                                    96% Played
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-600">
                                  Guide Ollie down the river: Give the Key or Keep it Locked?
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-sky-600" />
                          </div>

                          <div
                            onClick={() => setPracticeGame('roleplay')}
                            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-3.5 border-2 border-red-300 hover:border-red-400 cursor-pointer flex items-center justify-between shadow-2xs transition-all"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-white border border-red-200 flex items-center justify-center text-xl shadow-2xs">
                                🎭
                              </div>
                              <div>
                                <strong className="text-xs font-heading font-black text-navy-900 block">
                                  Role-Play: Imposter Caller Defense
                                </strong>
                                <span className="text-[11px] text-slate-600">
                                  Simulated call drill with safe choices and live feedback.
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-red-600" />
                          </div>

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
          <aside className="w-full max-w-md sm:max-w-[390px] lg:w-[380px] shrink-0 flex flex-col space-y-3 animate-fadeIn">
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

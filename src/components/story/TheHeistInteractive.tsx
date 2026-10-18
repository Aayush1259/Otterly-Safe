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
} from 'lucide-react';
import { Ollie } from '../Ollie';
import { PhoneFrame } from '../PhoneFrame';
import { sound } from '../../lib/audio';

export const TheHeistInteractive: React.FC<{ onBackToDashboard?: () => void }> = ({
  onBackToDashboard,
}) => {
  // Acts: 1 = Ringing, 2 = Call in Progress, 3 = In App Sending Wire, 4 = Ollie Pauses, 5 = Rescued
  const [act, setAct] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scammerLineIdx, setScammerLineIdx] = useState(0);
  const [stressBpm, setStressBpm] = useState(88);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Sound sync
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Act 1: Phone starts ringing
  useEffect(() => {
    if (act === 1 && soundEnabled) {
      sound.startRinging();
    } else {
      sound.stopRinging();
    }
    return () => {
      sound.stopRinging();
      sound.stopSpeaking();
    };
  }, [act, soundEnabled]);

  // Scripted Scammer dialogue
  const scammerScript = [
    {
      speaker: 'Fake Agent Miller (Imposter)',
      line: 'Eleanor! This is Agent Miller from Sound Fraud Prevention. Someone is trying to wire $9,800 out of your checking account right now!',
      stress: 110,
    },
    {
      speaker: 'Fake Agent Miller (Imposter)',
      line: 'Do NOT hang up. We need you to open your Sound Credit Union app and transfer the funds to the Federal Escrow Lockbox immediately to secure them!',
      stress: 135,
    },
  ];

  // Trigger scammer speech when act 2 advances
  useEffect(() => {
    if (act === 2) {
      const current = scammerScript[scammerLineIdx];
      setStressBpm(current.stress);
      sound.playAlert();
      sound.speakScammer(current.line);
    }
  }, [act, scammerLineIdx]);

  // Heartbeat pulse simulation
  useEffect(() => {
    let interval: any;
    if (act === 2 || act === 3) {
      interval = setInterval(() => {
        sound.playHeartbeat();
      }, 60000 / stressBpm);
    }
    return () => clearInterval(interval);
  }, [act, stressBpm]);

  // Handle Act 1 -> 2: Answer call
  const handleAnswerCall = () => {
    sound.stopRinging();
    setAct(2);
    setScammerLineIdx(0);
  };

  // Handle Act 2 -> 3: Eleanor follows scammer instructions into app
  const handleOpenAppToWire = () => {
    sound.stopSpeaking();
    setAct(3);
    setStressBpm(142);
  };

  // Handle Act 3 -> 4: Eleanor hits Send -> Ollie Check Sheet triggers!
  const handleAttemptSendWire = () => {
    sound.playCalmChord();
    setAct(4);
    setStressBpm(72); // Calmed down!
  };

  // Handle Act 4 -> 5: Eleanor taps "Talk to Sound"
  const handleTalkToSound = () => {
    sound.playSuccess();
    setAct(5);
  };

  const resetStory = () => {
    sound.stopRinging();
    sound.stopSpeaking();
    setAct(1);
    setScammerLineIdx(0);
    setStressBpm(88);
    setAnsweredQuestions([]);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-5xl mx-auto px-4 py-6">
      {/* Top Focused Presentation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1">
            <Ollie mood="wave" size={32} animated={false} />
          </div>
          <div>
            <h1 className="font-heading font-black text-lg text-navy-900 leading-tight">
              Interactive Story: Stop the Scam Before the Money Moves
            </h1>
            <p className="text-xs text-slate-500 font-body">
              Witness how Eleanor is targeted by an impersonator, and how Ollie prevents the loss.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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
            className={`px-3 py-1.5 rounded-full border text-xs font-heading font-bold flex items-center space-x-1.5 transition-colors ${
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
            onClick={resetStory}
            title="Restart Story"
            className="p-2 rounded-full border border-slate-200 hover:bg-sand-100 text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-3 py-1.5 rounded-full bg-navy-900 text-white font-heading font-bold text-xs"
            >
              Back to Overview
            </button>
          )}
        </div>
      </div>

      {/* Progress Story Timeline */}
      <div className="py-4">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-heading font-bold">
          {[
            { num: 1, title: '1. The Ringing Phone' },
            { num: 2, title: '2. High-Pressure Call' },
            { num: 3, title: '3. Wire Under Duress' },
            { num: 4, title: '4. Ollie Intervenes' },
            { num: 5, title: '5. Money Stays Safe' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-xl border transition-all ${
                act === s.num
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm'
                  : act > s.num
                    ? 'bg-safe-50 text-safe-800 border-safe-300'
                    : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              <span>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Centerpiece Cinema Stage */}
      <div className="flex-1 flex items-center justify-center py-4">
        {/* ACT 1: INCOMING CALL */}
        {act === 1 && (
          <div className="w-[380px] bg-slate-900 rounded-[44px] p-6 text-white text-center shadow-2xl border-4 border-slate-700 animate-bounce space-y-6">
            <div className="space-y-1 pt-6">
              <span className="text-xs uppercase tracking-widest text-red-400 font-mono animate-pulse">
                Incoming Call · Urgency Alert
              </span>
              <h2 className="text-2xl font-heading font-black">Sound CU Fraud Alert</h2>
              <p className="text-sm font-mono text-slate-400">(253) 555-0199 (Spoofed)</p>
            </div>

            <div className="w-24 h-24 mx-auto rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center animate-ping">
              <PhoneCall className="w-10 h-10 text-red-400" />
            </div>

            <p className="text-xs text-slate-300 italic px-4">
              "Eleanor is preparing lunch when her phone suddenly rings with an official-looking caller ID."
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 pb-4">
              <button
                type="button"
                onClick={resetStory}
                className="py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-heading font-bold text-xs flex items-center justify-center space-x-1"
              >
                <PhoneOff className="w-4 h-4 text-red-500 mr-1" />
                <span>Decline</span>
              </button>
              <button
                type="button"
                onClick={handleAnswerCall}
                className="py-3 rounded-full bg-safe-600 hover:bg-safe-700 text-white font-heading font-black text-sm flex items-center justify-center space-x-2 shadow-lg animate-pulse"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Answer Call</span>
              </button>
            </div>
          </div>
        )}

        {/* ACT 2: CALL IN PROGRESS WITH SCAMMER DIALOGUE & HEARTBEAT */}
        {act === 2 && (
          <div className="w-[420px] bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5 animate-fadeIn">
            {/* Header Stress Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-1.5 text-xs text-red-600 font-mono font-bold">
                <Heart className="w-4 h-4 animate-ping fill-current" />
                <span>Eleanor's Stress: {stressBpm} BPM</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                High Psychological Pressure
              </span>
            </div>

            {/* Scammer Call Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 border-2 border-red-500/50 shadow-inner">
              <div className="flex items-center justify-between text-xs text-red-400 font-mono">
                <span>CALL CONNECTED (0:42)</span>
                <span className="flex space-x-0.5 items-end h-3">
                  <span className="w-1 bg-red-400 h-3 animate-pulse" />
                  <span className="w-1 bg-red-400 h-2 animate-pulse" />
                  <span className="w-1 bg-red-400 h-4 animate-pulse" />
                </span>
              </div>
              <p className="text-sm font-heading font-bold leading-snug text-white">
                "{scammerScript[scammerLineIdx].line}"
              </p>
            </div>

            {/* Eleanor's Dilemma */}
            <div className="bg-sand-50 rounded-2xl p-3 border border-sand-200 text-xs text-slate-700 space-y-1">
              <strong className="text-navy-900 block font-heading">What is happening:</strong>
              <p>
                The scammer is manufacturing artificial fear and authority. He won't let Eleanor hang up or verify with anyone else.
              </p>
            </div>

            {/* Interactive Step Next */}
            {scammerLineIdx === 0 ? (
              <button
                type="button"
                onClick={() => setScammerLineIdx(1)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-heading font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-1"
              >
                <span>Eleanor Asks: "What should I do?!"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAppToWire}
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-heading font-black text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 animate-pulse"
              >
                <span>Follow Scammer Instructions: Open Sound App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ACT 3: IN-APP WIRE TRANSFER UNDER DURESS */}
        {act === 3 && (
          <div className="w-[400px] bg-white rounded-3xl p-6 shadow-2xl border-2 border-red-300 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span className="font-heading font-bold text-navy-900">Sound Mobile Transfer</span>
              <span className="font-mono text-red-600 font-bold flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 fill-current animate-ping" />
                <span>142 BPM</span>
              </span>
            </div>

            {/* Caller Still in Ear */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-[11px] font-semibold">
                  Scammer shouting on call: <em>"Send $9,800 to Federal Escrow immediately!"</em>
                </span>
              </div>
            </div>

            {/* Payment Details Form Filled Out */}
            <div className="space-y-3 bg-sand-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-mono text-[10px] block">PAYEE</span>
                <span className="font-heading font-bold text-navy-900">
                  Federal Reserve Escrow Lockbox (example)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-500 font-mono text-[10px] block">AMOUNT</span>
                  <span className="text-2xl font-heading font-black text-navy-900">$9,800.00</span>
                </div>
                <span className="font-mono text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                  Wire Transfer
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Checking balance before send: <strong>$14,200.00</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAttemptSendWire}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-heading font-black text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Eleanor Taps "Authorize Wire"</span>
            </button>
          </div>
        )}

        {/* ACT 4: OLLIE INTERVENES & CALMS DOWN */}
        {act === 4 && (
          <div className="w-[420px] bg-foam-50 rounded-3xl p-6 shadow-2xl border-2 border-kelp-400 space-y-4 animate-slideUp">
            {/* Ollie Mascot Header */}
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-kelp-200 flex items-center justify-center p-1 shadow-sm">
                <Ollie mood="concerned" size={48} animated={true} />
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-check-200 text-check-800 text-[10px] font-mono font-bold uppercase">
                  Payment Paused · Money Safe
                </span>
                <h3 className="font-heading font-black text-lg text-navy-900 leading-tight">
                  Hold on, Eleanor.
                </h3>
                <span className="text-xs text-slate-600">Your $9,800 is still safely in your account.</span>
              </div>
            </div>

            {/* Calm Coach Message */}
            <div className="bg-white rounded-2xl p-3 border border-kelp-200 text-xs space-y-2 text-navy-900">
              <strong className="text-kelp-800 font-heading block">
                Ollie's 30-Second Gut Check:
              </strong>
              <div className="space-y-1.5 text-[11px]">
                {[
                  '1. Did someone call or text and ask you to send this?',
                  '2. Did they say to act fast or keep it secret?',
                  '3. Did they say your money is in danger?',
                ].map((q, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (!answeredQuestions.includes(i)) {
                        setAnsweredQuestions([...answeredQuestions, i]);
                      }
                    }}
                    className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      answeredQuestions.includes(i)
                        ? 'bg-amber-50 border-amber-300 font-bold text-amber-900'
                        : 'bg-sand-50 border-slate-200 hover:bg-sand-100 text-slate-700'
                    }`}
                  >
                    <span>{q}</span>
                    <span className="font-mono text-[10px] uppercase font-bold text-kelp-700">
                      {answeredQuestions.includes(i) ? 'YES' : 'Tap to Answer'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Real banks will never ask you to move money to keep it safe.</span>
            </div>

            {/* Protective Action Choices */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleTalkToSound}
                className="w-full py-3 bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-black text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
              >
                <span>Cancel Payment & Talk to Sound</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ACT 5: RESCUED & MONEY KEPT SAFE */}
        {act === 5 && (
          <div className="w-[440px] bg-white rounded-3xl p-6 shadow-2xl border-2 border-safe-300 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-safe-50 border-2 border-safe-200 flex items-center justify-center p-2 shadow-sm">
              <Ollie mood="cheer" size={68} animated={true} />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-safe-100 text-safe-800 border border-safe-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Dollars Lost</span>
              </span>
              <h2 className="font-heading font-black text-2xl text-navy-900">
                The Scam Was Stopped!
              </h2>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Because Sound paused the wire transfer, Eleanor's $9,800 never left her account.
              </p>
            </div>

            {/* Dual Safeguard Impact */}
            <div className="bg-sand-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-900 block font-heading">Family Guardian Alerted</strong>
                  <span className="text-slate-600 text-[11px]">
                    Eleanor's daughter Maya received an SMS: <em>"Sound paused a payment for Eleanor. Please call her on a number you already have."</em>
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-900 block font-heading">Credit Union Staff Hold</strong>
                  <span className="text-slate-600 text-[11px]">
                    Sound Care staff immediately verified the impersonator call and marked the case <strong>Keep Holding</strong>.
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetStory}
              className="w-full py-3 bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Interactive Heist Story</span>
            </button>
          </div>
        )}
      </div>

      {/* Narrative Footer Advice */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center text-xs text-slate-500 font-mono">
        💡 <strong>Key Takeaway:</strong> Scammers manipulate human emotion. Otterly Safe enforces a calm, mandatory 30-second circuit breaker before irreversible wires move.
      </div>
    </div>
  );
};

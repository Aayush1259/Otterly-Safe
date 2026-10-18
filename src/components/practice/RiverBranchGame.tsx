import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Lock, Key, Award, Users, TrendingUp, ArrowRight, Sparkles, MoveHorizontal } from 'lucide-react';
import { Ollie } from '../Ollie';
import { sound } from '../../lib/audio';

interface RiverBranchGameProps {
  onComplete?: () => void;
  onReturnToDashboard?: () => void;
  onGoToRolePlay?: () => void;
}

export const RiverBranchGame: React.FC<RiverBranchGameProps> = ({
  onComplete,
  onReturnToDashboard,
  onGoToRolePlay,
}) => {
  // 'idle' = at top fork, 'swimming_left' = flowing to Key, 'swimming_right' = flowing to Lock, 'result' = outcome
  const [gameState, setGameState] = useState<'idle' | 'swimming_left' | 'swimming_right' | 'result'>('idle');
  const [selectedBranch, setSelectedBranch] = useState<'key' | 'lock' | null>(null);

  // Swipe / Drag Tracing state
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [currentDragX, setCurrentDragX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleChooseBranch = (branch: 'key' | 'lock') => {
    if (gameState !== 'idle') return;

    setSelectedBranch(branch);
    if (branch === 'key') {
      setGameState('swimming_left');
      sound.playAlert();
      setTimeout(() => {
        setGameState('result');
      }, 700);
    } else {
      setGameState('swimming_right');
      sound.playSuccess();
      setTimeout(() => {
        sound.playCalmChord();
        setGameState('result');
        onComplete?.();
      }, 700);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameState !== 'idle') return;
    setDragStartX(e.clientX);
    setIsSwiping(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSwiping || dragStartX === null || gameState !== 'idle') return;
    const diff = e.clientX - dragStartX;
    setCurrentDragX(Math.max(-90, Math.min(90, diff)));
  };

  const handlePointerUp = () => {
    if (!isSwiping || gameState !== 'idle') return;
    setIsSwiping(false);
    if (currentDragX < -28) {
      handleChooseBranch('key');
    } else if (currentDragX > 28) {
      handleChooseBranch('lock');
    }
    setCurrentDragX(0);
    setDragStartX(null);
  };

  const handleReset = () => {
    setGameState('idle');
    setSelectedBranch(null);
    setCurrentDragX(0);
  };

  // Compute curved path coordinates for Ollie during swipe tracing
  const dragFraction = Math.min(1, Math.abs(currentDragX) / 85);
  const dragDirection = currentDragX < 0 ? -1 : currentDragX > 0 ? 1 : 0;
  
  // Dynamic position while dragging or swimming
  let ollieTop = 16;
  let ollieLeftPercent = 50;

  if (gameState === 'idle') {
    if (isSwiping && dragDirection !== 0) {
      ollieTop = 16 + dragFraction * 115;
      ollieLeftPercent = 50 + dragDirection * (dragFraction * 33);
    } else {
      ollieTop = 16;
      ollieLeftPercent = 50;
    }
  } else if (gameState === 'swimming_left' || (gameState === 'result' && selectedBranch === 'key')) {
    ollieTop = 135;
    ollieLeftPercent = 18;
  } else if (gameState === 'swimming_right' || (gameState === 'result' && selectedBranch === 'lock')) {
    ollieTop = 135;
    ollieLeftPercent = 82;
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-3 select-none animate-fadeIn font-body">
      {/* Game Header */}
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-kelp-800 bg-foam-100 border border-kelp-200 px-2 py-0.5 rounded-full">
            🌊 Daily River Challenge
          </span>
          <div className="flex items-center space-x-1 text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            <Users className="w-3 h-3 text-amber-700" />
            <span>96% Members Played</span>
          </div>
        </div>

        <h3 className="font-heading font-black text-sm text-navy-900 leading-tight">
          The Password Fork: Where Should Ollie Swim?
        </h3>

        {/* Prompt Card */}
        <div className="bg-sand-100/90 border border-slate-200 rounded-2xl p-2.5 text-left text-xs shadow-2xs">
          <div className="flex items-start space-x-2">
            <span className="text-base shrink-0">📞</span>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              <strong className="text-navy-900 block">Incoming Call: "Sound CU Security"</strong>
              "We noticed suspicious activity! To keep your account safe, please give us your online banking password or text verification code right now."
            </p>
          </div>
        </div>
      </div>

      {/* Interactive River Canvas / SVG Map with Swipe & Tracing */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="relative my-2 h-[265px] bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 rounded-3xl border-2 border-sky-200 overflow-hidden shadow-inner flex flex-col items-center justify-between p-3 cursor-grab active:cursor-grabbing select-none"
      >
        {/* Animated Water Currents Background */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 Q 10 0 20 10 T 40 10" fill="none" stroke="#0284c7" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>

        {/* River Graphic Paths */}
        <svg
          viewBox="0 0 300 240"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Main River Trunk */}
          <path
            d="M 150 10 Q 150 50 150 70"
            stroke="#38bdf8"
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Branch to Key */}
          <path
            d="M 150 70 Q 110 110 65 180"
            stroke={selectedBranch === 'key' ? '#f87171' : isSwiping && currentDragX < -15 ? '#fca5a5' : '#7dd3fc'}
            strokeWidth="34"
            strokeLinecap="round"
            fill="none"
            className="transition-colors duration-300"
          />
          {/* Dashed guide path for Left Branch */}
          <path
            d="M 150 65 Q 110 105 65 170"
            stroke={currentDragX < -15 ? '#ef4444' : '#bae6fd'}
            strokeWidth="3"
            strokeDasharray="5 5"
            fill="none"
          />

          {/* Right Branch to Lock */}
          <path
            d="M 150 70 Q 190 110 235 180"
            stroke={selectedBranch === 'lock' ? '#34d399' : isSwiping && currentDragX > 15 ? '#86efac' : '#38bdf8'}
            strokeWidth="34"
            strokeLinecap="round"
            fill="none"
            className="transition-colors duration-300"
          />
          {/* Dashed guide path for Right Branch */}
          <path
            d="M 150 65 Q 190 105 235 170"
            stroke={currentDragX > 15 ? '#10b981' : '#bae6fd'}
            strokeWidth="3"
            strokeDasharray="5 5"
            fill="none"
          />

          {/* Central River Island */}
          <ellipse cx="150" cy="120" rx="22" ry="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <text x="150" y="124" fontSize="11" textAnchor="middle" fill="#475569" fontWeight="bold">
            🏝️
          </text>
        </svg>

        {/* Floating Ollie Position with Curved Swipe & Drag Tracing */}
        <div
          className="absolute z-20 pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: `${ollieTop}px`,
            left: `${ollieLeftPercent}%`,
            transform: 'translate(-50%, 0)',
          }}
        >
          <div className="w-12 h-12 rounded-full bg-white/95 border-2 border-sky-400 p-0.5 shadow-md flex items-center justify-center animate-bounce">
            <Ollie
              mood={
                gameState === 'result' && selectedBranch === 'lock'
                  ? 'cheer'
                  : selectedBranch === 'key' || (isSwiping && currentDragX < -20)
                  ? 'concerned'
                  : 'wave'
              }
              size={36}
              animated={gameState !== 'idle' || isSwiping}
            />
          </div>
          <span className="text-[9px] font-mono font-bold bg-navy-900/85 text-white px-1.5 py-0.2 rounded-full block text-center mt-0.5 shadow-xs whitespace-nowrap">
            {isSwiping ? (currentDragX < -15 ? '← Swiping to Key 🗝️' : currentDragX > 15 ? 'Swiping to Lock 🔒 →' : 'Tracing...') : 'Ollie'}
          </span>
        </div>

        {/* Top Swipe / Trace Instructions */}
        <div className="z-10 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-sky-300 text-[10px] font-heading font-extrabold text-navy-900 shadow-2xs flex items-center space-x-1">
          {gameState === 'idle' ? (
            <>
              <MoveHorizontal className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Swipe Ollie or tap a branch below:</span>
            </>
          ) : gameState === 'result' && selectedBranch === 'lock' ? (
            <span className="text-safe-800">🎉 Safe Waters Reached!</span>
          ) : (
            <span className="text-red-700">⚠️ Danger: Account Exposed!</span>
          )}
        </div>

        {/* Two River Endpoints (Left = Key 🗝️, Right = Lock 🔒) */}
        <div className="w-full flex justify-between items-end px-1 z-10 pt-28">
          {/* LEFT FORK: The Key (Give Password / Unlock) */}
          <button
            type="button"
            disabled={gameState !== 'idle'}
            onClick={() => handleChooseBranch('key')}
            className={`w-[134px] p-2 rounded-2xl border-2 transition-all flex flex-col items-center text-center shadow-sm active:scale-95 ${
              selectedBranch === 'key'
                ? 'bg-red-50 border-red-400 ring-2 ring-red-400/40'
                : 'bg-white hover:bg-red-50/50 border-slate-300 hover:border-red-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-2xs mb-1">
              <Key className="w-4 h-4 text-amber-700" />
            </div>
            <strong className="text-[11px] font-heading font-black text-navy-900 block leading-tight">
              Give Key 🗝️
            </strong>
            <span className="text-[9px] text-slate-500 leading-tight block mt-0.5">
              Read code to caller
            </span>
          </button>

          {/* RIGHT FORK: The Lock (Keep Locked / Never Share) */}
          <button
            type="button"
            disabled={gameState !== 'idle'}
            onClick={() => handleChooseBranch('lock')}
            className={`w-[134px] p-2 rounded-2xl border-2 transition-all flex flex-col items-center text-center shadow-sm active:scale-95 ${
              selectedBranch === 'lock'
                ? 'bg-safe-50 border-safe-400 ring-2 ring-safe-400/40'
                : 'bg-white hover:bg-safe-50/50 border-slate-300 hover:border-safe-400'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-safe-100 border border-safe-300 flex items-center justify-center text-safe-800 shadow-2xs mb-1">
              <Lock className="w-4 h-4 text-safe-700" />
            </div>
            <strong className="text-[11px] font-heading font-black text-navy-900 block leading-tight">
              Keep Locked 🔒
            </strong>
            <span className="text-[9px] text-slate-500 leading-tight block mt-0.5">
              Hang up! Never share
            </span>
          </button>
        </div>
      </div>

      {/* Outcome / Result Feedback View */}
      {gameState === 'result' ? (
        <div className="space-y-2 pt-1 animate-slideUp">
          {selectedBranch === 'lock' ? (
            /* Correct Choice */
            <div className="bg-safe-50 border-2 border-safe-300 rounded-2xl p-3 text-xs space-y-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-safe-800 font-heading font-black text-xs">
                <ShieldCheck className="w-4 h-4 text-safe-700 shrink-0" />
                <span>Spot On! Account Locked & Protected!</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Sound Credit Union employees will <strong>NEVER</strong> call or text asking for your password, PIN, or one-time SMS verification code. Keeping it locked keeps scammers out!
              </p>

              {/* Leaderboard & Metric Badge */}
              <div className="bg-white rounded-xl p-2.5 border border-safe-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-extrabold text-navy-900 block leading-none">
                      Leaderboard: Top 4%
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      Rank #14 of 480 members today
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-safe-700 font-mono font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+50 Safe XP</span>
                </div>
              </div>

              {/* Action Buttons: Next Role-Play Drill or Dashboard */}
              <div className="space-y-1.5 pt-1">
                {onGoToRolePlay && (
                  <button
                    type="button"
                    onClick={onGoToRolePlay}
                    className="w-full py-2.5 bg-navy-900 hover:bg-slate-800 text-white rounded-xl font-heading font-black text-xs shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-95"
                  >
                    <span>🎭 Try Imposter Call Role-Play Drill Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onReturnToDashboard}
                    className="flex-1 py-2 bg-kelp-700 hover:bg-kelp-800 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
                  >
                    <span>Return to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-sand-50 text-slate-700 font-heading font-bold text-xs"
                    title="Play Again"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Trap Choice */
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3 text-xs space-y-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-red-800 font-heading font-black text-xs">
                <span>⚠️ Scammer Trap!</span>
              </div>
              <p className="text-[11px] text-red-900 leading-relaxed">
                Reading your passcode or password gives the scammer the literal "key" to take over your account and drain funds!
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm transition-transform active:scale-95"
              >
                Try Safe River Fork 🔒
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Hint / Community tidbit before answering */
        <div className="bg-foam-50 rounded-2xl p-2.5 border border-kelp-200 flex items-center justify-between text-[11px] text-slate-700 shadow-2xs">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-kelp-700 shrink-0" />
            <span>96% of members chose the Lock today</span>
          </div>
          <span className="font-mono text-[10px] text-kelp-800 font-bold">
            30-Sec Drill
          </span>
        </div>
      )}
    </div>
  );
};

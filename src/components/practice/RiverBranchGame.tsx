import React, { useState, useRef } from 'react';
import { ShieldCheck, RotateCcw, Lock, Key, Award, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
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
  // 'idle' = at start/drag ready, 'swimming_left' = docking into Key, 'swimming_right' = docking into Lock, 'result' = outcome screen
  const [gameState, setGameState] = useState<'idle' | 'swimming_left' | 'swimming_right' | 'result'>('idle');
  const [selectedBranch, setSelectedBranch] = useState<'key' | 'lock' | null>(null);

  // River Canvas ref for exact bounds tracking
  const riverRef = useRef<HTMLDivElement>(null);

  // 2D position of Ollie inside the canvas (x: percentage 15-85, y: pixels 28-215)
  const [olliePos, setOlliePos] = useState<{ xPercent: number; yPx: number }>({ xPercent: 50, yPx: 32 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<'key' | 'lock' | null>(null);

  const handleChooseBranch = (branch: 'key' | 'lock') => {
    if (gameState !== 'idle') return;

    setSelectedBranch(branch);
    if (branch === 'key') {
      setGameState('swimming_left');
      setOlliePos({ xPercent: 24, yPx: 175 });
      sound.playAlert();
      setTimeout(() => {
        setGameState('result');
      }, 650);
    } else {
      setGameState('swimming_right');
      setOlliePos({ xPercent: 76, yPx: 175 });
      sound.playSuccess();
      setTimeout(() => {
        sound.playCalmChord();
        setGameState('result');
        onComplete?.();
      }, 650);
    }
  };

  const updatePositionFromPointer = (clientX: number, clientY: number) => {
    if (!riverRef.current) return;
    const rect = riverRef.current.getBoundingClientRect();

    // Calculate clamped percentages and pixels
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const xPercent = Math.max(16, Math.min(84, (relX / rect.width) * 100));
    const yPx = Math.max(26, Math.min(210, relY));

    setOlliePos({ xPercent, yPx });

    // Detect if hovering over bottom drop zones
    if (yPx > 85) {
      if (xPercent < 48) {
        setHoveredZone('key');
      } else if (xPercent > 52) {
        setHoveredZone('lock');
      } else {
        setHoveredZone(null);
      }
    } else {
      setHoveredZone(null);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameState !== 'idle') return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    updatePositionFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || gameState !== 'idle') return;
    updatePositionFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || gameState !== 'idle') return;
    setIsDragging(false);

    if (!riverRef.current) return;
    const rect = riverRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const xPercent = (relX / rect.width) * 100;

    // If dropped in lower area or over a target block
    if (relY > 80 || Math.abs(xPercent - 50) > 18) {
      if (xPercent < 50) {
        handleChooseBranch('key');
      } else {
        handleChooseBranch('lock');
      }
    } else {
      // Released too high: spring back to river start
      setOlliePos({ xPercent: 50, yPx: 32 });
      setHoveredZone(null);
    }
  };

  const handleReset = () => {
    setGameState('idle');
    setSelectedBranch(null);
    setHoveredZone(null);
    setOlliePos({ xPercent: 50, yPx: 32 });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-2 sm:p-3 select-none animate-fadeIn font-body">
      {/* Game Header */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold text-kelp-800 bg-foam-100 border border-kelp-200 px-2.5 py-0.5 rounded-full">
            🌊 Daily River Challenge
          </span>
          <div className="flex items-center space-x-1 text-xs font-heading font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>96% Members Played</span>
          </div>
        </div>

        <h3 className="font-heading font-extrabold text-sm sm:text-base text-navy-900 leading-tight">
          The Password Fork: Where Should Ollie Swim?
        </h3>

        {/* Prompt Card */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-left shadow-2xs">
          <div className="flex items-start space-x-2.5">
            <span className="text-lg shrink-0 mt-0.5">📞</span>
            <div className="space-y-0.5">
              <strong className="text-xs font-heading font-extrabold text-navy-900 block">
                Incoming Call: "Sound CU Security"
              </strong>
              <p className="text-xs font-body text-slate-700 leading-relaxed">
                "We noticed suspicious activity! To keep your account safe, please give us your online banking password or text verification code right now."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Instruction Banner (Cleanly placed ABOVE river, no collision with Ollie!) */}
      <div className="my-1.5 py-1.5 px-3 rounded-full bg-white border border-slate-200 text-center shadow-2xs">
        <span className="text-xs font-heading font-extrabold text-navy-900 block">
          {gameState === 'idle'
            ? isDragging
              ? hoveredZone === 'key'
                ? '⚠️ Hovering over Key: Release to hand over password'
                : hoveredZone === 'lock'
                ? '✅ Hovering over Lock: Release to keep safe'
                : 'Drag Ollie down into a choice block below ⤸'
              : '👇 Drag Ollie down into a block, or tap below:'
            : gameState === 'result' && selectedBranch === 'lock'
            ? '🎉 Safe Waters Reached!'
            : '⚠️ Danger: Account Exposed!'}
        </span>
      </div>

      {/* Interactive River Canvas / SVG Map with 2D Drag & Drop */}
      <div
        ref={riverRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="relative h-[275px] bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 rounded-3xl border-2 border-sky-200 overflow-hidden shadow-inner flex flex-col items-center justify-between p-2.5 select-none"
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

        {/* River Graphic Paths with visual current flow */}
        <svg
          viewBox="0 0 300 240"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Main River Trunk */}
          <path
            d="M 150 10 Q 150 45 150 70"
            stroke="#38bdf8"
            strokeWidth="42"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Branch to Key */}
          <path
            d="M 150 70 Q 110 110 70 185"
            stroke={selectedBranch === 'key' || hoveredZone === 'key' ? '#f87171' : '#7dd3fc'}
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
            className="transition-colors duration-300"
          />
          {/* Dashed guide path for Left Branch */}
          <path
            d="M 150 65 Q 110 105 70 180"
            stroke={hoveredZone === 'key' ? '#ef4444' : '#bae6fd'}
            strokeWidth="3.5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Right Branch to Lock */}
          <path
            d="M 150 70 Q 190 110 230 185"
            stroke={selectedBranch === 'lock' || hoveredZone === 'lock' ? '#34d399' : '#38bdf8'}
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
            className="transition-colors duration-300"
          />
          {/* Dashed guide path for Right Branch */}
          <path
            d="M 150 65 Q 190 105 230 180"
            stroke={hoveredZone === 'lock' ? '#10b981' : '#bae6fd'}
            strokeWidth="3.5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Central River Island */}
          <ellipse cx="150" cy="120" rx="22" ry="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <text x="150" y="124" fontSize="12" textAnchor="middle" fill="#475569" fontWeight="bold">
            🏝️
          </text>
        </svg>

        {/* 2D Draggable Ollie Character */}
        <div
          className={`absolute z-30 cursor-grab active:cursor-grabbing select-none ${
            isDragging ? 'transition-none scale-110' : 'transition-all duration-400 ease-out'
          }`}
          style={{
            top: `${olliePos.yPx}px`,
            left: `${olliePos.xPercent}%`,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
          }}
        >
          <div className="w-14 h-14 rounded-full bg-white/95 border-2 border-sky-400 p-0.5 shadow-lg flex items-center justify-center animate-bounce">
            <Ollie
              mood={
                gameState === 'result' && selectedBranch === 'lock'
                  ? 'cheer'
                  : selectedBranch === 'key' || hoveredZone === 'key'
                  ? 'concerned'
                  : hoveredZone === 'lock'
                  ? 'cheer'
                  : 'wave'
              }
              size={42}
              animated={gameState !== 'idle' || isDragging}
            />
          </div>
          <span className="text-[10px] font-heading font-extrabold bg-navy-900/90 text-white px-2 py-0.5 rounded-full block text-center mt-1 shadow-sm whitespace-nowrap">
            {isDragging
              ? hoveredZone === 'key'
                ? '🗝️ Drop to Give Key'
                : hoveredZone === 'lock'
                ? '🔒 Drop to Keep Lock'
                : 'Dragging Ollie ⤸'
              : 'Drag Ollie'}
          </span>
        </div>

        {/* Two Target Drop-Blocks / Choice Areas (Left = Key 🗝️, Right = Lock 🔒) */}
        <div className="w-full flex justify-between items-end gap-2 px-1 z-20 pb-1 mt-auto">
          {/* LEFT BLOCK: The Key (Give Password / Unlock) */}
          <button
            type="button"
            disabled={gameState !== 'idle'}
            onClick={() => handleChooseBranch('key')}
            className={`flex-1 max-w-[145px] min-h-[88px] sm:min-h-[92px] p-2 sm:p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center shadow-sm active:scale-95 ${
              selectedBranch === 'key' || hoveredZone === 'key'
                ? 'bg-red-50 border-red-500 ring-4 ring-red-400/40 scale-105 shadow-md'
                : 'bg-white hover:bg-red-50/50 border-slate-300 hover:border-red-300'
            }`}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-2xs mb-1">
              <Key className="w-4 h-4 text-amber-700" />
            </div>
            <strong className="text-xs font-heading font-extrabold text-navy-900 block leading-tight">
              Give Key 🗝️
            </strong>
            <span className="text-[10px] sm:text-[11px] font-body text-slate-500 leading-tight block mt-0.5">
              Read code to caller
            </span>
          </button>

          {/* RIGHT BLOCK: The Lock (Keep Locked / Never Share) */}
          <button
            type="button"
            disabled={gameState !== 'idle'}
            onClick={() => handleChooseBranch('lock')}
            className={`flex-1 max-w-[145px] min-h-[88px] sm:min-h-[92px] p-2 sm:p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center shadow-sm active:scale-95 ${
              selectedBranch === 'lock' || hoveredZone === 'lock'
                ? 'bg-safe-50 border-safe-500 ring-4 ring-safe-400/40 scale-105 shadow-md'
                : 'bg-white hover:bg-safe-50/50 border-slate-300 hover:border-safe-400'
            }`}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-safe-100 border border-safe-300 flex items-center justify-center text-safe-800 shadow-2xs mb-1">
              <Lock className="w-4 h-4 text-safe-700" />
            </div>
            <strong className="text-xs font-heading font-extrabold text-navy-900 block leading-tight">
              Keep Locked 🔒
            </strong>
            <span className="text-[10px] sm:text-[11px] font-body text-slate-500 leading-tight block mt-0.5">
              Hang up! Never share
            </span>
          </button>
        </div>
      </div>

      {/* Outcome / Result Feedback View */}
      {gameState === 'result' ? (
        <div className="space-y-2 pt-2 animate-slideUp">
          {selectedBranch === 'lock' ? (
            /* Correct Choice */
            <div className="bg-safe-50 border-2 border-safe-300 rounded-2xl p-3 text-xs space-y-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-safe-800 font-heading font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-safe-700 shrink-0" />
                <span>Spot On! Account Locked & Protected!</span>
              </div>
              <p className="text-xs font-body text-slate-700 leading-relaxed">
                Sound Credit Union employees will <strong>NEVER</strong> call or text asking for your password, PIN, or one-time SMS verification code. Keeping it locked keeps scammers out!
              </p>

              {/* Leaderboard & Metric Badge */}
              <div className="bg-white rounded-xl p-2.5 border border-safe-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xs font-heading font-extrabold text-navy-900 block leading-none">
                      Leaderboard: Top 4%
                    </span>
                    <span className="text-xs font-body text-slate-500">
                      Rank #14 of 480 members today
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-safe-700 font-heading font-extrabold text-xs">
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
                    className="w-full min-h-[44px] py-2.5 bg-navy-900 hover:bg-slate-800 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-95"
                  >
                    <span>🎭 Try Imposter Call Role-Play Drill Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onReturnToDashboard}
                    className="flex-1 min-h-[42px] py-2 bg-kelp-700 hover:bg-kelp-800 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
                  >
                    <span>Return to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-sand-50 text-slate-700 font-heading font-extrabold text-xs"
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
              <div className="flex items-center space-x-2 text-red-800 font-heading font-extrabold text-xs">
                <span>⚠️ Scammer Trap!</span>
              </div>
              <p className="text-xs font-body text-red-950 leading-relaxed">
                Reading your passcode or password gives the scammer the literal "key" to take over your account and drain funds!
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="w-full min-h-[44px] py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm transition-transform active:scale-95"
              >
                Try Safe River Fork 🔒
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Hint / Community tidbit before answering */
        <div className="bg-foam-50 rounded-2xl p-2.5 border border-kelp-200 flex items-center justify-between text-xs font-body text-slate-700 shadow-2xs mt-1">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-kelp-700 shrink-0" />
            <span>96% of members chose the Lock today</span>
          </div>
          <span className="font-heading text-xs text-kelp-800 font-bold">
            30-Sec Drill
          </span>
        </div>
      )}
    </div>
  );
};

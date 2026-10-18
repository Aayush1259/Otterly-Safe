import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Database,
  Gamepad2,
  ShieldAlert,
  Home,
  AlertOctagon,
  HeartHandshake,
} from 'lucide-react';

export type DemoScenario = 'practice' | 'scam' | 'lookalike' | 'takeover' | 'missed';

interface PresenterBarProps {
  scenario: DemoScenario;
  onSelectScenario: (scenario: DemoScenario) => void;
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  isPlaying: boolean;
  onToggleAutoplay: () => void;
  showDataDrawer: boolean;
  onToggleDataDrawer: () => void;
  stepNarrative?: string;
}

export const PresenterBar: React.FC<PresenterBarProps> = ({
  scenario,
  onSelectScenario,
  step,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  isPlaying,
  onToggleAutoplay,
  showDataDrawer,
  onToggleDataDrawer,
  stepNarrative,
}) => {
  const scenarios: { id: DemoScenario; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'practice', label: '1. Practice (40s)', icon: Gamepad2 },
    { id: 'scam', label: '2. Scam Signs', icon: ShieldAlert },
    { id: 'lookalike', label: '3. Look-Alike', icon: Home },
    { id: 'takeover', label: '4. Takeover Lock', icon: AlertOctagon },
    { id: 'missed', label: '5. Missed Scam', icon: HeartHandshake },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm space-y-2 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Scenario Selectors */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isSelected = scenario === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectScenario(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading font-extrabold flex items-center space-x-1.5 transition-all min-h-[38px] ${
                  isSelected
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-sand-50 hover:bg-sand-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center space-x-2">
          {/* Step Back */}
          <button
            type="button"
            onClick={onPrev}
            disabled={step <= 1}
            title="Previous Step (Left Arrow)"
            className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-sand-50 disabled:opacity-30 disabled:pointer-events-none min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Step Counter */}
          <span className="font-mono text-xs font-bold text-navy-900 px-2">
            Step {step} / {totalSteps}
          </span>

          {/* Step Next */}
          <button
            type="button"
            onClick={onNext}
            disabled={step >= totalSteps}
            title="Next Step (Right Arrow)"
            className="px-3.5 py-1.5 rounded-full bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs flex items-center space-x-1 shadow-xs disabled:opacity-40 disabled:pointer-events-none min-h-[38px]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Autoplay */}
          <button
            type="button"
            onClick={onToggleAutoplay}
            title="Autoplay Demo"
            className={`p-2 rounded-full border text-xs flex items-center justify-center min-h-[38px] min-w-[38px] transition-colors ${
              isPlaying
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'border-slate-200 text-slate-700 hover:bg-sand-50'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            title="Reset Scenario (R)"
            className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-sand-50 min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Show the Data Toggle */}
          <button
            type="button"
            onClick={onToggleDataDrawer}
            title="Show Raw Data Events (D)"
            className={`px-3 py-1.5 rounded-full border text-xs font-heading font-bold flex items-center space-x-1.5 transition-colors min-h-[38px] ${
              showDataDrawer
                ? 'bg-info-700 text-white border-info-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sand-50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Show Data</span>
          </button>
        </div>
      </div>

      {/* Step Narrative Cue Strip */}
      {stepNarrative && (
        <div className="bg-sand-50 border border-sand-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-navy-900">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-extrabold text-[11px] uppercase tracking-wider text-kelp-700">
              Demo Scene:
            </span>
            <span className="font-body font-semibold">{stepNarrative}</span>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            Keys: ← → Step · R Reset · D Data
          </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldX, Info } from 'lucide-react';
import type { Lane, Reason, RuleId } from '../types';

interface DecisionPipelineProps {
  currentStage: 1 | 2 | 3 | 4; // 1: Signals, 2: Lane, 3: Response, 4: Outcome
  lane: Lane;
  reasons: Reason[];
  fired: RuleId[];
  outcomeText?: string;
}

/**
 * Visual decision pipeline strip beneath the demo phones.
 * Stages: Signals → Lane → Response → Outcome.
 * Lights up sequentially and renders plain-English ReasonChips.
 */
export const DecisionPipeline: React.FC<DecisionPipelineProps> = ({
  currentStage,
  lane,
  reasons,
  fired,
  outcomeText,
}) => {
  const laneColor = {
    takeover: 'bg-stop-50 text-stop-700 border-stop-200',
    scam: 'bg-check-50 text-check-700 border-check-200',
    lookalike: 'bg-kelp-50 text-kelp-700 border-kelp-200',
    normal: 'bg-safe-50 text-safe-700 border-safe-200',
  }[lane];

  const laneLabel = {
    takeover: 'Takeover signs',
    scam: 'Scam signs',
    lookalike: 'Look-alike (Legitimate)',
    normal: 'Looks normal',
  }[lane];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-kelp-700" />
          <span>Deterministic Decision Pipeline</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          Sound account data only · Zero third-party telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 items-stretch">
        {/* Step 1: Signals */}
        <div
          className={`p-2.5 rounded-xl border transition-all ${
            currentStage >= 1
              ? 'bg-sand-50 border-kelp-700/40 shadow-xs'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-heading font-bold text-navy-900 flex items-center space-x-1">
              <span className="w-4 h-4 rounded-full bg-kelp-700 text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Signals Detected</span>
            </span>
            {currentStage >= 1 && (
              <span className="text-[10px] font-mono font-semibold text-kelp-700 bg-white px-1.5 py-0.5 rounded border border-kelp-200">
                {fired.length} rules
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 min-h-[36px]">
            {reasons.length > 0 ? (
              reasons.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center text-[11px] font-medium bg-white text-navy-900 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs"
                >
                  <strong className="text-kelp-700 mr-1">{r.id}:</strong>
                  <span className="truncate max-w-[160px]">{r.plainText}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Baseline transactions only</span>
            )}
          </div>
        </div>

        {/* Step 2: Lane */}
        <div
          className={`p-2.5 rounded-xl border transition-all ${
            currentStage >= 2
              ? `${laneColor} shadow-xs font-semibold`
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-heading font-bold flex items-center space-x-1 text-navy-900">
              <span className="w-4 h-4 rounded-full bg-navy-900 text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Evaluated Lane</span>
            </span>
            {currentStage >= 2 && <ArrowRight className="w-3.5 h-3.5 opacity-60" />}
          </div>

          <div className="flex items-center space-x-1.5 pt-1">
            {lane === 'takeover' && <ShieldX className="w-4 h-4 text-stop-700" />}
            {lane === 'scam' && <AlertTriangle className="w-4 h-4 text-check-700" />}
            {lane === 'lookalike' && <Info className="w-4 h-4 text-kelp-700" />}
            {lane === 'normal' && <CheckCircle2 className="w-4 h-4 text-safe-700" />}
            <span className="text-xs font-heading font-bold">{laneLabel}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {lane === 'takeover'
              ? 'Locks new payees; verify through prior contact'
              : lane === 'scam'
                ? 'Pauses outgoing money; runs 30s Ollie check'
                : lane === 'lookalike'
                  ? 'Scheduled send time with 1-question check'
                  : 'Standard straight-through processing'}
          </p>
        </div>

        {/* Step 3: Response */}
        <div
          className={`p-2.5 rounded-xl border transition-all ${
            currentStage >= 3
              ? 'bg-sand-50 border-kelp-700/40 shadow-xs'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-heading font-bold text-navy-900 flex items-center space-x-1">
              <span className="w-4 h-4 rounded-full bg-kelp-700 text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Intervention Delivered</span>
            </span>
          </div>

          <div className="text-xs text-navy-900 font-body leading-tight pt-0.5">
            {lane === 'takeover'
              ? 'Lockdown banner + SMS to old contact on file'
              : lane === 'scam'
                ? 'Ollie 30s Check Sheet (No "send anyway" button)'
                : lane === 'lookalike'
                  ? 'SendTimeCard ("Sends at 4:10 pm") + 1 prompt'
                  : 'Instant confirmation receipt'}
          </div>
        </div>

        {/* Step 4: Outcome */}
        <div
          className={`p-2.5 rounded-xl border transition-all ${
            currentStage >= 4
              ? 'bg-foam-50 border-safe-700/40 text-safe-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-heading font-bold flex items-center space-x-1 text-navy-900">
              <span className="w-4 h-4 rounded-full bg-safe-700 text-white text-[10px] flex items-center justify-center font-bold">
                4
              </span>
              <span>Outcome</span>
            </span>
            {currentStage >= 4 && <CheckCircle2 className="w-4 h-4 text-safe-700" />}
          </div>

          <div className="text-xs font-bold font-body leading-tight pt-0.5 text-navy-900">
            {outcomeText || (lane === 'normal' ? 'Payment sent smoothly' : 'Money stayed in account')}
          </div>
        </div>
      </div>
    </div>
  );
};

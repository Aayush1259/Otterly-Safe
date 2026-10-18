import React, { useState, useMemo } from 'react';
import { Sliders, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw } from 'lucide-react';
import type { BankEvent, Member, MemberKeyRow } from '../../types';
import { DEFAULT_CONFIG, type RulesConfig, RULE_IDS } from '../../rules/config';
import { evaluateMember } from '../../rules/engine';
import { money } from '../../lib/format';

interface RulesLabProps {
  members: Member[];
  events: BankEvent[];
  memberKey: MemberKeyRow[];
}

export const RulesLab: React.FC<RulesLabProps> = ({ members, events, memberKey }) => {
  const [config, setConfig] = useState<RulesConfig>({ ...DEFAULT_CONFIG });

  // Evaluate all members against current config
  const evaluations = useMemo(() => {
    return members.map((m) => {
      const { result, event } = evaluateMember(m, events, config);
      const keyRow = memberKey.find((k) => k.member_id === m.member_id);
      const expected = keyRow?.expected || (m.role === 'anchor' ? 'scam' : 'legit');

      let matches = false;
      if (expected === 'scam' && result.lane === 'scam') matches = true;
      else if (expected === 'takeover' && result.lane === 'takeover') matches = true;
      else if (expected === 'legit' && (result.lane === 'lookalike' || result.lane === 'normal')) matches = true;

      return {
        member: m,
        result,
        event,
        expected,
        matches,
      };
    });
  }, [members, events, config, memberKey]);

  // Summary counts
  const anchorEvals = evaluations.filter((e) => e.member.role === 'anchor');
  const lookalikeEvals = evaluations.filter((e) => e.member.role === 'lookalike');

  const anchorsFlagged = anchorEvals.filter(
    (e) => e.result.lane === 'scam' || e.result.lane === 'takeover',
  ).length;

  const lookalikesPaused = lookalikeEvals.filter((e) => e.result.paused).length;
  const misses = evaluations.filter((e) => !e.matches).length;

  const handleResetSliders = () => {
    setConfig({ ...DEFAULT_CONFIG });
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto py-2 select-none">
      {/* Synthetic Data Disclaimer Banner */}
      <div className="bg-sand-100 border-2 border-otter-700/30 rounded-2xl p-4 flex items-center justify-between text-navy-900 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-otter-700 shrink-0" />
          <div>
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-otter-700 block">
              Synthetic data: not real fraud rates.
            </span>
            <p className="text-xs text-slate-700">
              Synthetic data: not real fraud rates. Numbers reflect deterministic rule testing across synthetic anchor personas and 90-day fictional look-alikes.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-sand-200">
          UW Tacoma / HuskyHack 2026
        </span>
      </div>

      {/* Summary Stat Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Anchors Flagged
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-heading font-black text-kelp-700">
              {anchorsFlagged} / {anchorEvals.length}
            </span>
            <span className="text-xs font-medium text-slate-500">scam/takeover</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Look-Alikes Paused
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-heading font-black text-navy-900">
              {lookalikesPaused} / {lookalikeEvals.length}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({lookalikeEvals.length > 0 ? Math.round((lookalikesPaused / lookalikeEvals.length) * 100) : 0}% friction)
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Rule Misses
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-heading font-black text-stop-700">{misses}</span>
            <span className="text-xs font-medium text-slate-500">(1 intentional: Missed Scam)</span>
          </div>
        </div>
      </div>

      {/* Threshold Sandbox Sliders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-kelp-700" />
            <h3 className="font-heading font-extrabold text-sm text-navy-900 uppercase tracking-wider">
              Tune Thresholds in Sandbox
            </h3>
          </div>

          <button
            type="button"
            onClick={handleResetSliders}
            className="inline-flex items-center space-x-1.5 text-xs font-heading font-bold text-slate-600 hover:text-navy-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* R2 Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>R2: Multiple of Usual Payment</span>
              <span className="font-mono font-bold text-kelp-700">{config.r2Multiple}x</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="6"
              step="0.5"
              value={config.r2Multiple}
              onChange={(e) => setConfig({ ...config, r2Multiple: parseFloat(e.target.value) })}
              className="w-full accent-kelp-700"
            />
            <span className="text-[11px] text-slate-500 block mt-1">Default: 3x usual</span>
          </div>

          {/* R3 Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>R3: Share of Account Balance</span>
              <span className="font-mono font-bold text-kelp-700">
                {Math.round(config.r3Share * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={config.r3Share}
              onChange={(e) => setConfig({ ...config, r3Share: parseFloat(e.target.value) })}
              className="w-full accent-kelp-700"
            />
            <span className="text-[11px] text-slate-500 block mt-1">Default: 50% of balance</span>
          </div>

          {/* R5/R6 Window Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>R5 & R6: Lookback Window</span>
              <span className="font-mono font-bold text-kelp-700">{config.r5WindowHours} hours</span>
            </div>
            <input
              type="range"
              min="24"
              max="168"
              step="12"
              value={config.r5WindowHours}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setConfig({ ...config, r5WindowHours: val, r6WindowHours: val });
              }}
              className="w-full accent-kelp-700"
            />
            <span className="text-[11px] text-slate-500 block mt-1">Default: 72 hours</span>
          </div>
        </div>
      </div>

      {/* Rules Lab Persona Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-navy-900">
            Persona Evaluation Matrix
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {evaluations.length} total personas evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-mono uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Persona</th>
                <th className="py-2.5 px-2">Role</th>
                {RULE_IDS.map((r) => (
                  <th key={r} className="py-2.5 px-1.5 text-center">
                    {r}
                  </th>
                ))}
                <th className="py-2.5 px-3">Lane</th>
                <th className="py-2.5 px-3">Expected</th>
                <th className="py-2.5 px-3 text-center">Match?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluations.map(({ member, result, expected, matches }) => {
                return (
                  <tr key={member.member_id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-navy-900">
                      <div>{member.display_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {member.member_id}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 font-mono text-[11px] uppercase">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          member.role === 'anchor'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    {/* Columns R1–R7 */}
                    {RULE_IDS.map((rId) => {
                      const isFired = result.fired.includes(rId);
                      return (
                        <td key={rId} className="py-2.5 px-1.5 text-center font-mono font-bold">
                          {isFired ? (
                            <span className="text-kelp-700 font-extrabold">✓</span>
                          ) : (
                            <span className="text-slate-300">·</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 font-mono font-bold uppercase text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          result.lane === 'takeover'
                            ? 'bg-stop-200 text-stop-700'
                            : result.lane === 'scam'
                              ? 'bg-check-200 text-check-800'
                              : result.lane === 'lookalike'
                                ? 'bg-kelp-100 text-kelp-800'
                                : 'bg-safe-50 text-safe-700'
                        }`}
                      >
                        {result.lane}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] uppercase text-slate-600">
                      {expected}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {matches ? (
                        <span className="inline-flex items-center text-safe-700 font-bold font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>YES</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-stop-700 font-bold font-mono text-[11px]">
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          <span>NO</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

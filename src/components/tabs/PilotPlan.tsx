import React from 'react';
import { Calendar, Target, ShieldCheck, Scale, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export const PilotPlan: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 select-none">
      {/* Pilot Plan Header */}
      <div className="bg-sand-50 border border-slate-200 rounded-3xl p-6 text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full text-xs font-bold text-kelp-700 border border-kelp-200 mb-1">
          <Calendar className="w-4 h-4" />
          <span>Sound Credit Union · 90-Day Deployment Roadmap</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-navy-900">
          Otterly Safe Pilot Deployment Plan
        </h2>
        <p className="text-sm text-slate-600 font-body max-w-xl mx-auto">
          A phased, risk-free transition from shadow monitoring to member-facing intervention, validating efficacy before broad rollout.
        </p>
      </div>

      {/* 2-Phase Phased Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phase 1: Days 1–30 */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-mono text-xs font-extrabold uppercase bg-sand-100 text-navy-900 px-2 py-0.5 rounded">
              Phase 1 · Days 1–30
            </span>
            <span className="text-xs font-bold text-kelp-700 font-heading">Shadow / Watch-Only</span>
          </div>

          <h3 className="font-heading font-extrabold text-base text-navy-900">
            Passive Signal Calibration
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-body">
            Deterministic rules evaluate all outgoing transfers silently in the background. <strong>Zero transactions are paused or delayed.</strong>
          </p>

          <ul className="space-y-2 text-xs font-body text-navy-900">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
              <span>Measure false positive baseline across Sound's active membership.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
              <span>Verify that internal payroll and recurring mortgage transfers never trip R1–R7.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0 mt-0.5" />
              <span>Baseline loss figures calculated from Sound's previous 12 months.</span>
            </li>
          </ul>
        </div>

        {/* Phase 2: Days 31–90 */}
        <div className="bg-white border-2 border-kelp-700/30 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-mono text-xs font-extrabold uppercase bg-foam-50 text-kelp-800 px-2 py-0.5 rounded">
              Phase 2 · Days 31–90
            </span>
            <span className="text-xs font-bold text-safe-700 font-heading">Controlled A/B Field Trial</span>
          </div>

          <h3 className="font-heading font-extrabold text-base text-navy-900">
            Opt-In Member Intervention Trial
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-body">
            Randomized evaluation across <strong>~2,000 opt-in Sound Credit Union members</strong> comparing standard warnings with Otterly Safe.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-sand-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Cohort A (Control)</span>
              <span className="text-[11px] text-slate-600">Standard static warning modal ("Are you sure? Fraud is common").</span>
            </div>

            <div className="p-2.5 rounded-xl bg-foam-50 border border-kelp-200">
              <span className="font-bold text-kelp-800 block mb-1">Cohort B (Otterly Safe)</span>
              <span className="text-[11px] text-kelp-900">30-second Ollie check + practice card recall + no "send anyway" button.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Metrics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-kelp-700" />
          <h3 className="font-heading font-extrabold text-base text-navy-900">
            Pilot Success Metrics & Targets
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              target: '≥ 2x',
              title: 'Scam Cancellation Rate',
              desc: 'At least 2x more scam-pattern payments cancelled or delayed compared to static modal.',
              assumption: 'Assumption: Active cognitive pause disrupts coercive phone manipulation.',
            },
            {
              target: '90%+',
              title: 'Same-Day Legit Clearance',
              desc: '90%+ of legitimate flagged look-alike payments completed same day via clear schedule/call.',
              assumption: 'Assumption: Predictable 4:10 pm cutoff eliminates member anxiety.',
            },
            {
              target: '20%+',
              title: 'Practice Completion Rate',
              desc: '20%+ of enrolled members complete at least one 40-second practice drill with Ollie.',
              assumption: 'Assumption: Bite-sized interactive cards outperform lengthy emails.',
            },
            {
              target: '0%',
              title: 'Complaints Escalation',
              desc: 'Zero rise in member dissatisfaction or friction complaints logged by member care.',
              assumption: 'Assumption: Calm, kind tone makes members feel protected, not accused.',
            },
          ].map((m, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-sand-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-heading font-black text-kelp-700 block">
                  {m.target}
                </span>
                <span className="text-xs font-heading font-extrabold text-navy-900 block mt-1">
                  {m.title}
                </span>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  {m.desc}
                </p>
              </div>

              <span className="text-[10px] font-mono text-otter-700 bg-white p-1.5 rounded-lg border border-sand-200 mt-2 block">
                {m.assumption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

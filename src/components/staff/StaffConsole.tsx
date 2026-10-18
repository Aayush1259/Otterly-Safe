import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Moon,
  Sun,
  User,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Clock,
  Send,
  FileCheck,
  History,
  PhoneCall,
  Search,
  Filter,
} from 'lucide-react';
import type { Case, BankEvent, Member, Decision, Lane } from '../../types';
import { RecallClock } from './RecallClock';
import { CallScript } from './CallScript';
import { MemberTimeline } from './MemberTimeline';
import { stamp, money } from '../../lib/format';

interface StaffConsoleProps {
  cases: Case[];
  events: BankEvent[];
  members: Member[];
  selectedCaseId?: string;
  onSelectCase: (caseId: string) => void;
  onDecision: (caseId: string, decision: Decision, notes?: string) => void;
  isStandaloneTab?: boolean;
}

export const StaffConsole: React.FC<StaffConsoleProps> = ({
  cases,
  events,
  members,
  selectedCaseId,
  onSelectCase,
  onDecision,
  isStandaloneTab = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [laneFilter, setLaneFilter] = useState<'all' | Lane>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Find active case
  const activeCase =
    cases.find((c) => c.case_id === selectedCaseId) ||
    cases.find((c) => c.decision === 'pending') ||
    cases[0];

  const activeMember = members.find((m) => m.member_id === activeCase?.member_id);
  const activeEvent = events.find((e) => e.event_id === activeCase?.event_id);
  const memberEvents = events
    .filter((e) => e.member_id === activeCase?.member_id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Keyboard navigation: J/K for case selection, 1/2/3 for decisions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const filteredCases = cases.filter(
        (c) => laneFilter === 'all' || c.lane === laneFilter,
      );
      const currentIndex = filteredCases.findIndex((c) => c.case_id === activeCase?.case_id);

      if (e.key === 'j' || e.key === 'J') {
        const nextIdx = (currentIndex + 1) % filteredCases.length;
        if (filteredCases[nextIdx]) onSelectCase(filteredCases[nextIdx].case_id);
      } else if (e.key === 'k' || e.key === 'K') {
        const prevIdx = (currentIndex - 1 + filteredCases.length) % filteredCases.length;
        if (filteredCases[prevIdx]) onSelectCase(filteredCases[prevIdx].case_id);
      } else if (e.key === '1') {
        if (activeCase) onDecision(activeCase.case_id, 'release');
      } else if (e.key === '2') {
        if (activeCase) onDecision(activeCase.case_id, 'keep_holding');
      } else if (e.key === '3') {
        if (activeCase) onDecision(activeCase.case_id, 'escalate');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cases, activeCase, laneFilter, onSelectCase, onDecision]);

  const filteredCases = cases.filter((c) => {
    if (laneFilter !== 'all' && c.lane !== laneFilter) return false;
    if (searchQuery) {
      const m = members.find((mem) => mem.member_id === c.member_id);
      const query = searchQuery.toLowerCase();
      return (
        c.case_id.toLowerCase().includes(query) ||
        (m && m.display_name.toLowerCase().includes(query)) ||
        c.member_id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div
      className={`rounded-2xl border transition-colors flex flex-col overflow-hidden shadow-sm ${
        isDarkMode ? 'bg-[#0F172A] border-slate-700 text-[#E2E8F0]' : 'bg-white border-slate-200 text-navy-900'
      } ${isStandaloneTab ? 'h-[calc(100vh-140px)] w-full' : 'h-[844px] w-full min-w-[420px]'}`}
      role="region"
      aria-label="Staff Fraud Intervention Console"
    >
      {/* Console Header Bar */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-info-700 text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-heading font-extrabold text-sm tracking-tight">
                Staff Intervention Console
              </h2>
              <span className="text-[10px] font-mono bg-info-700/20 text-info-700 px-1.5 py-0.5 rounded font-bold">
                Sound CU internal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Shortcuts: <kbd className="px-1 bg-slate-200 text-slate-800 rounded text-[10px]">J/K</kbd> queue, <kbd className="px-1 bg-slate-200 text-slate-800 rounded text-[10px]">1</kbd> Release, <kbd className="px-1 bg-slate-200 text-slate-800 rounded text-[10px]">2</kbd> Hold, <kbd className="px-1 bg-slate-200 text-slate-800 rounded text-[10px]">3</kbd> Escalate
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle staff dark mode"
            className={`p-2 rounded-lg border text-xs flex items-center space-x-1.5 transition-colors ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="font-mono text-xs">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Queue (left or top) & Detail View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Case Queue Sidebar (240px) */}
        <div
          className={`w-56 border-r flex flex-col shrink-0 overflow-hidden ${
            isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          {/* Filter Pills */}
          <div className="p-2 border-b border-slate-700/20 space-y-1.5 shrink-0">
            <div className="flex items-center space-x-1 text-xs">
              <Search className="w-3.5 h-3.5 opacity-50 ml-1" />
              <input
                type="text"
                placeholder="Filter cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent text-xs p-1 focus:outline-none ${
                  isDarkMode ? 'text-white' : 'text-navy-900'
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {(['all', 'scam', 'lookalike', 'takeover'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLaneFilter(l)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize transition-all ${
                    laneFilter === l
                      ? 'bg-info-700 text-white font-bold'
                      : isDarkMode
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5">
            {filteredCases.map((c) => {
              const mem = members.find((m) => m.member_id === c.member_id);
              const isSelected = c.case_id === activeCase?.case_id;
              return (
                <div
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-info-700/30 border-info-500 shadow-xs'
                        : 'bg-sand-50 border-kelp-700 shadow-xs'
                      : isDarkMode
                        ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                        : 'bg-white border-slate-200 hover:bg-sand-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-0.5">
                    <span className="font-bold text-info-600">{c.case_id}</span>
                    <span>{stamp(c.created_at).slice(11)}</span>
                  </div>

                  <div className="font-heading font-bold text-xs truncate">
                    {mem?.display_name || c.member_id}
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span
                      className={`font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                        c.lane === 'takeover'
                          ? 'bg-stop-200 text-stop-700'
                          : c.lane === 'scam'
                            ? 'bg-check-200 text-check-800'
                            : 'bg-kelp-100 text-kelp-800'
                      }`}
                    >
                      {c.lane}
                    </span>

                    <span
                      className={`font-semibold capitalize ${
                        c.decision === 'pending'
                          ? 'text-amber-500 font-bold'
                          : c.decision === 'release'
                            ? 'text-safe-700'
                            : 'text-stop-700'
                      }`}
                    >
                      {c.decision.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Case Detail View */}
        {activeCase ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Top Detail Strip */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-sand-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-extrabold text-info-600">
                    {activeCase.case_id}
                  </span>
                  <span
                    className={`font-mono text-xs uppercase px-2 py-0.5 rounded font-bold ${
                      activeCase.lane === 'takeover'
                        ? 'bg-stop-200 text-stop-700'
                        : activeCase.lane === 'scam'
                          ? 'bg-check-200 text-check-800'
                          : 'bg-kelp-100 text-kelp-800'
                    }`}
                  >
                    Lane: {activeCase.lane}
                  </span>
                </div>
                <div className="text-sm font-heading font-extrabold mt-1">
                  {activeMember?.display_name} ({activeMember?.age_band}) · Balance: {money(activeMember?.balance || 0)}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Phone on file: {activeMember?.phone_on_file} · Email: {activeMember?.email_on_file}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 block">Transfer Amount</span>
                <span className="text-xl font-heading font-black">
                  {money(activeEvent?.amount || 9800)}
                </span>
                <span className="text-xs font-mono block text-slate-500 uppercase">
                  {activeEvent?.payment_type || 'wire'}
                </span>
              </div>
            </div>

            {/* Reasons Fired in Plain English */}
            <div
              className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Deterministic Rule Triggers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCase.reasons.map((r, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl border text-xs flex items-center space-x-2 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-mono font-bold text-info-600 bg-info-50 dark:bg-info-900/50 px-1.5 py-0.5 rounded text-[11px]">
                      {r.id}
                    </span>
                    <span className="font-medium truncate">{r.plainText}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Member's In-App Answers (if Ollie check was run) */}
            {activeCase.answers && activeCase.answers.length > 0 && (
              <div
                className={`p-3.5 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Member In-App Responses (Ollie 30-Second Check)
                </h4>
                <div className="space-y-1.5 text-xs">
                  {activeCase.answers.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {a.question}
                      </span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          a.answer.toLowerCase().includes('yes')
                            ? 'bg-check-200 text-check-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {a.answer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recall Clock & Call Script */}
            <RecallClock
              paymentType={activeEvent?.payment_type || 'wire'}
              status={activeEvent?.status || 'held'}
              isDarkMode={isDarkMode}
            />

            <CallScript
              memberName={activeMember?.display_name || 'Member'}
              amount={activeEvent?.amount || 9800}
              recipientName={activeEvent?.recipient_name || 'recipient'}
              isDarkMode={isDarkMode}
            />

            {/* Member Chronological Timeline */}
            <div
              className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span>Account Audit Timeline</span>
                <span className="text-[11px] font-mono text-slate-400">Past 90 days</span>
              </h4>
              <MemberTimeline
                events={memberEvents}
                highlightEventId={activeCase.event_id}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Decision Bar & Audit Log */}
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-sand-50 border-slate-200'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-extrabold uppercase tracking-wider">
                  Staff Decision Bar
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Current Status: <strong className="uppercase">{activeCase.decision}</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onDecision(activeCase.case_id, 'release')}
                  className={`min-h-[46px] rounded-xl font-heading font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-transform active:scale-95 border ${
                    activeCase.decision === 'release'
                      ? 'bg-safe-700 text-white border-safe-700'
                      : 'bg-white dark:bg-slate-800 text-safe-700 border-safe-700/40 hover:bg-safe-50'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Release Payment (1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDecision(activeCase.case_id, 'keep_holding')}
                  className={`min-h-[46px] rounded-xl font-heading font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-transform active:scale-95 border ${
                    activeCase.decision === 'keep_holding'
                      ? 'bg-check-700 text-white border-check-700'
                      : 'bg-white dark:bg-slate-800 text-check-700 border-check-700/40 hover:bg-check-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Keep Holding (2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDecision(activeCase.case_id, 'escalate')}
                  className={`min-h-[46px] rounded-xl font-heading font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-transform active:scale-95 border ${
                    activeCase.decision === 'escalate'
                      ? 'bg-stop-700 text-white border-stop-700'
                      : 'bg-white dark:bg-slate-800 text-stop-700 border-stop-700/40 hover:bg-stop-50'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Escalate to Fraud (3)</span>
                </button>
              </div>

              {/* Audit Trail List */}
              <div className="pt-2 border-t border-slate-700/20">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                  Case Action Audit Trail
                </span>
                <div className="space-y-1 text-[11px] font-mono">
                  {activeCase.audit.map((a, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <span className="text-slate-400">[{stamp(a.at).slice(11)}] {a.who}:</span>
                      <span className="font-semibold">{a.action} — {a.why}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a case from the queue to view details.
          </div>
        )}
      </div>
    </div>
  );
};

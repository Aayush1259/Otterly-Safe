import React from 'react';
import { X, Database, Code, Check } from 'lucide-react';
import type { BankEvent } from '../../types';
import { stamp, money } from '../../lib/format';

interface DataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: BankEvent[];
  activeEventIds?: string[];
}

export const DataDrawer: React.FC<DataDrawerProps> = ({
  isOpen,
  onClose,
  events,
  activeEventIds = [],
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-950 text-slate-100 z-50 shadow-2xl border-l border-slate-800 flex flex-col font-mono select-none animate-slideLeft"
      role="dialog"
      aria-modal="true"
      aria-label="Raw Ledger Events Data Drawer"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-kelp-400" />
          <h3 className="font-heading font-extrabold text-sm text-white">
            Sound Account Data Inspector
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 bg-slate-900/50 border-b border-slate-800 text-xs text-slate-400">
        Showing raw deterministic event objects driving the current decision pipeline.
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {events.length > 0 ? (
          events.map((e) => {
            const isHighlight = activeEventIds.includes(e.event_id);
            return (
              <div
                key={e.event_id}
                className={`p-3 rounded-xl border ${
                  isHighlight
                    ? 'bg-slate-900 border-kelp-500 ring-1 ring-kelp-500/50'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
                  <span className="font-bold text-kelp-400">{e.event_id}</span>
                  <span className="text-[11px] text-slate-400">{stamp(e.timestamp)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500">Member:</span> {e.member_id}
                  </div>
                  <div>
                    <span className="text-slate-500">Type:</span> {e.type}
                  </div>
                  {e.amount !== null && (
                    <div>
                      <span className="text-slate-500">Amount:</span> {money(e.amount)}
                    </div>
                  )}
                  {e.payment_type && (
                    <div>
                      <span className="text-slate-500">Channel:</span> {e.payment_type.toUpperCase()} ({e.channel})
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">New Payee:</span>{' '}
                    <span className={e.new_recipient ? 'text-amber-400 font-bold' : ''}>
                      {e.new_recipient ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                  {e.status && (
                    <div>
                      <span className="text-slate-500">Status:</span> {e.status}
                    </div>
                  )}
                  {e.recipient_name && (
                    <div className="col-span-2 truncate">
                      <span className="text-slate-500">Payee:</span> {e.recipient_name}
                    </div>
                  )}
                  {e.balance_before !== null && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Balance Prior:</span> {money(e.balance_before || 0)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-500 py-10">No ledger events recorded.</div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Synthetic event feed</span>
        <span>Offline verified</span>
      </div>
    </div>
  );
};

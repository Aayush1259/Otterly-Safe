import React from 'react';
import { ShieldCheck, Lock, EyeOff, Check, X, Accessibility, Globe2, Sparkles } from 'lucide-react';

export const PrivacyAccess: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 select-none">
      {/* Intro Header */}
      <div className="bg-sand-50 border border-slate-200 rounded-3xl p-6 text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full text-xs font-bold text-kelp-700 border border-kelp-200 mb-1">
          <Lock className="w-4 h-4" />
          <span>Ethics, Feasibility & Member Trust</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-navy-900">
          Privacy & Accessibility Charter
        </h2>
        <p className="text-sm text-slate-600 font-body max-w-xl mx-auto">
          Sound Credit Union protects member privacy by design: strict data boundaries, zero third-party telemetry, and universal accessibility.
        </p>
      </div>

      {/* Data Boundaries: Used vs Never Used */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allowed Data */}
        <div className="bg-white border-2 border-safe-700/30 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-safe-700 pb-2 border-b border-slate-100">
            <Check className="w-5 h-5" />
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wide">
              Sound's Own Internal Account Data (Used)
            </h3>
          </div>

          <p className="text-xs text-slate-600 font-body leading-relaxed">
            Otterly Safe operates exclusively on the internal ledger data Sound Credit Union already maintains:
          </p>

          <ul className="space-y-1.5 text-xs text-navy-900 font-body">
            {[
              'Payment amount and scheduled send timing',
              'Payment channel (mobile, online, branch)',
              'Payment type (ACH, instant P2P, Fedwire)',
              'New-recipient flag and first-time payee additions',
              'Recent profile modifications (password reset, phone/email)',
              'Current checking balance and historical comparisons',
              'Gateway hold status and retry tracking',
              'Opt-in trusted contact enrollment',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-safe-700 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Never Used Data */}
        <div className="bg-white border-2 border-stop-700/30 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-stop-700 pb-2 border-b border-slate-100">
            <X className="w-5 h-5" />
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wide">
              Intrusive Signals We Never Use or Simulate
            </h3>
          </div>

          <p className="text-xs text-slate-600 font-body leading-relaxed">
            We reject surveillance creep. Otterly Safe strictly prohibits and never simulates:
          </p>

          <ul className="space-y-1.5 text-xs text-navy-900 font-body">
            {[
              'Device sensors, accelerometers or battery drain tracking',
              'Keystroke dynamics or behavioral biometrics',
              'Voice tone or speech stress analysis',
              'Reading member SMS messages, emails or call logs',
              'Location geofencing or continuous GPS telemetry',
              'Browser browsing history or cookies',
              'Third-party fraud surveillance data brokers',
              'Black-box unexplainable machine learning scores',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <X className="w-3.5 h-3.5 text-stop-700 shrink-0 mt-0.5" />
                <span className="text-slate-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Role-Based Privacy View Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <EyeOff className="w-5 h-5 text-kelp-700" />
          <h3 className="font-heading font-extrabold text-base text-navy-900">
            Role-Based Information Boundaries
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200 space-y-1.5">
            <span className="font-heading font-extrabold text-navy-900 block">
              1. Trusted Contact (SMS)
            </span>
            <p className="text-slate-600">
              Receives a prompt to check on their loved one. <strong>Sees NO balances, amounts, or recipient details.</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200 space-y-1.5">
            <span className="font-heading font-extrabold text-navy-900 block">
              2. Sound Branch Staff
            </span>
            <p className="text-slate-600">
              Only sees case-relevant timeline data and verified contact info. <strong>Zero access to personal messages or off-platform activity.</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200 space-y-1.5">
            <span className="font-heading font-extrabold text-navy-900 block">
              3. Member in Mobile App
            </span>
            <p className="text-slate-600">
              Owns all decisions. Can define custom rules (e.g. contractor exemptions) and manage trusted contacts at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Architecture (WCAG 2.2 AA) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Accessibility className="w-5 h-5 text-kelp-700" />
          <h3 className="font-heading font-extrabold text-base text-navy-900">
            WCAG 2.2 AA Accessibility Commitments
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-sand-50/70 border border-sand-200 rounded-xl space-y-1">
            <span className="font-bold text-navy-900 block">Atkinson Hyperlegible Typography</span>
            <p className="text-slate-600 text-[11px]">
              Designed by the Braille Institute for low-vision readers. 18px base size on member screens.
            </p>
          </div>

          <div className="p-3 bg-sand-50/70 border border-sand-200 rounded-xl space-y-1">
            <span className="font-bold text-navy-900 block">Touch Targets ≥ 48×48 px</span>
            <p className="text-slate-600 text-[11px]">
              Every button, selector and toggle meets or exceeds physical 48px touch bounding boxes.
            </p>
          </div>

          <div className="p-3 bg-sand-50/70 border border-sand-200 rounded-xl space-y-1">
            <span className="font-bold text-navy-900 block">Bilingual English / Spanish</span>
            <p className="text-slate-600 text-[11px]">
              One-tap language toggle switches all member-facing interfaces and practice card drills.
            </p>
          </div>

          <div className="p-3 bg-sand-50/70 border border-sand-200 rounded-xl space-y-1">
            <span className="font-bold text-navy-900 block">aria-live="polite" Announcements</span>
            <p className="text-slate-600 text-[11px]">
              Ollie’s speech bubbles are automatically announced to screen readers without interrupting navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

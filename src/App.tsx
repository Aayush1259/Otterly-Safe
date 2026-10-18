import React, { useEffect } from 'react';
import {
  ShieldCheck,
  Gamepad2,
  Sliders,
  Calendar,
  Lock,
  Headphones,
  Laptop,
  Sparkles,
} from 'lucide-react';
import { useStore } from './store/useStore';
import { loadDataset } from './data/adapter';
import { Ollie } from './components/Ollie';
import { DemoStage } from './components/demo/DemoStage';
import { PracticeTab } from './components/practice/PracticeTab';
import { StaffConsole } from './components/staff/StaffConsole';
import { RulesLab } from './components/tabs/RulesLab';
import { PilotPlan } from './components/tabs/PilotPlan';
import { PrivacyAccess } from './components/tabs/PrivacyAccess';
import { TheHeistInteractive } from './components/story/TheHeistInteractive';

export function App() {
  const {
    members,
    events,
    cards,
    cases,
    memberKey,
    activeTab,
    lang,
    setActiveTab,
    toggleLang,
    addMemberRule,
    updateStaffDecision,
    initDataset,
  } = useStore();

  const [theaterMode, setTheaterMode] = React.useState(false);

  // Try loading kit dataset if present
  useEffect(() => {
    loadDataset().then((dataset) => {
      if (dataset.source === 'kit') {
        initDataset(dataset);
      }
    });
  }, [initDataset]);

  const tabs: {
    id: typeof activeTab;
    label: { en: string; es: string };
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'story', label: { en: '🎭 Interactive Story (with Audio)', es: '🎭 Historia Interactiva' }, icon: Sparkles },
    { id: 'demo', label: { en: 'Live demo stage', es: 'Demostración en vivo' }, icon: Laptop },
    { id: 'practice', label: { en: 'Practice with Ollie', es: 'Practicar con Ollie' }, icon: Gamepad2 },
    { id: 'staff', label: { en: 'Staff console', es: 'Consola de personal' }, icon: Headphones },
    { id: 'rules', label: { en: 'Rules lab', es: 'Laboratorio de reglas' }, icon: Sliders },
    { id: 'pilot', label: { en: 'Pilot plan', es: 'Plan piloto' }, icon: Calendar },
    { id: 'privacy', label: { en: 'Privacy & access', es: 'Privacidad y acceso' }, icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-sand-50 text-navy-900 flex flex-col font-body selection:bg-kelp-200">
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1520px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Wordmark & Mascot */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-0.5 shadow-2xs">
              <Ollie mood="wave" size={36} animated={false} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-lg tracking-tight text-navy-900 leading-none">
                  Sound Credit Union
                </span>
                <span className="text-xs font-mono font-medium text-slate-500 bg-sand-100 px-2 py-0.5 rounded-full border border-sand-200">
                  (prototype)
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-otter-700 font-semibold mt-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Otterly Safe · "Otterly safe, every wave of life"</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            className="flex items-center space-x-1 bg-sand-50 p-1 rounded-2xl border border-slate-200 overflow-x-auto"
            aria-label="Application tabs"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-1.5 rounded-xl font-heading font-extrabold text-xs flex items-center space-x-1.5 transition-all min-h-[38px] ${
                    isActive
                      ? 'bg-kelp-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{tab.label[lang]}</span>
                </button>
              );
            })}
          </nav>

          {/* Persistent Disclaimers & Language Toggle */}
          <div className="flex items-center space-x-2.5">
            {/* Language Switch */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={`Toggle language. Current: ${lang === 'en' ? 'English' : 'Español'}`}
              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full text-xs font-heading font-extrabold bg-sand-100 hover:bg-sand-200 text-navy-900 border border-slate-300 min-h-[36px] transition-colors focus:ring-2 focus:ring-kelp-700"
            >
              <span className={lang === 'en' ? 'font-black text-kelp-800 underline' : 'opacity-60'}>
                EN
              </span>
              <span className="mx-1 opacity-30">|</span>
              <span className={lang === 'es' ? 'font-black text-kelp-800 underline' : 'opacity-60'}>
                ES
              </span>
            </button>

            {/* Persistent Synthetic Data Badge */}
            <div
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-mono font-bold shadow-2xs"
              role="note"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Prototype · Synthetic Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Content View */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col">
        {activeTab === 'demo' && (
          <DemoStage
            members={members}
            events={events}
            cards={cards}
            cases={cases}
            lang={lang}
            onToggleLang={toggleLang}
            onUpdateMemberRule={addMemberRule}
            onStaffDecision={updateStaffDecision}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeTab
            cards={cards}
            member={members[0]}
            lang={lang}
            onSetRule={(amt) => addMemberRule(members[0].member_id, amt)}
          />
        )}

        {activeTab === 'staff' && (
          <StaffConsole
            cases={cases}
            events={events}
            members={members}
            isStandaloneTab={true}
            onSelectCase={() => {}}
            onDecision={(caseId, dec) => updateStaffDecision(caseId, dec)}
          />
        )}

        {activeTab === 'rules' && (
          <RulesLab members={members} events={events} memberKey={memberKey} />
        )}

        {activeTab === 'pilot' && <PilotPlan />}

        {activeTab === 'privacy' && <PrivacyAccess />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500 font-body">
        <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            HuskyHack 2026 · Sound Credit Union & UW Tacoma · Challenge: "Stop the scam before the money moves"
          </span>
          <span className="font-mono text-[11px]">
            Otterly Safe Kelp UI · Fully offline verifiable
          </span>
        </div>
      </footer>
    </div>
  );
}

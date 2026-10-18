import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { loadDataset } from './data/adapter';
import { OtterlySafeMobileApp } from './components/mobile/OtterlySafeMobileApp';
import { DemoStage } from './components/demo/DemoStage';
import { PracticeTab } from './components/practice/PracticeTab';
import { StaffConsole } from './components/staff/StaffConsole';
import { RulesLab } from './components/tabs/RulesLab';
import { PilotPlan } from './components/tabs/PilotPlan';
import { PrivacyAccess } from './components/tabs/PrivacyAccess';
import { Ollie } from './components/Ollie';
import {
  Smartphone,
  Presentation,
  Gamepad2,
  Headphones,
  Sliders,
  Calendar,
  Lock,
} from 'lucide-react';

export function App() {
  const {
    members,
    events,
    cards,
    cases,
    memberKey,
    activeTab,
    setActiveTab,
    lang,
    toggleLang,
    addMemberRule,
    updateStaffDecision,
    initDataset,
  } = useStore();

  const [staffSelectedCaseId, setStaffSelectedCaseId] = useState<string>(cases[0]?.case_id || 'CASE-DEMO-SCAM');

  // Try loading kit dataset if present
  useEffect(() => {
    loadDataset().then((dataset) => {
      if (dataset.source === 'kit') {
        initDataset(dataset);
      }
    });
  }, [initDataset]);

  const navTabs = [
    { id: 'story' as const, label: '📱 Member Mobile App', icon: Smartphone },
    { id: 'demo' as const, label: '💻 Live Demo Stage', icon: Presentation },
    { id: 'practice' as const, label: '🎮 Practice Arena', icon: Gamepad2 },
    { id: 'staff' as const, label: '🎧 Staff Console', icon: Headphones },
    { id: 'rules' as const, label: '📊 Rules Lab', icon: Sliders },
    { id: 'pilot' as const, label: '📅 Pilot Plan', icon: Calendar },
    { id: 'privacy' as const, label: '🔒 Privacy & Access', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-sand-50 text-navy-900 flex flex-col font-body selection:bg-kelp-200">
      {/* Top Executive Navigation Bar */}
      <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-50 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Brand Wordmark & Mandatory Synthetic Data Badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1 shrink-0">
              <Ollie mood="wave" size={30} animated={false} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-sm sm:text-base text-navy-900 leading-none tracking-tight">
                  Sound Credit Union (prototype)
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-sand-100 px-2 py-0.5 rounded-full border border-sand-200">
                  Prototype · synthetic data
                </span>
              </div>
              <span className="text-[11px] font-heading font-extrabold text-otter-700 block mt-0.5">
                Otterly Safe · "Otterly safe, every wave of life"
              </span>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav
            aria-label="Platform main navigation"
            className="flex flex-wrap items-center gap-1.5 text-xs font-heading font-extrabold"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-[44px] px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 shrink-0 ${
                    isActive
                      ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm ring-2 ring-kelp-700/20'
                      : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-kelp-700'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Language Switch */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={`Switch language. Current: ${lang === 'en' ? 'English' : 'Español'}`}
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 bg-sand-50 hover:bg-white text-navy-900 transition-colors flex items-center space-x-1 font-bold shrink-0 ml-1"
            >
              <span className={lang === 'en' ? 'underline font-black text-kelp-700' : 'opacity-60'}>EN</span>
              <span className="opacity-30">|</span>
              <span className={lang === 'es' ? 'underline font-black text-kelp-700' : 'opacity-60'}>ES</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        {activeTab === 'story' && (
          <OtterlySafeMobileApp
            member={members[0]}
            cards={cards}
            events={events}
            cases={cases}
          />
        )}

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
          <div className="max-w-4xl mx-auto py-2">
            <StaffConsole
              cases={cases}
              events={events}
              members={members}
              selectedCaseId={staffSelectedCaseId}
              onSelectCase={(id) => setStaffSelectedCaseId(id)}
              onDecision={updateStaffDecision}
            />
          </div>
        )}

        {activeTab === 'rules' && (
          <RulesLab
            members={members}
            events={events}
            memberKey={memberKey}
          />
        )}

        {activeTab === 'pilot' && <PilotPlan />}

        {activeTab === 'privacy' && <PrivacyAccess />}
      </main>
    </div>
  );
}

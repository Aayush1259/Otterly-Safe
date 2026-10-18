import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { loadDataset } from './data/adapter';
import { OtterlySafeMobileApp } from './components/mobile/OtterlySafeMobileApp';
import { DemoStage } from './components/demo/DemoStage';
import { PracticeTab } from './components/practice/PracticeTab';
import { PracticeWithOllie } from './components/PracticeWithOllie';
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
    recordPractice,
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

  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const auditTabs = [
    { id: 'demo' as const, label: '💻 Live Demo Stage', icon: Presentation },
    { id: 'practice' as const, label: '🎮 Practice Arena', icon: Gamepad2 },
    { id: 'staff' as const, label: '🎧 Staff Console', icon: Headphones },
    { id: 'rules' as const, label: '📊 Rules Lab', icon: Sliders },
    { id: 'pilot' as const, label: '📅 Pilot Plan', icon: Calendar },
    { id: 'privacy' as const, label: '🔒 Privacy & Access', icon: Lock },
  ];

  const isAuditActive = auditTabs.some((t) => t.id === activeTab);
  const currentAuditTab = auditTabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-sand-50 text-navy-900 flex flex-col font-body selection:bg-kelp-200">
      {/* Sleek, Professional Header (No prototype clutter, focused member experience) */}
      <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-50 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Wordmark (Clean Sound Credit Union) */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-kelp-50 border border-kelp-200 flex items-center justify-center p-1 shrink-0 shadow-2xs">
              <Ollie mood="wave" size={30} animated={false} />
            </div>
            <div>
              <span className="font-heading font-black text-sm sm:text-base text-navy-900 leading-none tracking-tight block">
                Sound Credit Union
              </span>
              <span className="text-[11px] font-heading font-extrabold text-otter-700 block mt-0.5">
                Otterly Safe · Member Financial Protection
              </span>
            </div>
          </div>

          {/* Simple, Streamlined Navigation */}
          <nav
            aria-label="Platform navigation"
            className="flex items-center gap-2 text-xs font-heading font-extrabold"
          >
            {/* Primary View: Member Mobile App */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('story');
                setShowToolsMenu(false);
              }}
              aria-current={activeTab === 'story' ? 'page' : undefined}
              className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                activeTab === 'story'
                  ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm ring-2 ring-kelp-700/20'
                  : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${activeTab === 'story' ? 'text-white' : 'text-kelp-700'}`} />
              <span>📱 Member App</span>
            </button>

            {/* Compact Staff & Audit Tools Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                aria-expanded={showToolsMenu}
                aria-haspopup="true"
                className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                  isAuditActive
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-sand-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>
                  {isAuditActive && currentAuditTab ? currentAuditTab.label : 'Staff & Audit Tools'} ▾
                </span>
              </button>

              {/* Dropdown Menu */}
              {showToolsMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-slideDown"
                  role="menu"
                >
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Auditor & Staff Suite
                  </div>
                  {auditTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isTabActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowToolsMenu(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs font-heading font-bold flex items-center space-x-2 transition-colors ${
                          isTabActive
                            ? 'bg-kelp-50 text-kelp-900 font-black'
                            : 'text-slate-700 hover:bg-sand-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-kelp-700 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Switch */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={`Switch language. Current: ${lang === 'en' ? 'English' : 'Español'}`}
              className="min-h-[42px] px-3 py-1.5 rounded-xl border border-slate-200 bg-sand-50 hover:bg-white text-navy-900 transition-colors flex items-center space-x-1 font-bold shrink-0 ml-1"
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
          <div className="max-w-5xl mx-auto py-2">
            <PracticeWithOllie
              onApplyRule={(ruleLabel) => {
                const match = ruleLabel.match(/\$([0-9,]+)/);
                const amount = match ? parseInt(match[1].replace(/,/g, ''), 10) : 1000;
                addMemberRule(members[0].member_id, amount);
              }}
              onRecordPractice={(cardId, correct) => {
                recordPractice(members[0].member_id, cardId, correct);
              }}
            />
          </div>
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

      {/* Subtle Member Safety Footer */}
      <footer className="py-2.5 px-4 text-center text-[11px] font-mono text-slate-500 border-t border-slate-200/80 bg-white/70">
        Synthetic Data Only · Sound Credit Union Member Financial Protection Initiative
      </footer>
    </div>
  );
}

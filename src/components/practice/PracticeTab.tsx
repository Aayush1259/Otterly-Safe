import React, { useState } from 'react';
import { Gamepad2, ShieldAlert, PhoneCall, Target, HelpCircle, Award, Sparkles } from 'lucide-react';
import type { Card, Lang, Member } from '../../types';
import { ScamOrLegitDeck } from './ScamOrLegitDeck';
import { RolePlayChat } from './RolePlayChat';
import { RedFlagHunt } from './RedFlagHunt';
import { QuickQuiz } from './QuickQuiz';
import { ShellBadges } from './ShellBadges';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { PhoneFrame } from '../PhoneFrame';

interface PracticeTabProps {
  cards: Card[];
  member: Member;
  lang: Lang;
  onSetRule?: (amount: number) => void;
}

type PracticeMode = 'imposter_call' | 'deck' | 'roleplay' | 'hunt' | 'quiz';

export const PracticeTab: React.FC<PracticeTabProps> = ({
  cards,
  member,
  lang,
  onSetRule,
}) => {
  const [activeMode, setActiveMode] = useState<PracticeMode>('imposter_call');
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([
    'first_catch', // unlocked by default for demo
  ]);

  const handleCardFinished = (_cardId: string, correct: boolean) => {
    if (correct && !unlockedBadges.includes('first_catch')) {
      setUnlockedBadges((b) => [...b, 'first_catch']);
    }
  };

  const handleHuntComplete = () => {
    if (!unlockedBadges.includes('clue_spotter')) {
      setUnlockedBadges((b) => [...b, 'clue_spotter']);
    }
  };

  const handleRolePlayComplete = (score: number) => {
    if (score >= 3 && !unlockedBadges.includes('steady_paws')) {
      setUnlockedBadges((b) => [...b, 'steady_paws']);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Intro Header */}
      <div className="bg-sand-50 border border-slate-200 rounded-3xl p-6 text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full text-xs font-bold text-kelp-700 border border-kelp-200 mb-1">
          <Gamepad2 className="w-4 h-4" />
          <span>Interactive Defensive Training with Ollie</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-navy-900">
          Practice with Ollie
        </h2>
        <p className="text-sm text-slate-600 font-body max-w-xl mx-auto">
          Short, empowering games built from official FTC scam alerts. Rehearse recognizing social engineering before real transactions ever occur.
        </p>

        {/* Sub-Nav Pill Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {[
            { id: 'imposter_call', icon: Sparkles, label: '🎭 The Imposter Call Simulator' },
            { id: 'deck', icon: ShieldAlert, label: 'Scam or Legit? Cards' },
            { id: 'roleplay', icon: PhoneCall, label: 'Branching Chat' },
            { id: 'hunt', icon: Target, label: 'Red-Flag Hunt' },
            { id: 'quiz', icon: HelpCircle, label: 'Quick Quiz' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMode(tab.id as PracticeMode)}
                className={`px-3.5 py-2 rounded-full font-heading font-extrabold text-xs flex items-center space-x-2 transition-all min-h-[42px] ${
                  isActive
                    ? 'bg-kelp-700 text-white shadow-sm'
                    : 'bg-white text-navy-900 border border-slate-200 hover:bg-sand-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges display */}
      <ShellBadges unlockedBadges={unlockedBadges} lang={lang} />

      {/* Active Game Mode */}
      <div className="flex justify-center">
        {activeMode === 'imposter_call' && (
          <div className="w-[390px] mx-auto">
            <PhoneFrame title="Sound Protective Drill Simulator">
              <OnboardingFlow
                member={member}
                lang={lang}
                onComplete={() => setActiveMode('deck')}
                onExit={() => setActiveMode('deck')}
              />
            </PhoneFrame>
          </div>
        )}

        {activeMode === 'deck' && (
          <div className="w-full">
            <ScamOrLegitDeck
              cards={cards}
              member={member}
              lang={lang}
              onSetRule={onSetRule}
              onCardFinished={handleCardFinished}
            />
          </div>
        )}

        {activeMode === 'roleplay' && (
          <RolePlayChat lang={lang} onComplete={handleRolePlayComplete} />
        )}

        {activeMode === 'hunt' && (
          <RedFlagHunt lang={lang} onComplete={handleHuntComplete} />
        )}

        {activeMode === 'quiz' && <QuickQuiz lang={lang} />}
      </div>
    </div>
  );
};

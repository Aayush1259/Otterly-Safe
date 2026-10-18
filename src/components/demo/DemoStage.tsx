import React, { useState, useEffect } from 'react';
import { User, Users, Sparkles } from 'lucide-react';
import type { BankEvent, Card, Case, Decision, Lang, Member, PaymentType } from '../../types';
import { PersonaRail } from './PersonaRail';
import { PresenterBar, type DemoScenario, type ViewMode } from './PresenterBar';
import { DataDrawer } from './DataDrawer';
import { PhoneFrame } from '../PhoneFrame';
import { SoundAppShell } from '../SoundAppShell';
import { SmsThread } from '../SmsThread';
import { DecisionPipeline } from '../DecisionPipeline';
import { StaffConsole } from '../staff/StaffConsole';
import { PayAnyoneForm } from '../payment/PayAnyoneForm';
import { ReviewScreen } from '../payment/ReviewScreen';
import { OllieCheckSheet } from '../payment/OllieCheckSheet';
import { SendTimeCard } from '../payment/SendTimeCard';
import { OwnRulePrompt } from '../payment/OwnRulePrompt';
import { LockdownCard } from '../payment/LockdownCard';
import { RecoveryPath } from '../payment/RecoveryPath';
import { ScamOrLegitDeck } from '../practice/ScamOrLegitDeck';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { OllieBubble } from '../OllieBubble';
import { evaluatePayment } from '../../rules/engine';
import { DEFAULT_CONFIG } from '../../rules/config';
import { money } from '../../lib/format';

interface DemoStageProps {
  members: Member[];
  events: BankEvent[];
  cards: Card[];
  cases: Case[];
  lang: Lang;
  onToggleLang: () => void;
  onUpdateMemberRule: (memberId: string, ruleAmount: number, category?: string) => void;
  onStaffDecision: (caseId: string, decision: Decision) => void;
}

export const DemoStage: React.FC<DemoStageProps> = ({
  members,
  events,
  cards,
  cases,
  lang,
  onToggleLang,
  onUpdateMemberRule,
  onStaffDecision,
}) => {
  const [scenario, setScenario] = useState<DemoScenario>('scam');
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDataDrawer, setShowDataDrawer] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('ANCHOR-A');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-DEMO-SCAM');
  const [tighterSettingsEngaged, setTighterSettingsEngaged] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showPersonaRail, setShowPersonaRail] = useState(false);

  // Scenario specific state
  const [customRuleAdded, setCustomRuleAdded] = useState(false);

  // Sync member selection when scenario changes
  useEffect(() => {
    setStep(1);
    setIsPlaying(false);
    if (scenario === 'onboarding') setSelectedMemberId('ANCHOR-A');
    else if (scenario === 'practice') setSelectedMemberId('ANCHOR-A');
    else if (scenario === 'scam') setSelectedMemberId('ANCHOR-A');
    else if (scenario === 'lookalike') setSelectedMemberId('L2001');
    else if (scenario === 'takeover') setSelectedMemberId('ANCHOR-B');
    else if (scenario === 'missed') setSelectedMemberId('ANCHOR-C');
  }, [scenario]);

  const currentMember =
    members.find((m) => m.member_id === selectedMemberId) || members[0];

  const practiceCard = cards.find((c) => c.card_id === 'c-fraud-text') || cards[0];

  // Total steps per scenario
  const scenarioSteps: Record<DemoScenario, number> = {
    onboarding: 4,
    practice: 3,
    scam: 5,
    lookalike: 5,
    takeover: 4,
    missed: 4,
  };

  const totalSteps = scenarioSteps[scenario];

  // Autoplay timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((s) => {
          if (s < totalSteps) return s + 1;
          setIsPlaying(false);
          return s;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  // Global Keyboard shortcuts: Left/Right arrow, R, D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') {
        setStep((s) => Math.min(totalSteps, s + 1));
      } else if (e.key === 'ArrowLeft') {
        setStep((s) => Math.max(1, s - 1));
      } else if (e.key === 'r' || e.key === 'R') {
        setStep(1);
        setIsPlaying(false);
      } else if (e.key === 'd' || e.key === 'D') {
        setShowDataDrawer((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSteps]);

  // Determine active pipeline stage and lane
  let pipelineStage: 1 | 2 | 3 | 4 = 1;
  let pipelineLane = 'normal' as any;
  let pipelineReasons: any[] = [];
  let pipelineFired: any[] = [];
  let outcomeText = '';
  let narrative = '';

  if (scenario === 'onboarding') {
    narrative =
      step === 1
        ? 'First-Time Sign Up: Welcome & Sound Otter Shield Introduction'
        : step === 2
          ? 'Live Imposter Role-Play: Member counters high-pressure scammer tactics'
          : step === 3
            ? 'Trusted Family Circle: Maya enrolled for non-invasive pause notifications'
            : 'Otter Shield Active: $1,000 safety threshold automated & badge earned';
    pipelineStage = step <= 2 ? 1 : step === 3 ? 2 : 4;
    pipelineLane = 'normal';
    pipelineReasons = [{ id: 'ROLEPLAY', plainText: 'First-time onboarding role-play completed' }];
    pipelineFired = ['ROLEPLAY'];
    outcomeText = 'Otter Shield Activated · 24h Hold Rule Live';
  } else if (scenario === 'practice') {
    pipelineLane = 'normal';
    narrative =
      step === 1
        ? 'Member reviews a suspicious text message mimicking Sound Credit Union'
        : step === 2
          ? 'Member identifies the scam; ClueSpotlight numbers red flags'
          : 'Member adopts protective rule: hold new payees over $1,000';
  } else if (scenario === 'scam') {
    narrative =
      step === 1
        ? 'Anchor A creates $9,800 wire to "Secure Reserve Holdings (example)"'
        : step === 2
          ? 'Review Screen: member prepares to authorize transfer'
          : step === 3
            ? 'Rules R1, R2, R3, R4 fire: Payment paused; 30-second Ollie check opens'
            : step === 4
              ? 'Member completes check and taps "Talk to Sound"; Trusted Contact alerted'
              : 'Staff chooses "Keep holding"; Ollie cheers: $9,800 stayed safe in account';

    if (step >= 3) {
      pipelineStage = step === 3 ? 2 : step === 4 ? 3 : 4;
      pipelineLane = 'scam';
      pipelineReasons = [
        { id: 'R1', plainText: 'First payment to this recipient' },
        { id: 'R2', plainText: '12.2x usual payment ($800)' },
        { id: 'R3', plainText: '69% of checking balance' },
        { id: 'R4', plainText: 'Wire transfer (hard to undo)' },
      ];
      pipelineFired = ['R1', 'R2', 'R3', 'R4'];
      outcomeText = 'Transfer safely blocked · $9,800 remained with member';
    }
  } else if (scenario === 'lookalike') {
    narrative =
      step === 1
        ? 'Rosa Delgado pays $5,000 by ACH to Ridgeline Roofing (example)'
        : step === 2
          ? 'Rules R1 & R2 fire; ACH transfer routed to Legitimate Look-Alike lane'
          : step === 3
            ? 'SendTimeCard asks purpose and schedules release for 4:10 pm today'
            : step === 4
              ? 'Member calls Sound to release immediately; Staff approves'
              : 'OwnRulePrompt: Contractor payments up to $6,000 won’t pause in the future';

    if (step >= 2) {
      pipelineStage = step === 2 ? 2 : step === 3 ? 3 : 4;
      pipelineLane = 'lookalike';
      pipelineReasons = [
        { id: 'R1', plainText: 'First payment to this recipient' },
        { id: 'R2', plainText: '4.2x usual payment' },
      ];
      pipelineFired = ['R1', 'R2'];
      outcomeText = 'Released to contractor · Custom exemption saved';
    }
  } else if (scenario === 'takeover') {
    narrative =
      step === 1
        ? '2:03 am password reset and 2:05 am phone number change detected'
        : step === 2
          ? 'Rules R5, R3, R1 fire: Lane designated as Account Takeover'
          : step === 3
            ? 'Member phone enters Lockdown (No Ollie check: user may be criminal)'
            : 'Second phone shows email on file before change; Staff verification open';

    pipelineStage = step <= 2 ? 2 : step === 3 ? 3 : 4;
    pipelineLane = 'takeover';
    pipelineReasons = [
      { id: 'R5', plainText: 'Password + Phone changed within 5 minutes' },
      { id: 'R1', plainText: 'First payment to D. Fox' },
      { id: 'R3', plainText: '61% of balance ($4,000 P2P)' },
    ];
    pipelineFired = ['R5', 'R1', 'R3'];
    outcomeText = 'New payees locked · Prior email alerted';
  } else if (scenario === 'missed') {
    narrative =
      step === 1
        ? 'Weekly $300 transfers to BrightHarbor Trading; no rules fire and funds move'
        : step === 2
          ? 'Member reports deceptive manipulation platform to Sound'
          : step === 3
            ? 'No-blame RecoveryPath engaged; ACH recall initiated'
            : '90 days of tighter account settings enabled; staff logs future rule request';

    pipelineStage = step === 1 ? 1 : step === 2 ? 2 : 4;
    pipelineLane = step === 1 ? 'normal' : 'normal';
    pipelineReasons = [];
    pipelineFired = [];
    outcomeText = 'No-blame recovery initiated · Future rule drafted';
  }

  // Active events for raw data drawer
  const activeEvents = events.filter((e) => e.member_id === currentMember.member_id);

  // Interactive handler for look-alike call to send
  const handleCallToSendNow = () => {
    setStep(4);
  };

  const handleApplyCustomRule = () => {
    onUpdateMemberRule(currentMember.member_id, 6000, 'contractor');
    setCustomRuleAdded(true);
  };

  return (
    <div className="space-y-4">
      {/* Presenter Stepper Controls Bar */}
      <PresenterBar
        scenario={scenario}
        onSelectScenario={(s) => setScenario(s)}
        step={step}
        totalSteps={totalSteps}
        onPrev={() => setStep((s) => Math.max(1, s - 1))}
        onNext={() => setStep((s) => Math.min(totalSteps, s + 1))}
        onReset={() => {
          setStep(1);
          setIsPlaying(false);
        }}
        isPlaying={isPlaying}
        onToggleAutoplay={() => setIsPlaying(!isPlaying)}
        showDataDrawer={showDataDrawer}
        onToggleDataDrawer={() => setShowDataDrawer(!showDataDrawer)}
        stepNarrative={narrative}
        viewMode={viewMode}
        onSelectViewMode={(m) => setViewMode(m)}
        showPersonaRail={showPersonaRail}
        onTogglePersonaRail={() => setShowPersonaRail(!showPersonaRail)}
      />

      {/* Top Persona Info & Quick Switcher Bar (Spacious & Clean) */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 font-heading font-black text-navy-900">
            <User className="w-4 h-4 text-otter-700" />
            <span>Active: <strong>{currentMember.display_name}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-sand-100 px-2.5 py-0.5 rounded-full border border-sand-200">
            Age: {currentMember.age_band} · Checking: ${currentMember.balance.toLocaleString()} · Usual: ${currentMember.usual_payment}
          </span>
          {currentMember.trusted_contact ? (
            <span className="text-[11px] font-bold text-safe-700 bg-safe-50 border border-safe-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Guardian: {currentMember.trusted_contact.name}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              No Guardian
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {scenario !== 'onboarding' && (
            <button
              type="button"
              onClick={() => {
                setScenario('onboarding');
                setStep(1);
              }}
              className="text-xs font-heading font-extrabold text-otter-700 bg-sand-100 hover:bg-sand-200 px-3 py-1.5 rounded-full border border-sand-300 flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Sign-Up Roleplay</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 text-xs">
            <label htmlFor="persona-select" className="font-heading font-bold text-slate-500">
              Persona:
            </label>
            <select
              id="persona-select"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="bg-sand-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-heading font-bold text-navy-900 focus:ring-2 focus:ring-kelp-700"
            >
              {members.map((m) => (
                <option key={m.member_id} value={m.member_id}>
                  {m.display_name} ({m.role}) — ${m.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Presentation Stage Row */}
      <div className="flex items-start gap-5 overflow-x-auto pb-2 justify-center">
        {/* Optional Collapsible Persona Rail */}
        {showPersonaRail && (
          <div className="shrink-0 animate-fadeIn">
            <PersonaRail
              members={members}
              selectedMemberId={selectedMemberId}
              onSelectMember={(id) => setSelectedMemberId(id)}
              activeScenario={scenario}
            />
          </div>
        )}

        {/* Column 2: Member Phone (shown in split or member mode) */}
        {(viewMode === 'split' || viewMode === 'member') && (
          <div className="shrink-0 transition-all">
            <PhoneFrame title="Sound Credit Union Member App">
              <SoundAppShell
                member={currentMember}
                lang={lang}
                onToggleLang={onToggleLang}
                activeNav={scenario === 'practice' ? 'practice' : 'pay'}
              >
                {/* Scenario 0: First-Time Onboarding & Imposter Role-Play */}
                {scenario === 'onboarding' && (
                  <OnboardingFlow
                    member={currentMember}
                    lang={lang}
                    onComplete={() => {
                      setScenario('scam');
                      setStep(1);
                    }}
                    onExit={() => {
                      setScenario('scam');
                      setStep(1);
                    }}
                  />
                )}

                {/* Scenario 1: Practice Drill */}
                {scenario === 'practice' && (
                  <div className="space-y-4">
                    <ScamOrLegitDeck
                      cards={[practiceCard]}
                      member={currentMember}
                      lang={lang}
                      onSetRule={(amt) => onUpdateMemberRule(currentMember.member_id, amt)}
                    />
                  </div>
                )}

              {/* Scenario 2: Scam (Anchor A) */}
              {scenario === 'scam' && (
                <div className="flex-1 flex flex-col justify-between">
                  {step === 1 && (
                    <PayAnyoneForm
                      member={currentMember}
                      lang={lang}
                      initialAmount={9800}
                      initialRecipient="Secure Reserve Holdings (example)"
                      initialType="wire"
                      onSubmit={() => setStep(2)}
                    />
                  )}

                  {step === 2 && (
                    <ReviewScreen
                      member={currentMember}
                      recipientName="Secure Reserve Holdings (example)"
                      amount={9800}
                      paymentType="wire"
                      lang={lang}
                      onSend={() => setStep(3)}
                      onBack={() => setStep(1)}
                    />
                  )}

                  {step >= 3 && step <= 4 && (
                    <OllieCheckSheet
                      amount={9800}
                      recipientName="Secure Reserve Holdings (example)"
                      practiceCard={practiceCard}
                      lang={lang}
                      onChoice={(choice) => {
                        if (choice === 'talk_to_sound') setStep(4);
                        else setStep(5);
                      }}
                    />
                  )}

                  {step === 5 && (
                    <div className="space-y-4 text-center my-auto p-4">
                      <OllieBubble
                        mood="cheer"
                        message={
                          lang === 'es'
                            ? '¡Hurra! Sus $9,800 se quedaron con usted y no salieron.'
                            : 'Your $9,800 stayed with you. Safe and sound in your checking account.'
                        }
                      />
                      <div className="bg-foam-50 border border-safe-700/30 rounded-2xl p-4 text-safe-700 text-xs font-bold font-heading">
                        Payment Safely Cancelled
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario 3: Look-Alike (Rosa Delgado) */}
              {scenario === 'lookalike' && (
                <div className="flex-1 flex flex-col justify-between">
                  {step === 1 && (
                    <ReviewScreen
                      member={currentMember}
                      recipientName="Ridgeline Roofing (example)"
                      amount={5000}
                      paymentType="ach"
                      lang={lang}
                      onSend={() => setStep(2)}
                      onBack={() => setStep(1)}
                    />
                  )}

                  {step >= 2 && step <= 3 && (
                    <SendTimeCard
                      amount={5000}
                      recipientName="Ridgeline Roofing (example)"
                      lang={lang}
                      sendTimeText="4:10 pm today"
                      onCallToSendNow={handleCallToSendNow}
                      onWaitSchedule={() => setStep(4)}
                    />
                  )}

                  {step === 4 && (
                    <div className="space-y-4 my-auto">
                      <OllieBubble
                        mood="wave"
                        message={
                          lang === 'es'
                            ? 'Llamada verificada con éxito con Member Care. Pago de $5,000 liberado.'
                            : 'Phone call verified with Sound Member Care! $5,000 released.'
                        }
                      />
                      <div className="p-3 bg-foam-50 border border-safe-700/30 rounded-2xl text-safe-700 font-bold text-xs text-center font-heading">
                        ACH Sent to Ridgeline Roofing
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="w-full min-h-[46px] bg-navy-900 text-white rounded-full font-heading font-extrabold text-xs"
                      >
                        Continue to Custom Rule
                      </button>
                    </div>
                  )}

                  {step === 5 && (
                    <OwnRulePrompt
                      category="contractor"
                      maxAmount={6000}
                      lang={lang}
                      isApplied={customRuleAdded}
                      onAcceptRule={handleApplyCustomRule}
                      onDismiss={() => setStep(1)}
                    />
                  )}
                </div>
              )}

              {/* Scenario 4: Takeover (Anchor B) */}
              {scenario === 'takeover' && (
                <div className="flex-1 flex flex-col justify-center">
                  <LockdownCard
                    member={currentMember}
                    lang={lang}
                    onCallSound={() => setStep(4)}
                  />
                </div>
              )}

              {/* Scenario 5: Missed Scam (Anchor C) */}
              {scenario === 'missed' && (
                <div className="flex-1 flex flex-col justify-between">
                  {step === 1 ? (
                    <div className="space-y-4 my-auto">
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                        <span className="font-heading font-bold text-slate-500 uppercase tracking-wide block">
                          Recurring Transfer Cleared
                        </span>
                        <div className="text-xl font-heading font-extrabold text-navy-900">
                          $300.00 to BrightHarbor Trading
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Payee added 5 months ago. No rules fired on internal data alone.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full min-h-[48px] bg-stop-700 hover:bg-red-800 text-white rounded-full font-heading font-extrabold text-xs shadow-sm"
                      >
                        Member Reports: "This was an investment scam"
                      </button>
                    </div>
                  ) : (
                    <RecoveryPath
                      member={currentMember}
                      lang={lang}
                      isSettingsApplied={tighterSettingsEngaged}
                      onActivateTighterSettings={() => setTighterSettingsEngaged(true)}
                    />
                  )}
                </div>
              )}
            </SoundAppShell>
          </PhoneFrame>
        </div>
        )}

        {/* Column 3: Second Phone (300×640, shown in split or member mode) */}
        {(viewMode === 'split' || viewMode === 'member') && (
          <div className="shrink-0 hidden lg:block transition-all">
            <SmsThread
              member={currentMember}
              mode={scenario === 'takeover' ? 'email' : 'sms'}
              lang={lang}
              scenario={scenario}
            />
          </div>
        )}

        {/* Column 4: Staff Console Panel (shown in split or staff mode) */}
        {(viewMode === 'split' || viewMode === 'staff') && (
          <div
            className={`transition-all ${
              viewMode === 'staff'
                ? 'w-full max-w-4xl mx-auto'
                : 'flex-1 min-w-[360px] max-w-2xl shrink-0 hidden md:block'
            }`}
          >
            <StaffConsole
              cases={cases}
              events={events}
              members={members}
              selectedCaseId={selectedCaseId}
              onSelectCase={(id) => setSelectedCaseId(id)}
              onDecision={(id, dec) => onStaffDecision(id, dec)}
            />
          </div>
        )}
      </div>

      {/* DecisionPipeline Strip underneath phones */}
      <DecisionPipeline
        currentStage={pipelineStage}
        lane={pipelineLane}
        reasons={pipelineReasons}
        fired={pipelineFired}
        outcomeText={outcomeText}
      />

      {/* Raw Data Inspector Drawer */}
      <DataDrawer
        isOpen={showDataDrawer}
        onClose={() => setShowDataDrawer(false)}
        events={activeEvents}
      />
    </div>
  );
};

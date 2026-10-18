import React, { useState } from 'react';
import { Ollie, OllieBubble } from './Ollie';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Flag,
  HelpCircle,
  MessageSquare,
  ShieldPlus,
  Sparkles,
  Layers,
} from 'lucide-react';

type GameMode = 'deck' | 'roleplay' | 'hunt' | 'quiz' | 'playbook';

interface Clue {
  id: number;
  phrase: string;
  explanation: string;
}

interface DeckCard {
  card_id: string;
  title: string;
  trickName: string;
  format: string;
  sender: string;
  content: string;
  is_scam: boolean;
  clues: Clue[];
  protect_action: string;
}

const SCAM_OR_LEGIT_CARDS: DeckCard[] = [
  {
    card_id: 'C1',
    title: 'Fake Fraud Department Text',
    trickName: 'Authority Impersonation',
    format: 'Text Message · 555-0199',
    sender: 'Alert-Center (555-0199)',
    content:
      'Sound Credit Union Alert: $1,420 wire attempted. Reply YES to speak with Security immediately or move funds to your Safe Holding Account at example.com/safe.',
    is_scam: true,
    clues: [
      { id: 1, phrase: 'Reply YES to speak with Security', explanation: 'Scammers ask you to reply so they can call and pressure you.' },
      { id: 2, phrase: 'move funds to your Safe Holding Account', explanation: 'Real credit unions never ask you to move money to keep it safe.' },
      { id: 3, phrase: 'example.com/safe', explanation: 'External links in urgent texts try to steal your login.' },
    ],
    protect_action: 'Set a rule: hold new payees over $1,000',
  },
  {
    card_id: 'C2',
    title: 'Remote Job Check Overpayment',
    trickName: 'The Overpayment Reversal',
    format: 'Email · hr@example.com',
    sender: 'Hiring Team (example.com)',
    content:
      'Welcome aboard! We mailed a $3,500 check for your home office laptop. Deposit it today and wire $1,200 back to our equipment vendor right away.',
    is_scam: true,
    clues: [
      { id: 1, phrase: 'mailed a $3,500 check', explanation: 'Scammers send fake checks that look real until they bounce days later.' },
      { id: 2, phrase: 'wire $1,200 back', explanation: 'Once you wire real money out, it cannot be undone when the check bounces.' },
    ],
    protect_action: 'Pause payments to new recipients right after a large deposit (Rule R6)',
  },
  {
    card_id: 'C3',
    title: 'Campus Rental P2P Deposit',
    trickName: 'Pre-Viewing Deposit Trap',
    format: 'Listing Message',
    sender: 'Tacoma Studio Host (555-0134)',
    content:
      '2BR near UW Tacoma for $950/mo! I am out of state on mission work, so send a $950 refundable P2P deposit now to hold the keys before Sunday viewing.',
    is_scam: true,
    clues: [
      { id: 1, phrase: 'out of state', explanation: 'Fake landlords invent excuses for why they cannot meet you in person.' },
      { id: 2, phrase: 'send a $950 refundable P2P deposit now', explanation: 'Instant P2P is for people you know—never pay before seeing inside a rental.' },
    ],
    protect_action: 'Set a rule: hold instant P2P to new recipients over $500',
  },
  {
    card_id: 'C4',
    title: 'Government Gift Card Call',
    trickName: 'Manufactured Urgency & Gift Cards',
    format: 'Voicemail Transcript · 555-0177',
    sender: 'County Warrant Desk (555-0177)',
    content:
      'This is Officer Miller. You missed jury duty. Stay on the line and purchase $800 in retail gift cards within 30 minutes to clear your warrant.',
    is_scam: true,
    clues: [
      { id: 1, phrase: 'Stay on the line', explanation: 'Keeping you on the phone stops you from checking with family or Sound.' },
      { id: 2, phrase: 'purchase $800 in retail gift cards', explanation: 'No government agency or court ever accepts gift cards or crypto.' },
    ],
    protect_action: 'Add a trusted contact who gets notified when a payment pauses',
  },
  {
    card_id: 'C5',
    title: 'Grandchild in Trouble Request',
    trickName: 'The Secrecy Pact',
    format: 'Text Message · 555-0162',
    sender: 'Unknown Number (555-0162)',
    content:
      'Grandma, it is me—I dropped my phone and got in a fender bender. Please send $1,800 via P2P to my friend’s account right now, and please don’t tell Mom!',
    is_scam: true,
    clues: [
      { id: 1, phrase: 'dropped my phone', explanation: 'Explains why they are texting from a strange number.' },
      { id: 2, phrase: 'please don’t tell Mom!', explanation: 'Scammers beg for secrecy so you won’t call family to verify.' },
    ],
    protect_action: 'Call family on a number you already have saved',
  },
  {
    card_id: 'C6',
    title: 'Direct Deposit Notice',
    trickName: 'Verified In-App Notice',
    format: 'In-App Notification',
    sender: 'Sound Credit Union App',
    content:
      'Your direct deposit of $2,140.00 from Pierce Transit has posted to your Checking Account. No action is needed.',
    is_scam: false,
    clues: [
      { id: 1, phrase: 'No action is needed', explanation: 'Real deposit notices inform you calmly without asking you to click links or move money.' },
    ],
    protect_action: 'Keep in-app deposit alerts turned on',
  },
  {
    card_id: 'C7',
    title: 'New Card Shipped Message',
    trickName: 'Informational Status Update',
    format: 'In-App Message Center',
    sender: 'Sound Credit Union App',
    content:
      'Your replacement debit card ending in 4821 has shipped by mail and will arrive in 5–7 business days. Activate it inside the Sound app when it arrives.',
    is_scam: false,
    clues: [
      { id: 1, phrase: 'Activate it inside the Sound app', explanation: 'Directs you to the official app rather than asking for your PIN or password.' },
    ],
    protect_action: 'Always activate cards directly in the official app',
  },
  {
    card_id: 'C8',
    title: 'Branch Appointment Reminder',
    trickName: 'Standard Appointment Note',
    format: 'Text Reminder · 555-0100',
    sender: 'Sound Credit Union (555-0100)',
    content:
      'Reminder: You have an in-person appointment at the Tacoma Pacific Ave branch tomorrow at 2:00 PM. Need to reschedule? Call the number on the back of your card.',
    is_scam: false,
    clues: [
      { id: 1, phrase: 'Call the number on the back of your card', explanation: 'Trusted reminders tell you to use the official number you already own.' },
    ],
    protect_action: 'Use the number on the back of your card',
  },
];

const ROLEPLAY_TURNS = [
  {
    scammerLine:
      'Caller (555-0199): "Hello, this is Sound Security. Someone in Miami just tried to wire $4,500 from your account. We must act in the next 3 minutes!"',
    tactic: 'Urgency',
    options: [
      { text: 'Oh no! Tell me where to send my money!', isSafe: false },
      { text: 'I will hang up and call the number on the back of my Sound card.', isSafe: true },
      { text: 'Here is my online banking password so you can check.', isSafe: false },
    ],
  },
  {
    scammerLine:
      'Caller: "Don’t hang up! Even your local branch staff might be part of this breach—keep this call completely secret while we secure your balance."',
    tactic: 'Secrecy',
    options: [
      { text: 'Okay, I won’t tell anyone.', isSafe: false },
      { text: 'Why would a real credit union ask me to hide this from staff? That’s a red flag.', isSafe: true },
      { text: 'Should I stay on the phone while driving to the ATM?', isSafe: false },
    ],
  },
  {
    scammerLine:
      'Caller: "To protect your savings, wire $9,800 to your temporary Federal Safe Vault account right now. We will refund it tomorrow."',
    tactic: '"Safe Account" Trick',
    options: [
      { text: 'Real banks never ask you to move money to a "safe account."', isSafe: true },
      { text: 'Give me the routing number so I can wire it fast.', isSafe: false },
      { text: 'Can I send half of it right now?', isSafe: false },
    ],
  },
  {
    scammerLine:
      'Caller: "If you don’t click example.com/lock and approve the wire code right now, your account will freeze permanently!"',
    tactic: 'Link & Threat Pressure',
    options: [
      { text: 'Clicking the link now!', isSafe: false },
      { text: 'Reading you my 6-digit passcode.', isSafe: false },
      { text: 'Hanging up now. My money is safe in my account until I talk to Sound directly.', isSafe: true },
    ],
  },
];

const RED_FLAG_PHRASES = [
  {
    id: 'flag1',
    text: '555-0199 (Unverified Caller ID)',
    why: 'Scammers spoof phone numbers so the call looks local.',
  },
  {
    id: 'flag2',
    text: 'act within 15 minutes or lose your savings',
    why: 'Manufactured urgency stops you from pausing to think.',
  },
  {
    id: 'flag3',
    text: 'transfer your balance to SafeAccount-Example.com',
    why: 'Real credit unions never ask you to move money to protect it.',
  },
  {
    id: 'flag4',
    text: 'do not mention this transfer to the teller',
    why: 'Coaching you to stay silent hides the scam from people who can help.',
  },
];

const QUIZ_QUESTIONS = [
  {
    q: 'A caller says your account is in danger and asks you to move money to a "safe account." What is true?',
    choices: [
      'Real credit unions never ask you to move money to keep it safe.',
      'You should wire the money right away to lock it.',
      'Only move half your balance first.',
    ],
    correctIdx: 0,
    clue: 'Your money is safest right where it is in your account.',
  },
  {
    q: 'A buyer sends you a check for more than the price and asks you to P2P the extra back. What happens next?',
    choices: [
      'You keep the bonus cash safely.',
      'The check bounces days later, and any money you sent is gone.',
      'The bank splits the difference.',
    ],
    correctIdx: 1,
    clue: 'Checks can take days to clear, even when funds show up right away.',
  },
  {
    q: 'Someone claiming to be a family member texts from a new number asking for P2P cash and says "Don’t tell Mom." Best move?',
    choices: [
      'Send the money fast so they aren’t stuck.',
      'Reply to the text asking for their birthday.',
      'Call the family member on a phone number you already had saved.',
    ],
    correctIdx: 2,
    clue: '"Don’t tell anyone" is the #1 clue to pause and call a known number.',
  },
  {
    q: 'A campus apartment listing asks for a P2P security deposit before you can tour the unit.',
    choices: [
      'Wait until you tour the unit in person and verify the lease before paying.',
      'Send it fast before another student rents it.',
      'Pay with retail gift cards instead.',
    ],
    correctIdx: 0,
    clue: 'Demanding instant P2P before a showing is a classic rental listing scam.',
  },
  {
    q: 'What does Ollie do when a payment shows scam signs in Otterly Safe?',
    choices: [
      'Blames you with a loud flashing red siren.',
      'Pauses the payment so your money stays in your account while we check together.',
      'Closes your checking account forever.',
    ],
    correctIdx: 1,
    clue: 'We pause calmly together so your money stays safe in your account.',
  },
];

interface PracticeWithOllieProps {
  onApplyRule?: (ruleLabel: string) => void;
  onRecordPractice?: (cardId: string, correct: boolean) => void;
}

export const PracticeWithOllie: React.FC<PracticeWithOllieProps> = ({
  onApplyRule,
  onRecordPractice,
}) => {
  const [mode, setMode] = useState<GameMode>('deck');

  // Deck state
  const [cardIndex, setCardIndex] = useState(0);
  const [deckAnswer, setDeckAnswer] = useState<boolean | null>(null);
  const [unlockedTricks, setUnlockedTricks] = useState<string[]>(['Authority Impersonation']);
  const [ruleAddedMessage, setRuleAddedMessage] = useState<string | null>(null);

  // Roleplay state
  const [turnIndex, setTurnIndex] = useState(0);
  const [roleplayScore, setRoleplayScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Red Flag Hunt state
  const [foundFlags, setFoundFlags] = useState<string[]>([]);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const currentCard = SCAM_OR_LEGIT_CARDS[cardIndex];
  const isDeckCorrect = deckAnswer !== null && deckAnswer === currentCard.is_scam;

  const handleDeckGuess = (guessScam: boolean) => {
    setDeckAnswer(guessScam);
    setRuleAddedMessage(null);
    const correct = guessScam === currentCard.is_scam;
    if (!unlockedTricks.includes(currentCard.trickName)) {
      setUnlockedTricks((prev) => [...prev, currentCard.trickName]);
    }
    onRecordPractice?.(currentCard.card_id, correct);
  };

  const badges = [
    {
      name: 'First catch',
      earned: unlockedTricks.length >= 1,
      desc: 'Practiced your first Scam or Legit card',
    },
    {
      name: 'Clue spotter',
      earned: foundFlags.length === 4 || unlockedTricks.length >= 4,
      desc: 'Spotted 4 red flags in practice',
    },
    {
      name: 'Steady paws',
      earned: roleplayScore >= 3 || quizScore >= 4,
      desc: 'Stayed calm under scammer urgency',
    },
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Top Banner + ShellBadges */}
      <div className="bg-white rounded-card border-2 border-slate-600/20 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Ollie mood="wave" size={64} />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-otter-100 text-otter-700 font-bold text-xs uppercase">
                Practice
              </span>
              <span className="text-xs font-bold text-slate-600">
                Inspired by Be Scam Ready & Spot the Vish
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-navy-900 mt-0.5">
              Practice with Ollie · Build Your Scam Playbook
            </h1>
          </div>
        </div>

        {/* ShellBadges */}
        <div className="flex flex-wrap gap-2" aria-label="Earned Shell Badges">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`px-3.5 py-2 rounded-full border-2 flex items-center gap-2 text-xs font-bold transition-all ${
                b.earned
                  ? 'bg-foam-50 border-kelp-700 text-navy-900 shadow-2xs'
                  : 'bg-sand-50 border-slate-600/20 text-slate-600 opacity-60'
              }`}
            >
              <Award className="w-4 h-4 text-otter-700 shrink-0" />
              <span>{b.name}</span>
              {b.earned && <CheckCircle2 className="w-4 h-4 text-safe-700 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'deck', label: '1. Scam or Legit? (8 Cards)', icon: Layers },
          { id: 'roleplay', label: '2. Role-Play Chat (4 Turns)', icon: MessageSquare },
          { id: 'hunt', label: '3. Red-Flag Hunt (Tap 4)', icon: Flag },
          { id: 'quiz', label: '4. Quick Quiz (5 Qs)', icon: HelpCircle },
          { id: 'playbook', label: `5. My Trick Card Playbook (${unlockedTricks.length}/8)`, icon: BookOpen },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id as GameMode)}
              className={`min-h-[48px] px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors duration-calm ${
                mode === item.id
                  ? 'bg-kelp-700 text-white shadow-sm'
                  : 'bg-white text-navy-900 border border-slate-600/30 hover:bg-foam-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: ScamOrLegitDeck + ClueSpotlight */}
      {mode === 'deck' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-card border-2 border-slate-600/20 p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-sand-100 text-otter-700 font-bold text-xs">
                Practice · Card {cardIndex + 1} of {SCAM_OR_LEGIT_CARDS.length}
              </span>
              <span className="font-mono text-xs text-slate-600">{currentCard.format}</span>
            </div>

            <div className="p-5 rounded-card bg-sand-50 border-2 border-slate-600/20">
              <div className="text-xs font-bold text-slate-600 mb-1">From: {currentCard.sender}</div>
              <p className="text-[18px] font-bold text-navy-900 leading-relaxed">
                {currentCard.content}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDeckGuess(true)}
                className="min-h-[48px] py-3 rounded-full bg-navy-900 text-white font-bold text-base hover:opacity-95 transition-opacity"
              >
                It’s a Scam Trick
              </button>
              <button
                type="button"
                onClick={() => handleDeckGuess(false)}
                className="min-h-[48px] py-3 rounded-full bg-kelp-700 text-white font-bold text-base hover:opacity-95 transition-opacity"
              >
                It’s Legit
              </button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-600/10">
              <button
                type="button"
                disabled={cardIndex === 0}
                onClick={() => {
                  setCardIndex((i) => i - 1);
                  setDeckAnswer(null);
                }}
                className="min-h-[48px] px-4 rounded-full bg-sand-100 font-bold text-sm disabled:opacity-40"
              >
                Previous Card
              </button>
              <button
                type="button"
                disabled={cardIndex === SCAM_OR_LEGIT_CARDS.length - 1}
                onClick={() => {
                  setCardIndex((i) => i + 1);
                  setDeckAnswer(null);
                }}
                className="min-h-[48px] px-4 rounded-full bg-sand-100 font-bold text-sm disabled:opacity-40"
              >
                Next Card
              </button>
            </div>
          </div>

          {/* ClueSpotlight + ProtectAction */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {deckAnswer === null ? (
              <OllieBubble
                mood="think"
                text="Read the message slowly. Would Sound ever ask you to do this?"
              />
            ) : (
              <>
                <OllieBubble
                  mood={isDeckCorrect ? 'cheer' : 'concerned'}
                  text={
                    isDeckCorrect
                      ? 'Spot on! You unlocked this trick card for your playbook.'
                      : "Tricky one! Here's the clue that gave it away."
                  }
                />

                {/* ClueSpotlight */}
                <div className="bg-white rounded-card border-2 border-kelp-700 p-5 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-extrabold text-lg text-navy-900">
                      ClueSpotlight · {currentCard.trickName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-foam-50 text-kelp-700 font-bold text-xs">
                      Playbook Card Unlocked
                    </span>
                  </div>
                  {currentCard.clues.map((clue) => (
                    <div
                      key={clue.id}
                      className="p-3 rounded-card bg-sand-50 border border-slate-600/20 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-navy-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {clue.id}
                      </span>
                      <div className="text-sm">
                        <p className="font-bold text-navy-900">“{clue.phrase}”</p>
                        <p className="text-slate-600 mt-0.5">{clue.explanation}</p>
                      </div>
                    </div>
                  ))}

                  {/* ProtectAction */}
                  <div className="pt-2 border-t border-slate-600/15 flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase text-otter-700">
                      ProtectAction · Turn Practice Into Protection
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRuleAddedMessage(currentCard.protect_action);
                        onApplyRule?.(currentCard.protect_action);
                      }}
                      className="min-h-[48px] px-4 py-2.5 rounded-full bg-kelp-700 hover:bg-kelp-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-calm"
                    >
                      <ShieldPlus className="w-4 h-4" />
                      <span>{currentCard.protect_action}</span>
                    </button>
                    {ruleAddedMessage && (
                      <p className="text-xs font-bold text-safe-700 animate-fadeIn">
                        ✓ Active on your Sound profile: “{ruleAddedMessage}”
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* OfficialAlertCard */}
            <div className="p-4 rounded-card bg-white border border-slate-600/30 text-sm shadow-2xs">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
                Source: FTC consumer alerts (example)
              </span>
              <p className="font-bold text-navy-900 mt-1">
                Impersonators use urgent texts or calls to rush you into moving money. Real financial
                institutions will never ask you to transfer money to a “safe account.”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: RolePlayChat ("The Bank Security Call") */}
      {mode === 'roleplay' && (
        <div className="bg-white rounded-card border-2 border-slate-600/20 p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-otter-100 text-otter-700 font-bold text-xs">
                Practice · Role-Play Chat
              </span>
              <h2 className="font-heading font-extrabold text-xl text-navy-900 mt-1">
                The Bank Security Call · Turn {turnIndex + 1} of 4
              </h2>
            </div>
            {/* Calm Tactic Spotter Bar (Kelp UI replacement for a flashing Scam-O-Meter) */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-600">Tactics Spotted:</span>
              {['Urgency', 'Secrecy', '"Safe Account" Trick', 'Link & Threat Pressure'].map(
                (tactic, i) => (
                  <span
                    key={tactic}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      i <= turnIndex
                        ? 'bg-check-50 text-check-700 border border-check-700 shadow-2xs'
                        : 'bg-sand-100 text-slate-600 opacity-50'
                    }`}
                  >
                    {tactic}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="p-4 rounded-card bg-sand-50 border-2 border-slate-600/20 text-[18px] font-bold text-navy-900">
            {ROLEPLAY_TURNS[turnIndex].scammerLine}
          </div>

          <div className="flex flex-col gap-2.5">
            {ROLEPLAY_TURNS[turnIndex].options.map((opt, idx) => (
              <button
                key={opt.text}
                type="button"
                onClick={() => {
                  setSelectedOption(idx);
                  if (opt.isSafe) setRoleplayScore((s) => s + 1);
                }}
                className={`min-h-[48px] p-3.5 rounded-full text-left font-bold text-base border-2 transition-colors duration-calm ${
                  selectedOption === idx
                    ? opt.isSafe
                      ? 'bg-foam-50 border-safe-700 text-safe-700'
                      : 'bg-check-50 border-check-700 text-check-700'
                    : 'bg-white border-slate-600/30 hover:bg-sand-50 text-navy-900'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {selectedOption !== null && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <OllieBubble
                mood={ROLEPLAY_TURNS[turnIndex].options[selectedOption].isSafe ? 'cheer' : 'concerned'}
                text={
                  ROLEPLAY_TURNS[turnIndex].options[selectedOption].isSafe
                    ? 'Great call! We never let a caller rush us.'
                    : "Tricky one! Here's the clue that gave it away."
                }
              />
              {turnIndex < ROLEPLAY_TURNS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setTurnIndex((t) => t + 1);
                    setSelectedOption(null);
                  }}
                  className="min-h-[48px] px-6 rounded-full bg-kelp-700 hover:bg-kelp-800 text-white font-bold transition-colors"
                >
                  Next Turn →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTurnIndex(0);
                    setSelectedOption(null);
                  }}
                  className="min-h-[48px] px-6 rounded-full bg-navy-900 hover:bg-slate-800 text-white font-bold transition-colors"
                >
                  Restart Role-Play
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 3: RedFlagHunt */}
      {mode === 'hunt' && (
        <div className="bg-white rounded-card border-2 border-slate-600/20 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-xl text-navy-900">
              Red-Flag Hunt · Tap all 4 hidden red flags ({foundFlags.length}/4 found)
            </h2>
            <span className="px-3 py-1 rounded-full bg-foam-50 text-kelp-700 font-bold text-xs">
              Practice
            </span>
          </div>

          <p className="text-sm text-slate-600 font-bold">
            Tap each highlighted phrase in the suspicious message below to expose the scammer’s trick:
          </p>

          <div className="p-5 rounded-card bg-sand-50 border-2 border-slate-600/20 leading-loose text-[18px]">
            Alert from{' '}
            {RED_FLAG_PHRASES.map((item) => {
              const found = foundFlags.includes(item.id);
              return (
                <React.Fragment key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setFoundFlags((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]))
                    }
                    className={`min-h-[48px] px-3 py-1 mx-1 my-1 rounded-full font-bold underline transition-colors duration-calm ${
                      found
                        ? 'bg-check-50 text-check-700 border-2 border-check-700 shadow-2xs'
                        : 'bg-white text-navy-900 border border-slate-600/40 hover:bg-foam-50'
                    }`}
                  >
                    {item.text}
                  </button>{' '}
                </React.Fragment>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RED_FLAG_PHRASES.filter((f) => foundFlags.includes(f.id)).map((f, i) => (
              <div key={f.id} className="p-3.5 rounded-card bg-foam-50 border border-kelp-700 text-sm">
                <span className="font-bold text-navy-900">
                  Flag #{i + 1}: “{f.text}”
                </span>
                <p className="text-slate-600 mt-1">{f.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: QuickQuiz */}
      {mode === 'quiz' && (
        <div className="bg-white rounded-card border-2 border-slate-600/20 p-6 flex flex-col gap-4 shadow-sm">
          <span className="text-xs font-bold uppercase text-otter-700">
            Practice · Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <h2 className="font-heading font-extrabold text-xl text-navy-900">
            {QUIZ_QUESTIONS[quizIndex].q}
          </h2>
          <div className="flex flex-col gap-2.5">
            {QUIZ_QUESTIONS[quizIndex].choices.map((c, idx) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setQuizChoice(idx);
                  if (idx === QUIZ_QUESTIONS[quizIndex].correctIdx) {
                    setQuizScore((s) => s + 1);
                  }
                }}
                className={`min-h-[48px] p-3.5 rounded-full text-left font-bold border-2 transition-colors ${
                  quizChoice === idx
                    ? idx === QUIZ_QUESTIONS[quizIndex].correctIdx
                      ? 'bg-foam-50 border-safe-700 text-safe-700'
                      : 'bg-check-50 border-check-700 text-check-700'
                    : 'bg-sand-50 border-slate-600/20 text-navy-900 hover:bg-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {quizChoice !== null && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-sm font-bold text-navy-900">
                Clue: {QUIZ_QUESTIONS[quizIndex].clue}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuizIndex((i) => (i + 1) % QUIZ_QUESTIONS.length);
                  setQuizChoice(null);
                }}
                className="min-h-[48px] px-5 rounded-full bg-kelp-700 hover:bg-kelp-800 text-white font-bold text-sm transition-colors"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 5: Be Scam Ready-Style Collectible Trick Card Playbook */}
      {mode === 'playbook' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCAM_OR_LEGIT_CARDS.map((card) => {
            const unlocked = unlockedTricks.includes(card.trickName);
            return (
              <div
                key={card.card_id}
                className={`p-5 rounded-card border-2 flex flex-col justify-between gap-3 transition-all ${
                  unlocked
                    ? 'bg-white border-kelp-700 shadow-sm'
                    : 'bg-sand-100 border-slate-600/20 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-otter-700">
                      TRICK CARD · {card.card_id}
                    </span>
                    <Sparkles className="w-4 h-4 text-kelp-700" />
                  </div>
                  <h3 className="font-heading font-extrabold text-lg text-navy-900 mt-1">{card.trickName}</h3>
                  <p className="text-sm text-slate-600 mt-1">{card.clues[0]?.explanation}</p>
                </div>
                <div className="text-xs font-bold text-kelp-700 bg-foam-50 p-2.5 rounded-card border border-kelp-200">
                  Used in Ollie Check: Replays automatically if a future payment matches this pattern.
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

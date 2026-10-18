# Product Requirements Document (PRD)
## Otterly Safe: Scam-Protection Prototype for Sound Credit Union

**Document Version:** 1.0.0  
**Event:** HuskyHack 2026 (Hosted by Sound Credit Union & University of Washington Tacoma)  
**Challenge:** *"Stop the scam before the money moves."*  
**Product Name:** Otterly Safe  
**Mascot:** Ollie the Sea Otter  
**Tagline:** *"Otterly safe, every wave of life."*  

---

## 1. Executive Summary & Problem Statement

Financial fraud and social engineering scams have metastasized from simple automated phishing into high-pressure psychological manipulation. In bank impersonation, fake remote employment, and family emergency scams, **the legitimate member is coerced into authorizing the transfer themselves**.

Traditional fraud defenses fail here because:
1. **The member authenticates cleanly:** Multi-factor authentication (MFA) and biometric face scans succeed because the victim is holding the device under psychological duress.
2. **Current warnings are ignorable:** Generic static warnings (*"Never send money to strangers"*) suffer from cognitive banner blindness and provide effortless *"Send anyway"* bypass buttons.
3. **Surveillance creep breaks trust:** Solutions proposing invasive keystroke biometrics, continuous GPS tracking, or email/SMS interception violate consumer trust and create massive regulatory liability.

**Otterly Safe** re-imagines scam intervention within the Sound Credit Union mobile app. Operating strictly on **Sound's internal account ledger data**, Otterly Safe pauses suspicious transfers, re-engages cognitive rational thinking via a 30-second check, removes bypass trapdoors, and coordinates seamless employee and trusted-contact support.

---

## 2. Alignment with Judging Criteria

| Criterion | Weight | How Otterly Safe Wins |
| :--- | :---: | :--- |
| **Member Safety** | **30%** | Transfers pause before money moves; funds stay 100% inside Sound accounts; zero "send anyway" bypass in scam lanes; takeover locks new payees instantly. |
| **User Experience & Trust** | **25%** | **Kelp UI** ("calm, kind, clear"): warm tones, Ollie mascot guidance, Atkinson Hyperlegible typography, bilingual EN/ES, no alarmist red warnings for everyday members. |
| **Feasibility** | **20%** | Pure deterministic rules (R1–R7) running on existing credit union data (ACH, wire, P2P, balances, login history); zero reliance on expensive AI APIs, device telemetry, or external fraud feeds. |
| **Innovation** | **15%** | **Practice-to-Intervention Recall:** Connecting practice drills to live transaction checks (*"You practiced this on Oct 3"*); member-created custom rules; no-blame restorative recovery. |
| **Prototype & Presentation** | **10%** | Interactive multi-device demo stage (member phone, contact phone, staff console, decision pipeline, raw data drawer); 100% offline-capable; automated keyboard navigation. |

---

## 3. Core Personas

### 3.1 Anchor Personas (Synthetic Risk Cases)
- **Anchor A (Age 65–74, Usual Pay: $800, Balance: $14,200):** Target of an urgent bank-impersonation scam. Coerced into wiring $9,800 to a "safe holding vault". Has enrolled trusted contact (daughter Maya).
- **Anchor B (Age 55–64, Usual Pay: $400, Balance: $6,500):** Victim of midnight credential compromise. Password reset at 2:03 am, phone number updated at 2:05 am, followed immediately by a $4,000 P2P transfer to an unknown payee.
- **Anchor C (Age 35–44, Usual Pay: $350, Balance: $3,200):** Victim of a slow-burn romance/investment platform scam. Sends weekly $300 ACH payments to a payee added 5 months ago. Represents the **Missed Scam** persona.
- **Anchor D (Age 18–24, Usual Pay: $150, Balance: $3,350):** College student tricked by a fake remote job check ($2,450 deposit), attempting to P2P $1,900 to an "office supplier". Retries with $950 after a hold.

### 3.2 Legitimate Look-Alike Personas
- **Rosa Delgado (L2001, Age 45–54, Usual Pay: $1,200, Balance: $18,500):** Paying $5,000 by ACH to "Ridgeline Roofing" after home storm damage. Triggers R1 and R2, but correctly routed to the Look-Alike lane.
- **Ken Okafor (L2002):** First payment of $1,800 to a new childcare center.
- **Linh Tran (L2003):** Tuition payment of $4,200 to Cascade Community College.
- **Marisol Vega (L2004):** $12,000 wire down payment for a vehicle purchase.
- **Sam Whitfield (L2005):** Recurring $600 birthday gift to grandson.
- **Priya Raman (L2006):** First rental security deposit to a campus apartment.

---

## 4. Feature Specifications

### 4.1 Practice with Ollie
1. **ScamOrLegitDeck:** 8 interactive cards (5 scams, 3 legitimate notifications). After selection, **ClueSpotlight** numbers red flags directly within the text and explains the psychological trigger in 1 line.
2. **RolePlayChat ("The Bank Security Call"):** 4 scripted turns simulating an urgent inbound impersonator. 3 choices per turn; tests resistance to false urgency and demands for secrecy.
3. **RedFlagHunt:** Interactive spotting drill challenging members to tap 4 embedded deceptions in an urgent SMS.
4. **QuickQuiz:** 5 foundational financial protection questions with instant explanations.
5. **ShellBadges:** Gamified badges (*"First Catch"*, *"Clue Spotter"*, *"Steady Paws"*) encouraging member engagement.

### 4.2 The Ollie Check (Scam Signs Lane)
- Triggered by: `R1 + R4 + (R2 or R3)`, or `R6`, or `R7`.
- Visual: **OllieCheckSheet** slides up with Ollie in *concerned* mood.
- Components:
  - **MoneyIsSafeCard:** Reassures that funds have not moved.
  - **RememberThisCard:** Matches the live transfer to a practice drill completed earlier (*"You practiced this one on Oct 3"*).
  - **CheckQuestions:** 3 plain-language yes/no questions (*"Did someone call or text?", "Did they say to act fast or keep secret?", "Did they say your money is in danger?"*).
  - **Golden Revelation:** If any "Yes" is selected: *"Real banks don't ask you to move money to keep it safe."*
  - **ChoiceBar:** Exactly 3 exits: **Cancel · Wait 24 Hours · Talk to Sound**. **No "send anyway" bypass.**
  - **Trusted Contact SMS:** Triggers automated prompt to family contact without exposing balances.

### 4.3 Look-Alike Lane & Custom Rule Creation
- Triggered by: `R1` or `R2` alone on lower-risk rails (e.g. ACH) without takeover or scam markers.
- Visual: **SendTimeCard**.
  - One purpose question: *Home repair, Family, Rent, Something else*.
  - Predictable send schedule: *"Sends at 4:10 pm today, or call us to send now."*
  - Member can trigger immediate staff phone release.
- **OwnRulePrompt:** Following release, Ollie offers: *"Contractor payments up to $6,000 won't pause."* Member can add this rule to eliminate future friction.

### 4.4 Account Takeover Lockdown
- Triggered by: `R5` (password/contact change within 72h) + new recipient + (`R2` or `R3`).
- Visual: **LockdownCard** (Stop-700 red).
- Design Rule: **No Ollie check sheet or quiz is shown**, as the unauthorized party may possess the physical device.
- Action: Locks new payees immediately; sends verification alert to email/phone on file *before* the change; queues verification case for staff.

### 4.5 Restorative Missed-Scam Recovery
- Addresses undetected slow-burn manipulation (Anchor C).
- Visual: **RecoveryPath**.
  - Ollie in *calm/wave* mood: *"This isn't your fault. Scammers are skilled. Here's what we can do right now."*
  - Status of federal ACH return window (48-hour NACHA rule).
  - 1-click FTC and IC3 fraud report generation package.
  - Activation of 90 days of tighter account protection settings.

### 4.6 Staff Intervention Console
- Dedicated console for member care and fraud teams.
- **CaseQueue:** Filterable by lane (*Scam, Look-Alike, Takeover, Recovery*).
- **CaseDetail:** Plain-English rule explanations, member in-app quiz responses.
- **RecallClock:** Text-based legal recall windows (*"Fedwire: Closed"*, *"ACH: 22h remaining"*, *"Pending: Paused at gateway"*).
- **CallScript:** 3-line verified telephone script.
- **DecisionBar:** 1-click execution (*Release, Keep Holding, Escalate*).
- **AuditLog:** Complete chronological record of who, when, and why.
- **Keyboard Shortcuts:** <kbd>J</kbd>/<kbd>K</kbd> to cycle queue, <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> for decisions.

---

## 5. Design System: Kelp UI ("Calm, Kind, Clear")

- **Primary Brand:** `kelp-700` (`#0F766E`)
- **Typography:**
  - Headings: `Nunito` (700–800)
  - Body: `Atkinson Hyperlegible` (18px base on member screens, 16px on staff screens)
  - Monospace: `JetBrains Mono` (case IDs, timestamps)
- **Palette Tokens:**
  - Sand background: `sand-50` (`#FFF8EE`)
  - Safe panel: `foam-50` (`#ECFDF5`)
  - Reassurance safe green: `safe-700` (`#15803D`)
  - Paused caution amber: `check-700` (`#B45309`) on `check-50` (`#FEF3C7`)
  - Takeover stop red: `stop-700` (`#B91C1C`) on `stop-50` (`#FEE2E2`)
  - Staff dark mode: `#E2E8F0` text on `#0F172A`
- **Accessibility:** Full WCAG 2.2 AA conformance; 48px touch targets; color never used alone; timers formatted as clear text; screen reader announcements via `aria-live="polite"`.

---

## 6. Acceptance Criteria

1. **Deterministic Execution:** 100% of rule logic executes deterministically with 0 external network dependencies.
2. **Offline Resilience:** All assets, fonts, icons, and seed data load offline from static build.
3. **Flawless Demo Path:** All 5 scenarios run end-to-end via PresenterBar without console warnings.
4. **Bilingual Completeness:** All member-facing strings dynamically swap between English and Spanish on toggle.
5. **Zero Data Creep:** Verified absence of device telemetry, biometric sensors, or third-party tracking feeds.

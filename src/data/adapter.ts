import type { BankEvent, Card, Case, Dataset, Member, MemberKeyRow } from '../types';
import seedDataRaw from './seed.json';
import cardsRaw from './cards.json';
import Papa from 'papaparse';

const defaultCards: Card[] = cardsRaw as unknown as Card[];

/**
 * Loads either starter kit files (from /public/kit/) if present,
 * or falls back seamlessly to the generated synthetic seed data.
 */
export async function loadDataset(): Promise<Dataset> {
  try {
    // Check if starter kit manifest or csv/json files exist in /public/kit/
    const resp = await fetch('./kit/manifest.json');
    if (resp.ok) {
      const manifest = await resp.json();
      const [membersData, eventsData, casesData] = await Promise.all([
        fetchKitResource(manifest.membersFile || './kit/members.csv'),
        fetchKitResource(manifest.eventsFile || './kit/events.csv'),
        fetchKitResource(manifest.casesFile || './kit/cases.json')
      ]);

      const members = mapKitMembers(membersData);
      const events = mapKitEvents(eventsData);
      const cases = mapKitCases(casesData);

      return {
        source: 'kit',
        generated_for: 'Sound Credit Union HuskyHack 2026 Starter Kit',
        members,
        events,
        cards: defaultCards,
        cases,
        member_key: manifest.member_key || []
      };
    }
  } catch (err) {
    // Fall back to seed data if kit is not found or fails to load
    console.info('Starter kit not found in /kit/. Using high-fidelity synthetic seed data.');
  }

  // Fallback to local high-fidelity seed data
  const seed = seedDataRaw as unknown as {
    source: 'seed';
    generated_for: string;
    members: Member[];
    events: BankEvent[];
    cases: Case[];
    member_key: MemberKeyRow[];
  };

  return {
    source: 'seed',
    generated_for: seed.generated_for,
    members: seed.members,
    events: seed.events,
    cards: defaultCards,
    cases: seed.cases,
    member_key: seed.member_key
  };
}

async function fetchKitResource(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const text = await res.text();
  if (url.endsWith('.json')) {
    return JSON.parse(text);
  }
  // Parse CSV
  const parsed = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true });
  return parsed.data;
}

function mapKitMembers(rows: any[]): Member[] {
  return rows.map((r, idx) => ({
    member_id: r.member_id || r.id || `M${1001 + idx}`,
    display_name: r.display_name || r.name || `Member ${idx + 1}`,
    age_band: r.age_band || r.age || '35–44',
    usual_payment: Number(r.usual_payment || r.avg_payment || 400),
    balance: Number(r.balance || 5000),
    trusted_contact: r.trusted_contact_name
      ? {
          name: r.trusted_contact_name,
          relation: r.trusted_contact_relation || 'family',
          phone: r.trusted_contact_phone || '(253) 555-0199'
        }
      : null,
    own_rules: r.own_rules ? (typeof r.own_rules === 'string' ? JSON.parse(r.own_rules) : r.own_rules) : [],
    practice_history: r.practice_history ? (typeof r.practice_history === 'string' ? JSON.parse(r.practice_history) : r.practice_history) : [],
    role: r.role === 'anchor' ? 'anchor' : 'lookalike',
    placeholder: false,
    phone_on_file: r.phone || '(253) 555-0123',
    email_on_file: r.email || `member${idx + 1}@example.com`,
    story: r.story || ''
  }));
}

function mapKitEvents(rows: any[]): BankEvent[] {
  return rows.map((r, idx) => ({
    event_id: r.event_id || r.id || `E-KIT-${String(idx + 1).padStart(4, '0')}`,
    member_id: r.member_id,
    timestamp: r.timestamp || new Date().toISOString(),
    type: r.type || 'payment',
    amount: r.amount !== undefined ? Number(r.amount) : null,
    channel: r.channel || 'mobile',
    payment_type: r.payment_type || 'p2p',
    recipient_id: r.recipient_id || null,
    recipient_name: r.recipient_name || null,
    recipient_category: r.recipient_category || null,
    new_recipient: Boolean(r.new_recipient),
    status: r.status || 'sent',
    hold_count: Number(r.hold_count || 0),
    balance_before: r.balance_before !== undefined ? Number(r.balance_before) : null,
    retry_of: r.retry_of || null,
    detail: r.detail || null
  }));
}

function mapKitCases(rows: any[]): Case[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((c, idx) => ({
    case_id: c.case_id || `CASE-${3000 + idx}`,
    member_id: c.member_id,
    event_id: c.event_id,
    lane: c.lane || 'scam',
    kind: c.kind || 'pause',
    reasons: c.reasons || [],
    answers: c.answers || [],
    decision: c.decision || 'pending',
    audit: c.audit || [],
    created_at: c.created_at || new Date().toISOString(),
    source: 'seed',
    scenario: c.scenario,
    flags: c.flags
  }));
}

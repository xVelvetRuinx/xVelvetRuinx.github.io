# Laffi Partner Hub — Interactive Concept Starter

A functional, original-design, mobile-first partner portal prototype that Laffi's product/development team can inspect, adapt, and build upon. It is inspired by the **features** commonly found in creator team portals (overview, member stages, publishing counts, activity stream, reward status) but **does not reproduce any other company's code, graphics, or private logic**.

## Open the demonstration

**Fastest:** Open `Laffi_Partner_Hub_Demo.html` (in the ZIP root) in a modern browser. Everything is embedded in that one file.

**Developer/source view:** Open `index.html` in your browser, or serve this folder locally:

```sh
python3 -m http.server 8080
# browse to http://localhost:8080
```

No framework, account, API key, installation, or build step is required. The `styles.css` and `app.js` files are intentionally separate and readable for engineers. The single HTML demo is generated from the same source code.

## Working features

- Six interactive tabs: Overview, Creators, Readers, Activity, Rewards, Settings.
- Creator stage filtering (awaiting start, trial, active, paused, ended), editable creator records, works in review, published works and engagement counts.
- Reader qualification and retention stage filtering, editable reader records, and deduplicated cross-role account identities.
- Auto-updating KPI cards, current-team counts, creator progress and 20/60/120 proposed milestone indicators.
- Activity feed populated from sample events **and updates performed in the demo**.
- Configurable **proposed** onboarding and retention reward values; rewards appear ONLY when explicit verification checkboxes are selected on a creator record.
- Approved-versus-marked-paid demo bonus ledger. Marking a payment paid does **not** issue money.
- Proposed milestone scope setting: readers, creators, or combined *unique* account IDs.
- Add/edit creator and reader, search/filter lists, edit proposed terms, copy example referral link.
- Export creators, readers, activity, rewards and overview as CSV; export/import complete demo records as JSON; reset to sample data.
- Browser localStorage persistence across refreshes; responsive small-screen navigation.

## Important limitations — not production-ready

**Nothing connects to Laffi yet.** All sample names, reader counts, Crystal activity, work counts, dollar values and reward states are fictional or proposed. This demo has **no login, no authentication, no server-side rules, no audit trail, no PayPal integration, no payments, no moderation, and no platform API connection**. Browser storage can be changed by anyone who uses that browser. Never use it for official qualifications, real user data, financial statements or payments.

The **$15 onboarding and $10 retention** values and **20 / 60 / 120** milestone counts are examples based on draft discussion and must be validated with Laffi. Qualifications (e.g., observation days, publication thresholds, retention criteria, audience, payment recipient and payout approvals) are **not finalized**. This demo deliberately requires an explicit verified status rather than inventing those business rules. It also does **not** assume a payout value for milestones. Reader qualifying activity is not equivalent to eligible Crystal consumption.

The creator revenue-share campaign should be displayed through a **separate settlement ledger** from Team Lead referral bonuses. Do not compute money from raw Crystal figures without the approved settlement rules.

## Suggested production architecture

- **Frontend**: Keep this UI or move it into React/Next.js/Vue; the feature model is framework-independent.
- **Backend**: Laffi-owned authenticated REST/GraphQL API, or a dedicated service controlled by Laffi.
- **Storage**: PostgreSQL, with scoped team memberships, immutable referral attribution, server-managed milestone and payout records, and audit events.
- **Auth/permissions**: Laffi-approved SSO and roles: platform admin, team lead, recruiter, creator. Team leads see only their teams.
- **Data pipeline**: Laffi-owned account creation, signed contracts/trials, character moderation/publishing, reader engagement, and verified reward decisions. No private user chats or raw conversation transcripts should be exposed to recruiters.
- **Time rules**: Define a canonical timezone for program settlement and display last-successful-sync timestamps.
- **Payouts**: Official payment processor integration operated by Laffi; the front end cannot authorize or send payments.

See `docs/API_CONTRACT.md` and `docs/schema.sql` for specific starting points.

## Demo-to-production map

| Demo implementation | Replace in production |
|---|---|
| `demoState()` | Authenticated account/team and metrics API |
| `localStorage` | Backend database and server-owned authorization |
| `savePerson()` | Server-side workflows subject to permissions |
| `onboardingApproved`, `retentionApproved` flags | Verified qualification decisions with reviewer, source, timestamp and ruleset |
| `paidIds` | Actual reconciliation from payout ledger |
| Work/chat/Crystal counts in sample state | Aggregate snapshots from Laffi source records |
| Combined `userId` unique count | Server-side deduplication on stable Laffi account ID |
| Local activity events | Append-only, signed platform event feed |

## Proposed project acceptance criteria

1. A team lead logs in using Laffi authentication and sees only assigned team creators and their aggregate reader referrals.
2. Registration/trial/long-term stages and work submissions update from authoritative Laffi records, with visible source and sync time.
3. Qualification is explicitly defined, versioned and auditable. No client-side action can authorize financial rewards.
4. Combined creator+reader milestones deduplicate the same account; false or refunded activity is excluded under agreed policy.
5. Creator revenue share and Team Lead incentives remain separate in calculations and reporting.
6. Administrators can review/approve/dispute a reward; the lead can view its current status; actual payment proof is reconciled.
7. Mobile and desktop layouts support real-world data volumes; accessibility, security and privacy reviews are completed.

## Sharing with Laffi

Send the single-file demo for rapid viewing and the ZIP for full source, UI, sample state, implementation notes and SQL starting schema. This project is a **proposal / scaffold**, not a claim of access to Laffi infrastructure and not an implementation of another company's proprietary system.
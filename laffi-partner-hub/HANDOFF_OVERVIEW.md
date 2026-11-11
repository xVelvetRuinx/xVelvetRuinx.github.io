# Laffi Partner Hub — Prototype Proposal

**Purpose:** Give Laffi an interactive example of a Team Lead management portal that unifies creator onboarding, reader referral attribution, publishing visibility, team activity, qualification milestones and rewards status.

**Prototype provided:** Browser-based, six-tab clickable demo with editable sample records, search and stage filters, automatically recalculated KPIs, milestone progress, a proposed verified-bonus ledger, and CSV/JSON exports. Works offline; no account or installation required.

**Why this helps Laffi:**
- Move from manual status checks to a shared operational view of recruitment **and retention**.
- Help team leads identify who needs onboarding assistance without asking support for every update.
- Separate registrations from qualified or retained users so incentive payments are meaningful.
- Give administrators visibility into which reward was earned, what verification supports it, and whether it was paid.
- Support multiple team leads with clear, role-based data access.

**What Laffi would need to provide for a live version:** An approved authentication method; authoritative account and referral mapping; creator submission and publication events; approved qualification criteria; verified engagement and reward decisions; official payout status; permission scope for Team Leads; and an API or secure import feed.

**Rules still requiring agreement:** Whether 20/60/120 milestones apply to readers, creators, or unique combined users; the qualifying event and observation window for each type; who receives $15 onboarding and $10 retention bonuses; retention standards; milestone amounts; dispute/duplicate handling; and settlement schedule. The demo uses those dollar values strictly as configurable proposals, not as confirmed Laffi offers.

**Implementation suggestion:** Review and approve the workflow with product, finance, legal and developer stakeholders. Then replace browser-local data with official Laffi APIs; enforce permissions and eligibility server-side; integrate a verified payment ledger. The sample front end can be retained or rebuilt in Laffi's preferred stack.

**Privacy note:** The demo contains fictitious user accounts and shows aggregate reader statistics. A production Team Lead interface should not expose private reader conversations or unrelated users' personal details.
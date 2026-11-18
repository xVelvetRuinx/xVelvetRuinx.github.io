# Fizzz Creator Experience Upgrade — Engineering Proposal

**Created:** 2026-11-18  
**Status:** Conceptual feature proposal. The linked UI demo is front-end only; no live Fizzz services or PayPal payments are connected.  
**Platforms:** Android (reference), web, and iOS whenever available.  
**Goal:** Improve creator discovery, retention, safety, testing, and earnings transparency **without redesigning Fizzz's established UI**.

## 1. Preserve the current user experience

Reference screenshots provided by the proposer show:

- Creator public profile: avatar, bio, level badge, Fizzz+, Gems, Tasks, and a **Creators / Join Us** tile; Characters, Saved, Moments tabs and the existing character grid.
- Tapping **Creators / Join Us** opens Creator Center on Android. Keep this entrypoint and extend it to web/iOS.
- Creator Center: current Level S / 20% revenue share header; earned **Coins** balance; **1 Coin = 1 Gem** exchange; History; creator data and character performance entries.
- Creator Level: U, C (7%), B (10%), A (14%), S (20%); Level S screenshot shows 10 public works, 1,000 monthly chats, 500 top-work chats as review thresholds.
- The screenshot's 19,747 spendable wallet Gems is **not evidence** of 19,747 payout-eligible earned Gems. Never silently equate these balances.

Keep typography, dark burgundy background, rounded sections, small rose accents, existing navigation, and mobile-first proportions. Add compact controls and overlays rather than moving visitors off the bot they are chatting with. Desktop can adapt the same patterns responsively.

## 2. Priority proposal

**P0 — cross-platform baseline:** follow/unfollow, creator name/UID search, owner-only Insights, comment parity and edit/delete, message refresh/edit/delete, block parity, free Edit Mode testing.

**P1 — discovery and community:** creator profile sorting, gifting, sharing, Following feed.

**Finance review + implementation:** 400:1 payout of **eligible creator-earned Gems** to PayPal. Design can ship before approval; no live conversion until financial, compliance, tax, and fraud decisions are approved.

All listed features are in scope; P0/P1 indicates proposed implementation sequencing, not an official commitment.

## 3. Feature specifications

### A. Follow creators / discover by name or UID

- Public creator profile: **Follow** under bio, with unobtrusive **Followers** count and **Share** action. Never show Follow on own profile.
- Within character chats: tap the creator avatar/name for a **small bottom sheet or compact overlay**; Follow or Share without leaving the chat. On dismiss, preserve chat route, draft, and scroll.
- Discovery: existing search accepts exact public UID, display name, and handle; show avatar, display name, UID/handle to disambiguate duplicates; paginated and privacy-aware.
- Following feed: recent public character releases for followed creators; do not automatically opt users into push notifications.
- Proposed endpoints: `GET /creators/search?q=`, `POST/DELETE /creators/{uid}/follow`, `GET /me/following`, `GET /me/following/releases`.
- Server constraints: no self-follow; deduplicate per follower/creator pair; respect block edges and removed accounts; rate limit automation.

### B. Private bot statistics

- Add a clearly clickable but tasteful **Insights** control on bot cards **only when viewed by their owner/editor**. Place a second small Insights affordance in bot chat header for owners.
- Clicking opens an overlay over the current bot, not a page redirect. On smaller screens, use a compact bottom sheet; outside click/back/close dismisses.
- Quick summary: selected bot photo/title, 24h / 7d / 30d / lifetime; qualified chats, messages, distinct readers, saves, returning readers, follow-attributed entry, paid Gem consumption, and estimated earnings **when backed by reliable accounting**.
- Deeper Creator Center → View all can show trends, comparisons, traffic/referral sources, premium work breakdowns, and period filters. Restrict financial metrics to the owner.
- Differentiate **conversations**, **reader-authored messages**, **unique readers**, **model responses**, **creator self-tests**, and **billable usage**. Never sum daily distinct-user counts as monthly unique users.
- Every owner-only data API must validate identity and character ownership *on the server*, not merely hide an icon in the app. Do not expose chat transcripts or individual reader spending.

### C. Comments on web / iOS, including edit and delete

- Offer the same comments surface across Android/web/iOS and synchronize the same record set.
- Authors may edit or delete **their own** comments. Show edited indicator; ask for confirmation where appropriate.
- Moderators and authorized bot owners may remove comments for moderation under clearly defined permissions, but cannot rewrite another user's speech.
- Suggested: `GET/POST /characters/{id}/comments`, `PATCH/DELETE /comments/{id}`. Add rate limits, optional reporting, and an audit trail consistent with retention policy.

### D. Chat message refresh, edit, and delete

- Put a discreet overflow (`···`) menu on individual messages.
- User message → **Edit / Delete**; model reply → **Refresh / regenerate**, and **Delete** where supported.
- Editing or deleting a user prompt must consistently invalidate/rebuild dependent AI replies. Prefer an explicit message version/branch model rather than silently changing transcript history.
- Clarify whether regeneration incurs a charge in ordinary paid chats; show confirmation for any charge. A free creator QA session must never bill.
- Server authorizes conversation access and authorship. Work on Android, web, and future iOS with consistent history.

### E. Block parity

- Keep Android's existing Block User behavior, add equivalent action to web and iOS in profile overflow menu.
- Apply block edges consistently to follow state, search visibility, profile and chat access, comments, notifications, and gifts under published policy.
- Distinguish block from platform-wide report/moderation. Server enforces block, not CSS.

### F. Profile character sorting

- On the profile's Characters tab add compact control: **Highest performing / Alphabetical A–Z / Newest**.
- Default highest-performing means a documented qualifying-chat measure; never substitute unannounced gross traffic or private earnings.
- Newest uses published date; alphabetical uses normalized title with stable tie-breaker; sorting must work across all server pages, not just visible cards.

### G. Gift Gems to creators

- Place **Gift Gems** beside Follow on visitor profile, optionally in the in-chat creator overlay.
- Show spendable wallet Gem balance, amount, creator, confirmation, and transfer receipt. Disallow self-gifts where inappropriate.
- Transfer only through server-side double-entry/accounting ledger; prevent negative balances, replayed submissions, bot spam, and circular fraudulent transfers. Decide whether gifts count as eligible creator earnings and how fees/reversals/abuse affect the settlement balance. Do not infer payout eligibility from a displayed wallet credit.

### H. Creator profile sharing

- Small share action near profile header, using native share sheet where available and copy-link fallback.
- Canonical stable public URL based on UID; correct unfurl image/title/description and deep link into app with web fallback.
- Preserve normal character share behavior separately.

### I. Free creator test chats in Edit Mode

- Provide **Test Chat** directly in bot editor, for draft and published characters; a clearly displayed **0 Gem charge** label.
- Dedicated `qa_test` session type, authorized to the creator/editor. Server enforces zero creator charge, zero payouts, and zero eligibility for any contests, promotions, valid-message thresholds, rankings, character stats, discovery boosts, or monetized chats.
- Suggested configurable daily testing allowance to protect inference costs. Reset to opening, compare variants, and optionally expose safe debug details such as which Worldbook is active.
- Owner chatting with their own published bot should also be excluded from incentivized/performance calculations even if not in explicit QA mode.

### J. Gem-to-cash payout at 400:1 via PayPal

**Proposed rate:** `400 eligible creator-earned Gems = $1 USD`.

- Keep **existing 1 Coin = 1 Gem exchange** untouched in Creator Center. Add a **separate** `Cash Out` section beneath current balance / History, with eligible Gem ledger, USD estimate, amount, payout method, status, and history.
- Formula for reference: `eligible_gems / 400 = estimated_USD` before any disclosed fees or adjustments.
- Distinguish **wallet Gems for spending**, **earned but pending Gems**, **eligible settled creator Gems**, **reserved payout Gems**, and **paid-out Gems**.
- Only backed, verified settled balances are cash-out eligible. Define which revenues and gifts qualify, thresholds, refund/fraud adjustments, verification, payment cadence, geography, tax documents, and publisher fees before launch.
- Require verified PayPal receiver, idempotent payout requests, server-side balance reservation, signed provider callbacks, reconciliation, failure/retry logic and auditable records. Never mark money as paid on client click.
- Show one money event per settled balance movement, with creator-accessible statements. Treat the 400:1 rule as a **requested proposal**, not existing Fizzz policy.

## 4. Example backend data contracts (illustrative, not actual Fizzz API)

```text
GET /v1/creators/search?q=...
POST /v1/creators/{uid}/follow
DELETE /v1/creators/{uid}/follow
GET /v1/me/following/releases
GET /v1/me/creator/characters/{id}/insights?period=7d
GET /v1/characters/{id}/comments
POST /v1/characters/{id}/comments
PATCH /v1/comments/{id}
DELETE /v1/comments/{id}
PATCH /v1/conversations/{id}/messages/{messageId}
DELETE /v1/conversations/{id}/messages/{messageId}
POST /v1/conversations/{id}/messages/{messageId}/regenerate
POST /v1/accounts/{uid}/block
DELETE /v1/accounts/{uid}/block
POST /v1/creators/{uid}/gift-gems
POST /v1/me/creator/test-sessions
GET /v1/me/creator/payouts/eligible-balance
POST /v1/me/creator/payouts
```

All paths are proposals. Use existing Fizzz authentication/authorization framework and event ledger where possible.

## 5. Acceptance and security checks

- Public users can Follow, find by exact UID, Share and Gift; a creator cannot follow or gift to themselves where policy disallows.
- Private stats are **never** returned by endpoints to a non-owner, even when the user requests the network URL directly.
- Tapping Insights in chat overlays data **without losing input draft, conversation scroll, or chat history**.
- Same comment authorship and message versioning apply across every client.
- Blocked relationships cannot interact through alternate exposed surfaces, subject to published privacy policy.
- All profile sorting modes work server-wide with stable pagination.
- All Edit Mode QA messages charge 0 Gems and contribute 0 to valid activity, promotions, rankings, and creator payouts.
- Payout interface only reads independently verified eligible balance; duplicate payout requests never debit twice; PayPal callbacks reconcile state transitions.
- Accessibility: keyboard access on web, semantic labels, reduced motion, no new visual clutter, native safe area spacing.
- Analytics and revenue changes need metric definitions, visible timestamps and auditability.

## 6. Prototype details

- **Live page:** https://xvelvetruinx.github.io/fizzz-feature-proposal/
- **Source & README:** https://github.com/xVelvetRuinx/xVelvetRuinx.github.io/tree/main/fizzz-feature-proposal
- **Implementation is simulation:** click actions update local prototype state only; real persistence, payment settlement, anti-fraud, privacy and mobile integration must be built by Fizzz.
- **Visual reference:** creator-supplied Android screenshots, November 18, 2026. The code includes mock image assets as embedded data; publish officially only with approved artwork and permissions.

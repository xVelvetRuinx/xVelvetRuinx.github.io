# Fizzz Creator Experience Upgrade — Product + Engineering Handoff

**Prepared:** November 18, 2026  
**Status:** Proposal / interactive front-end concept — not an official Fizzz roadmap or integrated build.  
**Target platforms:** Android (existing visual reference), Web, and iOS if/when available.  
**Design requirement:** Preserve the screenshots' existing burgundy/rose-black visual language, public profile grid, Creator Center, Creator Level, level badge, and bottom navigation. Add controls rather than replacing Fizzz's existing information architecture.

## 1. What the supplied Android screenshots show

These are *observations* from the four provided captures, not new features:

- Profile: VelvetRuin, Level badge, public character-card grid, navigation tabs, top-right action icons, and four tiles labeled Fizzz+, Gems, Tasks, **Creators / Join Us**.
- The **Creators / Join Us** entry currently opens the Creator Center, per the user's explanation. That relationship must be preserved, with the same destination on web and future iOS.
- Creator Center: **Level S, 20% revenue share**, activity banner, balance of 0 Coins, an exchange labeled **1 Coin = 1 Gem**, and creator data: a screenshot window showing **6,908 chats** and **167 characters**. The center features a History link and View All.
- Creator Level shows the tier labels **U / C 7% / B 10% / A 14% / S 20%**, Level S perks, review on the first day of each month, and screenshot thresholds **10 public works, 1,000 monthly chats, and 500 top-work chats**.
- The profile screenshot shows **19,747 wallet Gems**. Those are **not proven to be creator-earned, payout-eligible Gems**. The proposal must not label the full displayed wallet as cash-convertible.

Screenshot activity and balances are snapshots; the demo uses a combination of pictured figures and explicitly fictional sample metrics. The proposed feature flows do **not** claim to be live.

## 2. Feature matrix and specific placements

| Priority | Feature | Placement / UX | Platforms | Backend requirement |
|---|---|---|---|---|
| P0 | **Follow Creator** | Prominent compact button beneath public creator bio; small follow action in an in-chat creator-profile overlay; one shared follow relationship | Android, web, iOS | Creator/account follow edges; cannot self-follow; rate limits; follow feed |
| P0 | **Search creators by name or UID** | Existing magnifying-glass discovery/search action; matches current name, handle, and stable public UID | Android, web, iOS | Server search index, case-insensitive, cursor pagination, permissions |
| P0 | **Owner-only Bot Insights** | Small, clearly clickable `Insights` / rising-trend icon on owner's character cards and in bot header | Android, web, iOS | Authenticated `owner/editor` authorization, per-character aggregates |
| P0 | **Comments parity + edit/delete** | Comments tab on each character page with Post, Edit, Delete; owner gets moderation removal, not editing other users' text | Web, iOS to match Android | Authorship checks, soft-delete/moderation, propagation, rate limits |
| P0 | **Message Refresh / Edit / Delete** | Options from discreet `···` menu on each chat bubble; direct Refresh on AI replies | Android, web, iOS | Thread versioning, author permissions, regeneration, coherent context |
| P0 | **Block user parity** | Existing profile overflow menu, matching Android behavior | Web, iOS | Server-level user block edges, content visibility and moderation semantics |
| P0 | **Free test chat inside Edit Mode** | Creator bot editor and accessible QA toggle, clear “0 Gem cost / excluded” indicator | Android, web, iOS | Server-enforced `qa_test` sessions, separate costs/counters, anti-abuse limits |
| P1 | **Profile character filtering** | Select beside `Characters` tab: Highest performing, Alphabetical A–Z, Newest | Android, web, iOS | Indexed bot list, consistent ranking and stable paging |
| P1 | **Share creator profile** | Standard share icon by creator profile actions; native share sheet / copy stable URL | Android, web, iOS | Canonical UID link, preview metadata, route/deep-link support |
| P1 | **Gift Gems to creator** | Gift Gems next to Follow on public profile, also possible from in-chat creator overlay | Android, web, iOS | Validated spendable Gems, transfer ledger, recipient credit, sender receipt, abuse controls |
| P1 + finance approval | **400:1 Gem→Cash, PayPal** | New section/tab inside **Creator Center**; preserve the 1 Coin→1 Gem exchange above it | Android, web, iOS | Eligibility ledger, balance reservation, settlement, PayPal payouts, statements, verification |

P0/P1 is a **suggested engineering rollout** only. All requested additions remain in scope. The finance-dependent features require more policy work than interface parity, even if prioritized urgently.

## 3. Creator Follow + Search: a connected experience

### UI rules

- Visitors can follow/unfollow a creator beneath the bio and from a **small in-place profile overlay** while chatting with that creator's bot. Do not send the reader away from the active chat to follow.
- The reader’s `Following` navigation displays eligible public releases, newest first. Follow is not automatically a push notification subscription.
- Creator-profile summaries accessed from character pages show a small avatar, name, public follower count, and Follow/Share actions. Close returns to the exact chat, scroll offset, and unsent message.
- Own profile never shows a nonsensical follow-self button; it shows a private Creator Center entry.
- Query search by display name, handle, or stable **UID**. Duplicate display names must be disambiguated with handle/UID and avatar. Handle changes must not break existing follows or shares.

### Suggested API

```http
GET /v1/creators/search?q=VelvetRuin&cursor=...
GET /v1/creators/{creatorUid}/public
GET /v1/me/following
POST /v1/creators/{creatorUid}/follow
DELETE /v1/creators/{creatorUid}/follow
GET /v1/me/following/releases?cursor=...
```

Store `follower_user_id`, `creator_user_id`, `created_at`; unique key on the pair. Filter blocked relationships. Owner follow count is public; individual followers should be disclosed only under an explicit privacy policy.

## 4. Bot Statistics: private, actionable, nonintrusive

### UI

- On an **owned bot card**, show a tasteful but clearly clickable `Insights` pill with a custom upward-trend mark (no borrowed competitor icon). The rest of the card still opens the character normally.
- On an **open bot**, show a small Insights action near the bot header **only for its creator or approved editors**.
- Selecting Insights opens a **compact overlay / mobile sheet** in place. Preserve chat route, mounted chat component, scroll, draft, and conversation state. Dismiss via close, backdrop, Back, and Escape where applicable.
- Overlay: character thumbnail/title; periods `24h | 7d | 30d | Total`; Threads, Messages, Favorites; Unique Readers; Follow-attributed conversations; Paid Gems consumed; and **Estimated creator earnings** if the server can provide legitimate earning estimates. Deep details live in owner-only Creator Center.
- Never show quick stats or private money figures to profile visitors, bot readers, or public share previews. Hiding the icon in the UI is **not sufficient**; protect all data endpoints.

### Metric contracts

- `unique_readers`: distinct qualifying reader accounts active **across the entire selected interval**; don't add daily uniques together.
- `threads`: distinct eligible conversation IDs with at least one reader-authored accepted message within the interval.
- `reader_messages`: accepted reader-authored messages, not AI responses.
- `returning_readers`: qualifying accounts first observed before the period and active in it.
- `follow_attributed_conversations`: conversations whose documented entry source was a Following surface, not arbitrary conversations of people who happen to follow.
- `paid_gems_consumed`: verify purchased Gem funding source; report separately from subscription-funded and promotional/free usage.
- `creator_earnings_estimate`: derived from backend's versioned revenue share or finalized settlement events; never calculate a payable from a raw public chat count.
- Exclude creator-owned chats, authorized test sessions, invalid synthetic traffic, and QA sessions from all public activity statistics, valid-message targets, contests, rankings, promotions, discovery performance, and payouts.

### Authorization and privacy

```http
GET /v1/me/creator/characters/{characterId}/quick-stats?period=7d
GET /v1/me/creator/audience?period=30d
GET /v1/me/creator/revenue?period=30d
```

Server verifies caller's authorization to the `characterId`, returns 403 otherwise; never deliver private data and rely on front-end concealment. No individual reader identities, private chat bodies, payment instruments, or exact per-reader financial detail in creator-facing analytics. Timestamps stored in UTC; present with a clearly labeled timezone.

## 5. Comments and chat parity

### Comments

Expose current Android-like comment posting on web/iOS. Only the comment author may edit their comment. The author may delete it; platform moderators and authorized character managers may remove prohibited comments, **without impersonating the author or editing their speech**. Show `Edited` marker when modified. Soft delete for server audit needs; don't retain deleted user content longer than the applicable policy allows.

```http
GET    /v1/characters/{id}/comments?cursor=...
POST   /v1/characters/{id}/comments
PATCH  /v1/comments/{id}    // author
DELETE /v1/comments/{id}    // author or authorized moderation
```

### Chat message controls

- Reader-authored bubble: **Edit message**, **Delete message**.
- Generated AI bubble: **Refresh/regenerate**; if deletion allowed, **Delete reply**.
- Editing a prompt invalidates or regenerates its dependent AI response(s). For chat history with branching, preserve an explicit parent/version reference rather than silently changing prior context.
- When deleting a parent prompt, confirm whether linked generated replies will be removed/truncated; the demo removes the immediately linked reply.
- Refresh controls must state any charge before a paid model call. Proposed free creator Edit Mode has zero Gem cost; paid ordinary-chat retry policy must be decided by Fizzz.
- Synchronize edits/deletions between web and Android and future iOS; enforce author and conversation ownership.

```http
PATCH  /v1/conversations/{cid}/messages/{mid}    // own prompt only
DELETE /v1/conversations/{cid}/messages/{mid}
POST   /v1/conversations/{cid}/messages/{mid}/regenerate
```

## 6. Creator Edit Mode: no-cost, no-count QA

- Provide test chat from **both draft and published bot editor screens**, available only to the creator or authorized editors.
- Use a dedicated server session `session_type=qa_test`, not an ordinary user conversation tagged cosmetically. It must never debit wallet Gems, issue creator earnings, or satisfy creator activity / retention / contest eligibility criteria.
- Initial proposal: **50 free AI test replies per creator account per day**, shared across all works. This is a suggested throttle, not an existing Fizzz allowance. Count replies server-side, not per browser/device; configurable by admin.
- Useful extra QA affordances: reset conversation to opening, inspect which Worldbook entries triggered, swap test parameters, and compare reply variants without leaking another user’s conversations.
- Owner's ordinary chat interactions on their own bot should also be excluded from valid public performance and promotional counts even outside the QA view.

## 7. Creator profile sorting and block parity

### Sorting

On `Characters` tab, support `Highest performing`, `Alphabetical A–Z`, and `Newest`.

- Performance ranking must use a **published, documented measure**, e.g. qualifying total chats or selected period's qualifying chats. Default to qualifying total chats for the simple profile sort, not private revenue.
- Alphabetical sort follows normalized title, consistent locale behavior and UID tie-breaking.
- Newest uses published timestamp (not edit date) to prevent edit-bump manipulation.
- Server-side page sorting across all 167+ works, not merely sorting the small set already loaded in the browser.

### Block

Profile overflow includes `Block user` and `Unblock user` on web/iOS matching the current Android option. Production logic should remove a follow edge, hide blocked accounts' discovery surfaces, restrict contact, and maintain consistent moderation scope across clients. Ensure both blocker and blockee rights are designed (privacy, appeals, and reporting policies). A local UI toggle alone is insufficient.

## 8. Financial proposal: two separate exchanges

### Preserve today's visual model

The screenshot explicitly shows **1 Coin = 1 Gem** within the existing Creator Center and a Level S 20% share. Keep that exchange in place unless Fizzz separately changes its existing product policy.

### Add the requested option

**Proposed cash conversion: 400 eligible creator-earned Gems = US $1.00, paid through PayPal.**

Example calculations:

| Eligible creator-earned Gems | Proposed USD value |
|---:|---:|
| 400 | $1.00 |
| 2,000 | $5.00 |
| 4,000 | $10.00 |
| 8,400 | $21.00 |
| 20,000 | $50.00 |

The screenshot's **19,747 wallet Gems** cannot be assumed to qualify. Maintain a separately traceable `earned_eligible_gem_balance`; do not convert the generic spendable Gem balance or promotional credits by default. Define whether revenue-share Coins, their subsequent Gem exchanges, and purchased-funded gifts create *the same* payout-eligible balance. Each earning event may enter **only one** settlement/cash-out pathway to prevent double payment.

### Suggested state machine / ledger

```text
qualifying_activity
  → earning_recorded(source, unique_event_id, rule_version)
  → creator_gems_earned(eligible=true/false)
  → creator_cashout_requested(request_id, gems_reserved)
  → compliance_verified
  → paypal_transfer_queued
  → paid(confirmed_provider_transfer_id)
```

Use immutable append-only currency ledger entries with balances derived from events. Requests must be idempotent; reserve Gems atomically so concurrent requests cannot spend the same balance twice. Confirm recipient PayPal details and applicable payout/tax prerequisites, maintain an itemized statement history, and disclose exact rate and any deductions before final confirmation. Never display `paid` until provider confirmation. Design should not assume that every purchased Gem carries the same economic eligibility. The interactive demo's **2,000-Gem minimum** is merely a suggested example.

### Gift Gems

- Reader gifts Gems to a chosen creator through a small profile action or in-chat creator overlay. Show recipient, amount, remaining balance, confirmation, and receipt; verify sender ownership on the server.
- The creator receives a traceable gift-origin event and a creator-facing total. Only **approved purchased-source gifts** should be marked cash-out eligible by default. Prevent self-gifting, reciprocal cycling, automated transfers and other cash-out abuse.
- Decide whether the creator receives 100% of Gems gifted, a settlement equivalent, or a platform-adjusted reward; disclose that rule to both parties. Do not assume a gift is automatically revenue-share qualifying as well.
- Keep gift totals distinct from chat-driven revenue share and free/promotional Gems in analytics and statements.

### Suggested API

```http
GET  /v1/me/creator/wallets
GET  /v1/me/creator/payouts/quote?eligible_gems=4000
POST /v1/me/creator/payouts/paypal
GET  /v1/me/creator/payouts?cursor=...
POST /v1/creators/{uid}/gifts/quote
POST /v1/creators/{uid}/gifts
```

A trusted server/service, **not** front-end JavaScript, computes 400:1 and available payable Gems; issue signed quotes or authoritative server responses. Never accept a payout USD value supplied by the client as the transfer amount.

## 9. Share creator profiles

Use a stable UID-based canonical profile URI with optional current-handle vanity alias, e.g. a **proposed route** `https://fizzz.ai/creator/{creatorUid}`. This route is a design example, **not** a verified live Fizzz URL. Configure website `og:title`, `og:image` and text summary, Android app links, and iOS universal links when available. Use the existing native Share behavior and a copy-link fallback; public previews must respect the creator's artwork visibility and watermark policy.

## 10. Platform acceptance tests

1. **Owner vs reader:** a reader never receives private bot stats or payout balances. Direct private API requests from a non-owner return 403.
2. **Overlay continuity:** a user with unsent chat text opens creator profile, follows, opens and closes. Text, route, and scroll remain unchanged.
3. **Follow/search:** name, handle and UID resolve to same creator; two devices show the same follow status; no self-follow; blocked accounts cannot be newly followed.
4. **Comments:** post/edit/delete by author works on Android, web, iOS; another reader cannot edit; creator moderation can remove but cannot rewrite a reader's text.
5. **Message controls:** edit own message and regenerate downstream context; delete confirmation removes correct dependencies; refresh uses transparent pricing.
6. **QA:** at the server ledger level, creator Edit Mode generates no Gem debit and no counted messages, rankings, contest/qualifying usage, or creator revenue; throttle cannot be bypassed with another device.
7. **Sort:** entire public bot catalog sorts correctly; stable pagination; re-editing old bot doesn't make it newest.
8. **Block:** changes propagate across platforms, follows and visibility updates are consistent.
9. **Gift:** deduction and recipient credit occur exactly once; duplicate button/requests cannot transfer twice; receipts and ineligible promotional currency handled.
10. **Cash-out:** 400 Gems quotes $1 USD, 4,000 quotes $10, an insufficient eligible balance is rejected, and repeated requests cannot reserve the same Gems; PayPal errors do not incorrectly show paid.
11. **Existing flows remain:** old 1:1 Coin→Gem section, tier display, Creator Center entry from `Join Us`, character grid, and content tabs continue working.
12. **Responsive design:** Android, mobile web, desktop web, and iOS share feature semantics, accessible touch areas, Escape/Back dismissal and keyboard focus handling.

## 11. Files and prototype limitations

- `index.html`, `styles.css`, `app.js`, and `assets/` are the readable **static frontend source** for an engineering prototype.
- `Fizzz_Interactive_Proposal_Standalone.html` is the same interactive experience with embedded images, CSS and JavaScript; easiest to open/share locally.
- `screenshots/` contains illustrative desktop-browser-rendered **mobile viewport** preview PNGs based on the code; they are **not** official Fizzz screenshots.
- `build_standalone.py` regenerates the standalone bundle.
- `test_screens.py` is a Playwright UI smoke-test script; test screenshots were captured using a bundled Chromium via browser `set_content`. This does not test Fizzz backend integrations.
- The UI stores temporary sample actions only in page state. Refresh clears them. Bot replies are templates, not actual AI generation; transfers never reach PayPal or Fizzz.
- The project contains cropped user-provided visual references; obtain permission and replace with official approved app assets before public distribution.

**Decision requests for Fizzz:** define financial funding-source eligibility, payout/Gem accounting relationship, gift recipient rate, exact QA cap, comment moderation policy, chat refresh pricing, creator stats definitions, and engineering ownership of cross-platform parity. The UI integration can begin while those policies are finalized.
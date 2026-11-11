# Proposed Laffi Partner API (design draft)

**Not an existing Laffi API.** This is a starting specification for Laffi's engineering team, subject to their security, privacy, and payout rules.

## Security and reporting
- Authenticate through Laffi-managed SSO/OAuth or verified sessions, with server-side role authorization on every request.
- Roles: platform_admin, team_lead, recruiter, creator. A lead can access only assigned teams.
- Use stable account IDs and unique referral attribution; a creator who is also a reader is one person for unique-user milestones.
- Do not expose private reader chats or raw personal data. Prefer verified aggregate engagement data.
- All timestamps, data-sync freshness, ruleset versions, and payout states must be explicit.
- Bonuses and payment approvals are server-owned, never controlled by browser flags.

## Suggested endpoints

    GET /v1/partner/me
    GET /v1/partner/teams/{teamId}/overview?period=2026-11
    GET /v1/partner/teams/{teamId}/creators?stage=active&cursor=...
    GET /v1/partner/teams/{teamId}/creators/{accountId}
    GET /v1/partner/teams/{teamId}/readers?stage=qualified&cursor=...
    GET /v1/partner/teams/{teamId}/activity?cursor=...
    GET /v1/partner/teams/{teamId}/rewards?period=2026-11
    GET /v1/partner/teams/{teamId}/settlements?period=2026-11
    GET /v1/partner/program-rules?effective_at=2026-11-01
    GET /v1/partner/teams/{teamId}/exports?kind=creator_metrics

Admin-only, audited actions:

    POST /v1/admin/partner/qualification-decisions
    POST /v1/admin/partner/reward-approvals
    POST /v1/admin/partner/payout-reconciliations

## Suggested overview data
Period, team ID, settlement timezone, source_checked_at, ruleset_version, current creator counts by status, submitted and published works, unique referred/qualified/retained readers, verified unique-user milestone progress, approved/pending/paid reward amounts.

## Recommended event types
referral_attributed, account_verified, creator_registered, trial_started, trial_completed, contract_signed, work_submitted, work_approved, work_published, reader_qualified, reader_retained, reward_approved, reward_paid, reward_reversed.

## Reward lifecycle and duplicate prevention
Observed → Pending Review → Verified → Approved → Submitted for Payout → Paid. Include rejected/reversed/disputed states and an immutable audit record.

Enforce eligibility and unique constraints on the server. Reuse the ruleset effective when the reward was earned. Do not treat visible UI status as proof of settlement. The proposed $15 / $10 bonuses and 20 / 60 / 120 thresholds are unapproved examples; Laffi must define recipient, qualification, timing, and any payment amount.

Creator revenue-sharing settlements must be distinct from Team Lead recruitment rewards.
-- Conceptual PostgreSQL starting schema ONLY. Not production-ready.
-- Laffi must add row-level access controls, indexes, migrations, retention,
-- audited write permissions, payout reconciliation and validated rules.

create table partner_teams (
 id text primary key,
 display_name text not null,
 created_at timestamptz not null default now()
);
create table partner_accounts (
 account_id text primary key,
 display_name text not null,
 joined_at timestamptz,
 is_creator boolean not null default false,
 is_reader boolean not null default false
);
create table partner_team_memberships (
 team_id text not null references partner_teams(id),
 account_id text not null references partner_accounts(account_id),
 role text not null check (role in ('team_lead','recruiter','creator')),
 status text not null check (status in ('registering','trial','active','paused','ended')),
 started_at timestamptz not null,
 ended_at timestamptz,
 primary key(team_id,account_id,role)
);
create table partner_referrals (
 referral_id text primary key,
 team_id text not null references partner_teams(id),
 referring_account_id text not null references partner_accounts(account_id),
 referred_account_id text not null unique references partner_accounts(account_id),
 attributed_at timestamptz not null,
 attribution_method text not null
);
create table partner_works (
 work_id text primary key,
 creator_account_id text not null references partner_accounts(account_id),
 work_kind text not null,
 status text not null check(status in ('draft','submitted','in_review','approved','published','rejected')),
 submitted_at timestamptz,
 published_at timestamptz,
 source_checked_at timestamptz
);
create table partner_program_rulesets (
 ruleset_id text primary key,
 effective_from timestamptz not null,
 effective_until timestamptz,
 definition jsonb not null,
 approved_by text not null,
 created_at timestamptz not null default now()
);
create table partner_qualification_decisions (
 decision_id text primary key,
 team_id text not null references partner_teams(id),
 referred_account_id text not null references partner_accounts(account_id),
 ruleset_id text not null references partner_program_rulesets(ruleset_id),
 qualification_type text not null,
 status text not null check(status in ('pending','verified','rejected','reversed')),
 verified_by text,
 verified_at timestamptz,
 source_reference text,
 created_at timestamptz not null default now()
);
create table partner_reward_ledger (
 reward_id text primary key,
 team_id text not null references partner_teams(id),
 recipient_account_id text not null references partner_accounts(account_id),
 referred_account_id text references partner_accounts(account_id),
 qualification_decision_id text references partner_qualification_decisions(decision_id),
 ruleset_id text not null references partner_program_rulesets(ruleset_id),
 reward_type text not null,
 settlement_period text not null,
 amount_minor_units bigint not null check(amount_minor_units>=0),
 currency char(3) not null default 'USD',
 status text not null check(status in ('pending','verified','approved','submitted','paid','rejected','reversed','disputed')),
 payout_batch_id text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(recipient_account_id,referred_account_id,reward_type,settlement_period)
);
create table partner_audit_events (
 event_id text primary key,
 team_id text references partner_teams(id),
 actor_account_id text,
 event_type text not null,
 event_payload jsonb not null,
 occurred_at timestamptz not null,
 recorded_at timestamptz not null default now()
);

create table if not exists ranking_snapshots (
 id bigint generated always as identity primary key,
 month text not null, created_at timestamptz not null default now(),
 published_at timestamptz, active boolean not null default false,
 row_count int not null check(row_count between 1 and 5000)
);
create unique index if not exists only_one_active_snapshot on ranking_snapshots (active) where active=true;
create table if not exists ranking_entries (
 snapshot_id bigint not null references ranking_snapshots(id) on delete cascade,
 partner_id text not null, level text not null,
 active_traders int not null check(active_traders>=0), tv_lots numeric(18,3) not null check(tv_lots>=0),
 rank int not null check(rank>0), primary key(snapshot_id,partner_id)
);
create index if not exists ranking_entries_by_rank on ranking_entries(snapshot_id,rank);
create table if not exists upload_audit (
 id bigint generated always as identity primary key, snapshot_id bigint references ranking_snapshots(id),
 event_type text not null, details text, created_at timestamptz not null default now()
);
create table if not exists login_attempts (
 id bigint generated always as identity primary key, ip_hash text not null, role text not null,
 created_at timestamptz not null default now()
);
create index if not exists login_attempts_recent on login_attempts(ip_hash,role,created_at);
-- All data is accessed by server API only. Do not grant client/anon privileges.
alter table ranking_snapshots enable row level security;
alter table ranking_entries enable row level security;
alter table upload_audit enable row level security;
alter table login_attempts enable row level security;
revoke all on ranking_snapshots,ranking_entries,upload_audit,login_attempts from anon,authenticated;

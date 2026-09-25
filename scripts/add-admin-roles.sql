-- Admin roles for TravelTrack: `user` (default), `admin`, `super_admin`.
--
-- Run once, manually, in the Supabase Dashboard -> SQL Editor.
--
-- This script is written to be safe to run without first knowing the exact
-- name of the existing `cities` DELETE policy or the exact current UPDATE
-- grants on `profiles`: it inspects and replaces the DELETE policy
-- programmatically (section 6), and unconditionally revokes-then-grants
-- the UPDATE privilege on `profiles` (section 3) rather than assuming any
-- prior grant shape. It is also safe to re-run - every statement is
-- idempotent (IF NOT EXISTS / IF EXISTS / CREATE OR REPLACE throughout).

-- 1. Role column -----------------------------------------------------------

alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('user', 'admin', 'super_admin'));

-- 2. Role-checking helper ---------------------------------------------------
--
-- SECURITY DEFINER so its internal read of `profiles` bypasses RLS
-- entirely, avoiding any self-referencing-policy ambiguity when this is
-- used inside a `profiles` RLS policy itself (section 4).

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke execute on function public.current_user_role() from public;
revoke execute on function public.current_user_role() from anon;
grant execute on function public.current_user_role() to authenticated;

-- 3. Prevent self-assignment of role via column-level grants ---------------
--
-- Revoking UPDATE outright (rather than assuming any particular prior
-- grant shape) and re-granting only the two columns the app actually
-- writes is safe and idempotent regardless of what was granted before.
-- `role` is deliberately excluded, so no authenticated client can ever set
-- it via a normal table update, regardless of what RLS would otherwise
-- allow.

revoke update on public.profiles from authenticated;
grant update (full_name, avatar_path) on public.profiles to authenticated;

-- 4. profiles: let admins/super_admins view all profiles -------------------
--
-- Additive alongside whatever self-select policy already exists - regular
-- users keep seeing only their own row via that existing policy; this one
-- only ever adds visibility, never removes it.

drop policy if exists "Admins can view all profiles" on public.profiles;

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.current_user_role() in ('admin', 'super_admin'));

-- 5. cities: let admins/super_admins view and edit all cities --------------
--
-- Also additive - regular users' existing own-city SELECT/INSERT/UPDATE
-- policies are untouched.

drop policy if exists "Admins can view all cities" on public.cities;

create policy "Admins can view all cities"
on public.cities
for select
to authenticated
using (public.current_user_role() in ('admin', 'super_admin'));

drop policy if exists "Admins can update all cities" on public.cities;

create policy "Admins can update all cities"
on public.cities
for update
to authenticated
using (public.current_user_role() in ('admin', 'super_admin'))
with check (public.current_user_role() in ('admin', 'super_admin'));

-- 6. cities: DELETE - replace ALL existing DELETE policies -----------------
--
-- This is the one place additive policies are NOT safe: Postgres combines
-- multiple permissive policies for the same command with OR, so adding a
-- "super_admin can delete anything" policy alongside an existing "owner
-- can delete their own city" policy would still let an admin (who is also
-- the authenticated owner of their own rows) delete their own city through
-- the old policy. To guarantee that cannot happen, every existing DELETE
-- policy on public.cities is dropped programmatically below - whatever its
-- name turns out to be, this does not require knowing it in advance - and
-- replaced with exactly two, role-aware policies.

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'cities'
      and cmd = 'DELETE'
  loop
    execute format('drop policy %I on public.cities', pol.policyname);
  end loop;
end $$;

create policy "Users can delete their own cities"
on public.cities
for delete
to authenticated
using (user_id = auth.uid() and public.current_user_role() = 'user');

create policy "Super admins can delete any city"
on public.cities
for delete
to authenticated
using (public.current_user_role() = 'super_admin');

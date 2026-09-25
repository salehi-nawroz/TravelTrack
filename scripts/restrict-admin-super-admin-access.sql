-- Prevent `admin` from viewing or editing anything related to a
-- `super_admin` user: their profile row, and any cities they own.
-- `super_admin` remains fully unrestricted (can still view/edit everything).
--
-- Run once, manually, in the Supabase Dashboard -> SQL Editor.
--
-- Not covered here because they are already fully blocked by the existing
-- admin-roles policies, with no change needed:
--   - admin deleting ANY city (admin has no DELETE policy on cities at all)
--   - admin editing another user's profile (admin has no UPDATE policy on
--     profiles beyond their own full_name/avatar_path)

-- Generalizes current_user_role() to look up an arbitrary user's role.
-- Needed to check a CITY'S OWNER role from within a cities policy (cities
-- has no role column of its own - profiles does). SECURITY DEFINER so its
-- internal read of `profiles` bypasses RLS, same as current_user_role().
create or replace function public.get_role_for_user(target_user_id uuid)
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select role from public.profiles where id = target_user_id;
$$;

revoke execute on function public.get_role_for_user(uuid) from public;
revoke execute on function public.get_role_for_user(uuid) from anon;
grant execute on function public.get_role_for_user(uuid) to authenticated;

-- 1. profiles: admin can view all profiles EXCEPT a super_admin's own row.
-- profiles already has its own `role` column, so no helper call is needed
-- here - `role` refers to the row being checked.

drop policy if exists "Admins can view all profiles" on public.profiles;

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (
  public.current_user_role() = 'super_admin'
  or (public.current_user_role() = 'admin' and role <> 'super_admin')
);

-- 2. cities: admin can view all cities EXCEPT ones owned by a super_admin.

drop policy if exists "Admins can view all cities" on public.cities;

create policy "Admins can view all cities"
on public.cities
for select
to authenticated
using (
  public.current_user_role() = 'super_admin'
  or (
    public.current_user_role() = 'admin'
    and public.get_role_for_user(user_id) <> 'super_admin'
  )
);

-- 3. cities: admin can update all cities EXCEPT ones owned by a super_admin.

drop policy if exists "Admins can update all cities" on public.cities;

create policy "Admins can update all cities"
on public.cities
for update
to authenticated
using (
  public.current_user_role() = 'super_admin'
  or (
    public.current_user_role() = 'admin'
    and public.get_role_for_user(user_id) <> 'super_admin'
  )
)
with check (
  public.current_user_role() = 'super_admin'
  or (
    public.current_user_role() = 'admin'
    and public.get_role_for_user(user_id) <> 'super_admin'
  )
);

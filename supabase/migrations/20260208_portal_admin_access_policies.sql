-- Grants read access in web portal for authenticated users by role.
-- This keeps app/web on the same backend while supporting admin visibility.

-- Student: read own enrollments.
drop policy if exists "students_read_own_enrollments" on public.enrollments;
create policy "students_read_own_enrollments"
on public.enrollments
for select
to authenticated
using (student_id = auth.uid());

-- Teacher: read own courses.
drop policy if exists "teachers_read_own_courses" on public.courses;
create policy "teachers_read_own_courses"
on public.courses
for select
to authenticated
using (teacher_id = auth.uid());

-- Admin: read all users.
drop policy if exists "admins_read_all_users" on public.users;
create policy "admins_read_all_users"
on public.users
for select
to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

-- Admin: read all courses.
drop policy if exists "admins_read_all_courses" on public.courses;
create policy "admins_read_all_courses"
on public.courses
for select
to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

-- Admin: read all enrollments.
drop policy if exists "admins_read_all_enrollments" on public.enrollments;
create policy "admins_read_all_enrollments"
on public.enrollments
for select
to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

-- Admin: read all web-only tables.
drop policy if exists "admins_read_all_job_posts" on public.job_posts;
create policy "admins_read_all_job_posts"
on public.job_posts
for select
to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

drop policy if exists "admins_read_all_contact_inquiries" on public.contact_inquiries;
create policy "admins_read_all_contact_inquiries"
on public.contact_inquiries
for select
to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

drop policy if exists "admins_read_all_resume_submissions" on public.resume_submissions;
create policy "admins_read_all_resume_submissions"
on public.resume_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.users me
    where me.id = auth.uid()
      and me.role = 'admin'
  )
);

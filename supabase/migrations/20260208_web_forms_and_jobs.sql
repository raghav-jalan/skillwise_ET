-- Web-only tables for contact form, job posting, and resume submissions.
-- Also used by mobile app student dashboard to read active job posts.

create extension if not exists pgcrypto;

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  source text not null default 'web',
  created_at timestamptz not null default now()
);

create table if not exists public.job_posts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  job_title text not null,
  location text not null,
  category text not null,
  job_type text not null,
  salary text,
  description text not null,
  requirements text[] not null default '{}',
  contact_email text not null,
  contact_phone text,
  source text not null default 'web',
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  job_category text not null,
  experience text,
  education text,
  cover_letter text,
  resume_storage_path text not null,
  resume_file_name text not null,
  resume_file_size_bytes bigint,
  resume_content_type text,
  source text not null default 'web',
  created_at timestamptz not null default now()
);

create index if not exists idx_job_posts_status_created_at
  on public.job_posts (status, created_at desc);

create index if not exists idx_job_posts_category
  on public.job_posts (category);

alter table public.contact_inquiries enable row level security;
alter table public.job_posts enable row level security;
alter table public.resume_submissions enable row level security;

drop policy if exists "insert_contact_inquiries_public" on public.contact_inquiries;
create policy "insert_contact_inquiries_public"
on public.contact_inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "insert_job_posts_public" on public.job_posts;
create policy "insert_job_posts_public"
on public.job_posts
for insert
to anon, authenticated
with check (true);

drop policy if exists "select_active_job_posts_public" on public.job_posts;
create policy "select_active_job_posts_public"
on public.job_posts
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "insert_resume_submissions_public" on public.resume_submissions;
create policy "insert_resume_submissions_public"
on public.resume_submissions
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "upload_resumes_public" on storage.objects;
create policy "upload_resumes_public"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'resumes');

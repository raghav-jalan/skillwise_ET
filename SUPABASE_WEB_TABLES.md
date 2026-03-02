Run this SQL in your Supabase SQL editor before testing the web forms:

- `skillup_web/supabase/migrations/20260208_web_forms_and_jobs.sql`
- `skillup_web/supabase/migrations/20260208_portal_admin_access_policies.sql`

This creates:
- `contact_inquiries`
- `job_posts`
- `resume_submissions`
- Storage bucket `resumes`

And adds portal access policies:
- Student reads own enrollments
- Teacher reads own courses
- Admin (`users.role = 'admin'`) reads users, courses, enrollments, jobs, inquiries, resumes

After running SQL:
1. Restart the Next.js dev server.
2. Post a job from `/jobs`.
3. Verify that it appears on web job listings and in the mobile student dashboard.
4. Open `/portal` and login with your backend user to view student/teacher/admin data.

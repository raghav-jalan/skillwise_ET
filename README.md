# SkillItUp India Web

SkillItUp India Web is a Next.js application for a skills and career development platform. It combines a public-facing marketing site with a unified portal for students, teachers, employers, and admins, all backed by Supabase.

## What the app includes

- Marketing homepage with course discovery, testimonials, FAQs, and partner-focused sections
- Unified portal for student, teacher, employee, and admin flows
- Supabase-backed course listing and course publishing support
- Contact, jobs, partners, learning-process, privacy, terms, and help routes
- Responsive UI built with Tailwind CSS and Radix-based components

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase JavaScript client
- Radix UI components

## Project structure

```text
app/                 App Router pages and UI sections
app/components/      Shared and route-specific React components
lib/                 Supabase helpers and data access functions
public/              Static assets
styles/              Additional styling assets
supabase/            Supabase-related project files
```

## Main routes

- `/` Home and discovery
- `/courses` Published course catalog
- `/portal` Login, registration, and role-based dashboards
- `/jobs` Job listings and resume submission
- `/partners` Partner information
- `/contact` Contact form
- `/faq`, `/help`, `/privacy`, `/terms` Support and policy pages

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create local environment variables

Create `.env.local` in the project root. Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Optional variables for the main admin login flow:

```bash
NEXT_PUBLIC_MAIN_ADMIN_EMAIL=
NEXT_PUBLIC_MAIN_ADMIN_PASSWORD=
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` runs the production server

## Notes about data and auth

- The app can render without Supabase credentials, but dynamic course data and portal-backed workflows will not function correctly.
- Course data is fetched from Supabase tables such as `courses` and `lessons`.
- The portal reads role and profile data from the shared backend used by the broader SkillItUp product.

## Deployment

The repository includes a [Dockerfile](./Dockerfile) and [docker-compose.yml](./docker-compose.yml) for container-based deployment. For production, provide the same environment variables used in local development.

Build a fully functional web app called "Interview Pipeline Tracker" — 
a personal ATS (Applicant Tracking System) for job seekers to track 
interviews, rounds, notes, and outcomes.

---

## TECH STACK
- Frontend: React + Vite + Tailwind CSS
- Backend & Auth: Supabase (use environment variables for keys)
- No additional UI libraries unless necessary

---

## SUPABASE SCHEMA

Table: interviews
- id: uuid (primary key, auto-generated)
- user_id: uuid (foreign key → auth.users)
- company: text (not null)
- role: text (not null)
- round: text (values: HR, Technical L1, Technical L2, System Design, Final, Other)
- scheduled_at: timestamptz (not null)
- prep_notes: text
- reflection: text
- confidence: integer (1–5)
- difficulty: integer (1–5)
- outcome: text (values: Awaiting, Passed, Failed, Offer Received, Withdrawn)
- created_at: timestamptz (default: now())
- updated_at: timestamptz (default: now())

Enable Row Level Security (RLS). Users can only read and write their own rows.

---

## AUTH SCREENS

1. Login Page
   - Email + Password fields
   - "Sign In" CTA button
   - Link to Sign Up page
   - Clean centered card layout, subtle background

2. Sign Up Page
   - Full Name, Email, Password, Confirm Password
   - "Create Account" CTA
   - Link back to Login

3. Forgot Password Page (basic — just email input + submit)

---

## APP SCREENS (post-login)

### 1. Dashboard (default landing after login)
- Header: App name left, user avatar/email + logout right
- Summary stats row at top:
  - Total Interviews
  - Upcoming (scheduled_at > now)
  - Passed
  - Pass Rate %
- Interview cards below, grouped by Status (Upcoming / Awaiting / Completed)
- Each card shows: Company, Role, Round badge, Date & Time, Outcome chip
- "Add Interview" floating action button (bottom right)

### 2. Add / Edit Interview Modal
Fields:
  - Company Name (text input)
  - Role / Position (text input)
  - Interview Round (dropdown: HR / Technical L1 / Technical L2 / System Design / Final / Other)
  - Date & Time (datetime-local picker)
  - Preparation Notes (textarea)
  - Post-Interview Reflection (textarea, label it "How did it go?")
  - Confidence Level (1–5 star rating)
  - Difficulty Level (1–5 star rating)
  - Outcome (dropdown: Awaiting / Passed / Failed / Offer Received / Withdrawn)
  - Save button + Cancel

### 3. Timeline View (tab or sidebar nav item)
- All interviews sorted by scheduled_at ascending
- Grouped by date (Today / Tomorrow / date label)
- Each item: Company, Role, Round, Time, Outcome chip
- Clicking opens the Edit modal for that entry

### 4. Stats Panel (tab or sidebar nav item)
- Total interviews logged
- Companies applied to (distinct count)
- Pass rate per round type (bar or simple list)
- Most recent outcome

---

## DESIGN GUIDELINES
- Color palette: Deep navy (#0F172A) background, white cards,
  accent color #6366F1 (indigo) for CTAs and active states
- Font: Inter (Google Fonts)
- Rounded corners on cards (rounded-2xl)
- Subtle shadows on cards
- Mobile-responsive layout
- Empty states: show a friendly message + CTA when no interviews exist
- Loading states: show skeleton loaders while fetching data
- Error states: show inline error messages on form validation

---

## INTERACTIONS & LOGIC
- On login success → redirect to Dashboard
- On logout → redirect to Login
- "Add Interview" opens a modal (not a new page)
- Edit: clicking any card opens the same modal pre-filled
- Delete: each card has a subtle delete icon (confirm before delete)
- Reflection field is always editable (do not lock it)
- Stats recalculate reactively when data changes

---

## ENVIRONMENT VARIABLES
- Store Supabase credentials as:
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
- Never hardcode credentials in source files
- Read them via import.meta.env.VITE_SUPABASE_URL and
  import.meta.env.VITE_SUPABASE_ANON_KEY

---

## .env.example
Generate a .env.example file in the project root:

  VITE_SUPABASE_URL=https://umbjbyyetewktaoufbpc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmpieXlldGV3a3Rhb3VmYnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0Njk0NzgsImV4cCI6MjA5NjA0NTQ3OH0.HNhYVxZ8vGl-poPDHWvqQ7O2sw6PAqCYUFse_tazBF4

---

## .gitignore
Generate a .gitignore file in the project root with:

  node_modules/
  .env
  .env.local
  .env.production
  dist/
  .DS_Store
  *.log
  .vite/

---

## README.md
Generate a README.md file in the project root with exactly this content:

  # Interview Pipeline Tracker

  A personal ATS (Applicant Tracking System) built to track job interviews,
  rounds, outcomes, and reflections — designed and developed by a Lead UX
  Designer as a portfolio project.

  ## Tech Stack
  - React + Vite
  - Tailwind CSS
  - Supabase (Auth + PostgreSQL database)
  - Figma Make (UI generation)

  ## Features
  - Email/password authentication (sign up, login, forgot password)
  - Add, edit, and delete interview entries
  - Track round type, outcome, confidence and difficulty ratings
  - Timeline view of all upcoming and past interviews
  - Stats dashboard — pass rate, total interviews, round-level breakdown
  - Row Level Security — each user sees only their own data
  - Mobile-responsive layout

  ## Local Setup

  ### 1. Clone the repo
  git clone https://github.com/YOUR_USERNAME/interview-pipeline-tracker.git
  cd interview-pipeline-tracker

  ### 2. Install dependencies
  npm install

  ### 3. Set up Supabase
  - Create a project at https://supabase.com
  - Run the SQL setup script from /docs/schema.sql in the Supabase SQL Editor
  - Copy your Project URL and anon key from Project Settings → API

  ### 4. Configure environment variables
  cp .env.example .env
  Then edit .env and fill in your Supabase credentials.

  ### 5. Run the app
  npm run dev

  ## Project Structure
  src/
  ├── components/       # Reusable UI components
  ├── pages/            # Auth and app screens
  ├── lib/              # Supabase client setup
  └── App.jsx           # Route definitions

  ## Screenshots
  _Add screenshots after first run_

  ## Roadmap
  - Google Calendar sync for scheduled interviews
  - Email reminders before interviews
  - Export pipeline as PDF report
  - Company-level view grouping all rounds together

---

## docs/schema.sql
Generate a docs/schema.sql file in the project root containing
the full Supabase SQL setup script:

  -- Interview Pipeline Tracker — Supabase Schema

  CREATE TABLE IF NOT EXISTS public.interviews (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company      text        NOT NULL,
    role         text        NOT NULL,
    round        text        NOT NULL DEFAULT 'HR'
                 CHECK (round IN (
                   'HR', 'Technical L1', 'Technical L2',
                   'System Design', 'Final', 'Other'
                 )),
    scheduled_at timestamptz NOT NULL,
    prep_notes   text,
    reflection   text,
    confidence   integer     CHECK (confidence BETWEEN 1 AND 5),
    difficulty   integer     CHECK (difficulty BETWEEN 1 AND 5),
    outcome      text        NOT NULL DEFAULT 'Awaiting'
                 CHECK (outcome IN (
                   'Awaiting', 'Passed', 'Failed',
                   'Offer Received', 'Withdrawn'
                 )),
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can view own interviews"
    ON public.interviews FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own interviews"
    ON public.interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own interviews"
    ON public.interviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own interviews"
    ON public.interviews FOR DELETE
    USING (auth.uid() = user_id);

  CREATE INDEX IF NOT EXISTS idx_interviews_user_id
    ON public.interviews (user_id);

  CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at
    ON public.interviews (scheduled_at);

  CREATE INDEX IF NOT EXISTS idx_interviews_outcome
    ON public.interviews (outcome);

---

## ADDITIONAL NOTES
- Use Supabase's built-in auth (no custom auth logic)
- Protect all app routes — redirect to Login if not authenticated
- The docs/schema.sql file must be committed to the repo so anyone
  cloning can set up Supabase independently
- The .env file must never be committed (covered by .gitignore)
- .env.example must be committed so collaborators know which
  variables are needed
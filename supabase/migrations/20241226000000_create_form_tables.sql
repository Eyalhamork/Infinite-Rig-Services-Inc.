-- Create contact_submissions table
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  company text,
  phone text,
  subject text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'responded', 'archived'))
);

-- Create quote_submissions table
create table if not exists public.quote_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  service_area text not null,
  full_name text not null,
  company_name text,
  email text not null,
  phone text,
  project_requirements text,
  status text default 'new' check (status in ('new', 'reviewed', 'quoted', 'archived'))
);

-- Enable RLS
alter table public.contact_submissions enable row level security;
alter table public.quote_submissions enable row level security;

-- Create policies (modify as needed)
-- Allow anyone to insert (public submission)
create policy "Enable insert for everyone" on public.contact_submissions for insert with check (true);
create policy "Enable insert for everyone" on public.quote_submissions for insert with check (true);

-- Allow only authenticated admins to view (assuming you have auth setup, otherwise standard authenticated role)
create policy "Enable read access for authenticated users only" on public.contact_submissions for select using (auth.role() = 'authenticated');
create policy "Enable read access for authenticated users only" on public.quote_submissions for select using (auth.role() = 'authenticated');

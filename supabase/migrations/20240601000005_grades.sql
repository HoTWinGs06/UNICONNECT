-- =============================================
-- 005_grades.sql — Academic Courses & Grades
-- =============================================

create table public.courses (
  id          uuid primary key default gen_random_uuid(),
  code        text not null,         -- e.g., "CS 301"
  name        text not null,         -- e.g., "Data Structures & Algorithms"
  professor_id uuid references public.profiles(id) on delete set null,
  credits     int not null default 3,
  semester    text not null,         -- e.g., "Spring 2024"
  year        int not null,          -- academic year
  branch      text,                  -- which department
  description text default '',
  created_at  timestamptz default now()
);

create index idx_courses_professor on public.courses(professor_id);
create index idx_courses_semester on public.courses(semester, year);
create index idx_courses_code on public.courses(code);

create table public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  grade       text,                  -- e.g., "A", "B+", null if ongoing
  percentage  numeric(5,2),          -- e.g., 93.20
  status      text not null default 'active' check (status in ('active', 'completed', 'dropped', 'failed')),
  enrolled_at timestamptz default now(),
  unique (user_id, course_id)
);

create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_course on public.enrollments(course_id);

-- Function: calculate GPA for a user
create or replace function public.calculate_gpa(target_user_id uuid)
returns numeric
language plpgsql
stable
as $$
declare
  total_points numeric := 0;
  total_credits int := 0;
  grade_point numeric;
  rec record;
begin
  for rec in
    select e.grade, c.credits
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    where e.user_id = target_user_id
      and e.status = 'completed'
      and e.grade is not null
  loop
    grade_point := case rec.grade
      when 'A+' then 4.0
      when 'A'  then 4.0
      when 'A-' then 3.7
      when 'B+' then 3.3
      when 'B'  then 3.0
      when 'B-' then 2.7
      when 'C+' then 2.3
      when 'C'  then 2.0
      when 'C-' then 1.7
      when 'D+' then 1.3
      when 'D'  then 1.0
      when 'F'  then 0.0
      else null
    end;

    if grade_point is not null then
      total_points := total_points + (grade_point * rec.credits);
      total_credits := total_credits + rec.credits;
    end if;
  end loop;

  if total_credits = 0 then return 0; end if;
  return round(total_points / total_credits, 2);
end;
$$;

-- Function: get total credits earned
create or replace function public.get_credits_earned(target_user_id uuid)
returns int
language sql
stable
as $$
  select coalesce(sum(c.credits), 0)::int
  from public.enrollments e
  join public.courses c on c.id = e.course_id
  where e.user_id = target_user_id
    and e.status = 'completed';
$$;

-- =============================================
-- Row Level Security
-- =============================================
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

-- Courses: all authenticated can view
create policy "Courses are viewable" on public.courses
  for select to authenticated using (true);

-- Courses: only faculty/admin can create
create policy "Faculty can create courses" on public.courses
  for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('faculty', 'admin')
    )
  );

-- Courses: professor or admin can update
create policy "Professor can update course" on public.courses
  for update to authenticated
  using (
    auth.uid() = professor_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Enrollments: students see own enrollments
create policy "Students see own enrollments" on public.enrollments
  for select to authenticated
  using (
    auth.uid() = user_id
    or exists (
      -- Faculty can see enrollments in their courses
      select 1 from public.courses c
      where c.id = enrollments.course_id
        and c.professor_id = auth.uid()
    )
    or exists (
      -- Admins can see all
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Enrollments: students can enroll themselves
create policy "Students can enroll" on public.enrollments
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Enrollments: faculty can update grades for their courses
create policy "Faculty can update grades" on public.enrollments
  for update to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = enrollments.course_id
        and c.professor_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- =============================================
-- seed.sql — Demo data for UniConnect
-- =============================================
-- NOTE: This seed file is designed for use AFTER
-- real auth.users have been created via Supabase Auth.
-- Run the profile updates manually once you have user IDs.
--
-- For local development, insert demo data directly:

-- =============================================
-- 1. Demo Courses
-- =============================================
insert into public.courses (id, code, name, credits, semester, year, branch, description) values
  ('c0000001-0000-0000-0000-000000000001', 'CS 301', 'Data Structures & Algorithms', 4, 'Spring 2024', 3, 'Computer Science', 'Core CS course covering trees, graphs, sorting, and complexity analysis.'),
  ('c0000001-0000-0000-0000-000000000002', 'MATH 302', 'Calculus III', 4, 'Spring 2024', 3, 'Mathematics', 'Multivariable calculus: partial derivatives, multiple integrals, vector calculus.'),
  ('c0000001-0000-0000-0000-000000000003', 'ENG 210', 'Technical Writing', 3, 'Spring 2024', 2, 'English', 'Professional communication: reports, proposals, and documentation.'),
  ('c0000001-0000-0000-0000-000000000004', 'PHYS 201', 'General Physics II', 4, 'Spring 2024', 2, 'Physics', 'Electricity, magnetism, optics, and modern physics.'),
  ('c0000001-0000-0000-0000-000000000005', 'CS 310', 'Database Systems', 3, 'Spring 2024', 3, 'Computer Science', 'Relational databases, SQL, normalization, and query optimization.');

-- =============================================
-- 2. Demo Servers
-- =============================================
insert into public.servers (id, name, icon_emoji, type, description, created_by) values
  ('s0000001-0000-0000-0000-000000000001', 'Year 1 Server', '1️⃣', 'year', 'First year students community', 'REPLACE_WITH_USER_ID'),
  ('s0000001-0000-0000-0000-000000000002', 'Year 2 Server', '2️⃣', 'year', 'Second year students community', 'REPLACE_WITH_USER_ID'),
  ('s0000001-0000-0000-0000-000000000003', 'Year 3 Server', '3️⃣', 'year', 'Third year students community', 'REPLACE_WITH_USER_ID'),
  ('s0000001-0000-0000-0000-000000000004', 'Year 4 Server', '4️⃣', 'year', 'Final year students community', 'REPLACE_WITH_USER_ID'),
  ('s0000001-0000-0000-0000-000000000005', 'Faculty Lounge', '🎓', 'faculty', 'Faculty discussions and announcements', 'REPLACE_WITH_USER_ID'),
  ('s0000001-0000-0000-0000-000000000006', 'Clubs & Societies', '👥', 'club', 'Student organizations and clubs', 'REPLACE_WITH_USER_ID');

-- =============================================
-- 3. Demo Channels (for Year 3 Server)
-- =============================================
insert into public.channels (id, server_id, name, type, position) values
  -- Text channels
  ('ch000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000003', 'general', 'text', 1),
  ('ch000001-0000-0000-0000-000000000002', 's0000001-0000-0000-0000-000000000003', 'announcements', 'announcements', 2),
  ('ch000001-0000-0000-0000-000000000003', 's0000001-0000-0000-0000-000000000003', 'resources', 'text', 3),
  ('ch000001-0000-0000-0000-000000000004', 's0000001-0000-0000-0000-000000000003', 'help-desk', 'text', 4),
  -- Subject channels
  ('ch000001-0000-0000-0000-000000000005', 's0000001-0000-0000-0000-000000000003', 'data-structures', 'text', 5),
  ('ch000001-0000-0000-0000-000000000006', 's0000001-0000-0000-0000-000000000003', 'algorithms', 'text', 6),
  ('ch000001-0000-0000-0000-000000000007', 's0000001-0000-0000-0000-000000000003', 'databases', 'text', 7),
  -- Voice channels
  ('ch000001-0000-0000-0000-000000000008', 's0000001-0000-0000-0000-000000000003', 'Study Room 1', 'voice', 8),
  ('ch000001-0000-0000-0000-000000000009', 's0000001-0000-0000-0000-000000000003', 'Study Room 2', 'voice', 9),
  ('ch000001-0000-0000-0000-000000000010', 's0000001-0000-0000-0000-000000000003', 'Meeting Room', 'video', 10);

-- =============================================
-- 4. Demo Events
-- =============================================
insert into public.events (id, title, description, category, start_time, end_time, location, organizer_id, organizer_name, attendee_count) values
  ('e0000001-0000-0000-0000-000000000001', 'AI in Healthcare Seminar', 'Exploring the latest applications of artificial intelligence in medical diagnostics and patient care.', 'workshop', '2024-04-10 15:00:00+00', '2024-04-10 17:00:00+00', 'Auditorium B, Science Building', 'REPLACE_WITH_USER_ID', 'Prof. Sarah Jenkins', 30),
  ('e0000001-0000-0000-0000-000000000002', 'Tech Career Fair 2024', 'Connect with 25+ companies hiring for tech internships and full-time positions.', 'career', '2024-04-11 10:00:00+00', '2024-04-11 16:00:00+00', 'Main Exhibition Hall', 'REPLACE_WITH_USER_ID', 'Career Services', 87),
  ('e0000001-0000-0000-0000-000000000003', 'Spring Cultural Festival', 'Annual celebration of diversity with food, music, dance, and art from around the world.', 'cultural', '2024-04-13 12:00:00+00', '2024-04-13 20:00:00+00', 'University Quad & Student Center', 'REPLACE_WITH_USER_ID', 'Cultural Clubs Alliance', 54),
  ('e0000001-0000-0000-0000-000000000004', 'Research Symposium', 'Graduate and undergraduate students present their latest research findings.', 'academic', '2024-04-14 09:00:00+00', '2024-04-14 15:00:00+00', 'Graduate Research Center', 'REPLACE_WITH_USER_ID', 'Graduate School', 44);

-- =============================================
-- 5. Demo Study Groups
-- =============================================
insert into public.study_groups (id, name, description, icon_emoji, course_id, schedule, max_members, is_active, created_by) values
  ('g0000001-0000-0000-0000-000000000001', 'Algorithms Study Circle', 'Weekly problem-solving sessions focusing on dynamic programming and graph algorithms for CS301.', '💻', 'c0000001-0000-0000-0000-000000000001', 'Wed & Fri, 3–5 PM', 8, true, 'REPLACE_WITH_USER_ID'),
  ('g0000001-0000-0000-0000-000000000002', 'Organic Chemistry Lab Prep', 'Pre-lab review sessions to discuss procedures, safety, and expected results before weekly labs.', '🔬', null, 'Mon, 1–2 PM', 6, true, 'REPLACE_WITH_USER_ID'),
  ('g0000001-0000-0000-0000-000000000003', 'Calculus III Workshop', 'Collaborative problem sets and exam prep for multivariable calculus. All skill levels welcome!', '📐', 'c0000001-0000-0000-0000-000000000002', 'Tue & Thu, 6–8 PM', 10, true, 'REPLACE_WITH_USER_ID');

-- =============================================
-- NOTE ON USAGE:
-- =============================================
-- 1. Create a Supabase project at https://supabase.com
-- 2. Run migrations 001-008 in order via the SQL Editor
-- 3. Create test users via Supabase Auth (email + password)
-- 4. Replace all 'REPLACE_WITH_USER_ID' in this file with
--    the actual UUID from auth.users / profiles
-- 5. Run this seed file via the SQL Editor
-- =============================================

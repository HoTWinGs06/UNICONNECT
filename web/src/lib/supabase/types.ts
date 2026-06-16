// =============================================
// UniConnect — Database Type Definitions
// Manually typed from Supabase migrations
// =============================================

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: 'student' | 'faculty' | 'admin';
  branch: string | null;
  year: number | null;
  bio: string;
  is_online: boolean;
  last_seen: string;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
};

// --- Feed ---

export type Post = {
  id: string;
  author_id: string;
  content: string;
  type: 'post' | 'announcement' | 'research';
  media_urls: string[];
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
};

export type PostLike = {
  user_id: string;
  post_id: string;
  created_at: string;
};

export type PostComment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joined
  author?: Profile;
};

// --- Servers ---

export type Server = {
  id: string;
  name: string;
  icon_emoji: string;
  type: 'year' | 'faculty' | 'club' | 'custom';
  description: string;
  created_by: string;
  member_count: number;
  created_at: string;
};

export type Channel = {
  id: string;
  server_id: string;
  name: string;
  type: 'text' | 'voice' | 'video' | 'announcements';
  description: string;
  position: number;
  created_at: string;
};

export type ServerMember = {
  server_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  // Joined
  profile?: Profile;
};

export type ChannelMessage = {
  id: string;
  channel_id: string;
  author_id: string;
  content: string;
  attachments: string[];
  reactions: Record<string, string[]>;
  edited_at: string | null;
  created_at: string;
  // Joined
  author?: Profile;
};

// --- Direct Messages ---

export type Conversation = {
  id: string;
  is_group: boolean;
  name: string | null;
  created_at: string;
  // Joined
  members?: ConversationMember[];
  last_message?: DirectMessage;
};

export type ConversationMember = {
  conversation_id: string;
  user_id: string;
  unread_count: number;
  last_read_at: string;
  joined_at: string;
  // Joined
  profile?: Profile;
};

export type DirectMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  is_read: boolean;
  created_at: string;
  // Joined
  sender?: Profile;
};

// --- Grades ---

export type Course = {
  id: string;
  code: string;
  name: string;
  professor_id: string | null;
  credits: number;
  semester: string;
  year: number;
  branch: string | null;
  description: string;
  created_at: string;
  // Joined
  professor?: Profile;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  grade: string | null;
  percentage: number | null;
  status: 'active' | 'completed' | 'dropped' | 'failed';
  enrolled_at: string;
  // Joined
  course?: Course;
};

// --- Events ---

export type Event = {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'social' | 'career' | 'workshop' | 'sports' | 'cultural';
  start_time: string;
  end_time: string;
  location: string;
  organizer_id: string;
  organizer_name: string | null;
  cover_image: string | null;
  max_attendees: number | null;
  attendee_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  organizer?: Profile;
  user_rsvp?: EventRsvp;
};

export type EventRsvp = {
  event_id: string;
  user_id: string;
  status: 'going' | 'interested' | 'saved';
  created_at: string;
};

// --- Study Groups ---

export type StudyGroup = {
  id: string;
  name: string;
  description: string;
  icon_emoji: string;
  course_id: string | null;
  schedule: string | null;
  max_members: number;
  member_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined
  course?: Course;
  creator?: Profile;
  user_membership?: GroupMember;
};

export type GroupMember = {
  group_id: string;
  user_id: string;
  role: 'owner' | 'member';
  status: 'approved' | 'pending' | 'rejected';
  joined_at: string;
  // Joined
  profile?: Profile;
};

// --- Help Requests ---

export type HelpRequest = {
  id: string;
  title: string;
  description: string;
  category: 'tutoring' | 'study_partner' | 'assignment' | 'lab_project' | 'technical' | 'career' | 'other';
  course_id: string | null;
  urgency: 'low' | 'medium' | 'high';
  visibility: 'public' | 'private';
  author_id: string;
  attachments: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
  course?: Course;
};

// --- Notifications ---

export type Notification = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: 'comment' | 'like' | 'dm' | 'group_join_request' | 'group_join_approved' | 'help_status';
  entity_type: string | null;
  entity_id: string | null;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  // Joined
  actor?: Profile;
};

// --- Navigation ---

export type NavItem = {
  path: string;
  icon: string;
  label: string;
  mobileNav: boolean;
  badge?: number;
};

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Post } from '@/lib/supabase/types';

const BRANCHES = [
  'Computer Science',
  'Business Administration',
  'Pre-Med / Biology',
  'Law & Ethics',
  'Engineering',
  'Fine Arts',
  'Mathematics',
  'Psychology',
];

export default function ProfileClient({
  profile,
  isOwner,
  posts,
}: {
  profile: Profile;
  isOwner: boolean;
  posts: Post[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [branch, setBranch] = useState(profile.branch ?? '');
  const [year, setYear] = useState<number | null>(profile.year);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);

  async function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const path = `${profile.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } catch {
      setError('Avatar upload failed. Make sure the "avatars" storage bucket exists.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    setSaving(true);
    setError('');
    const { error: updErr } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        bio: bio.trim(),
        branch: branch || null,
        year: year,
        avatar_url: avatarUrl,
      })
      .eq('id', profile.id);
    setSaving(false);
    if (updErr) {
      setError('Could not save changes.');
      return;
    }
    setEditing(false);
    router.refresh();
  }

  function cancelEdit() {
    setDisplayName(profile.display_name);
    setBio(profile.bio ?? '');
    setBranch(profile.branch ?? '');
    setYear(profile.year);
    setAvatarUrl(profile.avatar_url);
    setError('');
    setEditing(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Banner + avatar */}
      <div className="bg-gradient-brand h-32 rounded-2xl relative" />
      <div className="px-2 -mt-12 relative">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-primary-fixed border-4 border-surface flex items-center justify-center text-primary-container font-bold text-3xl overflow-hidden">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              profile.display_name.charAt(0).toUpperCase()
            )}
          </div>
          {!profile.is_online ? null : (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-success border-2 border-surface rounded-full" />
          )}
          {editing && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined">
                {uploading ? 'hourglass_top' : 'photo_camera'}
              </span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>
      </div>

      {/* Header row */}
      <div className="px-2 mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {editing ? (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-xl font-bold text-on-surface bg-surface-container rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-secondary/30"
              placeholder="Display name"
            />
          ) : (
            <h1 className="text-2xl font-bold text-on-surface truncate">{profile.display_name}</h1>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
              {profile.role}
            </span>
            <span className="text-sm text-on-surface-variant">
              {profile.is_online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {isOwner ? (
          editing ? (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <span className="spinner !w-4 !h-4 !border-white/30 !border-t-white" />}
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>
          )
        ) : (
          <Link
            href={`/messages?userId=${profile.id}&name=${encodeURIComponent(profile.display_name)}`}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Message
          </Link>
        )}
      </div>

      {error && (
        <p className="px-2 mt-3 text-sm text-error">{error}</p>
      )}

      {/* Details */}
      <div className="px-2 mt-5 space-y-4">
        {editing ? (
          <>
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase tracking-wide font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell people about yourself..."
                className="mt-1.5 w-full bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant uppercase tracking-wide font-medium">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-1.5 w-full bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
                >
                  <option value="">Not set</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant uppercase tracking-wide font-medium">Year</label>
                <select
                  value={year ?? ''}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
                  className="mt-1.5 w-full bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
                >
                  <option value="">Not set</option>
                  {[1, 2, 3, 4, 5, 6].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-on-surface whitespace-pre-wrap">
              {profile.bio?.trim() ? profile.bio : <span className="text-on-surface-variant italic">No bio yet.</span>}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
              {profile.branch && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  {profile.branch}
                </span>
              )}
              {profile.year && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Year {profile.year}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                {profile.email}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Recent posts */}
      {!editing && (
        <div className="px-2 mt-8">
          <h2 className="text-label-md text-on-surface-variant uppercase tracking-wide font-semibold mb-3">
            Recent activity
          </h2>
          {posts.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="bg-surface border border-outline-variant rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      {p.type}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface line-clamp-3">{p.content}</p>
                  <div className="flex gap-4 mt-2 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                      {p.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      {p.comments_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

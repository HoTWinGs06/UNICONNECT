'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { StudyGroup } from '@/lib/supabase/types';

export default function GroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  const fetchGroups = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data } = await supabase
      .from('study_groups')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) setGroups(data);

    // Check which groups the user is in
    if (user) {
      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .in('status', ['approved', 'pending']);
      if (memberships) {
        setJoinedGroups(new Set(memberships.map((m) => m.group_id)));
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  async function handleJoin(groupId: string) {
    if (joinedGroups.has(groupId)) return;

    setJoinedGroups((prev) => new Set(prev).add(groupId));

    await supabase.from('group_members').insert({
      group_id: groupId,
      user_id: currentUserId,
      role: 'member',
      status: 'pending',
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    await supabase.from('study_groups').insert({
      name: newName.trim(),
      description: newDesc.trim(),
      created_by: currentUserId,
    });

    // Auto-join as owner
    // The trigger doesn't auto-add creator, so we insert manually
    const { data: newGroup } = await supabase
      .from('study_groups')
      .select('id')
      .eq('name', newName.trim())
      .eq('created_by', currentUserId)
      .single();

    if (newGroup) {
      await supabase.from('group_members').insert({
        group_id: newGroup.id,
        user_id: currentUserId,
        role: 'owner',
        status: 'approved',
      });
    }

    setNewName('');
    setNewDesc('');
    setShowCreate(false);
    setCreating(false);
    fetchGroups();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-background">Study Groups</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Find or create study groups for your courses
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Group
        </button>
      </div>

      {/* Create Group Form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 mb-6 animate-slide-up"
        >
          <h3 className="font-semibold text-on-surface mb-4">Create a Study Group</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Group name..."
              required
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {creating ? <span className="spinner !w-4 !h-4" /> : null}
              Create
            </button>
          </div>
        </form>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.length === 0 ? (
          <div className="col-span-full text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">
              group
            </span>
            <p className="font-medium">No study groups yet</p>
            <p className="text-body-sm">Create the first one!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover-lift animate-fade-in"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-2xl shrink-0">
                  {group.icon_emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-on-surface truncate">
                    {group.name}
                  </h3>
                  <p className="text-label-sm text-on-surface-variant">
                    {group.member_count} / {group.max_members} members
                  </p>
                </div>
              </div>

              {group.description && (
                <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-3">
                  {group.description}
                </p>
              )}

              {group.schedule && (
                <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {group.schedule}
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-surface-container rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (group.member_count / group.max_members) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <button
                onClick={() => handleJoin(group.id)}
                disabled={joinedGroups.has(group.id) || group.member_count >= group.max_members}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all press-scale ${
                  joinedGroups.has(group.id)
                    ? 'bg-surface-container text-on-surface-variant cursor-default'
                    : group.member_count >= group.max_members
                    ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                    : 'bg-primary text-on-primary hover:bg-primary/90'
                }`}
              >
                {joinedGroups.has(group.id)
                  ? '✓ Joined / Pending'
                  : group.member_count >= group.max_members
                  ? 'Full'
                  : 'Request to Join'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

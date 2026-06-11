'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HelpRequest } from '@/lib/supabase/types';

const helpCategories = [
  { value: 'tutoring', label: 'Tutoring', icon: 'school' },
  { value: 'study_partner', label: 'Study Partner', icon: 'group' },
  { value: 'assignment', label: 'Assignment Help', icon: 'assignment' },
  { value: 'lab_project', label: 'Lab / Project', icon: 'science' },
  { value: 'technical', label: 'Technical Issue', icon: 'computer' },
  { value: 'career', label: 'Career Advice', icon: 'work' },
  { value: 'other', label: 'Other', icon: 'help' },
];

const urgencyColors: Record<string, string> = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-error/10 text-error',
};

const statusColors: Record<string, string> = {
  open: 'bg-primary/10 text-primary',
  in_progress: 'bg-warning/10 text-warning',
  resolved: 'bg-success/10 text-success',
  closed: 'bg-on-surface-variant/10 text-on-surface-variant',
};

export default function HelpPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tutoring');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const supabase = createClient();

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setRequests(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('help_requests').insert({
      title: title.trim(),
      description: description.trim(),
      category,
      urgency,
      author_id: user.id,
    });

    setTitle('');
    setDescription('');
    setCategory('tutoring');
    setUrgency('medium');
    setShowForm(false);
    setSubmitting(false);
    fetchRequests();
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-background">Help Center</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Ask for help or help others
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">
            {showForm ? 'close' : 'add'}
          </span>
          {showForm ? 'Close' : 'Ask for Help'}
        </button>
      </div>

      {/* Help Request Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-6 animate-slide-up"
        >
          <h3 className="font-semibold text-on-surface mb-4">New Help Request</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="help-title" className="block text-sm font-medium text-on-surface mb-1.5">
                Title
              </label>
              <input
                id="help-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need help with?"
                required
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="help-desc" className="block text-sm font-medium text-on-surface mb-1.5">
                Description
              </label>
              <textarea
                id="help-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {helpCategories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all press-scale flex items-center gap-1.5 ${
                      category === cat.value
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Urgency
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all press-scale ${
                      urgency === u
                        ? urgencyColors[u]
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? <span className="spinner !w-4 !h-4" /> : null}
              Submit Request
            </button>
          </div>
        </form>
      )}

      {/* Help Requests List */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">
              help_outline
            </span>
            <p className="font-medium">No help requests yet</p>
            <p className="text-body-sm">Be the first to ask for help!</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover-lift animate-fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    {helpCategories.find((c) => c.value === req.category)?.icon || 'help'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-on-surface text-sm">
                      {req.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[req.status]}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${urgencyColors[req.urgency]}`}>
                      {req.urgency}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-2">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {timeAgo(req.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">label</span>
                      {helpCategories.find((c) => c.value === req.category)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

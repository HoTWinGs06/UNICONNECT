'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Post, Profile } from '@/lib/supabase/types';

type PostWithAuthor = Post & { author: Profile };

export default function FeedPage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data } = await supabase
      .from('posts')
      .select('*, author:profiles!posts_author_id_fkey(*)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setPosts(data as PostWithAuthor[]);

    // Fetch user's likes
    if (user) {
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);
      if (likes) {
        setLikedPosts(new Set(likes.map((l) => l.post_id)));
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('posts').insert({
      author_id: user.id,
      content: newPost.trim(),
      type: 'post',
    });

    setNewPost('');
    setPosting(false);
    fetchPosts();
  }

  async function toggleLike(postId: string) {
    const isLiked = likedPosts.has(postId);

    if (isLiked) {
      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes_count: p.likes_count - 1 } : p
        )
      );
      await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', postId);
    } else {
      setLikedPosts((prev) => new Set(prev).add(postId));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
        )
      );
      await supabase.from('post_likes').insert({
        user_id: currentUserId,
        post_id: postId,
      });
    }
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
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      {/* Post Composer */}
      <form
        onSubmit={handleCreatePost}
        className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-6 hover-lift"
      >
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with your campus..."
          rows={3}
          className="w-full resize-none bg-transparent text-on-surface placeholder:text-outline text-body-md focus:outline-none"
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant">
          <div className="flex gap-2">
            <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[20px]">image</span>
            </button>
            <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[20px]">tag</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={!newPost.trim() || posting}
            className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {posting ? <span className="spinner !w-4 !h-4" /> : null}
            Post
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-3 block opacity-40">
              dynamic_feed
            </span>
            <p className="text-lg font-medium mb-1">No posts yet</p>
            <p className="text-body-sm">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover-lift animate-fade-in"
            >
              {/* Author Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-sm">
                  {post.author?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    post.author?.display_name?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-label-md font-semibold text-on-surface truncate">
                    {post.author?.display_name}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {post.author?.branch || post.author?.role} • {timeAgo(post.created_at)}
                  </p>
                </div>
                {post.type !== 'post' && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    post.type === 'announcement'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {post.type}
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-body-md text-on-surface whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-outline-variant">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors press-scale ${
                    likedPosts.has(post.id)
                      ? 'text-error'
                      : 'text-on-surface-variant hover:text-error'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: likedPosts.has(post.id)
                        ? "'FILL' 1"
                        : '',
                    }}
                  >
                    favorite
                  </span>
                  {post.likes_count > 0 && post.likes_count}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors press-scale">
                  <span className="material-symbols-outlined text-[20px]">
                    chat_bubble_outline
                  </span>
                  {post.comments_count > 0 && post.comments_count}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors press-scale">
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                </button>
                <button className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    bookmark
                  </span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

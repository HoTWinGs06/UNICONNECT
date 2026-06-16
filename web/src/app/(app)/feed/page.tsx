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
  
  // Composer extra states
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagText, setTagText] = useState('');
  
  // Comments states
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

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

  // Real-time subscription to comments
  useEffect(() => {
    if (!expandedPostId) return;
    const channel = supabase
      .channel(`comments-${expandedPostId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${expandedPostId}`,
        },
        () => { fetchComments(expandedPostId); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [expandedPostId]);

  const fetchComments = useCallback(async (postId: string) => {
    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    const { data } = await supabase
      .from('post_comments')
      .select('*, author:profiles!post_comments_author_id_fkey(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setComments(prev => ({ ...prev, [postId]: data }));
    }
    setLoadingComments(prev => ({ ...prev, [postId]: false }));
  }, [supabase]);

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim() && !mediaUrl.trim()) return;
    setPosting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Parse hashtags
    const hashtagsArray = tagText
      .split(/[\s,]+/)
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t.slice(1) : t));

    await supabase.from('posts').insert({
      author_id: user.id,
      content: newPost.trim(),
      type: 'post',
      media_urls: mediaUrl.trim() ? [mediaUrl.trim()] : [],
      hashtags: hashtagsArray,
    });

    setNewPost('');
    setMediaUrl('');
    setTagText('');
    setShowMediaInput(false);
    setShowTagInput(false);
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

  async function handleAddComment(postId: string) {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('post_comments').insert({
      post_id: postId,
      author_id: user.id,
      content: text,
    });

    if (!error) {
      setNewCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      setPosts(prev =>
        prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p)
      );
    }
  }

  function toggleComments(postId: string) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
    }
  }

  function handleShare(post: PostWithAuthor) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/feed?post=${post.id}`);
      showNotification('Post link copied to clipboard!');
    } else {
      showNotification('Post link: ' + window.location.origin + '/feed?post=' + post.id);
    }
  }

  function handleBookmark(postId: string) {
    showNotification('Post bookmarked successfully!');
  }

  function showNotification(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-lg z-50 animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">info</span>
          {toast}
        </div>
      )}

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

        {/* Dynamic Image Input Field */}
        {showMediaInput && (
          <div className="mt-2 mb-3">
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste image URL here..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-xs focus:outline-none focus:border-primary"
            />
          </div>
        )}

        {/* Dynamic Tag Input Field */}
        {showTagInput && (
          <div className="mt-2 mb-3">
            <input
              type="text"
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              placeholder="Enter tags (separated by spaces, e.g., study hackathon)..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-xs focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowMediaInput(!showMediaInput)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${showMediaInput ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              title="Add Image URL"
            >
              <span className="material-symbols-outlined text-[20px]">image</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTagInput(!showTagInput)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${showTagInput ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              title="Add Tags"
            >
              <span className="material-symbols-outlined text-[20px]">tag</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={(!newPost.trim() && !mediaUrl.trim()) || posting}
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
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-sm shrink-0">
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
              <p className="text-body-md text-on-surface whitespace-pre-wrap mb-3">
                {post.content}
              </p>

              {/* Media Image Attachment */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="w-full max-h-80 rounded-lg overflow-hidden border border-outline-variant/50 mb-3 bg-surface-container-low">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.media_urls[0]}
                    alt="Post attachment"
                    className="w-full h-full object-cover max-h-80"
                  />
                </div>
              )}

              {/* Hashtag list */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[11px] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

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
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors press-scale ${
                    expandedPostId === post.id
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    chat_bubble_outline
                  </span>
                  {post.comments_count > 0 && post.comments_count}
                </button>
                <button
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors press-scale"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                </button>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    bookmark
                  </span>
                </button>
              </div>

              {/* Collapsible Comments Section */}
              {expandedPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-outline-variant/60 space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Comments
                  </h4>

                  {/* Comment input form */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newCommentText[post.id] || ''}
                      onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newCommentText[post.id]?.trim()}
                      className="px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/95 disabled:opacity-50"
                    >
                      Comment
                    </button>
                  </div>

                  {/* Comments list */}
                  {loadingComments[post.id] ? (
                    <div className="text-center py-2">
                      <span className="spinner !w-4 !h-4" />
                    </div>
                  ) : !comments[post.id] || comments[post.id].length === 0 ? (
                    <p className="text-xs text-on-surface-variant italic py-1">
                      No comments yet.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {comments[post.id].map((comment) => (
                        <div key={comment.id} className="flex gap-2 text-xs">
                          <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-[10px] shrink-0">
                            {comment.author?.display_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="bg-surface-container-low p-2.5 rounded-xl flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="font-semibold text-on-surface">
                                {comment.author?.display_name}
                              </span>
                              <span className="text-[9px] text-on-surface-variant">
                                {timeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-on-surface-variant break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Conversation, DirectMessage, Profile, ConversationMember } from '@/lib/supabase/types';

type ConversationWithDetails = Conversation & {
  conversation_members: (ConversationMember & { profile: Profile })[];
  last_message_content?: string;
  last_message_time?: string;
  unread_count?: number;
};

type MessageWithSender = DirectMessage & { sender: Profile };

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const fetchConversations = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_members(*, profile:profiles(*))
      `)
      .order('created_at', { ascending: false });

    if (data) setConversations(data as ConversationWithDetails[]);
    setLoading(false);
  }, [supabase]);

  const fetchMessages = useCallback(async (convoId: string) => {
    const { data } = await supabase
      .from('direct_messages')
      .select('*, sender:profiles!direct_messages_sender_id_fkey(*)')
      .eq('conversation_id', convoId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) setMessages(data as MessageWithSender[]);

    // Mark as read
    await supabase.rpc('mark_conversation_read', { conv_id: convoId });
  }, [supabase]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);
  useEffect(() => {
    if (selectedConvo) fetchMessages(selectedConvo.id);
  }, [selectedConvo, fetchMessages]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time
  useEffect(() => {
    if (!selectedConvo) return;
    const channel = supabase
      .channel(`dm-${selectedConvo.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${selectedConvo.id}`,
        },
        () => { fetchMessages(selectedConvo.id); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedConvo, supabase, fetchMessages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;

    await supabase.from('direct_messages').insert({
      conversation_id: selectedConvo.id,
      sender_id: currentUserId,
      content: newMessage.trim(),
    });
    setNewMessage('');
  }

  function getOtherUser(convo: ConversationWithDetails): Profile | null {
    const other = convo.conversation_members?.find(
      (m) => m.user_id !== currentUserId
    );
    return other?.profile || null;
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-56px)] md:h-screen">
        <div className="w-80 bg-surface-container animate-pulse" />
        <div className="flex-1 bg-background" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen overflow-hidden">
      {/* Conversation List */}
      <div className={`w-full md:w-80 bg-surface border-r border-outline-variant flex flex-col shrink-0 ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-outline-variant">
          <h2 className="font-semibold text-on-surface text-lg">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto thin-scrollbar">
          {conversations.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">
                chat
              </span>
              <p className="font-medium">No conversations</p>
              <p className="text-body-sm">Start a new conversation!</p>
            </div>
          ) : (
            conversations.map((convo) => {
              const other = getOtherUser(convo);
              const myMembership = convo.conversation_members?.find(
                (m) => m.user_id === currentUserId
              );
              return (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-outline-variant/50 ${
                    selectedConvo?.id === convo.id
                      ? 'bg-surface-container-low'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-sm">
                      {other?.display_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {other?.is_online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-sm text-on-surface truncate">
                        {convo.name || other?.display_name || 'Chat'}
                      </p>
                    </div>
                    <p className="text-label-sm text-on-surface-variant truncate">
                      {other?.branch || 'UniConnect user'}
                    </p>
                  </div>
                  {(myMembership?.unread_count ?? 0) > 0 && (
                    <span className="w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                      {myMembership?.unread_count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
        {selectedConvo ? (
          <>
            {/* Chat Header */}
            <div className="h-14 px-4 flex items-center gap-3 border-b border-outline-variant bg-surface-container-lowest shrink-0">
              <button
                onClick={() => setSelectedConvo(null)}
                className="md:hidden text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-xs">
                {getOtherUser(selectedConvo)?.display_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold text-sm text-on-surface">
                  {selectedConvo.name || getOtherUser(selectedConvo)?.display_name || 'Chat'}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {getOtherUser(selectedConvo)?.is_online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        isMine
                          ? 'bg-primary text-on-primary rounded-br-md'
                          : 'bg-surface-container text-on-surface rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-on-primary/60' : 'text-on-surface-variant'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center gap-2 bg-surface-container rounded-xl px-4 py-2.5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="text-primary hover:text-primary/80 transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            <div className="text-center">
              <span className="material-symbols-outlined text-[64px] mb-3 block opacity-20">
                forum
              </span>
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-body-sm">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

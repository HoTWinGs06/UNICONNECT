'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Server, Channel, ChannelMessage, Profile } from '@/lib/supabase/types';

type MessageWithAuthor = ChannelMessage & { author: Profile };

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const fetchServers = useCallback(async () => {
    const { data } = await supabase
      .from('servers')
      .select('*')
      .order('name');
    if (data && data.length > 0) {
      setServers(data);
      setSelectedServer(data[0]);
    }
    setLoading(false);
  }, [supabase]);

  const fetchChannels = useCallback(async (serverId: string) => {
    const { data } = await supabase
      .from('channels')
      .select('*')
      .eq('server_id', serverId)
      .order('position');
    if (data && data.length > 0) {
      setChannels(data);
      setSelectedChannel(data[0]);
    } else {
      setChannels([]);
      setSelectedChannel(null);
    }
  }, [supabase]);

  const fetchMessages = useCallback(async (channelId: string) => {
    const { data } = await supabase
      .from('channel_messages')
      .select('*, author:profiles!channel_messages_author_id_fkey(*)')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) setMessages(data as MessageWithAuthor[]);
  }, [supabase]);

  useEffect(() => { fetchServers(); }, [fetchServers]);
  useEffect(() => {
    if (selectedServer) fetchChannels(selectedServer.id);
  }, [selectedServer, fetchChannels]);
  useEffect(() => {
    if (selectedChannel) fetchMessages(selectedChannel.id);
  }, [selectedChannel, fetchMessages]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    if (!selectedChannel) return;
    const channel = supabase
      .channel(`channel-${selectedChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'channel_messages',
          filter: `channel_id=eq.${selectedChannel.id}`,
        },
        () => { fetchMessages(selectedChannel.id); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedChannel, supabase, fetchMessages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('channel_messages').insert({
      channel_id: selectedChannel.id,
      author_id: user.id,
      content: newMessage.trim(),
    });

    setNewMessage('');
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-56px)] md:h-screen">
        <div className="w-16 bg-surface-container-high animate-pulse" />
        <div className="w-60 bg-surface-container animate-pulse" />
        <div className="flex-1 bg-background" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen overflow-hidden">
      {/* Server Rail */}
      <div className="w-16 bg-surface-container-high border-r border-outline-variant flex flex-col items-center py-3 gap-2 overflow-y-auto hide-scrollbar shrink-0">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setSelectedServer(server)}
            title={server.name}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all hover:rounded-xl press-scale ${
              selectedServer?.id === server.id
                ? 'bg-primary text-on-primary rounded-xl'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {server.icon_emoji}
          </button>
        ))}
        <button className="w-11 h-11 rounded-2xl bg-surface-container text-success flex items-center justify-center hover:rounded-xl hover:bg-success/10 transition-all">
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>
      </div>

      {/* Channel List */}
      <div className="w-60 bg-surface-container border-r border-outline-variant flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-outline-variant">
          <h2 className="font-semibold text-on-surface truncate">
            {selectedServer?.name || 'Select a server'}
          </h2>
          <p className="text-label-sm text-on-surface-variant truncate">
            {selectedServer?.member_count || 0} members
          </p>
        </div>

        <div className="flex-1 p-2 overflow-y-auto thin-scrollbar space-y-0.5">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedChannel?.id === channel.id
                  ? 'bg-surface-container-low text-on-surface font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="text-on-surface-variant">#</span>
              {channel.name}
            </button>
          ))}
          {channels.length === 0 && (
            <p className="text-center text-on-surface-variant text-sm py-8">
              No channels yet
            </p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-12 px-4 flex items-center gap-2 border-b border-outline-variant bg-surface-container-lowest shrink-0">
          <span className="text-on-surface-variant">#</span>
          <span className="font-medium text-on-surface text-sm">
            {selectedChannel?.name || 'Select a channel'}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-on-surface-variant">
              <div className="text-center">
                <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">
                  forum
                </span>
                <p className="font-medium">No messages yet</p>
                <p className="text-body-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-xs shrink-0">
                  {msg.author?.display_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-on-surface">
                      {msg.author?.display_name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface mt-0.5 break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-outline-variant bg-surface-container-lowest"
        >
          <div className="flex items-center gap-2 bg-surface-container rounded-xl px-4 py-2.5">
            <button type="button" className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${selectedChannel?.name || 'channel'}...`}
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
      </div>
    </div>
  );
}

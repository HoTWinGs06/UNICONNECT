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
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // Membership check state
  const [isMember, setIsMember] = useState(false);
  const [joiningServer, setJoiningServer] = useState(false);

  // Dialog/Modal states
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerEmoji, setNewServerEmoji] = useState('🌐');
  const [newServerDesc, setNewServerDesc] = useState('');

  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState('text');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const fetchServers = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

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

  const checkMembership = useCallback(async (serverId: string, userId: string) => {
    const { data } = await supabase
      .from('server_members')
      .select('*')
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .maybeSingle();
    
    setIsMember(!!data);
    return !!data;
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
    if (selectedServer && currentUserId) {
      checkMembership(selectedServer.id, currentUserId).then((member) => {
        if (member) {
          fetchChannels(selectedServer.id);
        } else {
          setChannels([]);
          setSelectedChannel(null);
        }
      });
    }
  }, [selectedServer, currentUserId, checkMembership, fetchChannels]);

  useEffect(() => {
    if (selectedChannel && isMember) fetchMessages(selectedChannel.id);
  }, [selectedChannel, fetchMessages, isMember]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!selectedChannel || !isMember) return;
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
  }, [selectedChannel, supabase, fetchMessages, isMember]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    await supabase.from('channel_messages').insert({
      channel_id: selectedChannel.id,
      author_id: currentUserId,
      content: newMessage.trim(),
    });

    setNewMessage('');
  }

  async function handleJoinServer() {
    if (!selectedServer || !currentUserId) return;
    setJoiningServer(true);

    const { error } = await supabase.from('server_members').insert({
      server_id: selectedServer.id,
      user_id: currentUserId,
      role: 'member',
    });

    if (!error) {
      setIsMember(true);
      fetchChannels(selectedServer.id);
      setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, member_count: (s.member_count || 0) + 1 } : s));
      setSelectedServer(prev => prev ? { ...prev, member_count: (prev.member_count || 0) + 1 } : null);
    }
    setJoiningServer(false);
  }

  async function handleCreateServer(e: React.FormEvent) {
    e.preventDefault();
    if (!newServerName.trim() || !currentUserId) return;

    const { data: server, error: serverError } = await supabase
      .from('servers')
      .insert({
        name: newServerName.trim(),
        icon_emoji: newServerEmoji.trim() || '🌐',
        description: newServerDesc.trim(),
        created_by: currentUserId,
        type: 'custom',
      })
      .select()
      .single();

    if (serverError || !server) {
      console.error(serverError);
      return;
    }

    await supabase.from('server_members').insert({
      server_id: server.id,
      user_id: currentUserId,
      role: 'owner',
    });

    await supabase.from('channels').insert({
      server_id: server.id,
      name: 'general',
      type: 'text',
      position: 0,
    });

    setNewServerName('');
    setNewServerEmoji('🌐');
    setNewServerDesc('');
    setShowCreateServerModal(false);

    const { data: allServers } = await supabase.from('servers').select('*').order('name');
    if (allServers) {
      setServers(allServers);
      const created = allServers.find(s => s.id === server.id);
      if (created) setSelectedServer(created);
    }
  }

  async function handleCreateChannel(e: React.FormEvent) {
    e.preventDefault();
    if (!newChannelName.trim() || !selectedServer) return;

    const { error } = await supabase.from('channels').insert({
      server_id: selectedServer.id,
      name: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'),
      type: newChannelType,
      position: channels.length,
    });

    if (!error) {
      setNewChannelName('');
      setNewChannelType('text');
      setShowCreateChannelModal(false);
      fetchChannels(selectedServer.id);
    }
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
    <div className="flex h-[calc(100vh-56px)] md:h-screen overflow-hidden relative">
      {/* Create Server Modal */}
      {showCreateServerModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateServer}
            className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 animate-scale-up"
          >
            <h3 className="text-lg font-bold text-on-surface">Create a Server</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Server Name</label>
                <input
                  type="text"
                  required
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="My Awesome Server"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                />
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={newServerEmoji}
                    onChange={(e) => setNewServerEmoji(e.target.value)}
                    placeholder="🌐"
                    maxLength={2}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-center text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Description</label>
                  <input
                    type="text"
                    value={newServerDesc}
                    onChange={(e) => setNewServerDesc(e.target.value)}
                    placeholder="Brief details about server..."
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateServerModal(false)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newServerName.trim()}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/95 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannelModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateChannel}
            className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 animate-scale-up"
          >
            <h3 className="text-lg font-bold text-on-surface">Create a Channel</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Channel Name</label>
                <input
                  type="text"
                  required
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="announcements"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Channel Type</label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                >
                  <option value="text">Text Channel</option>
                  <option value="voice">Voice Channel</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateChannelModal(false)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newChannelName.trim()}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/95 disabled:opacity-50"
              >
                Create Channel
              </button>
            </div>
          </form>
        </div>
      )}

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
        <button
          onClick={() => setShowCreateServerModal(true)}
          className="w-11 h-11 rounded-2xl bg-surface-container text-success flex items-center justify-center hover:rounded-xl hover:bg-success/10 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>
      </div>

      {/* Channel List */}
      <div className="w-60 bg-surface-container border-r border-outline-variant flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="font-semibold text-on-surface truncate">
              {selectedServer?.name || 'Select a server'}
            </h2>
            <p className="text-label-sm text-on-surface-variant truncate">
              {selectedServer?.member_count || 0} members
            </p>
          </div>
          {selectedServer && isMember && (
            <button
              onClick={() => setShowCreateChannelModal(true)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container-low"
              title="Add Channel"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          )}
        </div>

        <div className="flex-1 p-2 overflow-y-auto thin-scrollbar space-y-0.5">
          {isMember ? (
            channels.map((channel) => (
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
            ))
          ) : (
            <p className="text-xs text-on-surface-variant p-3 italic">
              Join this server to view channels.
            </p>
          )}
          {isMember && channels.length === 0 && (
            <p className="text-center text-on-surface-variant text-sm py-8">
              No channels yet
            </p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!isMember ? (
          /* Join Server CTA Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-background">
            <div className="max-w-md text-center bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm hover-lift animate-fade-in">
              <span className="text-6xl mb-4 block">{selectedServer?.icon_emoji || '🌐'}</span>
              <h2 className="text-xl font-bold text-on-surface mb-2">{selectedServer?.name}</h2>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                {selectedServer?.description || 'Welcome to this campus community. Join to chat and connect with other members!'}
              </p>
              <button
                onClick={handleJoinServer}
                disabled={joiningServer}
                className="px-6 py-3 rounded-lg bg-secondary text-on-secondary text-sm font-semibold hover:bg-secondary/90 transition-all press-scale disabled:opacity-50"
              >
                {joiningServer ? 'Joining...' : 'Join Server'}
              </button>
            </div>
          </div>
        ) : (
          <>
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
                    <div className="min-w-0 flex-1">
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
          </>
        )}
      </div>
    </div>
  );
}

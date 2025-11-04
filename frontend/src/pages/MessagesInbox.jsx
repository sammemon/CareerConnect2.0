import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './messages.css';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showPane, setShowPane] = useState(true);
  const [conversation, setConversation] = useState([]);
  const [messageText, setMessageText] = useState('');
  const convoPollRef = useRef(null);
  const inboxPollRef = useRef(null);
  const navigate = useNavigate();

  // Load inbox messages
  const loadInbox = async () => {
    try {
      const res = await api.get('/social/messages/inbox');
      setMessages(res.data.data || []);
    } catch (e) {
      console.error('Failed to load inbox', e);
    }
  };

  // Load full conversation with a user
  const loadConversation = async (userId) => {
    if (!userId) return;
    try {
      const res = await api.get(`/social/messages/conversation/${userId}`);
      // controller returns messages in res.data.data (assumed)
      setConversation(res.data.data || []);
    } catch (e) {
      console.error('Failed to load conversation', e);
      setConversation([]);
    }
  };

  // Open a conversation in the pane and start polling it.
  const openConversationWith = async (m) => {
    if (!m) return;
    // ensure pane is visible
    setShowPane(true);
    // set selected item
    setSelected(m);
    // clear any existing poll
    if (convoPollRef.current) clearInterval(convoPollRef.current);
    // load conversation now
    await loadConversation(m.sender_id);
    // start polling this conversation every 2s
    convoPollRef.current = setInterval(() => loadConversation(m.sender_id), 2000);
  };

  // Send a message to selected user
  const handleSend = async () => {
    if (!selected || !messageText.trim()) return;
    try {
      await api.post(`/social/messages/${selected.sender_id}`, { content: messageText.trim() });
      setMessageText('');
      // reload conversation and inbox
      await loadConversation(selected.sender_id);
      await loadInbox();
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadInbox();
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Poll inbox every 5s
    inboxPollRef.current = setInterval(() => {
      loadInbox();
    }, 5000);

    return () => {
      mounted = false;
      if (inboxPollRef.current) clearInterval(inboxPollRef.current);
      if (convoPollRef.current) clearInterval(convoPollRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center text-neutral-600 dark:text-neutral-300">Loading inbox…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 py-8 text-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">Messages</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPane((s) => !s)}
              className="px-3 py-2 rounded-full bg-neutral-800/40 hover:bg-neutral-800/60 text-sm text-neutral-100 transition"
            >
              {showPane ? 'Hide Conversation Pane' : 'Show Conversation Pane'}
            </button>
          </div>
        </div>

        {/* If there are no messages, show a centered prominent inbox card */}
        {messages.length === 0 && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-3xl glass-panel soft-shadow rounded-2xl p-8 theme-dark">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl">I</div>
                <div>
                  <h2 className="text-2xl font-bold">Inbox</h2>
                  <p className="text-sm text-neutral-300">Your inbox looks empty — start a conversation to see it here.</p>
                </div>
              </div>
              <div className="mt-6 text-center text-neutral-400">
                <p className="mb-4">No messages yet</p>
                <div className="inline-flex gap-3">
                  <button className="px-4 py-2 rounded-full bg-primary-600 text-white shadow">Start Conversation</button>
                  <button className="px-4 py-2 rounded-full bg-transparent border border-neutral-700 text-neutral-200">Search Users</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Inbox List */}
          <aside className={showPane ? 'lg:col-span-6' : 'lg:col-span-12'}>
            <div className="flex items-start justify-center">
              <div className="rounded-2xl overflow-hidden glass-panel soft-shadow centered-panel p-4 theme-dark">
                <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Inbox</h2>
                  <button className="text-sm text-neutral-300 hover:text-white transition">New</button>
                </div>
                <div className="divide-y divide-neutral-800 max-h-[48vh] overflow-auto">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400">No messages yet</div>
                ) : (
                  messages.map((m, index) => (
                    <button
                      key={m.id}
                      onClick={() => openConversationWith(m)}
                      style={{ animationDelay: `${index * 60}ms` }}
                      className={`message-item w-full text-left px-4 py-3 flex items-start gap-3 transition transform hover:-translate-y-0.5 hover:scale-[1.01] focus:outline-none ${selected?.id === m.id ? 'bg-gradient-to-r from-primary-700/30 to-primary-500/20 border-l-4 border-primary-500' : 'hover:bg-neutral-900/30'}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl shadow-md">
                          {m.sender_name ? m.sender_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold truncate">{m.sender_name || `User #${m.sender_id}`}</div>
                          <div className="text-xs text-neutral-400 ml-2">{new Date(m.created_at).toLocaleTimeString()}</div>
                        </div>
                        <div className="text-sm text-neutral-300 mt-1 line-clamp-2">{m.content}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 text-xs bg-neutral-800 rounded-full text-neutral-300">Inbox</span>
                          {m.unread && <span className="inline-block px-2 py-0.5 text-xs bg-primary-600 rounded-full text-white">New</span>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Conversation Window (optional) */}
          {showPane && (
            <section className="lg:col-span-6">
              <div className="rounded-2xl glass-panel soft-shadow flex flex-col h-[70vh] overflow-hidden theme-dark">
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg shadow-md">
                      {selected?.sender_name ? selected.sender_name.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div>
                      <div className="font-bold">{selected?.sender_name || 'No Conversation Selected'}</div>
                      <div className="text-xs text-neutral-400">{selected ? 'Active' : 'Select a conversation to view messages'}</div>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400">{selected ? new Date(selected.created_at).toLocaleString() : ''}</div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-t from-transparent to-neutral-900/20">
                  {conversation.length > 0 ? (
                    conversation.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_id === selected?.sender_id ? 'justify-start' : 'justify-end'}`}>
                        {msg.sender_id === selected?.sender_id ? (
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white">{msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : 'U'}</div>
                            <div className="max-w-[70%] bubble bubble-left bg-neutral-800/60 backdrop-blur-md p-3 rounded-2xl soft-shadow text-neutral-100">
                              <div className="text-sm">{msg.content}</div>
                              <div className="text-xs text-neutral-400 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-end gap-3">
                            <div className="max-w-[70%] bubble bubble-right bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-2xl soft-shadow">
                              <div className="text-sm">{msg.content}</div>
                              <div className="text-xs text-white/80 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400">Select a conversation from the left to see messages</div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/40">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={selected ? `Message ${selected.sender_name || 'user'}...` : 'Select a conversation to reply...'}
                      className="flex-1 bg-neutral-800/50 placeholder-neutral-400 text-neutral-100 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
                      disabled={!selected}
                    />
                    <button onClick={handleSend} className="px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg transition" disabled={!selected || !messageText.trim()}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
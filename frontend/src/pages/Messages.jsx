import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function Messages() {
  const { userId } = useParams();
  const { state } = useLocation();
  const name = state?.name || 'User';
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversation = async () => {
    try {
      const res = await api.get(`/social/messages/conversation/${userId}`);
      setConversation(res.data.data || []);
    } catch (e) {
      console.error('Failed to load conversation', e);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const res = await api.get('/social/messages/suggestions', {
        params: { type: 'intro', name },
      });
      setSuggestions(res.data.data || []);
    } catch (e) {
      console.error('Failed to load suggestions', e);
    }
  };

  useEffect(() => {
    loadConversation();
    loadSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const send = async () => {
    if (!input.trim()) return;
    try {
      setSending(true);
      await api.post(`/social/messages/${userId}`, { content: input.trim() });
      setInput('');
      await loadConversation();
    } catch (e) {
      console.error('Failed to send message', e);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center text-neutral-600 dark:text-neutral-300">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="p-6 rounded-xl shadow bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Chat with {name}</h1>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button key={idx} className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm hover:opacity-90" onClick={() => setInput(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="h-80 overflow-y-auto space-y-3 mb-4 p-3 rounded border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-neutral-900/40">
            {conversation.length === 0 ? (
              <div className="text-center text-neutral-500">No messages yet</div>
            ) : (
              conversation.map((m) => (
                <div key={m.id} className={`max-w-[80%] p-2 rounded ${m.isMine ? 'bg-primary-100 dark:bg-primary-900 ml-auto' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                  <div className="text-neutral-900 dark:text-white whitespace-pre-line">{m.content}</div>
                  <div className="text-[10px] text-neutral-500 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 p-2 rounded border bg-white dark:bg-neutral-800 dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
            />
            <button className="btn btn-primary" disabled={sending} onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

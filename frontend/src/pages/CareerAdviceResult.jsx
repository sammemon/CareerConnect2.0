import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./careeradviceResult.css";

const CareerAdviceResult = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  // If the page was opened with a `q` query param we want to create a new session
  const [creatingNewSession, setCreatingNewSession] = useState(Boolean(query));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const lastAutoSentRef = useRef(null);
  const inFlightRef = useRef(new Set());

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated || !user?.id) return;
      try {
        const res = await api.get(`/chat-history?user_id=${user.id}`);
        if (res.data?.history) {
          const grouped = {};
          res.data.history.forEach(r => {
            const sid = r.session_id || r.id;
            if (!grouped[sid]) grouped[sid] = r;
          });
          const mapped = Object.values(grouped).map(r => ({
            id: r.session_id || r.id,
            query: r.query,
            response: r.response,
            created_at: r.created_at || r.timestamp
          }));
          setSessions(mapped);

          if (mapped.length > 0 && !selectedSessionId && !creatingNewSession) {
            const first = mapped[0];
            setSelectedSessionId(first.id);
            setSessionId(first.id);
            setMessages([
              { id: `${first.id}_u`, user: true, text: renderTextToHtml(first.query) },
              { id: `${first.id}_ai`, user: false, text: renderTextToHtml(first.response) }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch history:", err.message || err);
      }
    };
    fetchHistory();
  }, [isAuthenticated, user, creatingNewSession]);

  // Auto-send initial query if page opened with a `q` param
  useEffect(() => {
    const sendInitialQuery = async () => {
      const initialQuery = (location.state && location.state.query) || query;
      if (initialQuery && messages.length === 0) {
        // avoid sending the same auto-query twice (guard against double navigation/mount)
        if (lastAutoSentRef.current === initialQuery) return;
        // Ensure this is treated as a new chat (do not reuse existing selected session)
        setSelectedSessionId(null);
        setSessionId(null);
        setMessages([]);
        setCreatingNewSession(true);
        try {
          const result = await sendMessageText(initialQuery, null, { forceNewSession: true });
          const sid = result?.session_id || null;
          if (sid) {
            setSelectedSessionId(sid);
            setSessionId(sid);
          }
          // mark as sent to avoid duplicate auto-send
          lastAutoSentRef.current = initialQuery;
        } finally {
          setCreatingNewSession(false);
        }
      }
    };
    sendInitialQuery();
  }, [query, location.state]);

  useEffect(scrollToBottom, [messages]);

  // small helper to escape HTML
  const escapeHtml = (unsafe) => {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // convert basic markdown/code to HTML (safe-ish): triple-backticks -> pre, inline ` -> code, ** -> strong, _ -> em
  const renderTextToHtml = (raw) => {
    if (!raw) return '';
    // escape first
    let out = escapeHtml(raw);
    // code blocks ``` ```
    out = out.replace(/```([\s\S]*?)```/g, (m, p1) => {
      return `<pre><code>${escapeHtml(p1)}</code></pre>`;
    });
    // inline code `code`
    out = out.replace(/`([^`]+)`/g, (m, p1) => `<code>${escapeHtml(p1)}</code>`);
    // bold **text**
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // italics _text_
    out = out.replace(/_(.*?)_/g, '<em>$1</em>');
    // newlines to <br>
    out = out.replace(/\n/g, '<br/>');
    return out;
  };

  // Send message
  // options: { forceNewSession: boolean }
  const sendMessageText = async (text, oldMsgId = null, options = {}) => {
    const trimmed = text.trim();
    if (!trimmed) return;

  // store user message as safe HTML, but avoid duplicating identical recent user message
  const userMessage = { id: Date.now() + "_u", user: true, text: renderTextToHtml(trimmed), originalQuery: trimmed };
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.user && last.originalQuery === trimmed) {
        // already have the same user message recently
        return prev;
      }
      return [...prev, userMessage];
    });
    setInput("");
    setLoading(true);

    try {
      const payload = { message: trimmed };
      if (isAuthenticated && user?.id) payload.user_id = user.id;
  // When caller requests a forced new session, do not include any session_id even if one exists locally.
  if (!options.forceNewSession && sessionId) payload.session_id = sessionId;

      // deduplicate in-flight identical requests (message + session/new marker + user)
      const keyObj = { message: trimmed, session: options.forceNewSession ? 'NEW' : (sessionId || null), user_id: user?.id };
      const inFlightKey = JSON.stringify(keyObj);
      if (inFlightRef.current.has(inFlightKey)) {
        // duplicate in-flight request detected; do not send again
        return null;
      }
      inFlightRef.current.add(inFlightKey);

  const res = await api.post("/gemini-chat", payload);
  let aiRaw = res.data?.reply || "⚠️ No response generated by Gemini. Please try again.";
  const aiText = renderTextToHtml(aiRaw);

  const aiMessage = { id: Date.now() + "_ai", user: false, text: aiText, originalQuery: trimmed };
      setMessages(prev => {
        if (oldMsgId) {
          // replace the old failed message
          return prev.map(msg => (msg.id === oldMsgId ? aiMessage : msg));
        }
        return [...prev, aiMessage];
      });

      if (res.data?.session_id) setSessionId(res.data.session_id);

      await fetchHistoryAfterSend();
      // return server payload so callers (like auto-send) can read session_id
      return res.data || null;
    } catch (err) {
      console.error("Gemini chat error:", err.message || err);
      setMessages(prev => [...prev, { id: Date.now() + "_err", user: false, text: renderTextToHtml("⚠️ Something went wrong. Please try again."), originalQuery: trimmed }]);
      return null;
    } finally {
      // remove in-flight key
      try { inFlightRef.current.delete(inFlightKey); } catch (e) {}
      setLoading(false);
      scrollToBottom();
    }
  };

  const fetchHistoryAfterSend = async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const res = await api.get(`/chat-history?user_id=${user.id}`);
      if (res.data?.history) {
        const grouped = {};
        res.data.history.forEach(r => {
          const sid = r.session_id || r.id;
          if (!grouped[sid]) grouped[sid] = r;
        });
        const mapped = Object.values(grouped).map(r => ({
          id: r.session_id || r.id,
          query: r.query,
          response: r.response,
          created_at: r.created_at || r.timestamp
        }));
        setSessions(mapped);
      }
    } catch (err) {
      console.error("Failed to refresh history:", err.message || err);
    }
  };

  const handleSend = () => sendMessageText(input);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSend(); };

  // Delete session
  const handleDeleteSession = async (s) => {
    try {
      await api.delete("/chat-session", { data: { session_id: s.id, user_id: user?.id } });
      setSessions(prev => prev.filter(x => x.id !== s.id));
      if (selectedSessionId === s.id) {
        setSelectedSessionId(null);
        setSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete session:", err.message || err);
    }
  };

  const handleRenameSession = async (s) => {
    const newName = prompt("Enter new session name:", s.query);
    if (!newName || newName.trim() === "") return;
    try {
      await api.put("/chat-session", { session_id: s.id, user_id: user?.id, new_name: newName });
      setSessions(prev => prev.map(x => x.id === s.id ? { ...x, query: newName } : x));
    } catch (err) {
      console.error("Failed to rename session:", err.message || err);
    }
  };

  const handleShareSession = (s) => {
    navigator.clipboard.writeText(`Check out my AI session: "${s.query}"`).then(() => alert("Session copied to clipboard!"));
  };

  const handleRetryMessage = (msg) => {
    sendMessageText(msg.originalQuery, msg.id);
  };

  return (
    <div className="career-result-page flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
  <aside className={`sidebar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${sidebarOpen ? "w-80 mobile-open" : "w-0 mobile-closed"}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">AI</div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">CareerConnect Assistant</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Model: Gemini</div>
          </div>
          <button className="sidebar-toggle" onClick={() => { setMessages([]); setSessionId(null); setSelectedSessionId(null); setSidebarOpen(true); }}>+</button>
        </div>

        <div className="history p-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {sessions.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No chats yet. Start a new conversation.</div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="form-checkbox" checked={selectedIds.length === sessions.length} onChange={() => {
                    if (selectedIds.length === sessions.length) setSelectedIds([]);
                    else setSelectedIds(sessions.map(s => s.id));
                  }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Select all</span>
                </label>
                <button disabled={selectedIds.length === 0} onClick={async () => {
                  if (selectedIds.length === 0) return;
                  try {
                    await api.delete('/chat-session', { data: { session_id: selectedIds, user_id: user?.id } });
                    setSessions(prev => prev.filter(s => !selectedIds.includes(s.id)));
                    if (selectedIds.includes(selectedSessionId)) {
                      setSelectedSessionId(null);
                      setSessionId(null);
                      setMessages([]);
                    }
                    setSelectedIds([]);
                  } catch (e) {
                    console.error('Failed to delete selected sessions', e?.message || e);
                  }
                }} className={`px-2 py-1 rounded text-sm ${selectedIds.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-red-500 text-white'}`}>Delete selected</button>
              </div>

              {sessions.map(s => (
                <div key={s.id} className={`mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm cursor-pointer hover:shadow-md ${selectedSessionId === s.id ? 'ring-2 ring-purple-300' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0" onClick={() => {
                      setSelectedSessionId(s.id);
                      setSessionId(s.id);
                      setMessages([
                        { id: `${s.id}_u`, user: true, text: renderTextToHtml(s.query) },
                        { id: `${s.id}_ai`, user: false, text: renderTextToHtml(s.response) }
                      ]);
                    }}>
                      <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={(e) => {
                        e.stopPropagation();
                        if (selectedIds.includes(s.id)) setSelectedIds(prev => prev.filter(x => x !== s.id));
                        else setSelectedIds(prev => [...prev, s.id]);
                      }} onClick={(e) => e.stopPropagation()} />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate" title={s.query} aria-label={s.query}>{s.query}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(s.created_at).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Dropdown menu */}
                    <div className="relative ml-2">
                      <button onClick={(e) => { e.stopPropagation(); setDropdownOpenId(dropdownOpenId === s.id ? null : s.id); }} className="px-2 py-1 text-gray-500 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700">⋮</button>
                      {dropdownOpenId === s.id && (
                        <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                          <button onClick={() => handleShareSession(s)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Share</button>
                          <button onClick={() => handleRenameSession(s)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Rename</button>
                          <button onClick={() => handleDeleteSession(s)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-500">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </aside>
  {/* mobile overlay when sidebar is open */}
  <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">G</div>
            <div>
              <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Career Advice Assistant</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Instant career guidance powered by Gemini</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-md">Settings</button>
            <button className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md" onClick={() => { setMessages([]); setInput(''); setSessionId(null); setSelectedSessionId(null); }}>New Chat</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.user ? "justify-end" : "justify-start"} relative`}>
              <div className={`max-w-xl p-4 rounded-xl shadow-lg break-words transition-colors duration-300 ${msg.user ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
              {/* Retry button for failed AI response */}
              {!msg.user && msg.text.includes("⚠️ No response generated") && (
                <button onClick={() => handleRetryMessage(msg)} className="absolute -bottom-5 right-0 text-xs text-blue-500 hover:underline">Retry</button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="typing-dots"><span></span><span></span><span></span></div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your question..." className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400" />
          <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition duration-200" onClick={handleSend} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default CareerAdviceResult;

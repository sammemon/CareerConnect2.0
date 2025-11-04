import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPopup from "../components/LoginPopup";
import "./careeradvice.css";

const CareerAdvice = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const submit = () => {
    const trimmed = (query || "").trim();
    if (!trimmed) return;

    // 🔒 Require login
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

  // ✅ Redirect to result page with query param so result page can auto-send
  navigate(`/career-advice/result?q=${encodeURIComponent(trimmed)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="career-page min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 transition-colors duration-300">
      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}

      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="career-hero relative rounded-3xl p-10 text-center overflow-visible bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="hero-panel mx-auto">
              <div className="hero-content relative">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                  Ask CareerConnect AI: Your AI Career Advisor
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Get tailored career advice, interview help, and job search tips from CareerConnect's assistant.
                </p>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Ask me about career advice, interview tips..."
                    className="w-full max-w-3xl px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none shadow-sm focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={submit}
                    className="ask-btn px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition duration-200"
                  >
                    Ask Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="resource-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Browse Articles</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Gain insights on resumes, interviews and career planning.
              </p>
            </div>
            <div className="resource-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Watch Webinars</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Recorded sessions with hiring experts.
              </p>
            </div>
            <div className="resource-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Career Programs</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Upskilling and mentorship programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAdvice;

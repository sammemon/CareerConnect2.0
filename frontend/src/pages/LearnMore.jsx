import React from "react";
import './learnmore.css';

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section (heading removed to match provided UI) */}

        {/* Cards Row inside hero band */}
        <div className="hero-band mb-16">
          <div className="hero-inner max-w-6xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
            {/* Job Seekers */}
            <div className="card-hero has-outline relative overflow-visible p-8 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg shadow-slate-200/60 dark:shadow-black/30 hover:shadow-xl hover:-translate-y-1 transition-all">
              {/* SVG border (rect) for crisp animated stroke on hero card */}
              <svg className="card-border" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <linearGradient id="cardGradA" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
                <rect x="1" y="1" rx="10" ry="10" width="98" height="98" fill="none" stroke="url(#cardGradA)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="card-content">
              <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-inner">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 7v10M7 12h10"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  For Job Seekers
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Explore personalized job matches, create stunning profiles,
                  and apply directly to companies that value your skills.
                </p>
              </div>
            </div>
          </div>
          </div>

          {/* Employers */}
          <div className="card-hero has-outline relative overflow-visible p-8 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg shadow-slate-200/60 dark:shadow-black/30 hover:shadow-xl hover:-translate-y-1 transition-all">
            {/* SVG border (rect) for crisp animated stroke on hero card */}
            <svg className="card-border" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="cardGradB" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <rect x="1" y="1" rx="10" ry="10" width="98" height="98" fill="none" stroke="url(#cardGradB)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="card-content">
            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-xl shadow-inner">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  For Employers
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Post openings, browse pre-vetted candidates, and leverage our
                  intelligent matching system to build your dream team.
                </p>
              </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
  <div className="success-card relative overflow-visible bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl p-8 md:p-12 shadow-md shadow-slate-200/50 dark:shadow-black/40">
          {/* SVG border (rect) for crisp rectangular animated stroke */}
          <svg className="success-border" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="succGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" rx="10" ry="10" width="98" height="98" fill="none" stroke="url(#succGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* animated subtle border/glow for success card */}
          <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 to-blue-400 blur-2xl opacity-30"></div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 blur-2xl opacity-30"></div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Success Stories
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
            Thousands of professionals have landed their dream roles through
            CareerConnect’s smart AI matching system. Here’s what some of them
            have to say:
          </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-2xl shadow-md shadow-blue-400/50">
                  A
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white text-lg">Alex Johnson</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Product Designer</div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300 italic">“CareerConnect streamlined my job search. Within two weeks, I found a position perfectly aligned with my experience and goals.”</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold text-2xl shadow-md shadow-pink-300/40">
                  M
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white text-lg">Maya Patel</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Frontend Engineer</div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300 italic">“Thanks to CareerConnect I connected with hiring teams that valued my portfolio — landed a role in under a month.”</p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-[1.03] transition-transform">Join the CareerConnect Community</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col">
      {/* Hero Section */}
  <section className="home-hero relative w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-10 md:py-16 lg:py-20 overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 -z-0">
          <img
            src="/careerconnect2.jpg"
            alt="CareerConnect Hero"
            className="w-full h-[90vh] object-cover object-center brightness-95 contrast-105 shadow-[inset_0_-60px_120px_rgba(0,0,0,0.45)]"
          />
          {/* Overlay for readability and theme balance */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent dark:from-black/70 dark:via-black/50 dark:to-transparent"></div>
        </div>

        {/* Left Content */}
        <div className="z-10 max-w-xl text-center md:text-left mt-10 md:mt-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Connect with Opportunity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              Your Future Starts Here
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-100 dark:text-neutral-300 mb-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Explore thousands of jobs, build teams, and manage your career with ease.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center md:justify-start">
            {!user ? (
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-xl
                  overflow-hidden transition-all duration-500 bg-black group shadow-md shadow-black/40"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
                  animate-gradient-move rounded-xl opacity-80"></span>
                <span className="absolute inset-[2px] bg-black rounded-xl"></span>
                <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all">
                  Get Started
                </span>
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-xl
                  overflow-hidden transition-all duration-500 bg-black group shadow-md shadow-black/40"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 
                  animate-gradient-move rounded-xl opacity-80"></span>
                <span className="absolute inset-[2px] bg-black rounded-xl"></span>
                <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-green-300 via-cyan-300 to-blue-300 transition-all">
                  Go to Dashboard
                </span>
              </Link>
            )}

            <Link
              to="/learn-more"
              className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-xl
                overflow-hidden transition-all duration-500 bg-black group shadow-md shadow-black/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                animate-gradient-move rounded-xl opacity-80"></span>
              <span className="absolute inset-[2px] bg-black rounded-xl"></span>
              <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all">
                Learn More
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

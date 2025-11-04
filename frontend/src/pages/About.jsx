import React from 'react';

const About = () => {
  return (
  <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-6">About Us</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              Welcome to <span className="font-semibold text-primary-600 dark:text-primary-400">CareerConnect</span> — where opportunity meets potential.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              CareerConnect is an internship and job portal designed to support fresh graduates, students, and inexperienced individuals looking for their first professional break. We understand that starting a career can be challenging when most jobs demand prior experience — that’s why we created a platform that connects ambitious freshers with startups and small businesses seeking dedicated and affordable talent.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              Our goal is simple: to empower freshers and enable employers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">For Job Seekers</h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              We provide a platform to gain hands-on experience, develop professional skills, and build career confidence through internships and entry-level opportunities.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6">For Employers</h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              We help startups and small enterprises find motivated individuals who can contribute to their business growth at reasonable rates.
            </p>

            <p className="text-neutral-700 dark:text-neutral-300 mt-6">
              CareerConnect believes that everyone deserves a chance to grow, and that every business deserves access to passionate talent. By connecting freshers with startups, we’re creating a collaborative ecosystem that promotes learning, inclusivity, and progress.
            </p>

            <p className="text-neutral-800 dark:text-neutral-200 font-medium mt-6">
              Join us in shaping the future of work — one connection at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

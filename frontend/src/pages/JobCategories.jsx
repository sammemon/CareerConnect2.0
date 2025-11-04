import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUserGraduate } from 'react-icons/fa';

const MAIN_OPTIONS = [
  { 
    id: 'jobs', 
    name: 'Jobs', 
    icon: FaBriefcase, 
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    description: 'Browse full-time, part-time, and contract positions',
    link: '/jobs-categories'
  },
  { 
    id: 'internships', 
    name: 'Internships', 
    icon: FaUserGraduate, 
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    description: 'Explore internship opportunities across various fields',
    link: '/internships-categories'
  },
];

const JobCategories = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-primary-400 via-primary-600 to-accent-400 bg-clip-text text-transparent dark:text-primary-200">
          What are you looking for?
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-10 text-lg">
          Choose between jobs or internships to explore opportunities
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {MAIN_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <Link
                key={option.id}
                to={option.link}
                className={`group block p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-white hover:scale-103 focus:scale-103 focus:outline-none ${option.color}`}
              >
                <div className="flex flex-col items-center gap-4 text-center min-h-[180px] md:min-h-[200px] justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Icon className="text-4xl md:text-5xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-2xl md:text-3xl mb-2 leading-tight break-words">{option.name}</h3>
                    <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-[28rem] mx-auto">{option.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobCategories;

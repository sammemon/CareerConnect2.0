import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaHospital, FaChartLine, FaBullhorn, FaDatabase, FaBriefcase } from 'react-icons/fa';

const INTERNSHIP_CATEGORIES = [
  { 
    id: 'it-software', 
    name: 'IT & Software', 
    icon: FaLaptopCode, 
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    description: 'Tech internships in software development, AI, data science, and more'
  },
  { 
    id: 'medical', 
    name: 'Medical & Healthcare', 
    icon: FaHospital, 
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    description: 'Medical and healthcare internships'
  },
  { 
    id: 'banking-management', 
    name: 'Banking & Management', 
    icon: FaChartLine, 
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    description: 'Banking, finance, and management internships'
  },
  { 
    id: 'marketing-sales', 
    name: 'Marketing & Sales', 
    icon: FaBullhorn, 
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    description: 'Marketing, sales, and business development internships'
  },
  { 
    id: 'database-devops', 
    name: 'Database & DevOps', 
    icon: FaDatabase, 
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    description: 'Database, DevOps, and infrastructure internships'
  },
  { 
    id: 'all', 
    name: 'All Fields', 
    icon: FaBriefcase, 
    color: 'bg-gradient-to-br from-gray-500 to-gray-600',
    description: 'Browse all available internship opportunities'
  },
];

const InternshipsMainCategories = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-primary-400 via-primary-600 to-accent-400 bg-clip-text text-transparent dark:text-primary-200">
          Internship Categories
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-10 text-lg">
          Select a category to explore specialized internship opportunities
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {INTERNSHIP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.id === 'all' ? '/jobs?type=Internship' : `/internships-categories/${cat.id}`}
                className={`group block p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-white hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-400 ${cat.color}`}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Icon className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{cat.name}</h3>
                    <p className="text-sm text-white/90">{cat.description}</p>
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

export default InternshipsMainCategories;

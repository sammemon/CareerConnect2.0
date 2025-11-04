import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCode, FaPalette, FaServer, FaLaptopCode, FaMobileAlt, FaRobot, FaChartBar, FaGamepad, FaPencilAlt } from 'react-icons/fa';

const INTERNSHIP_SUBCATEGORIES = {
  'it-software': [
    { id: 'web-development', name: 'Web Development', icon: FaCode, color: 'from-blue-400 to-blue-600' },
    { id: 'frontend', name: 'Frontend Developer', icon: FaPalette, color: 'from-purple-400 to-purple-600' },
    { id: 'backend', name: 'Backend Developer', icon: FaServer, color: 'from-green-400 to-green-600' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: FaLaptopCode, color: 'from-indigo-400 to-indigo-600' },
    { id: 'mobile', name: 'Mobile Development', icon: FaMobileAlt, color: 'from-pink-400 to-pink-600' },
    { id: 'ai-ml', name: 'AI & Machine Learning', icon: FaRobot, color: 'from-cyan-400 to-cyan-600' },
    { id: 'data-science', name: 'Data Science', icon: FaChartBar, color: 'from-orange-400 to-orange-600' },
    { id: 'graphic-design', name: 'Graphic Design', icon: FaPencilAlt, color: 'from-pink-400 to-pink-600' },
    { id: 'ui-ux', name: 'UI/UX Design', icon: FaPalette, color: 'from-purple-400 to-purple-600' },
    { id: 'game-development', name: 'Game Development', icon: FaGamepad, color: 'from-red-400 to-red-600' },
  ],
  'medical': [
    { id: 'mbbs', name: 'MBBS Internship', icon: FaCode, color: 'from-red-400 to-red-600' },
    { id: 'bds', name: 'BDS Internship', icon: FaPalette, color: 'from-pink-400 to-pink-600' },
    { id: 'pharmacy', name: 'Pharmacy', icon: FaServer, color: 'from-green-400 to-green-600' },
    { id: 'nursing', name: 'Nursing', icon: FaLaptopCode, color: 'from-blue-400 to-blue-600' },
    { id: 'medical-lab', name: 'Medical Lab Technology', icon: FaMobileAlt, color: 'from-purple-400 to-purple-600' },
    { id: 'physiotherapy', name: 'Physiotherapy', icon: FaRobot, color: 'from-teal-400 to-teal-600' },
  ],
  'banking-management': [
    { id: 'banking', name: 'Banking', icon: FaCode, color: 'from-green-400 to-green-600' },
    { id: 'finance', name: 'Finance', icon: FaPalette, color: 'from-emerald-400 to-emerald-600' },
    { id: 'management', name: 'Management', icon: FaServer, color: 'from-indigo-400 to-indigo-600' },
    { id: 'hr', name: 'Human Resources', icon: FaLaptopCode, color: 'from-blue-400 to-blue-600' },
    { id: 'accounting', name: 'Accounting', icon: FaMobileAlt, color: 'from-yellow-400 to-yellow-600' },
  ],
  'marketing-sales': [
    { id: 'digital-marketing', name: 'Digital Marketing', icon: FaCode, color: 'from-orange-400 to-orange-600' },
    { id: 'sales', name: 'Sales', icon: FaPalette, color: 'from-red-400 to-red-600' },
    { id: 'content-writing', name: 'Content Writing', icon: FaServer, color: 'from-purple-400 to-purple-600' },
    { id: 'seo', name: 'SEO Specialist', icon: FaLaptopCode, color: 'from-green-400 to-green-600' },
    { id: 'social-media', name: 'Social Media Marketing', icon: FaMobileAlt, color: 'from-pink-400 to-pink-600' },
  ],
  'database-devops': [
    { id: 'database-admin', name: 'Database Administrator', icon: FaCode, color: 'from-purple-400 to-purple-600' },
    { id: 'devops', name: 'DevOps Engineer', icon: FaPalette, color: 'from-blue-400 to-blue-600' },
    { id: 'cloud', name: 'Cloud Engineer', icon: FaServer, color: 'from-cyan-400 to-cyan-600' },
    { id: 'system-admin', name: 'System Administrator', icon: FaLaptopCode, color: 'from-green-400 to-green-600' },
  ],
};

const CATEGORY_NAMES = {
  'it-software': 'IT & Software',
  'medical': 'Medical & Healthcare',
  'banking-management': 'Banking & Management',
  'marketing-sales': 'Marketing & Sales',
  'database-devops': 'Database & DevOps',
};

const InternshipsSubCategories = () => {
  const { mainCategory } = useParams();
  const subcategories = INTERNSHIP_SUBCATEGORIES[mainCategory] || [];
  const categoryName = CATEGORY_NAMES[mainCategory] || mainCategory;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/internships-categories"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 font-semibold"
        >
          <FaArrowLeft /> Back to Categories
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-primary-400 via-primary-600 to-accent-400 bg-clip-text text-transparent dark:text-primary-200">
          {categoryName} Internships
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-10 text-lg">
          Select a specialization to view internship opportunities
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {subcategories.map((sub) => {
            const Icon = sub.icon;
            return (
              <Link
                key={sub.id}
                to={`/jobs/category/${sub.id}?type=Internship`}
                className={`group block p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 text-white hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gradient-to-br ${sub.color}`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <Icon className="text-3xl mb-2" />
                  <span className="font-bold text-sm">{sub.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InternshipsSubCategories;

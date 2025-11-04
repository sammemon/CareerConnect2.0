-- CareerConnect Database Schema
-- Job Recruitment & Internship Portal

CREATE DATABASE IF NOT EXISTS careerconnect2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE careerconnect2;

-- Users Table (Job Seekers, Employers, Admins)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('seeker', 'employer', 'admin') DEFAULT 'seeker',
  profile_info TEXT,
  phone VARCHAR(20),
  location VARCHAR(100),
  skills TEXT,
  experience TEXT,
  education TEXT,
  resume VARCHAR(255),
  profile_picture VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Companies Table
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  website VARCHAR(100),
  logo VARCHAR(255),
  location VARCHAR(100),
  company_size VARCHAR(50),
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_employer (employer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs Table
CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT NOT NULL,
  company_id INT,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  requirements TEXT,
  responsibilities TEXT,
  skills VARCHAR(255),
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  salary VARCHAR(100),
  location VARCHAR(100),
  type ENUM('Full-time', 'Part-time', 'Internship', 'Remote', 'Contract') DEFAULT 'Full-time',
  experience_level ENUM('Entry Level', 'Mid Level', 'Senior Level', 'Internship') DEFAULT 'Entry Level',
  status ENUM('Active', 'Closed', 'Pending') DEFAULT 'Pending',
  vacancies INT DEFAULT 1,
  application_deadline DATE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
  INDEX idx_employer (employer_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  FULLTEXT idx_search (title, description, skills)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Applications Table
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  seeker_id INT NOT NULL,
  resume VARCHAR(255),
  cover_letter TEXT,
  status ENUM('Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected') DEFAULT 'Pending',
  notes TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (job_id, seeker_id),
  INDEX idx_job (job_id),
  INDEX idx_seeker (seeker_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('application', 'job', 'system') DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved Jobs Table
CREATE TABLE saved_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seeker_id INT NOT NULL,
  job_id INT NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_saved_job (seeker_id, job_id),
  INDEX idx_seeker (seeker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Inquiries Table
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS career_chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  query TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id)
);


-- Insert Default Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@careerconnect.com', '$2a$10$X8xhFVQz5zKj3HkQfJZ0H.VwKqV8GhLz8jKU2zDpX7xqYqE5hXxY2', 'admin');

-- Insert Sample Employer (password: employer123)
INSERT INTO users (name, email, password, role, phone, location) VALUES 
('Tech Corp HR', 'employer@techcorp.com', '$2a$10$X8xhFVQz5zKj3HkQfJZ0H.VwKqV8GhLz8jKU2zDpX7xqYqE5hXxY2', 'employer', '+1234567890', 'San Francisco, CA');

-- Insert Sample Job Seeker (password: seeker123)
INSERT INTO users (name, email, password, role, phone, location, skills) VALUES 
('John Doe', 'seeker@example.com', '$2a$10$X8xhFVQz5zKj3HkQfJZ0H.VwKqV8GhLz8jKU2zDpX7xqYqE5hXxY2', 'seeker', '+9876543210', 'New York, NY', 'JavaScript, React, Node.js');

-- Insert Sample Company
INSERT INTO companies (employer_id, name, description, industry, website, location, company_size) VALUES 
(2, 'Tech Corp', 'Leading technology company specializing in software solutions', 'Technology', 'https://techcorp.com', 'San Francisco, CA', '500-1000');

-- Insert Sample Jobs
INSERT INTO jobs (employer_id, company_id, title, description, requirements, skills, salary, location, type, experience_level, status, vacancies, application_deadline) VALUES 
(2, 1, 'Senior Full Stack Developer', 'We are looking for an experienced full stack developer to join our team.', 'Bachelor degree in Computer Science, 5+ years experience', 'JavaScript, React, Node.js, MySQL', '$100,000 - $130,000', 'San Francisco, CA', 'Full-time', 'Senior Level', 'Active', 2, '2025-12-31'),
(2, 1, 'Frontend Developer Intern', 'Exciting internship opportunity for frontend developers.', 'Currently pursuing degree in Computer Science', 'HTML, CSS, JavaScript, React', '$20/hour', 'Remote', 'Internship', 'Internship', 'Active', 3, '2025-11-30'),
(2, 1, 'DevOps Engineer', 'Join our DevOps team to manage cloud infrastructure.', 'Experience with AWS, Docker, Kubernetes', 'AWS, Docker, Kubernetes, CI/CD', '$90,000 - $120,000', 'San Francisco, CA', 'Full-time', 'Mid Level', 'Active', 1, '2025-12-15');

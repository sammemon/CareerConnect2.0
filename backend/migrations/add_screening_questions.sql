-- Migration: Add Screening Questions Feature
-- Description: Creates a table to store custom screening questions for job postings
-- Date: 2025-10-21

-- Create screening_questions table
CREATE TABLE IF NOT EXISTS screening_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  question TEXT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  INDEX idx_job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create screening_answers table to store job seeker responses
CREATE TABLE IF NOT EXISTS screening_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  question_id INT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES screening_questions(id) ON DELETE CASCADE,
  INDEX idx_application_id (application_id),
  INDEX idx_question_id (question_id),
  UNIQUE KEY unique_answer (application_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

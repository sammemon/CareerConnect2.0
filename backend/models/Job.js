const { promisePool } = require('../config/db');

class Job {
  // Create new job
  static async create(jobData) {
    const {
      employer_id,
      company_id,
      title,
      description,
      requirements,
      responsibilities,
      skills,
      salary,
      location,
      type,
      experience_level,
      vacancies,
      application_deadline,
      status,
      screening_questions
    } = jobData;

    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert the job
      const query = `
        INSERT INTO jobs (
          employer_id, company_id, title, description, requirements, 
          responsibilities, skills, salary, location, type, experience_level, 
          vacancies, application_deadline, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.query(query, [
        employer_id,
        company_id,
        title,
        description,
        requirements,
        responsibilities,
        skills,
        salary,
        location,
        type,
        experience_level,
        vacancies,
        application_deadline,
        status || 'Pending'
      ]);

      const jobId = result.insertId;

      // Insert screening questions if provided
      if (screening_questions && Array.isArray(screening_questions) && screening_questions.length > 0) {
        const questionQuery = `
          INSERT INTO screening_questions (job_id, question, is_required)
          VALUES (?, ?, ?)
        `;
        
        for (const q of screening_questions) {
          if (q.question && q.question.trim()) {
            await connection.query(questionQuery, [
              jobId,
              q.question.trim(),
              q.is_required !== undefined ? q.is_required : true
            ]);
          }
        }
      }

      await connection.commit();
      return jobId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all jobs with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        j.*,
        u.name as employer_name,
        c.name as company_name,
        c.logo as company_logo,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count
      FROM jobs j
      LEFT JOIN users u ON j.employer_id = u.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND j.status = ?';
      params.push(filters.status);
    }

    if (filters.type) {
      query += ' AND j.type = ?';
      params.push(filters.type);
    }

    if (filters.location) {
      query += ' AND j.location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.skills) {
      query += ' AND j.skills LIKE ?';
      params.push(`%${filters.skills}%`);
    }

    if (filters.search) {
      query += ' AND (j.title LIKE ? OR j.description LIKE ? OR j.skills LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.employer_id) {
      query += ' AND j.employer_id = ?';
      params.push(filters.employer_id);
    }

    query += ' ORDER BY j.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [jobs] = await promisePool.query(query, params);
    return jobs;
  }

  // Get job by ID
  static async findById(id) {
    const query = `
      SELECT 
        j.*,
        u.name as employer_name,
        u.email as employer_email,
        u.phone as employer_phone,
        c.name as company_name,
        c.description as company_description,
        c.logo as company_logo,
        c.website as company_website,
        c.industry as company_industry,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count
      FROM jobs j
      LEFT JOIN users u ON j.employer_id = u.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
    `;
    const [jobs] = await promisePool.query(query, [id]);
    
    if (jobs[0]) {
      // Fetch screening questions for this job
      const questionsQuery = `
        SELECT id, question, is_required
        FROM screening_questions
        WHERE job_id = ?
        ORDER BY id ASC
      `;
      const [questions] = await promisePool.query(questionsQuery, [id]);
      jobs[0].screening_questions = questions;
    }
    
    return jobs[0];
  }

  // Get screening questions for a job
  static async getScreeningQuestions(jobId) {
    const query = `
      SELECT id, question, is_required
      FROM screening_questions
      WHERE job_id = ?
      ORDER BY id ASC
    `;
    const [questions] = await promisePool.query(query, [jobId]);
    return questions;
  }

  // Update job
  static async update(id, jobData) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'title', 'description', 'requirements', 'responsibilities', 
      'skills', 'salary', 'location', 'type', 'experience_level', 
      'vacancies', 'application_deadline', 'status'
    ];

    Object.keys(jobData).forEach(key => {
      if (allowedFields.includes(key) && jobData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(jobData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    const query = `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await promisePool.query(query, values);
    return result.affectedRows > 0;
  }

  // Delete job
  static async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = ?';
    const [result] = await promisePool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Increment job views
  static async incrementViews(id) {
    const query = 'UPDATE jobs SET views = views + 1 WHERE id = ?';
    await promisePool.query(query, [id]);
  }

  // Get jobs by employer
  static async getByEmployer(employerId) {
    const query = `
      SELECT 
        j.*,
        c.name as company_name,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count,
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id AND status = 'Pending') as pending_applications
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.employer_id = ?
      ORDER BY j.created_at DESC
    `;
    const [jobs] = await promisePool.query(query, [employerId]);
    return jobs;
  }

  // Get job statistics
  static async getStats(employerId = null) {
    let query = `
      SELECT 
        COUNT(*) as total_jobs,
          CAST(SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS UNSIGNED) as active_jobs,
          CAST(SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS UNSIGNED) as closed_jobs,
          CAST(SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS UNSIGNED) as pending_jobs,
          CAST(SUM(CASE WHEN type = 'Full-time' THEN 1 ELSE 0 END) AS UNSIGNED) as fulltime_jobs,
          CAST(SUM(CASE WHEN type = 'Internship' THEN 1 ELSE 0 END) AS UNSIGNED) as internship_jobs
      FROM jobs
    `;

    const params = [];
    if (employerId) {
      query += ' WHERE employer_id = ?';
      params.push(employerId);
    }

    const [stats] = await promisePool.query(query, params);
    return stats[0];
  }

  // Get recommended jobs for a seeker
  static async getRecommendations(seekerId, limit = 10) {
    const query = `
      SELECT 
        j.*,
        u.name as employer_name,
        c.name as company_name,
        c.logo as company_logo
      FROM jobs j
      LEFT JOIN users u ON j.employer_id = u.id
      LEFT JOIN companies c ON j.company_id = c.id
      INNER JOIN users seeker ON seeker.id = ?
      WHERE j.status = 'Active'
        AND j.id NOT IN (SELECT job_id FROM applications WHERE seeker_id = ?)
        AND (
          seeker.skills IS NULL OR
          j.skills LIKE CONCAT('%', SUBSTRING_INDEX(SUBSTRING_INDEX(seeker.skills, ',', 1), ',', -1), '%')
        )
      ORDER BY j.created_at DESC
      LIMIT ?
    `;
    const [jobs] = await promisePool.query(query, [seekerId, seekerId, limit]);
    return jobs;
  }
}

module.exports = Job;

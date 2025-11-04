const { promisePool } = require('../config/db');
const ScreeningAnswer = require('./ScreeningAnswer');

class Application {
  // Create new application
  static async create(applicationData) {
    const { job_id, seeker_id, resume, cover_letter, screening_answers } = applicationData;

    // Check if already applied
    const checkQuery = 'SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?';
    const [existing] = await promisePool.query(checkQuery, [job_id, seeker_id]);

    if (existing.length > 0) {
      throw new Error('You have already applied for this job');
    }

    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Create the application
      const query = `
        INSERT INTO applications (job_id, seeker_id, resume, cover_letter, status) 
        VALUES (?, ?, ?, ?, 'Pending')
      `;
      const [result] = await connection.query(query, [job_id, seeker_id, resume, cover_letter]);
      const applicationId = result.insertId;

      // Save screening answers if provided
      if (screening_answers && Array.isArray(screening_answers) && screening_answers.length > 0) {
        for (const answer of screening_answers) {
          if (answer.question_id && answer.answer) {
            await connection.query(
              'INSERT INTO screening_answers (application_id, question_id, answer) VALUES (?, ?, ?)',
              [applicationId, answer.question_id, answer.answer.trim()]
            );
          }
        }
      }

      await connection.commit();
      return applicationId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all applications with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        a.*,
        j.title as job_title,
        j.location as job_location,
        j.type as job_type,
        u.name as seeker_name,
        u.email as seeker_email,
        u.phone as seeker_phone,
        u.skills as seeker_skills,
        c.name as company_name
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.id
      INNER JOIN users u ON a.seeker_id = u.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.seeker_id) {
      query += ' AND a.seeker_id = ?';
      params.push(filters.seeker_id);
    }

    if (filters.job_id) {
      query += ' AND a.job_id = ?';
      params.push(filters.job_id);
    }

    if (filters.employer_id) {
      query += ' AND j.employer_id = ?';
      params.push(filters.employer_id);
    }

    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY a.applied_at DESC';

    const [applications] = await promisePool.query(query, params);
    return applications;
  }

  // Get application by ID
  static async findById(id) {
    const query = `
      SELECT 
        a.*,
        j.title as job_title,
        j.description as job_description,
        j.location as job_location,
        j.type as job_type,
        j.salary as job_salary,
        u.name as seeker_name,
        u.email as seeker_email,
        u.phone as seeker_phone,
        u.location as seeker_location,
        u.skills as seeker_skills,
        u.experience as seeker_experience,
        u.education as seeker_education,
        c.name as company_name,
        emp.name as employer_name,
        emp.email as employer_email
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.id
      INNER JOIN users u ON a.seeker_id = u.id
      INNER JOIN users emp ON j.employer_id = emp.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE a.id = ?
    `;
    const [applications] = await promisePool.query(query, [id]);
    
    if (applications[0]) {
      // Fetch screening answers for this application
      const answersQuery = `
        SELECT 
          sa.id,
          sa.answer,
          sq.question,
          sq.is_required
        FROM screening_answers sa
        INNER JOIN screening_questions sq ON sa.question_id = sq.id
        WHERE sa.application_id = ?
        ORDER BY sq.id ASC
      `;
      const [answers] = await promisePool.query(answersQuery, [id]);
      applications[0].screening_answers = answers;
    }
    
    return applications[0];
  }

  // Update application status
  static async updateStatus(id, status, notes = null) {
    let query = 'UPDATE applications SET status = ?';
    const params = [status];

    if (notes) {
      query += ', notes = ?';
      params.push(notes);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await promisePool.query(query, params);
    return result.affectedRows > 0;
  }

  // Delete application
  static async delete(id) {
    const query = 'DELETE FROM applications WHERE id = ?';
    const [result] = await promisePool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Get applications for a specific job
  static async getByJob(jobId) {
    const query = `
      SELECT 
        a.*,
        u.name as seeker_name,
        u.email as seeker_email,
        u.phone as seeker_phone,
        u.skills as seeker_skills,
        u.experience as seeker_experience
      FROM applications a
      INNER JOIN users u ON a.seeker_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [applications] = await promisePool.query(query, [jobId]);
    return applications;
  }

  // Get applications by seeker
  static async getBySeeker(seekerId) {
    const query = `
      SELECT 
        a.*,
        j.title as job_title,
        j.location as job_location,
        j.type as job_type,
        j.salary as job_salary,
        c.name as company_name,
        c.logo as company_logo
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE a.seeker_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [applications] = await promisePool.query(query, [seekerId]);
    return applications;
  }

  // Get application statistics
  static async getStats(userId = null, role = null) {
    let query = `
      SELECT 
        COUNT(*) as total_applications,
          CAST(SUM(CASE WHEN a.status = 'Pending' THEN 1 ELSE 0 END) AS UNSIGNED) as pending,
          CAST(SUM(CASE WHEN a.status = 'Reviewed' THEN 1 ELSE 0 END) AS UNSIGNED) as reviewed,
          CAST(SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) AS UNSIGNED) as shortlisted,
          CAST(SUM(CASE WHEN a.status = 'Accepted' THEN 1 ELSE 0 END) AS UNSIGNED) as accepted,
          CAST(SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) AS UNSIGNED) as rejected
      FROM applications a
    `;

    const params = [];

    if (userId && role === 'seeker') {
      query += ' WHERE a.seeker_id = ?';
      params.push(userId);
    } else if (userId && role === 'employer') {
      query += ' INNER JOIN jobs j ON a.job_id = j.id WHERE j.employer_id = ?';
      params.push(userId);
    }

    const [stats] = await promisePool.query(query, params);
    return stats[0];
  }

  // Check if user has applied for a job
  static async hasApplied(seekerId, jobId) {
    const query = 'SELECT id FROM applications WHERE seeker_id = ? AND job_id = ?';
    const [result] = await promisePool.query(query, [seekerId, jobId]);
    return result.length > 0;
  }

  // Get applications by seeker with full details
  static async getBySeekerIdWithDetails(seekerId) {
    const query = `
      SELECT 
        a.id,
        a.job_id,
        a.status,
        a.applied_at,
        a.cover_letter,
        a.resume,
        j.title as job_title,
        j.location as job_location,
        j.type as job_type,
        j.salary as job_salary,
        j.status as job_status,
        c.name as company_name,
        c.logo as company_logo
      FROM applications a
      INNER JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE a.seeker_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [applications] = await promisePool.query(query, [seekerId]);
    return applications;
  }
}

module.exports = Application;

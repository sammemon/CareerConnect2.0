const { promisePool } = require('../config/db');

class ScreeningAnswer {
  // Save screening answers for an application
  static async saveAnswers(applicationId, answers) {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return true; // No answers to save
    }

    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      const query = `
        INSERT INTO screening_answers (application_id, question_id, answer)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE answer = VALUES(answer)
      `;

      for (const answer of answers) {
        if (answer.question_id && answer.answer) {
          await connection.query(query, [
            applicationId,
            answer.question_id,
            answer.answer.trim()
          ]);
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get screening answers for an application
  static async getByApplication(applicationId) {
    const query = `
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
    
    const [answers] = await promisePool.query(query, [applicationId]);
    return answers;
  }

  // Get all answers for a job's applications
  static async getByJob(jobId) {
    const query = `
      SELECT 
        sa.id,
        sa.application_id,
        sa.answer,
        sq.question,
        sq.is_required,
        a.seeker_id,
        u.name as applicant_name
      FROM screening_answers sa
      INNER JOIN screening_questions sq ON sa.question_id = sq.id
      INNER JOIN applications a ON sa.application_id = a.id
      INNER JOIN users u ON a.seeker_id = u.id
      WHERE sq.job_id = ?
      ORDER BY a.applied_at DESC, sq.id ASC
    `;
    
    const [answers] = await promisePool.query(query, [jobId]);
    return answers;
  }

  // Delete answers for an application
  static async deleteByApplication(applicationId) {
    const query = 'DELETE FROM screening_answers WHERE application_id = ?';
    const [result] = await promisePool.query(query, [applicationId]);
    return result.affectedRows > 0;
  }
}

module.exports = ScreeningAnswer;

const { promisePool } = require('../config/db');

class Company {
  // Create new company
  static async create(companyData) {
    const {
      employer_id,
      name,
      description,
      industry,
      website,
      location,
      company_size,
      logo
    } = companyData;

    const query = `
      INSERT INTO companies (
        employer_id, name, description, industry, website, location, company_size, logo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      employer_id,
      name,
      description,
      industry,
      website,
      location,
      company_size,
      logo
    ]);

    return result.insertId;
  }

  // Get all companies
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.name as employer_name,
        u.email as employer_email,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id) as total_jobs,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id AND status = 'Active') as active_jobs
      FROM companies c
      INNER JOIN users u ON c.employer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.employer_id) {
      query += ' AND c.employer_id = ?';
      params.push(filters.employer_id);
    }

    if (filters.industry) {
      query += ' AND c.industry = ?';
      params.push(filters.industry);
    }

    if (filters.search) {
      query += ' AND (c.name LIKE ? OR c.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY c.created_at DESC';

    const [companies] = await promisePool.query(query, params);
    return companies;
  }

  // Get company by ID
  static async findById(id) {
    const query = `
      SELECT 
        c.*,
        u.name as employer_name,
        u.email as employer_email,
        u.phone as employer_phone,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id) as total_jobs,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id AND status = 'Active') as active_jobs
      FROM companies c
      INNER JOIN users u ON c.employer_id = u.id
      WHERE c.id = ?
    `;
    const [companies] = await promisePool.query(query, [id]);
    return companies[0];
  }

  // Get company by employer ID
  static async findByEmployer(employerId) {
    const query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id) as total_jobs,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id AND status = 'Active') as active_jobs
      FROM companies c
      WHERE c.employer_id = ?
    `;
    const [companies] = await promisePool.query(query, [employerId]);
    return companies;
  }

  // Update company
  static async update(id, companyData) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'name', 'description', 'industry', 'website', 
      'location', 'company_size', 'logo', 'rating'
    ];

    Object.keys(companyData).forEach(key => {
      if (allowedFields.includes(key) && companyData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(companyData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    const query = `UPDATE companies SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await promisePool.query(query, values);
    return result.affectedRows > 0;
  }

  // Delete company
  static async delete(id) {
    const query = 'DELETE FROM companies WHERE id = ?';
    const [result] = await promisePool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Get company statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_companies,
        COUNT(DISTINCT industry) as total_industries
      FROM companies
    `;
    const [stats] = await promisePool.query(query);
    return stats[0];
  }

  // Get top companies by job count
  static async getTopCompanies(limit = 10) {
    const query = `
      SELECT 
        c.*,
        COUNT(j.id) as job_count,
        COUNT(DISTINCT a.id) as application_count
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY c.id
      ORDER BY job_count DESC, application_count DESC
      LIMIT ?
    `;
    const [companies] = await promisePool.query(query, [limit]);
    return companies;
  }
}

module.exports = Company;

const { promisePool } = require('../config/db');

class User {
  // Create new user
  static async create(userData) {
    const { name, email, password, role, phone, location } = userData;
    const query = `
      INSERT INTO users (name, email, password, role, phone, location) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await promisePool.query(query, [name, email, password, role || 'seeker', phone, location]);
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await promisePool.query(query, [email]);
    return users[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, role, profile_info, phone, location, skills, experience, education, resume, profile_picture, is_active, created_at FROM users WHERE id = ?';
    const [users] = await promisePool.query(query, [id]);
    return users[0];
  }

  // Update user profile
  static async updateProfile(id, profileData) {
    const fields = [];
    const values = [];

    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && key !== 'id' && key !== 'email' && key !== 'password' && key !== 'role') {
        fields.push(`${key} = ?`);
        values.push(profileData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await promisePool.query(query, values);
    return result.affectedRows > 0;
  }

  // Update password
  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await promisePool.query(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Get all users (admin only)
  static async getAll(filters = {}) {
    let query = 'SELECT id, name, email, role, phone, location, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await promisePool.query(query, params);
    return users;
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await promisePool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Toggle user active status
  static async toggleActiveStatus(id) {
    const query = 'UPDATE users SET is_active = NOT is_active WHERE id = ?';
    const [result] = await promisePool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Get user statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'seeker' THEN 1 ELSE 0 END) as seekers,
        SUM(CASE WHEN role = 'employer' THEN 1 ELSE 0 END) as employers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
      FROM users
    `;
    const [stats] = await promisePool.query(query);
    return stats[0];
  }
}

module.exports = User;

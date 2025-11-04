const { promisePool } = require('../config/db');

class Certificate {
  static async create({ user_id, title, file_url, issued_by, issued_date }) {
    const query = `INSERT INTO certificates (user_id, title, file_url, issued_by, issued_date) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await promisePool.query(query, [user_id, title, file_url, issued_by, issued_date]);
    return result.insertId;
  }

  static async getByUser(user_id) {
    const query = `SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_date DESC`;
    const [rows] = await promisePool.query(query, [user_id]);
    return rows;
  }

  static async delete(id, user_id) {
    const query = `DELETE FROM certificates WHERE id = ? AND user_id = ?`;
    const [result] = await promisePool.query(query, [id, user_id]);
    return result.affectedRows > 0;
  }
}

module.exports = Certificate;

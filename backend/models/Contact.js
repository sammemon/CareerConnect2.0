const { promisePool } = require('../config/db');

class Contact {
  static async create(contactData) {
    const { name, email, subject, message } = contactData;
    const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
    const [result] = await promisePool.execute(query, [name, email, subject || null, message]);
    return result.insertId;
  }

  static async getAll(limit = 50) {
    const query = 'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ?';
    const [rows] = await promisePool.execute(query, [limit]);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM contacts WHERE id = ?';
    const [rows] = await promisePool.execute(query, [id]);
    return rows[0];
  }

  static async markAsRead(id) {
    const query = 'UPDATE contacts SET is_read = TRUE WHERE id = ?';
    await promisePool.execute(query, [id]);
  }
}

module.exports = Contact;

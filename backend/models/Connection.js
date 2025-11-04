const { promisePool } = require('../config/db');

class Connection {
  static async request(user1_id, user2_id) {
    const query = `INSERT INTO connections (user1_id, user2_id, status) VALUES (?, ?, 'pending')`;
    const [result] = await promisePool.query(query, [user1_id, user2_id]);
    return result.insertId;
  }

  static async respond(id, status) {
    const query = `UPDATE connections SET status = ? WHERE id = ?`;
    const [result] = await promisePool.query(query, [status, id]);
    return result.affectedRows > 0;
  }

  static async getConnections(user_id) {
    const query = `SELECT * FROM connections WHERE (user1_id = ? OR user2_id = ?) AND status = 'accepted'`;
    const [rows] = await promisePool.query(query, [user_id, user_id]);
    return rows;
  }

  static async getPending(user_id) {
    const query = `SELECT * FROM connections WHERE user2_id = ? AND status = 'pending'`;
    const [rows] = await promisePool.query(query, [user_id]);
    return rows;
  }
}

module.exports = Connection;

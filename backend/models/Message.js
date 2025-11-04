const { promisePool } = require('../config/db');

class Message {
  static async send({ sender_id, receiver_id, content }) {
    const query = `INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`;
    const [result] = await promisePool.query(query, [sender_id, receiver_id, content]);
    return result.insertId;
  }

  static async getConversation(user1_id, user2_id) {
    const query = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC`;
    const [rows] = await promisePool.query(query, [user1_id, user2_id, user2_id, user1_id]);
    return rows;
  }

  static async getInbox(user_id) {
    const query = `SELECT * FROM messages WHERE receiver_id = ? ORDER BY created_at DESC`;
    const [rows] = await promisePool.query(query, [user_id]);
    return rows;
  }
}

module.exports = Message;

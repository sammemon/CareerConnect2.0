const { promisePool } = require('../config/db');

class Post {
  static async create({ user_id, content, image_url }) {
    const query = `INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)`;
    const [result] = await promisePool.query(query, [user_id, content, image_url]);
    return result.insertId;
  }

  static async getByUser(user_id) {
    const query = `SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await promisePool.query(query, [user_id]);
    return rows;
  }

  static async getFeed(limit = 20) {
    const query = `SELECT posts.*, users.name, users.profile_picture FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC LIMIT ?`;
    const [rows] = await promisePool.query(query, [limit]);
    return rows;
  }
}

module.exports = Post;

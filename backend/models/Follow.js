const { promisePool } = require('../config/db');

class Follow {
  static async follow(follower_id, following_id) {
    const query = `INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)`;
    const [result] = await promisePool.query(query, [follower_id, following_id]);
    return result.insertId;
  }

  static async unfollow(follower_id, following_id) {
    const query = `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`;
    const [result] = await promisePool.query(query, [follower_id, following_id]);
    return result.affectedRows > 0;
  }

  static async getFollowers(user_id) {
    const query = `SELECT follower_id FROM follows WHERE following_id = ?`;
    const [rows] = await promisePool.query(query, [user_id]);
    return rows;
  }

  static async getFollowing(user_id) {
    const query = `SELECT following_id FROM follows WHERE follower_id = ?`;
    const [rows] = await promisePool.query(query, [user_id]);
    return rows;
  }
}

module.exports = Follow;

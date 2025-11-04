const bcrypt = require('bcryptjs');
const { promisePool } = require('./config/db');

async function verify(email, plain) {
  const [rows] = await promisePool.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    console.log(`❌ ${email}: user not found`);
    return;
  }
  const user = rows[0];
  const ok = await bcrypt.compare(plain, user.password);
  console.log(`🔎 ${email}: match=${ok}`);
}

(async () => {
  try {
    await verify('employer@techcorp.com', 'employer123');
    await verify('seeker@example.com', 'seeker123');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();

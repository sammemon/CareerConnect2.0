const bcrypt = require('bcryptjs');
const { promisePool } = require('./config/db');

async function fixDemoPasswords() {
  try {
    console.log('🔧 Resetting demo user passwords to known values...');
    const adminPass = await bcrypt.hash('admin123', 10);
    const employerPass = await bcrypt.hash('employer123', 10);
    const seekerPass = await bcrypt.hash('seeker123', 10);

    await promisePool.query('UPDATE users SET password = ? WHERE email = ?', [adminPass, 'admin@careerconnect.com']);
    await promisePool.query('UPDATE users SET password = ? WHERE email = ?', [employerPass, 'employer@techcorp.com']);
    await promisePool.query('UPDATE users SET password = ? WHERE email = ?', [seekerPass, 'seeker@example.com']);

    console.log('✅ Demo passwords updated.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

fixDemoPasswords();

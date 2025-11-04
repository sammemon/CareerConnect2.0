const bcrypt = require('bcryptjs');
const { promisePool } = require('./config/db');

async function checkAndFixUsers() {
  try {
    console.log('🔍 Checking users in database...\n');
    
    // Check existing users
    const [users] = await promisePool.query('SELECT id, name, email, role FROM users');
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('📝 Creating demo users with hashed passwords...\n');
      
      // Hash passwords
      const adminPass = await bcrypt.hash('admin123', 10);
      const employerPass = await bcrypt.hash('employer123', 10);
      const seekerPass = await bcrypt.hash('seeker123', 10);
      
      // Insert demo users
      await promisePool.query(`
        INSERT INTO users (name, email, password, role, is_active) VALUES
        ('Admin User', 'admin@careerconnect.com', ?, 'admin', TRUE),
        ('Tech Corp HR', 'employer@techcorp.com', ?, 'employer', TRUE),
        ('John Doe', 'seeker@example.com', ?, 'seeker', TRUE)
      `, [adminPass, employerPass, seekerPass]);
      
      console.log('✅ Demo users created successfully!\n');
    } else {
      console.log(`✅ Found ${users.length} user(s) in database:\n`);
      users.forEach(user => {
        console.log(`   ID: ${user.id} | ${user.name} | ${user.email} | Role: ${user.role}`);
      });
      console.log('\n');
      
      // Check if passwords are hashed properly
      const [adminUser] = await promisePool.query(
        'SELECT password FROM users WHERE email = ?', 
        ['admin@careerconnect.com']
      );
      
      if (adminUser.length > 0) {
        const passLength = adminUser[0].password.length;
        if (passLength < 50) {
          console.log('⚠️  Passwords are NOT hashed properly!');
          console.log('🔧 Re-hashing all demo account passwords...\n');
          
          const adminPass = await bcrypt.hash('admin123', 10);
          const employerPass = await bcrypt.hash('employer123', 10);
          const seekerPass = await bcrypt.hash('seeker123', 10);
          
          await promisePool.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [adminPass, 'admin@careerconnect.com']
          );
          await promisePool.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [employerPass, 'employer@techcorp.com']
          );
          await promisePool.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [seekerPass, 'seeker@example.com']
          );
          
          console.log('✅ Passwords re-hashed successfully!\n');
        } else {
          console.log('✅ Passwords are properly hashed (bcrypt)!\n');
        }
      }
    }
    
    console.log('📋 Demo Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:    admin@careerconnect.com / admin123');
    console.log('Employer: employer@techcorp.com / employer123');
    console.log('Seeker:   seeker@example.com / seeker123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ Database check complete! You can now login.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndFixUsers();

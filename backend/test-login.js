const bcrypt = require('bcryptjs');
const { promisePool } = require('./config/db');

async function testLogin() {
  try {
    const testEmail = 'admin@careerconnect.com';
    const testPassword = 'admin123';
    
    console.log('🧪 Testing Login Process...\n');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}\n`);
    
    // Step 1: Find user
    console.log('Step 1: Finding user in database...');
    const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [testEmail]);
    
    if (users.length === 0) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    const user = users[0];
    console.log(`✅ User found: ${user.name} (ID: ${user.id})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.is_active}`);
    console.log(`   Password hash length: ${user.password.length} characters\n`);
    
    // Step 2: Check if active
    if (!user.is_active) {
      console.log('❌ User account is deactivated!');
      process.exit(1);
    }
    console.log('✅ User account is active\n');
    
    // Step 3: Compare password
    console.log('Step 2: Comparing password...');
    console.log(`   Stored hash: ${user.password.substring(0, 20)}...`);
    
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log(`   Password match: ${isPasswordValid}\n`);
    
    if (!isPasswordValid) {
      console.log('❌ Password does not match!');
      console.log('\n🔧 Testing if password needs to be re-hashed...');
      
      // Try re-hashing and updating
      const newHash = await bcrypt.hash(testPassword, 10);
      await promisePool.query('UPDATE users SET password = ? WHERE email = ?', [newHash, testEmail]);
      
      console.log('✅ Password re-hashed and updated in database');
      console.log('🔄 Please try logging in again!\n');
      process.exit(0);
    }
    
    console.log('✅ Login test SUCCESSFUL!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('You should now be able to login with:');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testLogin();

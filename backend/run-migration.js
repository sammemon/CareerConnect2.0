const fs = require('fs');
const path = require('path');
const { promisePool } = require('./config/db');

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', 'add_screening_questions.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await promisePool.query(statement);
        console.log('✓ Executed statement');
      }
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

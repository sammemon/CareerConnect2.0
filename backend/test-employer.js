const mysql = require('mysql2/promise');

async function checkUser() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Samalimemon123',
    database: 'careerconnect2'
  });

  console.log('=== User ID 6 ===');
  const [users] = await conn.query('SELECT id, name, email, role FROM users WHERE id = 6');
  console.log(JSON.stringify(users, null, 2));

  console.log('\n=== Companies ===');
  const [companies] = await conn.query('SELECT id, name, employer_id FROM companies');
  console.log(JSON.stringify(companies, null, 2));

  console.log('\n=== Job Stats for employer_id = 6 ===');
  const [stats] = await conn.query(`
    SELECT 
      COUNT(*) as total_jobs,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_jobs,
      SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed_jobs,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_jobs
    FROM jobs
    WHERE employer_id = 6
  `);
  console.log(JSON.stringify(stats, null, 2));

  console.log('\n=== All jobs for employer_id = 6 ===');
  const [jobs] = await conn.query(`
    SELECT 
      j.*,
      c.name as company_name
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.employer_id = 6
    ORDER BY j.created_at DESC
  `);
  console.log(JSON.stringify(jobs, null, 2));

  await conn.end();
}

checkUser().catch(console.error);

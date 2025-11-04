const mysql = require('mysql2/promise');

async function checkJobs() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Samalimemon123',
    database: 'careerconnect2'
  });

  console.log('=== Jobs with TEST in title ===');
  const [jobs] = await conn.query('SELECT id, title, employer_id, company_id, status, created_at FROM jobs WHERE title LIKE "%test%" ORDER BY created_at DESC LIMIT 5');
  console.log(JSON.stringify(jobs, null, 2));

  console.log('\n=== Jobs count by employer ===');
  const [stats] = await conn.query('SELECT employer_id, COUNT(*) as count, GROUP_CONCAT(status) as statuses FROM jobs GROUP BY employer_id');
  console.log(JSON.stringify(stats, null, 2));

  console.log('\n=== All jobs for checking ===');
  const [allJobs] = await conn.query('SELECT id, title, employer_id, status FROM jobs ORDER BY created_at DESC LIMIT 10');
  console.log(JSON.stringify(allJobs, null, 2));

  await conn.end();
}

checkJobs().catch(console.error);

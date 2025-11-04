const mysql = require('mysql2/promise');

async function testDashboardAPI() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Samalimemon123',
    database: 'careerconnect2'
  });

  const employerId = 6; // Your employer ID

  console.log('=== Testing Dashboard Stats Query ===');
  
  // Test Job Stats Query
  const jobStatsQuery = `
    SELECT 
      COUNT(*) as total_jobs,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_jobs,
      SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed_jobs,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_jobs,
      SUM(CASE WHEN type = 'Full-time' THEN 1 ELSE 0 END) as fulltime_jobs,
      SUM(CASE WHEN type = 'Internship' THEN 1 ELSE 0 END) as internship_jobs
    FROM jobs
    WHERE employer_id = ?
  `;
  
  const [jobStats] = await conn.query(jobStatsQuery, [employerId]);
  console.log('\nJob Stats:');
  console.log(JSON.stringify(jobStats[0], null, 2));

  // Test Application Stats Query
  const appStatsQuery = `
    SELECT 
      COUNT(*) as total_applications,
      SUM(CASE WHEN a.status = 'Pending' THEN 1 ELSE 0 END) as pending_applications,
      SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) as shortlisted_applications,
      SUM(CASE WHEN a.status = 'Accepted' THEN 1 ELSE 0 END) as accepted_applications,
      SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) as rejected_applications
    FROM applications a
    INNER JOIN jobs j ON a.job_id = j.id
    WHERE j.employer_id = ?
  `;
  
  const [appStats] = await conn.query(appStatsQuery, [employerId]);
  console.log('\nApplication Stats:');
  console.log(JSON.stringify(appStats[0], null, 2));

  // Check actual applications
  console.log('\n=== Checking Applications Table ===');
  const [allApps] = await conn.query(`
    SELECT a.*, j.title as job_title, j.employer_id 
    FROM applications a 
    INNER JOIN jobs j ON a.job_id = j.id 
    WHERE j.employer_id = ?
  `, [employerId]);
  console.log(`Total applications for employer ${employerId}: ${allApps.length}`);
  console.log(JSON.stringify(allApps, null, 2));

  await conn.end();
}

testDashboardAPI().catch(console.error);

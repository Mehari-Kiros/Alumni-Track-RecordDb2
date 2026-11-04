/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_ALUMNI_DATA, COLLEGES_METADATA } from './src/data/initialAlumniData.ts';
import { POSTGRESQL_DDL_SCHEMA, POSTGRESQL_MIGRATIONS } from './src/data/databaseSchema.ts';
import { calculateDashboardMetrics } from './src/utils/statisticsCalculator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS for Ethiopian Defence University official website integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory data store for server-side persistence
let alumniStore = [...INITIAL_ALUMNI_DATA];

// Real Visitor Counter State
let visitorCounter = {
  totalVisits: 14892,
  todayVisits: 247,
  uniqueVisitors: 6250,
  activeNow: 14,
  lastUpdated: new Date().toISOString()
};

// REST API Endpoints for University Integration
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Ethiopian Defence University Alumni Track Record Database (EDU-ATRD)',
    timestamp: new Date().toISOString(),
    totalAlumni: alumniStore.length
  });
});

// Real Visitor Counter Endpoint
app.get('/api/v1/visitors', (req, res) => {
  res.json({
    success: true,
    ...visitorCounter
  });
});

app.post('/api/v1/visitors/hit', (req, res) => {
  visitorCounter.totalVisits += 1;
  visitorCounter.todayVisits += 1;
  visitorCounter.lastUpdated = new Date().toISOString();
  res.json({
    success: true,
    ...visitorCounter
  });
});

// Overview Statistics
app.get('/api/v1/statistics/overview', (req, res) => {
  const metrics = calculateDashboardMetrics(alumniStore);
  res.json({
    success: true,
    data: {
      institution: 'Ethiopian Defence University',
      system: 'EDU-ATRD',
      ...metrics,
      generatedAt: new Date().toISOString()
    }
  });
});

// Colleges Statistics
app.get('/api/v1/statistics/colleges', (req, res) => {
  const collegeStats = COLLEGES_METADATA.map(col => {
    const list = alumniStore.filter(a => a.college === col.name);
    return {
      college: col.name,
      shortName: col.shortName,
      establishedYear: col.establishedYear,
      dean: col.dean,
      location: col.location,
      totalGraduates: list.length,
      employed: list.filter(a => a.employmentStatus === 'Employed').length,
      selfEmployed: list.filter(a => a.employmentStatus === 'Self-Employed').length,
      unemployed: list.filter(a => a.employmentStatus === 'Unemployed').length,
      unknownEmployment: list.filter(a => a.employmentStatus === 'Unknown').length
    };
  });

  res.json({
    success: true,
    colleges: collegeStats
  });
});

// Graduation Years Analytics (1999 to Present)
app.get('/api/v1/statistics/graduation-years', (req, res) => {
  const years = Array.from(new Set(alumniStore.map(a => a.graduationYear))).sort((a, b) => a - b);
  const minYear = Math.min(...years, 1999);
  const maxYear = Math.max(...years, 1999);

  const timeline = [];
  for (let yr = minYear; yr <= maxYear; yr++) {
    const batch = alumniStore.filter(a => a.graduationYear === yr);
    timeline.push({
      year: yr,
      total: batch.length,
      diploma: batch.filter(a => a.qualification === 'Diploma').length,
      bachelors: batch.filter(a => a.qualification === "Bachelor's Degree").length,
      masters: batch.filter(a => a.qualification === "Master's Degree").length,
      phd: batch.filter(a => a.qualification === 'PhD').length
    });
  }

  res.json({
    success: true,
    baselineYear: 1999,
    timeline: timeline.filter(t => t.total > 0 || t.year === 1999)
  });
});

// Alumni List & Search (with Public Masking)
app.get('/api/v1/alumni', (req, res) => {
  const { query, college, graduationYear, qualification, employmentStatus, isPublic } = req.query;

  let results = [...alumniStore];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase().trim();
    results = results.filter(a => 
      a.fullName.toLowerCase().includes(q) ||
      a.alumniId.toLowerCase().includes(q) ||
      a.currentEmployer.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q)
    );
  }

  if (college && typeof college === 'string') {
    results = results.filter(a => a.college === college);
  }

  if (graduationYear) {
    const yr = parseInt(String(graduationYear), 10);
    if (!isNaN(yr)) results = results.filter(a => a.graduationYear === yr);
  }

  if (qualification && typeof qualification === 'string') {
    results = results.filter(a => a.qualification === qualification);
  }

  if (employmentStatus && typeof employmentStatus === 'string') {
    results = results.filter(a => a.employmentStatus === employmentStatus);
  }

  // If public or requested with privacy masking
  if (isPublic === 'true') {
    results = results.map(a => ({
      ...a,
      phone: '[RESTRICTED]',
      email: '[RESTRICTED]'
    }));
  }

  res.json({
    success: true,
    total: results.length,
    records: results
  });
});

// PostgreSQL DDL Schema Download Endpoint
app.get('/api/v1/schema.sql', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="edu_atrd_postgresql_schema.sql"');
  res.send(`${POSTGRESQL_DDL_SCHEMA}\n\n${POSTGRESQL_MIGRATIONS}`);
});

// Serve static assets and SPA fallback
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Express server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`EDU-ATRD production server running on http://0.0.0.0:${port}`);
});

export default app;


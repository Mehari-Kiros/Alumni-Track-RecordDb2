/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alumnus, CollegeType } from '../types/alumni';

export interface DashboardMetrics {
  totalAlumni: number;
  totalEngineering: number;
  totalHealthSciences: number;
  totalBusinessSocial: number;
  totalDiploma: number;
  totalBachelors: number;
  totalMasters: number;
  totalPhD: number;
  totalEmployed: number;
  totalSelfEmployed: number;
  totalUnemployed: number;
  totalUnknownEmployment: number;
  
  // Data coverage and quality indicators
  employmentDataCoverageRate: number; // % of records with known status
  contactInfoCoverageRate: number; // % of records with phone or email
  verifiedRate: number;
  totalMissingEmployer: number;
  yearsRange: { min: number; max: number };
}

export function calculateDashboardMetrics(alumni: Alumnus[]): DashboardMetrics {
  const total = alumni.length;
  if (total === 0) {
    return {
      totalAlumni: 0,
      totalEngineering: 0,
      totalHealthSciences: 0,
      totalBusinessSocial: 0,
      totalDiploma: 0,
      totalBachelors: 0,
      totalMasters: 0,
      totalPhD: 0,
      totalEmployed: 0,
      totalSelfEmployed: 0,
      totalUnemployed: 0,
      totalUnknownEmployment: 0,
      employmentDataCoverageRate: 0,
      contactInfoCoverageRate: 0,
      verifiedRate: 0,
      totalMissingEmployer: 0,
      yearsRange: { min: 1999, max: new Date().getFullYear() }
    };
  }

  let totalEngineering = 0;
  let totalHealthSciences = 0;
  let totalBusinessSocial = 0;

  let totalDiploma = 0;
  let totalBachelors = 0;
  let totalMasters = 0;
  let totalPhD = 0;

  let totalEmployed = 0;
  let totalSelfEmployed = 0;
  let totalUnemployed = 0;
  let totalUnknownEmployment = 0;

  let withContact = 0;
  let verified = 0;
  let missingEmployer = 0;

  let minYear = 9999;
  let maxYear = 1999;

  for (const a of alumni) {
    // College breakdown
    if (a.college === 'College of Engineering') totalEngineering++;
    else if (a.college === 'College of Health Sciences') totalHealthSciences++;
    else if (a.college === 'College of Business and Social Studies') totalBusinessSocial++;

    // Qualification breakdown
    if (a.qualification === 'Diploma') totalDiploma++;
    else if (a.qualification === "Bachelor's Degree") totalBachelors++;
    else if (a.qualification === "Master's Degree") totalMasters++;
    else if (a.qualification === 'PhD') totalPhD++;

    // Employment breakdown
    if (a.employmentStatus === 'Employed') totalEmployed++;
    else if (a.employmentStatus === 'Self-Employed') totalSelfEmployed++;
    else if (a.employmentStatus === 'Unemployed') totalUnemployed++;
    else totalUnknownEmployment++;

    // Employer completeness
    if (!a.currentEmployer || a.currentEmployer.trim().toLowerCase() === 'unknown' || a.currentEmployer.trim() === '') {
      missingEmployer++;
    }

    if ((a.phone && a.phone.trim() !== '') || (a.email && a.email.trim() !== '')) {
      withContact++;
    }

    if (a.isVerified) {
      verified++;
    }

    if (a.graduationYear) {
      if (a.graduationYear < minYear) minYear = a.graduationYear;
      if (a.graduationYear > maxYear) maxYear = a.graduationYear;
    }
  }

  const knownEmploymentCount = totalEmployed + totalSelfEmployed + totalUnemployed;
  const employmentDataCoverageRate = total > 0 ? Math.round((knownEmploymentCount / total) * 100) : 0;
  const contactInfoCoverageRate = total > 0 ? Math.round((withContact / total) * 100) : 0;
  const verifiedRate = total > 0 ? Math.round((verified / total) * 100) : 0;

  return {
    totalAlumni: total,
    totalEngineering,
    totalHealthSciences,
    totalBusinessSocial,
    totalDiploma,
    totalBachelors,
    totalMasters,
    totalPhD,
    totalEmployed,
    totalSelfEmployed,
    totalUnemployed,
    totalUnknownEmployment,
    employmentDataCoverageRate,
    contactInfoCoverageRate,
    verifiedRate,
    totalMissingEmployer: missingEmployer,
    yearsRange: {
      min: minYear === 9999 ? 1999 : minYear,
      max: maxYear === 1999 && total === 0 ? 1999 : maxYear
    }
  };
}

export function getCollegeDistributionChartData(alumni: Alumnus[]) {
  const counts: Record<string, number> = {
    'College of Engineering': 0,
    'College of Health Sciences': 0,
    'College of Business & Social Studies': 0
  };

  alumni.forEach(a => {
    if (a.college === 'College of Engineering') counts['College of Engineering']++;
    else if (a.college === 'College of Health Sciences') counts['College of Health Sciences']++;
    else if (a.college === 'College of Business and Social Studies') counts['College of Business & Social Studies']++;
  });

  return [
    { name: 'Engineering', fullName: 'College of Engineering', count: counts['College of Engineering'], color: '#1d4ed8' },
    { name: 'Health Sciences', fullName: 'College of Health Sciences', count: counts['College of Health Sciences'], color: '#059669' },
    { name: 'Business & Social', fullName: 'College of Business and Social Studies', count: counts['College of Business & Social Studies'], color: '#d97706' }
  ];
}

export function getGraduationYearsChartData(alumni: Alumnus[]) {
  if (alumni.length === 0) return [];
  
  // Collect all unique years from min to max, starting from 1999
  const years = Array.from(new Set(alumni.map(a => a.graduationYear))).sort((a, b) => a - b);
  const minYear = Math.min(...years, 1999);
  const maxYear = Math.max(...years, 1999);

  const result = [];
  for (let yr = minYear; yr <= maxYear; yr++) {
    const batch = alumni.filter(a => a.graduationYear === yr);
    const engineering = batch.filter(a => a.college === 'College of Engineering').length;
    const health = batch.filter(a => a.college === 'College of Health Sciences').length;
    const business = batch.filter(a => a.college === 'College of Business and Social Studies').length;
    
    // Only push if there are records in the window or to give continuous trend
    result.push({
      year: yr.toString(),
      total: batch.length,
      engineering,
      health,
      business
    });
  }

  // Filter out long stretches of 0 if spread is wide, but keep key milestones and years with data
  return result.filter(r => r.total > 0 || parseInt(r.year) === 1999);
}

export function getQualificationDistributionData(alumni: Alumnus[]) {
  const counts = {
    'Diploma': 0,
    "Bachelor's Degree": 0,
    "Master's Degree": 0,
    'PhD': 0
  };

  alumni.forEach(a => {
    if (counts[a.qualification] !== undefined) {
      counts[a.qualification]++;
    }
  });

  return [
    { name: 'Diploma', count: counts['Diploma'], color: '#6366f1' },
    { name: "Bachelor's", count: counts["Bachelor's Degree"], color: '#0284c7' },
    { name: "Master's", count: counts["Master's Degree"], color: '#10b981' },
    { name: 'PhD', count: counts['PhD'], color: '#c59b27' }
  ];
}

export function getEmploymentStatusData(alumni: Alumnus[]) {
  const counts = {
    'Employed': 0,
    'Self-Employed': 0,
    'Unemployed': 0,
    'Unknown': 0
  };

  alumni.forEach(a => {
    counts[a.employmentStatus]++;
  });

  return [
    { name: 'Employed', count: counts['Employed'], color: '#10b981' },
    { name: 'Self-Employed', count: counts['Self-Employed'], color: '#0ea5e9' },
    { name: 'Unemployed', count: counts['Unemployed'], color: '#ef4444' },
    { name: 'Unknown / Not Reported', count: counts['Unknown'], color: '#94a3b8' }
  ];
}

export function getEmploymentByCollegeData(alumni: Alumnus[]) {
  const colleges: CollegeType[] = [
    'College of Engineering',
    'College of Health Sciences',
    'College of Business and Social Studies'
  ];

  return colleges.map(col => {
    const list = alumni.filter(a => a.college === col);
    const short = col.replace('College of ', '');
    return {
      college: short,
      employed: list.filter(a => a.employmentStatus === 'Employed').length,
      selfEmployed: list.filter(a => a.employmentStatus === 'Self-Employed').length,
      unemployed: list.filter(a => a.employmentStatus === 'Unemployed').length,
      unknown: list.filter(a => a.employmentStatus === 'Unknown').length,
      total: list.length
    };
  });
}

export function getDepartmentDistributionData(alumni: Alumnus[]) {
  const map: Record<string, { count: number; college: CollegeType }> = {};

  alumni.forEach(a => {
    const dept = a.department || 'Unassigned';
    if (!map[dept]) {
      map[dept] = { count: 0, college: a.college };
    }
    map[dept].count++;
  });

  return Object.entries(map)
    .map(([department, data]) => ({
      department: department.length > 28 ? department.slice(0, 26) + '...' : department,
      fullDepartment: department,
      count: data.count,
      college: data.college
    }))
    .sort((a, b) => b.count - a.count);
}

export function getGenderDistributionData(alumni: Alumnus[]) {
  const counts = { Male: 0, Female: 0, Unknown: 0 };
  alumni.forEach(a => {
    if (a.gender === 'Male') counts.Male++;
    else if (a.gender === 'Female') counts.Female++;
    else counts.Unknown++;
  });

  return [
    { name: 'Male Graduates', count: counts.Male, color: '#3b82f6' },
    { name: 'Female Graduates', count: counts.Female, color: '#ec4899' },
    { name: 'Not Recorded', count: counts.Unknown, color: '#94a3b8' }
  ].filter(item => item.count > 0);
}

export function getEmploymentSectorData(alumni: Alumnus[]) {
  const map: Record<string, number> = {};
  
  alumni.forEach(a => {
    const sector = a.employmentSector || 'Unknown';
    map[sector] = (map[sector] || 0) + 1;
  });

  return Object.entries(map)
    .map(([sector, count]) => ({
      sector,
      count,
      pct: alumni.length > 0 ? Math.round((count / alumni.length) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}

export function getHistoricalTimelineData(alumni: Alumnus[]) {
  const years = Array.from(new Set(alumni.map(a => a.graduationYear))).sort((a, b) => a - b);
  if (years.length === 0) return [];

  let runningCumulative = 0;
  return years.map(yr => {
    const batchCount = alumni.filter(a => a.graduationYear === yr).length;
    runningCumulative += batchCount;
    return {
      year: yr.toString(),
      annualGraduates: batchCount,
      cumulativeAlumni: runningCumulative
    };
  });
}

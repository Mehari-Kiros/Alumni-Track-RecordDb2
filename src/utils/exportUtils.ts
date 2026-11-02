/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { Alumnus } from '../types/alumni';

export const TEMPLATE_SAMPLE_ROWS = [
  {
    'Full Name': 'Capt. Dawit Haile',
    'Alumni ID': 'EDU/ENG/2015/042',
    'Gender': 'Male',
    'College': 'College of Engineering',
    'Department': 'Combat Vehicle & Mechanical Engineering',
    'Academic Program': 'BSc in Mechanical & Vehicle Engineering',
    'Qualification': "Bachelor's Degree",
    'Graduation Year': 2015,
    'Employment Status': 'Employed',
    'Current Employer': 'Defence Engineering Industry Corporation (DEIC)',
    'Current Position': 'Senior Powertrain Specialist',
    'Employment Sector': 'Military & Defence',
    'Country': 'Ethiopia',
    'Region': 'Bishoftu',
    'Phone Number': '+251 91 123 4567',
    'Email Address': 'dawit.h@deic.et'
  },
  {
    'Full Name': 'Dr. Frehiwot Assefa',
    'Alumni ID': 'EDU/CHS/2018/019',
    'Gender': 'Female',
    'College': 'College of Health Sciences',
    'Department': 'Military Medicine & Trauma Surgery',
    'Academic Program': 'Doctor of Medicine (MD)',
    'Qualification': "Bachelor's Degree",
    'Graduation Year': 2018,
    'Employment Status': 'Employed',
    'Current Employer': 'Armed Forces Comprehensive Specialized Hospital',
    'Current Position': 'Trauma Surgical Specialist',
    'Employment Sector': 'Military & Defence',
    'Country': 'Ethiopia',
    'Region': 'Addis Ababa',
    'Phone Number': '+251 91 234 5678',
    'Email Address': 'frehiwot.a@afh.gov.et'
  },
  {
    'Full Name': 'Maj. Samuel Worku',
    'Alumni ID': 'EDU/BSS/1999/007',
    'Gender': 'Male',
    'College': 'College of Business and Social Studies',
    'Department': 'Military Logistics & Supply Chain',
    'Academic Program': 'Diploma in Military Supplies & Administration (Historical)',
    'Qualification': 'Diploma',
    'Graduation Year': 1999,
    'Employment Status': 'Self-Employed',
    'Current Employer': 'Blue Nile Strategic Forwarding PLC',
    'Current Position': 'Managing Director',
    'Employment Sector': 'Private Sector',
    'Country': 'Ethiopia',
    'Region': 'Addis Ababa',
    'Phone Number': '+251 91 345 6789',
    'Email Address': 'samuel.w@bluenile.et'
  }
];

export function downloadAlumniTemplate(format: 'xlsx' | 'csv') {
  const ws = XLSX.utils.json_to_sheet(TEMPLATE_SAMPLE_ROWS);
  
  if (format === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'EDU_Alumni_Data_Upload_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'EDU_Alumni_Data_Upload_Template.xlsx');
  }
}

export function exportAlumniData(alumni: Alumnus[], filename: string, format: 'xlsx' | 'csv') {
  const exportRows = alumni.map((a) => ({
    'Alumni ID': a.alumniId,
    'Full Name': a.fullName,
    'Gender': a.gender,
    'College': a.college,
    'Department': a.department,
    'Academic Program': a.academicProgram,
    'Qualification': a.qualification,
    'Graduation Year': a.graduationYear,
    'Employment Status': a.employmentStatus,
    'Current Employer': a.currentEmployer,
    'Current Position': a.currentPosition,
    'Employment Sector': a.employmentSector,
    'Further Education': a.furtherEducation || '',
    'Country': a.country,
    'Region': a.region,
    'Phone Number': a.phone || '',
    'Email Address': a.email || '',
    'Last Updated': a.lastUpdated,
    'Verification Status': a.isVerified ? 'Verified' : 'Pending Verification'
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);

  if (format === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumni Track Records');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }
}

export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { Alumnus, CollegeType, QualificationLevel, EmploymentStatus, EmploymentSector, Gender } from '../types/alumni';

export interface ColumnMapping {
  fileHeader: string;
  mappedField: keyof Alumnus | 'skip';
}

export interface ParsedRow {
  rowIndex: number;
  raw: Record<string, any>;
  mapped: Partial<Alumnus>;
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
}

export const STANDARD_FIELDS: Array<{ key: keyof Alumnus; label: string; mandatory: boolean }> = [
  { key: 'fullName', label: 'Full Name', mandatory: true },
  { key: 'alumniId', label: 'Alumni ID', mandatory: false },
  { key: 'gender', label: 'Gender', mandatory: false },
  { key: 'college', label: 'College', mandatory: true },
  { key: 'department', label: 'Department', mandatory: false },
  { key: 'academicProgram', label: 'Academic Program', mandatory: false },
  { key: 'qualification', label: 'Qualification Level', mandatory: true },
  { key: 'graduationYear', label: 'Graduation Year (>= 1999)', mandatory: true },
  { key: 'employmentStatus', label: 'Employment Status', mandatory: false },
  { key: 'currentEmployer', label: 'Current Employer', mandatory: false },
  { key: 'currentPosition', label: 'Current Position', mandatory: false },
  { key: 'employmentSector', label: 'Employment Sector', mandatory: false },
  { key: 'country', label: 'Country', mandatory: false },
  { key: 'region', label: 'Region / City', mandatory: false },
  { key: 'phone', label: 'Phone Number', mandatory: false },
  { key: 'email', label: 'Email Address', mandatory: false }
];

export function autoDetectColumnMapping(headers: string[]): ColumnMapping[] {
  return headers.map(header => {
    const clean = header.trim().toLowerCase().replace(/[_\-\s]+/g, '');
    let mappedField: keyof Alumnus | 'skip' = 'skip';

    if (clean.includes('fullname') || clean === 'name' || clean === 'graduatename') {
      mappedField = 'fullName';
    } else if (clean.includes('alumniid') || clean.includes('studentnumber') || clean.includes('idnumber') || clean === 'id') {
      mappedField = 'alumniId';
    } else if (clean === 'gender' || clean === 'sex') {
      mappedField = 'gender';
    } else if (clean.includes('college') || clean === 'faculty') {
      mappedField = 'college';
    } else if (clean.includes('department') || clean === 'dept') {
      mappedField = 'department';
    } else if (clean.includes('program') || clean.includes('academicprogram') || clean.includes('course')) {
      mappedField = 'academicProgram';
    } else if (clean.includes('qualification') || clean.includes('degree') || clean.includes('level') || clean === 'award') {
      mappedField = 'qualification';
    } else if (clean.includes('year') || clean.includes('gradyear') || clean.includes('batch')) {
      mappedField = 'graduationYear';
    } else if (clean.includes('employmentstatus') || clean === 'status' || clean.includes('employed')) {
      mappedField = 'employmentStatus';
    } else if (clean.includes('employer') || clean.includes('organization') || clean.includes('company')) {
      mappedField = 'currentEmployer';
    } else if (clean.includes('position') || clean.includes('title') || clean.includes('rank') || clean.includes('jobtitle')) {
      mappedField = 'currentPosition';
    } else if (clean.includes('sector') || clean.includes('industry')) {
      mappedField = 'employmentSector';
    } else if (clean.includes('country')) {
      mappedField = 'country';
    } else if (clean.includes('region') || clean.includes('city') || clean.includes('state')) {
      mappedField = 'region';
    } else if (clean.includes('phone') || clean.includes('mobile') || clean.includes('tel')) {
      mappedField = 'phone';
    } else if (clean.includes('email') || clean.includes('mail')) {
      mappedField = 'email';
    }

    return { fileHeader: header, mappedField };
  });
}

export function parseFileToRawJson(file: File): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
        
        if (jsonData.length === 0) {
          resolve({ headers: [], rows: [] });
          return;
        }

        const headers = Object.keys(jsonData[0]);
        resolve({ headers, rows: jsonData });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}

export function normalizeCollege(input: string): CollegeType {
  const clean = (input || '').trim().toLowerCase();
  if (clean.includes('eng') || clean.includes('tech')) {
    return 'College of Engineering';
  }
  if (clean.includes('health') || clean.includes('med') || clean.includes('nurs')) {
    return 'College of Health Sciences';
  }
  if (clean.includes('business') || clean.includes('social') || clean.includes('manag') || clean.includes('lead')) {
    return 'College of Business and Social Studies';
  }
  return 'College of Engineering';
}

export function normalizeQualification(input: string): QualificationLevel {
  const clean = (input || '').trim().toLowerCase();
  if (clean.includes('phd') || clean.includes('doctorate')) return 'PhD';
  if (clean.includes('master') || clean.includes('msc') || clean.includes('ma') || clean.includes('postgrad')) return "Master's Degree";
  if (clean.includes('diploma') || clean.includes('cert')) return 'Diploma';
  return "Bachelor's Degree";
}

export function normalizeEmploymentStatus(input: string): EmploymentStatus {
  const clean = (input || '').trim().toLowerCase();
  if (clean.includes('self')) return 'Self-Employed';
  if (clean.includes('unemployed') || clean === 'no' || clean.includes('jobless')) return 'Unemployed';
  if (clean.includes('employ') || clean.includes('working') || clean === 'yes') return 'Employed';
  return 'Unknown';
}

export function normalizeSector(input: string): EmploymentSector {
  const clean = (input || '').trim().toLowerCase();
  if (clean.includes('milit') || clean.includes('defence') || clean.includes('defense') || clean.includes('army') || clean.includes('air force') || clean.includes('endf')) {
    return 'Military & Defence';
  }
  if (clean.includes('state') || clean.includes('parastatal') || clean.includes('enterprise') || clean.includes('telecom') || clean.includes('airline') || clean.includes('cbe')) {
    return 'State Enterprise / Parastatal';
  }
  if (clean.includes('public') || clean.includes('civil') || clean.includes('ministry') || clean.includes('gov')) {
    return 'Public / Civil Service';
  }
  if (clean.includes('private') || clean.includes('plc') || clean.includes('corp') || clean.includes('firm')) {
    return 'Private Sector';
  }
  if (clean.includes('ngo') || clean.includes('un') || clean.includes('international')) {
    return 'NGO / International';
  }
  if (clean.includes('acad') || clean.includes('uni') || clean.includes('research') || clean.includes('college')) {
    return 'Academic & Research';
  }
  return 'Unknown';
}

export function validateAndMapRows(
  rows: Record<string, any>[],
  mappings: ColumnMapping[],
  existingAlumni: Alumnus[]
): ParsedRow[] {
  const existingIds = new Set(existingAlumni.map(a => a.alumniId.trim().toUpperCase()));
  const seenBatchIds = new Set<string>();

  return rows.map((rawRow, index) => {
    const mapped: Partial<Alumnus> = {
      id: `imp-${Date.now()}-${index}`,
      country: 'Ethiopia',
      region: 'Addis Ababa',
      isVerified: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // Apply mappings
    mappings.forEach(m => {
      if (m.mappedField !== 'skip' && rawRow[m.fileHeader] !== undefined) {
        const val = rawRow[m.fileHeader];
        (mapped as any)[m.mappedField] = val;
      }
    });

    const errors: string[] = [];

    // Full name check
    if (!mapped.fullName || String(mapped.fullName).trim() === '') {
      errors.push('Full name is missing');
    } else {
      mapped.fullName = String(mapped.fullName).trim();
    }

    // Graduation Year validation: beginning 1999
    let yr = Number(mapped.graduationYear);
    if (!yr || isNaN(yr)) {
      errors.push('Graduation year must be a valid numeric year');
    } else if (yr < 1999) {
      errors.push(`Graduation year (${yr}) cannot precede the 1999 founding batch`);
    } else if (yr > 2035) {
      errors.push(`Graduation year (${yr}) exceeds permissible future batch window`);
    } else {
      mapped.graduationYear = yr;
    }

    // College normalization
    mapped.college = normalizeCollege(String(mapped.college || ''));

    // Qualification normalization
    mapped.qualification = normalizeQualification(String(mapped.qualification || ''));

    // Gender normalization
    const g = String(mapped.gender || '').trim().toLowerCase();
    if (g.startsWith('m')) mapped.gender = 'Male';
    else if (g.startsWith('f')) mapped.gender = 'Female';
    else mapped.gender = 'Unknown';

    // Employment normalization
    mapped.employmentStatus = normalizeEmploymentStatus(String(mapped.employmentStatus || ''));
    mapped.employmentSector = normalizeSector(String(mapped.employmentSector || ''));
    mapped.currentEmployer = mapped.currentEmployer ? String(mapped.currentEmployer).trim() : (mapped.employmentStatus === 'Employed' ? 'Recorded Employer' : 'Not Reported');
    mapped.currentPosition = mapped.currentPosition ? String(mapped.currentPosition).trim() : 'Graduate';
    mapped.department = mapped.department ? String(mapped.department).trim() : 'General Department';
    mapped.academicProgram = mapped.academicProgram ? String(mapped.academicProgram).trim() : `${mapped.qualification} Program`;

    // Alumni ID check & Duplicate detection
    let isDuplicate = false;
    if (mapped.alumniId && String(mapped.alumniId).trim() !== '') {
      const cleanId = String(mapped.alumniId).trim().toUpperCase();
      mapped.alumniId = cleanId;
      if (existingIds.has(cleanId) || seenBatchIds.has(cleanId)) {
        isDuplicate = true;
      } else {
        seenBatchIds.add(cleanId);
      }
    } else {
      // Generate standard format if missing: EDU/[COLLEGE_CODE]/[YEAR]/[AUTO]
      const colCode = mapped.college === 'College of Engineering' ? 'ENG' : mapped.college === 'College of Health Sciences' ? 'CHS' : 'BSS';
      mapped.alumniId = `EDU/${colCode}/${mapped.graduationYear || 1999}/${String(index + 1).padStart(3, '0')}`;
    }

    return {
      rowIndex: index + 1,
      raw: rawRow,
      mapped,
      isValid: errors.length === 0,
      errors,
      isDuplicate
    };
  });
}

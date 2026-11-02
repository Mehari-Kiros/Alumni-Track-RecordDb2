/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CollegeType = 
  | 'College of Engineering'
  | 'College of Health Sciences'
  | 'College of Business and Social Studies';

export type QualificationLevel = 
  | 'Diploma'
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'PhD';

export type EmploymentStatus = 
  | 'Employed'
  | 'Self-Employed'
  | 'Unemployed'
  | 'Unknown';

export type EmploymentSector = 
  | 'Military & Defence'
  | 'Public / Civil Service'
  | 'State Enterprise / Parastatal'
  | 'Private Sector'
  | 'NGO / International'
  | 'Academic & Research'
  | 'Unknown';

export type Gender = 'Male' | 'Female' | 'Unknown';

export type UserRole = 
  | 'system_admin'
  | 'data_admin'
  | 'management'
  | 'public';

export interface CareerMilestone {
  year: number;
  title: string;
  organization: string;
  sector?: EmploymentSector;
  notes?: string;
}

export interface Alumnus {
  id: string;
  alumniId: string;
  fullName: string;
  gender: Gender;
  college: CollegeType;
  department: string;
  academicProgram: string;
  qualification: QualificationLevel;
  graduationYear: number;
  employmentStatus: EmploymentStatus;
  currentEmployer: string;
  currentPosition: string;
  employmentSector: EmploymentSector;
  furtherEducation?: string;
  certifications?: string[];
  country: string;
  region: string;
  phone?: string;
  email?: string;
  careerMilestones?: CareerMilestone[];
  achievements?: string;
  lastUpdated: string;
  isVerified?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  ip?: string;
}

export interface ImportHistoryItem {
  id: string;
  uploadDate: string;
  administrator: string;
  filename: string;
  totalRecords: number;
  validRecords: number;
  duplicatesCount: number;
  correctionsCount: number;
  status: 'Completed' | 'Rolled Back';
}

export interface CollegeInfo {
  name: CollegeType;
  shortName: string;
  establishedYear: number;
  dean: string;
  location: string;
  description: string;
  departments: string[];
  programs: string[];
}

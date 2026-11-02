/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  publicAccessible: boolean;
  parameters: Array<{ name: string; type: string; required: boolean; description: string }>;
  sampleResponse: Record<string, any>;
}

export const API_DOCUMENTATION: ApiEndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/v1/statistics/overview',
    summary: 'University-Wide Aggregated Statistics',
    description: 'Returns top-level indicators for total alumni, college breakdowns, qualifications, and employment percentages for integration into the main university portal.',
    authRequired: false,
    publicAccessible: true,
    parameters: [
      { name: 'year', type: 'integer (optional)', required: false, description: 'Filter statistics by single graduation year (1999-present)' },
      { name: 'college', type: 'string (optional)', required: false, description: 'Filter by specific college name' }
    ],
    sampleResponse: {
      success: true,
      data: {
        institution: 'Ethiopian Defence University',
        system: 'EDU-ATRD',
        totalRegisteredAlumni: 4850,
        historicalBaselineYear: 1999,
        collegeBreakdown: {
          engineering: 2420,
          healthSciences: 1310,
          businessAndSocialStudies: 1120
        },
        qualificationDistribution: {
          diploma: 840,
          bachelors: 2950,
          masters: 980,
          phd: 80
        },
        employmentMetrics: {
          employed: 4120,
          selfEmployed: 320,
          unemployed: 190,
          unknown: 220,
          tracerEmploymentRatePct: 91.5
        },
        generatedAt: '2026-11-02T05:25:00Z'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/statistics/colleges',
    summary: 'Colleges Summary & Historical Trends',
    description: 'Provides college-by-college breakdown including historical batch numbers starting from 1999, departments, and employment sectors.',
    authRequired: false,
    publicAccessible: true,
    parameters: [
      { name: 'collegeId', type: 'string (optional)', required: false, description: 'COE, COHS, or COBSS' }
    ],
    sampleResponse: {
      success: true,
      colleges: [
        {
          code: 'COE',
          name: 'College of Engineering',
          establishedYear: 1999,
          totalGraduates: 2420,
          topDepartments: ['Combat Vehicle & Mechanical Engineering', 'Computer Science & Cyber Defence'],
          defenceSectorAbsorptionPct: 78.4
        },
        {
          code: 'COHS',
          name: 'College of Health Sciences',
          establishedYear: 2003,
          totalGraduates: 1310,
          topDepartments: ['Military Medicine & Trauma Surgery', 'Nursing & Field Care'],
          defenceSectorAbsorptionPct: 84.1
        },
        {
          code: 'COBSS',
          name: 'College of Business and Social Studies',
          establishedYear: 1999,
          totalGraduates: 1120,
          topDepartments: ['Military Logistics & Supply Chain', 'Defence Management'],
          defenceSectorAbsorptionPct: 71.2
        }
      ]
    }
  },
  {
    method: 'GET',
    path: '/api/v1/statistics/graduation-years',
    summary: 'Graduation Year Trends (1999 to Present)',
    description: 'Returns time-series cohort analytics starting from the first Diploma batch in 1999.',
    authRequired: false,
    publicAccessible: true,
    parameters: [
      { name: 'fromYear', type: 'integer', required: false, description: 'Defaults to 1999' },
      { name: 'toYear', type: 'integer', required: false, description: 'Defaults to current year' }
    ],
    sampleResponse: {
      success: true,
      coveragePeriod: { startYear: 1999, latestYear: 2024 },
      timeline: [
        { year: 1999, diplomaGraduates: 142, bachelors: 0, total: 142, notableMilestone: 'Inaugural 1st Diploma Graduation Batch' },
        { year: 2000, diplomaGraduates: 168, bachelors: 0, total: 168, notableMilestone: '2nd Diploma Graduation Batch' },
        { year: 2001, diplomaGraduates: 195, bachelors: 0, total: 195, notableMilestone: '3rd Diploma Graduation Batch' },
        { year: 2002, diplomaGraduates: 210, bachelors: 85, total: 295, notableMilestone: 'Inaugural 1st Bachelor\'s Degree Batch' },
        { year: 2003, diplomaGraduates: 220, bachelors: 120, total: 340, notableMilestone: '2nd Bachelor\'s Degree Batch' },
        { year: 2004, diplomaGraduates: 98, bachelors: 165, total: 263, notableMilestone: '3rd Degree Batch & Health Sciences Commencement' },
        { year: 2016, diplomaGraduates: 15, bachelors: 340, masters: 45, total: 400, notableMilestone: 'Postgraduate Expansion' }
      ]
    }
  },
  {
    method: 'GET',
    path: '/api/v1/alumni',
    summary: 'Search & Retrieve Alumni Records',
    description: 'Searchable alumni database. Personal contact details are automatically masked for public access.',
    authRequired: false,
    publicAccessible: true,
    parameters: [
      { name: 'query', type: 'string', required: false, description: 'Search by full name, alumni ID, or current employer' },
      { name: 'college', type: 'string', required: false, description: 'Filter by college' },
      { name: 'graduationYear', type: 'integer', required: false, description: 'Filter by graduation year (>= 1999)' },
      { name: 'qualification', type: 'string', required: false, description: 'Diploma, Bachelor, Master, PhD' },
      { name: 'employmentStatus', type: 'string', required: false, description: 'Employed, Self-Employed, Unemployed' },
      { name: 'page', type: 'integer', required: false, description: 'Pagination page number' },
      { name: 'limit', type: 'integer', required: false, description: 'Page limit (default 25)' }
    ],
    sampleResponse: {
      success: true,
      totalCount: 28,
      page: 1,
      limit: 25,
      records: [
        {
          alumniId: 'EDU/ENG/1999/001',
          fullName: 'Brig. Gen. Berhanu Mengesha',
          college: 'College of Engineering',
          department: 'Combat Vehicle & Mechanical Engineering',
          qualification: 'Diploma',
          graduationYear: 1999,
          employmentStatus: 'Employed',
          currentEmployer: 'Ethiopian National Defence Force (ENDF)',
          currentPosition: 'Director General, Combat Vehicles & Mobility Command',
          employmentSector: 'Military & Defence',
          phone: '[RESTRICTED_FOR_PUBLIC_VIEW]',
          email: '[RESTRICTED_FOR_PUBLIC_VIEW]'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/alumni/upload',
    summary: 'Batch Upload Alumni Dataset',
    description: 'Multipart file upload accepting .xlsx, .xls, and .csv files. Executes server-side schema validation, duplicate verification, and returns reconciliation report.',
    authRequired: true,
    publicAccessible: false,
    parameters: [
      { name: 'file', type: 'binary file (.xlsx, .xls, .csv)', required: true, description: 'Structured alumni file' },
      { name: 'duplicateStrategy', type: 'string ("skip" | "update" | "new")', required: false, description: 'Duplicate handling mode' }
    ],
    sampleResponse: {
      success: true,
      importId: 'imp-20261102-8821',
      totalIdentified: 150,
      validRecords: 148,
      duplicateRecords: 2,
      correctedRecords: 4,
      status: 'Completed'
    }
  }
];

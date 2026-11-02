/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Alumnus, CollegeType } from '../types/alumni';
import { exportAlumniData } from '../utils/exportUtils';
import { calculateDashboardMetrics } from '../utils/statisticsCalculator';
import { UniversityLogo } from './UniversityLogo';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Filter,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface ReportsAnalyticsViewProps {
  alumni: Alumnus[];
}

export type ReportType = 
  | 'university-wide'
  | 'college-specific'
  | 'department-specific'
  | 'graduation-year'
  | 'tracer-study'
  | 'employment-sector';

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({ alumni }) => {
  const [reportType, setReportType] = useState<ReportType>('university-wide');
  const [selectedCollege, setSelectedCollege] = useState<CollegeType>('College of Engineering');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [includePrintHeader, setIncludePrintHeader] = useState<boolean>(true);

  const metrics = calculateDashboardMetrics(alumni);
  const generationDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Filter records based on selected report type
  let reportAlumni = [...alumni];
  let reportTitle = 'University-Wide Comprehensive Alumni Report';
  let reportSubtitle = 'Centralized digital audit of all registered graduates from the 1999 founding batch to present';

  if (reportType === 'college-specific') {
    reportAlumni = alumni.filter(a => a.college === selectedCollege);
    reportTitle = `${selectedCollege} Annual Tracer & Track Record Report`;
    reportSubtitle = `Institutional audit for ${selectedCollege} covering departments, qualifications, and employment status`;
  } else if (reportType === 'graduation-year') {
    reportAlumni = alumni.filter(a => a.graduationYear === selectedYear);
    reportTitle = `Class of ${selectedYear} Cohort Outcome Report`;
    reportSubtitle = `Tracer outcomes and employment progression for the ${selectedYear} graduation class`;
  } else if (reportType === 'tracer-study') {
    reportTitle = 'Institutional Graduate Tracer Study & Employment Absorption Report';
    reportSubtitle = 'National defence sector absorption, civil service placements, and private entrepreneurship indicators';
  } else if (reportType === 'employment-sector') {
    reportTitle = 'Alumni Distribution by Employment Sector & Industry Report';
    reportSubtitle = 'Mapping defence capability contributions and national economic impact';
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportAlumniData(reportAlumni, `EDU_Report_${reportType}_${new Date().toISOString().split('T')[0]}`, 'xlsx');
  };

  const handleExportCsv = () => {
    exportAlumniData(reportAlumni, `EDU_Report_${reportType}_${new Date().toISOString().split('T')[0]}`, 'csv');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Configuration Header (Hidden on print) */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-400" />
              <span>Reporting & Analytical Intelligence Module</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Generate standardized accreditation, quality assurance, tracer-study, and executive decision reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Report</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          {[
            { id: 'university-wide', label: 'University-Wide' },
            { id: 'college-specific', label: 'College-Specific' },
            { id: 'graduation-year', label: 'Graduation-Year Cohort' },
            { id: 'tracer-study', label: 'Graduate Tracer Study' },
            { id: 'employment-sector', label: 'Sector Distribution' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setReportType(r.id as ReportType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                reportType === r.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-[#0F284E] text-slate-300 hover:bg-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Dynamic Context Selectors */}
        {reportType === 'college-specific' && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-slate-400">Select College Target:</span>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value as CollegeType)}
              className="bg-[#0F284E] text-xs text-white p-2 rounded-lg border border-slate-700"
            >
              <option value="College of Engineering">College of Engineering</option>
              <option value="College of Health Sciences">College of Health Sciences</option>
              <option value="College of Business and Social Studies">College of Business and Social Studies</option>
            </select>
          </div>
        )}

        {reportType === 'graduation-year' && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-slate-400">Select Cohort Year:</span>
            <input
              type="number"
              min={1999}
              max={2035}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-[#0F284E] text-xs text-white p-2 rounded-lg border border-slate-700 w-28"
            />
          </div>
        )}
      </div>

      {/* PRINT-READY OFFICIAL REPORT DOCUMENT */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-300 print:border-none print:shadow-none print:p-0">
        
        {/* Official Header */}
        <div className="border-b-2 border-[#0A192F] pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UniversityLogo size="lg" lightMode={true} />
            <div>
              <h1 className="text-lg sm:text-2xl font-serif font-black tracking-wide text-[#0A192F] leading-tight">
                የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
              </h1>
              <h2 className="text-lg sm:text-2xl font-serif font-black tracking-wider text-[#0A192F] leading-tight">
                ETHIOPIAN DEFENCE UNIVERSITY
              </h2>
              <div className="mt-1 space-y-0.5">
                <p className="text-xs sm:text-sm font-serif font-bold text-amber-700 tracking-wide uppercase">
                  የሬጅስትራርና ምሩቃን ጉዲይ ፅ/ቤት ዲይሬክተር
                </p>
                <p className="text-xs sm:text-sm font-serif font-bold text-amber-700 tracking-wide uppercase">
                  OFFICE OF THE REGISTRAR & ALUMNI AFFAIRS DIRECTORATE
                </p>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Alumni Track Record Database (EDU-ATRD) • Official Institutional Report
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 hidden sm:block">
            <p><strong>Ref:</strong> EDU/REG-ALUMNI/{new Date().getFullYear()}</p>
            <p><strong>Date of Generation:</strong> {generationDate}</p>
            <p><strong>Coverage Period:</strong> 1999–Present</p>
          </div>
        </div>

        {/* Report Metadata Strip */}
        <div className="py-6 border-b border-slate-200">
          <h2 className="text-xl font-serif font-bold text-[#0A192F]">{reportTitle}</h2>
          <p className="text-xs text-slate-600 mt-1">{reportSubtitle}</p>
          <div className="flex flex-wrap items-center gap-6 mt-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span><strong>Scope:</strong> {reportAlumni.length} Filtered Records</span>
            <span><strong>Data Source:</strong> Central Verified Database</span>
            <span><strong>Baseline Year:</strong> 1999 Inaugural Diploma Batch</span>
            <span><strong>Classification:</strong> Official Academic Record</span>
          </div>
        </div>

        {/* Summary Indicators Table */}
        <div className="py-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Executive Summary Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total In Report</span>
              <span className="text-2xl font-bold text-[#0A192F]">{reportAlumni.length}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Employed & Active</span>
              <span className="text-2xl font-bold text-emerald-700">
                {reportAlumni.filter(a => a.employmentStatus === 'Employed' || a.employmentStatus === 'Self-Employed').length}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Unemployed</span>
              <span className="text-2xl font-bold text-rose-700">
                {reportAlumni.filter(a => a.employmentStatus === 'Unemployed').length}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Unknown Status</span>
              <span className="text-2xl font-bold text-slate-600">
                {reportAlumni.filter(a => a.employmentStatus === 'Unknown').length}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Data Table */}
        <div className="py-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Alumni Record Roster ({reportAlumni.length} Individuals)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 border border-slate-300">
              <thead className="bg-[#0A192F] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5 border-r border-slate-700">Alumni ID</th>
                  <th className="p-2.5 border-r border-slate-700">Full Name</th>
                  <th className="p-2.5 border-r border-slate-700">College</th>
                  <th className="p-2.5 border-r border-slate-700">Year</th>
                  <th className="p-2.5 border-r border-slate-700">Qualification</th>
                  <th className="p-2.5 border-r border-slate-700">Current Employer</th>
                  <th className="p-2.5 border-r border-slate-700">Position</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportAlumni.slice(0, 30).map((a, idx) => (
                  <tr key={a.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2 font-mono font-medium border-r border-slate-200">{a.alumniId}</td>
                    <td className="p-2 font-semibold border-r border-slate-200">{a.fullName}</td>
                    <td className="p-2 border-r border-slate-200">{a.college.replace('College of ', '')}</td>
                    <td className="p-2 border-r border-slate-200 font-mono">{a.graduationYear}</td>
                    <td className="p-2 border-r border-slate-200">{a.qualification}</td>
                    <td className="p-2 border-r border-slate-200">{a.currentEmployer}</td>
                    <td className="p-2 border-r border-slate-200">{a.currentPosition}</td>
                    <td className="p-2 font-semibold">{a.employmentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reportAlumni.length > 30 && (
            <p className="text-[11px] text-slate-500 italic text-center mt-2">
              Showing first 30 of {reportAlumni.length} entries on page. Full dataset exportable to Excel / CSV.
            </p>
          )}
        </div>

        {/* Official Sign-Off Section */}
        <div className="pt-12 border-t-2 border-slate-300 mt-8 grid grid-cols-3 gap-6 text-xs text-slate-700">
          <div>
            <p className="font-bold text-slate-900">Prepared By:</p>
            <div className="h-12 border-b border-dashed border-slate-400 mt-2" />
            <p className="mt-1">Alumni Database Administrator</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Verified By:</p>
            <div className="h-12 border-b border-dashed border-slate-400 mt-2" />
            <p className="mt-1">Director, Registrar & Alumni Affairs Directorate</p>
            <p className="text-[10px] text-slate-500">የሬጅስትራርና ምሩቃን ጉዲይ ፅ/ቤት ዲይሬክተር</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Approved By:</p>
            <div className="h-12 border-b border-dashed border-slate-400 mt-2" />
            <p className="mt-1">Registrar General / Academic Vice President</p>
          </div>
        </div>

      </div>

    </div>
  );
};

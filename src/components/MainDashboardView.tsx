/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Alumnus, CollegeType, QualificationLevel } from '../types/alumni';
import {
  calculateDashboardMetrics,
  getCollegeDistributionChartData,
  getGraduationYearsChartData,
  getQualificationDistributionData,
  getEmploymentStatusData,
  getEmploymentByCollegeData,
  getDepartmentDistributionData,
  getGenderDistributionData,
  getEmploymentSectorData,
  getHistoricalTimelineData
} from '../utils/statisticsCalculator';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface MainDashboardViewProps {
  alumni: Alumnus[];
  onSelectCollege?: (col: CollegeType) => void;
}

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({ alumni, onSelectCollege }) => {
  // Filters
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedQualification, setSelectedQualification] = useState<string>('All');
  const [selectedYearRange, setSelectedYearRange] = useState<string>('All');

  // Filtered dataset
  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      if (selectedCollege !== 'All' && a.college !== selectedCollege) return false;
      if (selectedQualification !== 'All' && a.qualification !== selectedQualification) return false;
      if (selectedYearRange !== 'All') {
        const [start, end] = selectedYearRange.split('-').map(Number);
        if (a.graduationYear < start || a.graduationYear > end) return false;
      }
      return true;
    });
  }, [alumni, selectedCollege, selectedQualification, selectedYearRange]);

  // Dynamic calculations from filtered data
  const metrics = useMemo(() => calculateDashboardMetrics(filteredAlumni), [filteredAlumni]);
  const collegeDist = useMemo(() => getCollegeDistributionChartData(filteredAlumni), [filteredAlumni]);
  const yearTrends = useMemo(() => getGraduationYearsChartData(filteredAlumni), [filteredAlumni]);
  const qualDist = useMemo(() => getQualificationDistributionData(filteredAlumni), [filteredAlumni]);
  const empDist = useMemo(() => getEmploymentStatusData(filteredAlumni), [filteredAlumni]);
  const empByCol = useMemo(() => getEmploymentByCollegeData(filteredAlumni), [filteredAlumni]);
  const deptDist = useMemo(() => getDepartmentDistributionData(filteredAlumni).slice(0, 8), [filteredAlumni]);
  const genderDist = useMemo(() => getGenderDistributionData(filteredAlumni), [filteredAlumni]);
  const sectorDist = useMemo(() => getEmploymentSectorData(filteredAlumni), [filteredAlumni]);
  const timelineData = useMemo(() => getHistoricalTimelineData(filteredAlumni), [filteredAlumni]);

  const resetFilters = () => {
    setSelectedCollege('All');
    setSelectedQualification('All');
    setSelectedYearRange('All');
  };

  const hasActiveFilters = selectedCollege !== 'All' || selectedQualification !== 'All' || selectedYearRange !== 'All';

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A192F] text-white p-3 rounded-lg border border-amber-500/30 shadow-xl text-xs space-y-1">
          <p className="font-bold text-amber-400">{label || payload[0]?.name}</p>
          {payload.map((item: any, idx: number) => (
            <p key={idx} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-slate-300">{item.name}:</span>
              <span className="font-semibold text-white">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header & Filter Bar */}
      <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Institutional Alumni Dashboard</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              1999–Present
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics dynamically computed from active database ({filteredAlumni.length} records matching criteria).
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="bg-[#0F284E] text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            aria-label="Filter by College"
          >
            <option value="All">All Colleges</option>
            <option value="College of Engineering">College of Engineering</option>
            <option value="College of Health Sciences">College of Health Sciences</option>
            <option value="College of Business and Social Studies">College of Business & Social Studies</option>
          </select>

          <select
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            className="bg-[#0F284E] text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            aria-label="Filter by Qualification"
          >
            <option value="All">All Qualifications</option>
            <option value="Diploma">Diploma (1st Batch 1999)</option>
            <option value="Bachelor's Degree">Bachelor's Degree (1st Batch 2002)</option>
            <option value="Master's Degree">Master's Degree (from 2008)</option>
            <option value="PhD">PhD (from 2016)</option>
          </select>

          <select
            value={selectedYearRange}
            onChange={(e) => setSelectedYearRange(e.target.value)}
            className="bg-[#0F284E] text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            aria-label="Filter by Year Window"
          >
            <option value="All">All Years (1999–2026)</option>
            <option value="1999-2005">1999–2005 (Founding Batches)</option>
            <option value="2006-2015">2006–2015 (Expansion Era)</option>
            <option value="2016-2026">2016–Present (Modern Era)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1.5 rounded bg-rose-500/10 border border-rose-500/30 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Analytical Integrity & Coverage Banner */}
      <div className="bg-[#0B1E3B] border-l-4 border-amber-400 p-4 rounded-r-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-semibold text-white">Data Integrity Standard: </span>
            <span>
              All stats are computed live. Unknown employment status ({metrics.totalUnknownEmployment} records) is explicitly isolated from unemployment ({metrics.totalUnemployed} records).
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] shrink-0 font-medium text-slate-400">
          <span>Employment Coverage: <strong className="text-emerald-400">{metrics.employmentDataCoverageRate}%</strong></span>
          <span>Verified: <strong className="text-amber-400">{metrics.verifiedRate}%</strong></span>
        </div>
      </div>

      {/* SECTION A: MAIN STATISTICAL INDICATORS (12 CARDS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Key Institutional Indicators</span>
          </h3>
          <span className="text-[11px] text-slate-400">12 Primary Aggregates</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* 1. Total Registered Alumni */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-amber-500/30 shadow-md">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Registered Alumni</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">{metrics.totalAlumni.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Batches: {metrics.yearsRange.min}–{metrics.yearsRange.max}</p>
          </div>

          {/* 2. Engineering College */}
          <div 
            onClick={() => onSelectCollege && onSelectCollege('College of Engineering')}
            className="bg-[#0A192F] hover:bg-[#0E2448] p-4 rounded-xl border border-blue-900/60 shadow-md cursor-pointer transition"
          >
            <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Engineering College</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalEngineering.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              {metrics.totalAlumni > 0 ? Math.round((metrics.totalEngineering / metrics.totalAlumni) * 100) : 0}% of University
            </p>
          </div>

          {/* 3. Health Sciences */}
          <div 
            onClick={() => onSelectCollege && onSelectCollege('College of Health Sciences')}
            className="bg-[#0A192F] hover:bg-[#0E2448] p-4 rounded-xl border border-emerald-900/60 shadow-md cursor-pointer transition"
          >
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Health Sciences College</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalHealthSciences.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              {metrics.totalAlumni > 0 ? Math.round((metrics.totalHealthSciences / metrics.totalAlumni) * 100) : 0}% of University
            </p>
          </div>

          {/* 4. Business & Social Studies */}
          <div 
            onClick={() => onSelectCollege && onSelectCollege('College of Business and Social Studies')}
            className="bg-[#0A192F] hover:bg-[#0E2448] p-4 rounded-xl border border-amber-900/60 shadow-md cursor-pointer transition"
          >
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Business & Social Studies</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalBusinessSocial.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              {metrics.totalAlumni > 0 ? Math.round((metrics.totalBusinessSocial / metrics.totalAlumni) * 100) : 0}% of University
            </p>
          </div>

          {/* 5. Diploma Graduates */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
            <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Diploma Graduates</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalDiploma.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">1st batch 1999, 2nd 2000, 3rd 2001...</p>
          </div>

          {/* 6. Bachelor's Degree */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
            <p className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Bachelor's Degrees</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalBachelors.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">1st batch 2002, 2nd 2003, 3rd 2004...</p>
          </div>

          {/* 7. Master's Degree */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Master's Degrees</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalMasters.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Postgraduate cohort</p>
          </div>

          {/* 8. PhD Graduates */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
            <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">PhD Graduates</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{metrics.totalPhD.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Doctoral & Terminal research</p>
          </div>

          {/* 9. Employed Alumni */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-emerald-950/80 shadow-md">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Total Employed</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{metrics.totalEmployed.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">ENDF, DEIC, INSA, Civil, etc.</p>
          </div>

          {/* 10. Self-Employed */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-sky-950/80 shadow-md">
            <p className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Self-Employed / Ventures</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1">{metrics.totalSelfEmployed.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Enterprises & Consultants</p>
          </div>

          {/* 11. Unemployed Alumni */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-rose-950/80 shadow-md">
            <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Total Unemployed</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">{metrics.totalUnemployed.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Actively seeking placement</p>
          </div>

          {/* 12. Unknown Employment Status */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-700/80 shadow-md">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Unknown Status</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-300 mt-1">{metrics.totalUnknownEmployment.toLocaleString()}</p>
            <p className="text-[10px] text-amber-400/80 mt-1">Tracer follow-up required</p>
          </div>

        </div>
      </section>

      {/* SECTION B: 10 INTERACTIVE VISUALIZATIONS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Institutional Visual Analytics Suite (10 Charts)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Interactive Tooltips & Filtering</span>
        </div>

        {/* ROW 1: Charts 1, 2, 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Alumni Distribution by College */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>1. Distribution by College</span>
                <span className="text-[10px] font-normal text-slate-400">Doughnut</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Graduate headcount share across colleges</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collegeDist}
                    dataKey="count"
                    nameKey="fullName"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {collegeDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(val) => <span className="text-[11px] text-slate-300">{val}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Graduates by Graduation Year */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>2. Graduates by Graduation Year</span>
                <span className="text-[10px] font-normal text-slate-400">Bar Chart</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Total alumni produced per graduation batch</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Graduates" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: College-wise Graduation Trends */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>3. College-wise Graduation Trends</span>
                <span className="text-[10px] font-normal text-slate-400">Multi-Line</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Comparative growth by college over time</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(val) => <span className="text-[10px] text-slate-300">{val}</span>} 
                  />
                  <Line type="monotone" dataKey="engineering" name="Engineering" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="health" name="Health Sciences" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="business" name="Business & Social" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ROW 2: Charts 4, 5, 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 4: Qualification Distribution */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>4. Qualification Level Breakdown</span>
                <span className="text-[10px] font-normal text-slate-400">Bar</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Diploma through Doctoral degrees</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Alumni" fill="#38BDF8" radius={[4, 4, 0, 0]}>
                    {qualDist.map((entry, index) => (
                      <Cell key={`cell-qual-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Employment Status Distribution */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>5. Employment Status Distribution</span>
                <span className="text-[10px] font-normal text-slate-400">Doughnut</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Tracer indicators (Employed, Self, Unemployed, Unknown)</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={empDist}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {empDist.map((entry, index) => (
                      <Cell key={`cell-emp-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(val) => <span className="text-[10px] text-slate-300">{val}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 6: Employment by College */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>6. Employment by College</span>
                <span className="text-[10px] font-normal text-slate-400">Stacked Bar</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Employment outcomes mapped to college of origin</p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={empByCol}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="college" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(val) => <span className="text-[10px] text-slate-300">{val}</span>} />
                  <Bar dataKey="employed" name="Employed" stackId="a" fill="#10B981" />
                  <Bar dataKey="selfEmployed" name="Self-Emp" stackId="a" fill="#0EA5E9" />
                  <Bar dataKey="unemployed" name="Unemployed" stackId="a" fill="#EF4444" />
                  <Bar dataKey="unknown" name="Unknown" stackId="a" fill="#64748B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ROW 3: Charts 7, 8, 9 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 7: Graduates by Department */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>7. Graduates by Department</span>
                <span className="text-[10px] font-normal text-slate-400">Horizontal Bar</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Top department graduate distribution</p>
            </div>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                  <YAxis type="category" dataKey="department" stroke="#94A3B8" fontSize={9} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Graduates" fill="#818CF8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 8: Gender Distribution */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>8. Gender Distribution</span>
                <span className="text-[10px] font-normal text-slate-400">Pie Chart</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Gender equity representation across cohorts</p>
            </div>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDist}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label={(entry: any) => `${String(entry.name || '').split(' ')[0]}: ${entry.value ?? entry.count ?? ''}`}
                    fontSize={11}
                  >
                    {genderDist.map((entry, index) => (
                      <Cell key={`cell-gender-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(val) => <span className="text-[11px] text-slate-300">{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 9: Employment Sector Distribution */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>9. Employment Sector Distribution</span>
                <span className="text-[10px] font-normal text-slate-400">Bar Chart</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Absorption in Defence vs Civil vs Private</p>
            </div>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="sector" stroke="#94A3B8" fontSize={9} interval={0} angle={-25} textAnchor="end" height={60} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Alumni" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ROW 4: Chart 10 - Historical Timeline (1999–Present) */}
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-amber-500/30 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-base font-serif font-bold text-amber-400 flex items-center gap-2">
                <span>10. Historical Alumni Graduation Trends (1999–Present)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Longitudinal growth tracking from the inaugural 1999 Diploma batch through current graduation cycles.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-sm" />
                <span className="text-slate-300">Annual Graduates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-400" />
                <span className="text-slate-300">Cumulative Alumni</span>
              </div>
            </div>
          </div>

          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="annualGraduates" 
                  name="Annual Graduates" 
                  stroke="#D4AF37" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#D4AF37' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeAlumni" 
                  name="Cumulative Total" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={{ r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

    </div>
  );
};

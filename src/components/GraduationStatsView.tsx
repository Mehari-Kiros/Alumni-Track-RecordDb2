/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Alumnus, CollegeType } from '../types/alumni';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  Calendar, 
  ArrowLeftRight, 
  Award, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  CheckSquare, 
  Square,
  Sparkles
} from 'lucide-react';

interface GraduationStatsViewProps {
  alumni: Alumnus[];
}

export const GraduationStatsView: React.FC<GraduationStatsViewProps> = ({ alumni }) => {
  // Available graduation years starting with 1999 up to max year
  const allYears = useMemo(() => {
    const yearsSet = new Set<number>();
    yearsSet.add(1999); // Historical baseline
    alumni.forEach(a => {
      if (a.graduationYear >= 1999) yearsSet.add(a.graduationYear);
    });
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [alumni]);

  const latestYear = allYears[allYears.length - 1] || 1999;

  // Single year selection or comparison mode
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);
  const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);
  const [comparedYears, setComparedYears] = useState<number[]>([1999, latestYear]);

  // Single Year Analytics
  const singleYearAlumni = useMemo(() => {
    return alumni.filter(a => a.graduationYear === selectedYear);
  }, [alumni, selectedYear]);

  // Previous year analytics for comparison
  const prevYear = selectedYear - 1;
  const prevYearAlumni = useMemo(() => {
    return alumni.filter(a => a.graduationYear === prevYear);
  }, [alumni, prevYear]);

  const yearTotal = singleYearAlumni.length;
  const prevYearTotal = prevYearAlumni.length;
  const growthRate = prevYearTotal > 0 ? Math.round(((yearTotal - prevYearTotal) / prevYearTotal) * 100) : 0;

  // Single year college breakdown
  const collegeCounts = {
    'College of Engineering': singleYearAlumni.filter(a => a.college === 'College of Engineering').length,
    'College of Health Sciences': singleYearAlumni.filter(a => a.college === 'College of Health Sciences').length,
    'College of Business and Social Studies': singleYearAlumni.filter(a => a.college === 'College of Business and Social Studies').length
  };

  const collegeChartData = [
    { name: 'Engineering', count: collegeCounts['College of Engineering'], color: '#3B82F6' },
    { name: 'Health Sciences', count: collegeCounts['College of Health Sciences'], color: '#10B981' },
    { name: 'Business & Social', count: collegeCounts['College of Business and Social Studies'], color: '#F59E0B' }
  ];

  // Single year qualification breakdown
  const qualChartData = [
    { name: 'Diploma', count: singleYearAlumni.filter(a => a.qualification === 'Diploma').length, color: '#818CF8' },
    { name: "Bachelor's", count: singleYearAlumni.filter(a => a.qualification === "Bachelor's Degree").length, color: '#38BDF8' },
    { name: "Master's", count: singleYearAlumni.filter(a => a.qualification === "Master's Degree").length, color: '#34D399' },
    { name: 'PhD', count: singleYearAlumni.filter(a => a.qualification === 'PhD').length, color: '#FBBF24' }
  ];

  // Single year employment status
  const empCounts = {
    employed: singleYearAlumni.filter(a => a.employmentStatus === 'Employed').length,
    selfEmployed: singleYearAlumni.filter(a => a.employmentStatus === 'Self-Employed').length,
    unemployed: singleYearAlumni.filter(a => a.employmentStatus === 'Unemployed').length,
    unknown: singleYearAlumni.filter(a => a.employmentStatus === 'Unknown').length
  };

  // Multi-Year Comparison Dataset
  const multiYearComparisonData = useMemo(() => {
    return comparedYears.sort((a, b) => a - b).map(yr => {
      const cohort = alumni.filter(a => a.graduationYear === yr);
      const eng = cohort.filter(a => a.college === 'College of Engineering').length;
      const chs = cohort.filter(a => a.college === 'College of Health Sciences').length;
      const bss = cohort.filter(a => a.college === 'College of Business and Social Studies').length;
      const emp = cohort.filter(a => a.employmentStatus === 'Employed' || a.employmentStatus === 'Self-Employed').length;

      return {
        year: yr.toString(),
        total: cohort.length,
        engineering: eng,
        healthSciences: chs,
        businessSocial: bss,
        employed: emp,
        employmentRatePct: cohort.length > 0 ? Math.round((emp / cohort.length) * 100) : 0
      };
    });
  }, [alumni, comparedYears]);

  const toggleComparedYear = (yr: number) => {
    if (comparedYears.includes(yr)) {
      if (comparedYears.length > 1) {
        setComparedYears(comparedYears.filter(y => y !== yr));
      }
    } else {
      if (comparedYears.length < 5) {
        setComparedYears([...comparedYears, yr]);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header and Mode Switcher */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-white">Graduation-Year Analysis</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              1999–Present
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Examine cohort outcomes beginning from the first 1999 Diploma graduate batch or run multi-year comparisons.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 bg-[#0F284E] p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setIsComparisonMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !isComparisonMode
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Single Year Focus
          </button>
          <button
            onClick={() => setIsComparisonMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isComparisonMode
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Multi-Year Comparison</span>
          </button>
        </div>
      </div>

      {/* MODE 1: SINGLE YEAR FOCUS */}
      {!isComparisonMode ? (
        <div className="space-y-6">
          
          {/* Year Buttons Strip (1999 to Latest) */}
          <div className="bg-[#0A192F] p-4 rounded-2xl border border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Graduation Year Batch:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {allYears.map(yr => {
                const count = alumni.filter(a => a.graduationYear === yr).length;
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-[#0F284E] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{yr}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-900 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>
                      {count}
                    </span>
                    {yr === 1999 && (
                      <span className="text-[9px] uppercase tracking-tighter opacity-80 font-bold">1st</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Year Summary Banner */}
          <div className="bg-gradient-to-r from-[#071326] via-[#0A192F] to-[#122B55] border border-amber-500/30 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                    Batch Year: {selectedYear}
                  </span>
                  {selectedYear === 1999 && (
                    <span className="text-xs text-amber-400 font-semibold">
                      ★ Historical Inaugural Diploma Batch of Ethiopian Defence University
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-serif font-bold mt-2">
                  Graduation Class of {selectedYear}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Full trace record analysis for graduates completing their credentials in the academic year {selectedYear}.
                </p>
              </div>

              {/* Numerical Badges */}
              <div className="flex items-center gap-3">
                <div className="bg-[#0F284E] px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Cohort</span>
                  <span className="text-2xl font-bold text-amber-400">{yearTotal}</span>
                </div>
                <div className="bg-[#0F284E] px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Employment</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {yearTotal > 0 ? Math.round(((empCounts.employed + empCounts.selfEmployed) / yearTotal) * 100) : 0}%
                  </span>
                </div>
                {prevYearTotal > 0 && (
                  <div className="bg-[#0F284E] px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">vs {prevYear}</span>
                    <span className={`text-2xl font-bold ${growthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Visual Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Graduates by College in Selected Year */}
            <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>College Distribution ({selectedYear})</span>
                <span className="text-[10px] text-slate-400">Bar</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">College origins for this batch</p>
              <div className="h-60 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collegeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} />
                    <Bar dataKey="count" name="Graduates" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      {collegeChartData.map((e, i) => (
                        <Cell key={`c-${i}`} fill={e.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Qualification Distribution in Selected Year */}
            <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Qualifications Awarded</span>
                <span className="text-[10px] text-slate-400">Pie</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Diploma to Postgraduate share</p>
              <div className="h-60 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualChartData.filter(q => q.count > 0)}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {qualChartData.map((e, i) => (
                        <Cell key={`q-${i}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} />
                    <Legend formatter={(val) => <span className="text-[10px] text-slate-300">{val}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employment Status in Selected Year */}
            <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Employment Status</span>
                <span className="text-[10px] text-slate-400">Outcomes</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Career status for {selectedYear} alumni</p>
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F284E] border border-slate-700/60">
                  <span className="text-xs text-slate-200 font-medium">Employed</span>
                  <span className="text-xs font-bold text-emerald-400">{empCounts.employed}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F284E] border border-slate-700/60">
                  <span className="text-xs text-slate-200 font-medium">Self-Employed / Founder</span>
                  <span className="text-xs font-bold text-sky-400">{empCounts.selfEmployed}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F284E] border border-slate-700/60">
                  <span className="text-xs text-slate-200 font-medium">Unemployed</span>
                  <span className="text-xs font-bold text-rose-400">{empCounts.unemployed}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F284E] border border-slate-700/60">
                  <span className="text-xs text-slate-200 font-medium">Unknown / Tracer Pending</span>
                  <span className="text-xs font-bold text-slate-400">{empCounts.unknown}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Cohort Graduates Listing Table */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h4 className="text-sm font-bold text-white">Graduates in Batch {selectedYear} ({singleYearAlumni.length})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Alumni ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">College</th>
                    <th className="p-3">Qualification</th>
                    <th className="p-3">Employer</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {singleYearAlumni.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-850/50">
                      <td className="p-3 font-mono font-medium text-amber-400">{a.alumniId}</td>
                      <td className="p-3 font-semibold text-white">{a.fullName}</td>
                      <td className="p-3">{a.college}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300">
                          {a.qualification}
                        </span>
                      </td>
                      <td className="p-3">{a.currentEmployer}</td>
                      <td className="p-3">{a.currentPosition}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          a.employmentStatus === 'Employed' ? 'bg-emerald-500/20 text-emerald-400' :
                          a.employmentStatus === 'Self-Employed' ? 'bg-sky-500/20 text-sky-400' :
                          a.employmentStatus === 'Unemployed' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {a.employmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* MODE 2: MULTI-YEAR COMPARISON */
        <div className="space-y-6">
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Years to Compare (up to 5 cohorts simultaneously):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {allYears.map(yr => {
                const isChecked = comparedYears.includes(yr);
                return (
                  <button
                    key={yr}
                    onClick={() => toggleComparedYear(yr)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isChecked
                        ? 'bg-amber-400 text-slate-950 font-bold shadow'
                        : 'bg-[#0F284E] text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    <span>{yr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparative Chart */}
          <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center justify-between">
              <span>Multi-Year Cohort Comparison</span>
              <span className="text-xs font-normal text-slate-400">Comparing {comparedYears.length} Batches</span>
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={multiYearComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} />
                  <Legend formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} />
                  <Bar dataKey="total" name="Total Batch Size" fill="#D4AF37" />
                  <Bar dataKey="engineering" name="Engineering" fill="#3B82F6" />
                  <Bar dataKey="healthSciences" name="Health Sciences" fill="#10B981" />
                  <Bar dataKey="businessSocial" name="Business & Social" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparative Data Grid */}
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
            <h4 className="text-sm font-bold text-white mb-4">Cohort Comparison Summary Table</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Graduation Year</th>
                    <th className="p-3">Total Graduates</th>
                    <th className="p-3">Engineering</th>
                    <th className="p-3">Health Sciences</th>
                    <th className="p-3">Business & Social</th>
                    <th className="p-3">Employed</th>
                    <th className="p-3">Employment Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {multiYearComparisonData.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-850/50">
                      <td className="p-3 font-bold text-amber-400">{row.year}</td>
                      <td className="p-3 font-semibold text-white">{row.total}</td>
                      <td className="p-3">{row.engineering}</td>
                      <td className="p-3">{row.healthSciences}</td>
                      <td className="p-3">{row.businessSocial}</td>
                      <td className="p-3 text-emerald-400 font-semibold">{row.employed}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          {row.employmentRatePct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

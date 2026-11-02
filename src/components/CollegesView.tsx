/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Alumnus, CollegeType } from '../types/alumni';
import { COLLEGES_METADATA } from '../data/initialAlumniData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  GraduationCap, 
  Activity, 
  Award, 
  MapPin, 
  User, 
  Calendar, 
  Briefcase, 
  Shield, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface CollegesViewProps {
  alumni: Alumnus[];
  initialCollege?: CollegeType;
}

export const CollegesView: React.FC<CollegesViewProps> = ({ 
  alumni, 
  initialCollege = 'College of Engineering' 
}) => {
  const [selectedCollege, setSelectedCollege] = useState<CollegeType>(initialCollege);

  const collegeMeta = COLLEGES_METADATA.find(c => c.name === selectedCollege) || COLLEGES_METADATA[0];

  // College-specific alumni records
  const collegeAlumni = alumni.filter(a => a.college === selectedCollege);
  const totalGraduates = collegeAlumni.length;

  // Department breakdown
  const departmentCounts: Record<string, number> = {};
  collegeAlumni.forEach(a => {
    const d = a.department || 'General';
    departmentCounts[d] = (departmentCounts[d] || 0) + 1;
  });
  const departmentChartData = Object.entries(departmentCounts)
    .map(([dept, count]) => ({
      name: dept.length > 25 ? dept.slice(0, 23) + '...' : dept,
      fullName: dept,
      count
    }))
    .sort((a, b) => b.count - a.count);

  // Academic Program breakdown
  const programCounts: Record<string, number> = {};
  collegeAlumni.forEach(a => {
    const p = a.academicProgram || 'General Program';
    programCounts[p] = (programCounts[p] || 0) + 1;
  });
  const programChartData = Object.entries(programCounts)
    .map(([prog, count]) => ({
      name: prog.length > 28 ? prog.slice(0, 26) + '...' : prog,
      fullName: prog,
      count
    }))
    .sort((a, b) => b.count - a.count);

  // Qualification breakdown
  const qualCounts = {
    Diploma: collegeAlumni.filter(a => a.qualification === 'Diploma').length,
    "Bachelor's Degree": collegeAlumni.filter(a => a.qualification === "Bachelor's Degree").length,
    "Master's Degree": collegeAlumni.filter(a => a.qualification === "Master's Degree").length,
    PhD: collegeAlumni.filter(a => a.qualification === 'PhD').length
  };
  const qualChartData = [
    { name: 'Diploma', count: qualCounts.Diploma, color: '#818CF8' },
    { name: "Bachelor's", count: qualCounts["Bachelor's Degree"], color: '#38BDF8' },
    { name: "Master's", count: qualCounts["Master's Degree"], color: '#34D399' },
    { name: 'PhD', count: qualCounts.PhD, color: '#FBBF24' }
  ];

  // Employment status
  const empCounts = {
    Employed: collegeAlumni.filter(a => a.employmentStatus === 'Employed').length,
    SelfEmployed: collegeAlumni.filter(a => a.employmentStatus === 'Self-Employed').length,
    Unemployed: collegeAlumni.filter(a => a.employmentStatus === 'Unemployed').length,
    Unknown: collegeAlumni.filter(a => a.employmentStatus === 'Unknown').length
  };
  const empChartData = [
    { name: 'Employed', count: empCounts.Employed, color: '#10B981' },
    { name: 'Self-Employed', count: empCounts.SelfEmployed, color: '#0EA5E9' },
    { name: 'Unemployed', count: empCounts.Unemployed, color: '#EF4444' },
    { name: 'Unknown', count: empCounts.Unknown, color: '#94A3B8' }
  ];

  // Employment Sector
  const sectorCounts: Record<string, number> = {};
  collegeAlumni.forEach(a => {
    const s = a.employmentSector || 'Unknown';
    sectorCounts[s] = (sectorCounts[s] || 0) + 1;
  });
  const sectorChartData = Object.entries(sectorCounts).map(([sector, count]) => ({
    sector,
    count
  })).sort((a, b) => b.count - a.count);

  // Graduation Trends (1999 to Present)
  const years = Array.from(new Set(collegeAlumni.map(a => a.graduationYear))).sort((a, b) => a - b);
  const minYr = Math.min(...years, 1999);
  const maxYr = Math.max(...years, 1999);
  const yearlyTrends = [];
  for (let y = minYr; y <= maxYr; y++) {
    const inYr = collegeAlumni.filter(a => a.graduationYear === y).length;
    yearlyTrends.push({ year: y.toString(), graduates: inYr });
  }

  // Top Employers in this college
  const employerMap: Record<string, number> = {};
  collegeAlumni.forEach(a => {
    if (a.currentEmployer && a.currentEmployer.toLowerCase() !== 'unknown' && a.currentEmployer.toLowerCase() !== 'none (seeking employment)') {
      employerMap[a.currentEmployer] = (employerMap[a.currentEmployer] || 0) + 1;
    }
  });
  const topEmployers = Object.entries(employerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getCollegeIcon = (name: CollegeType) => {
    if (name === 'College of Engineering') return <GraduationCap className="w-5 h-5 text-blue-400" />;
    if (name === 'College of Health Sciences') return <Activity className="w-5 h-5 text-emerald-400" />;
    return <Award className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* College Tabs Header */}
      <div className="bg-[#0A192F] p-2 rounded-2xl border border-slate-800 shadow-md flex flex-wrap gap-2">
        {COLLEGES_METADATA.map((c) => {
          const isSelected = selectedCollege === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setSelectedCollege(c.name)}
              className={`flex-1 min-w-[240px] flex items-center justify-between p-3.5 rounded-xl transition text-left ${
                isSelected
                  ? 'bg-[#0F284E] text-white border-2 border-amber-400 shadow-lg'
                  : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                  {getCollegeIcon(c.name)}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Est. {c.establishedYear} • {c.shortName}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {alumni.filter(a => a.college === c.name).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* College Institutional Profile Header Card */}
      <div className="bg-gradient-to-r from-[#071326] via-[#0A192F] to-[#122B55] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                {collegeMeta.shortName} Profile
              </span>
              <span className="text-xs text-slate-400">
                Inception: {collegeMeta.establishedYear} {collegeMeta.establishedYear === 1999 ? '(Founding University Batch)' : ''}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {collegeMeta.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {collegeMeta.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-[#0F284E] px-3 py-1.5 rounded-lg border border-slate-700">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Dean: <strong>{collegeMeta.dean}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0F284E] px-3 py-1.5 rounded-lg border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Campus: <strong>{collegeMeta.location}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="bg-[#0F284E]/80 border border-amber-500/30 p-5 rounded-xl shrink-0 flex flex-col items-center justify-center min-w-[200px]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Graduates</span>
            <span className="text-4xl font-extrabold text-amber-400 mt-1">{totalGraduates}</span>
            <div className="mt-3 text-[11px] text-center text-slate-300 border-t border-slate-700 pt-2 w-full">
              <span>{Math.round((empCounts.Employed + empCounts.SelfEmployed) / (totalGraduates || 1) * 100)}% Employment Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* College Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Graduation Trends from 1999 to Present */}
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Graduation Trends (1999–Present)</span>
            </h3>
            <span className="text-[11px] text-slate-400">Annual Batch Count</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTrends.filter(t => t.graduates > 0 || parseInt(t.year) === 1999)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} 
                  itemStyle={{ color: '#F3BA2F' }}
                />
                <Bar dataKey="graduates" name="Graduates" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Graduates by Department */}
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Graduates by Department</span>
            </h3>
            <span className="text-[11px] text-slate-400">Department Share</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={10} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} 
                />
                <Bar dataKey="count" name="Alumni" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Graduates by Qualification */}
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Graduates by Qualification Level</span>
            </h3>
            <span className="text-[11px] text-slate-400">Diploma to Doctorate</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualChartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {qualChartData.map((entry, index) => (
                    <Cell key={`cell-q-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} />
                <Legend formatter={(val) => <span className="text-[11px] text-slate-300">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Employment Status & Sectors */}
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Employment Sectors for {collegeMeta.shortName}</span>
            </h3>
            <span className="text-[11px] text-slate-400">Absorption Area</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="sector" stroke="#94A3B8" fontSize={9} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} />
                <Bar dataKey="count" name="Alumni" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Employers Strip for College */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Top Institutional Employers of {collegeMeta.name} Alumni</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topEmployers.length > 0 ? (
            topEmployers.map(([employer, count], idx) => (
              <div key={idx} className="bg-[#0F284E] p-3 rounded-xl border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-200 line-clamp-2">{employer}</span>
                <span className="text-xs font-bold text-amber-400 mt-2">{count} Graduate{count > 1 ? 's' : ''}</span>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center text-xs text-slate-400 py-4">
              Employer records will automatically populate upon data upload.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

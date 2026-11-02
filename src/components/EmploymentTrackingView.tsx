/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Alumnus, EmploymentSector } from '../types/alumni';
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
  Briefcase, 
  ShieldCheck, 
  Building, 
  GraduationCap, 
  TrendingUp, 
  Award,
  Users,
  Compass
} from 'lucide-react';

interface EmploymentTrackingViewProps {
  alumni: Alumnus[];
}

export const EmploymentTrackingView: React.FC<EmploymentTrackingViewProps> = ({ alumni }) => {
  const total = alumni.length;

  const employedList = useMemo(() => alumni.filter(a => a.employmentStatus === 'Employed'), [alumni]);
  const selfEmployedList = useMemo(() => alumni.filter(a => a.employmentStatus === 'Self-Employed'), [alumni]);
  const unemployedList = useMemo(() => alumni.filter(a => a.employmentStatus === 'Unemployed'), [alumni]);
  const unknownList = useMemo(() => alumni.filter(a => a.employmentStatus === 'Unknown'), [alumni]);

  // Overall Tracer Metrics
  const activeWorking = employedList.length + selfEmployedList.length;
  const employmentRate = total > 0 ? Math.round((activeWorking / total) * 100) : 0;
  const tracerCoverage = total > 0 ? Math.round(((total - unknownList.length) / total) * 100) : 0;

  // Defence & Security Sector Absorption
  const defenceAbsorbed = alumni.filter(a => 
    a.employmentSector === 'Military & Defence' || 
    (a.currentEmployer && (
      a.currentEmployer.includes('Defence') || 
      a.currentEmployer.includes('ENDF') || 
      a.currentEmployer.includes('DEIC') || 
      a.currentEmployer.includes('INSA') || 
      a.currentEmployer.includes('Air Force') ||
      a.currentEmployer.includes('Armed Forces')
    ))
  );
  const defenceAbsorptionRate = activeWorking > 0 ? Math.round((defenceAbsorbed.length / activeWorking) * 100) : 0;

  // Sector breakdown chart data
  const sectorCounts: Record<string, number> = {};
  alumni.forEach(a => {
    const sec = a.employmentSector || 'Unknown';
    sectorCounts[sec] = (sectorCounts[sec] || 0) + 1;
  });

  const sectorChartData = Object.entries(sectorCounts)
    .map(([sector, count]) => ({
      name: sector,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Top Employers Ranking
  const employersMap: Record<string, { count: number; sector: EmploymentSector }> = {};
  alumni.forEach(a => {
    const emp = a.currentEmployer?.trim();
    if (emp && emp.toLowerCase() !== 'unknown' && !emp.toLowerCase().includes('unemployed') && !emp.toLowerCase().includes('seeking')) {
      if (!employersMap[emp]) {
        employersMap[emp] = { count: 0, sector: a.employmentSector };
      }
      employersMap[emp].count++;
    }
  });

  const topEmployersList = Object.entries(employersMap)
    .map(([name, data]) => ({ name, count: data.count, sector: data.sector }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Alumni with Advanced Further Education
  const advancedStudyAlumni = alumni.filter(a => a.furtherEducation && a.furtherEducation.trim() !== '');

  // Leadership rank distribution in Defence / Public Service
  const seniorOfficers = alumni.filter(a => 
    a.fullName.includes('Gen.') || 
    a.fullName.includes('Col.') || 
    a.fullName.includes('Maj.') || 
    a.fullName.includes('Dr.') || 
    a.fullName.includes('Dean') || 
    a.currentPosition?.toLowerCase().includes('director') ||
    a.currentPosition?.toLowerCase().includes('head') ||
    a.currentPosition?.toLowerCase().includes('chief')
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Tracer Header Banner */}
      <div className="bg-gradient-to-r from-[#071326] via-[#0A192F] to-[#122B55] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Graduate Tracer Study Analytics (1999–Present)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Alumni Employment Tracking & National Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitoring career trajectories, strategic defense sector absorption, entrepreneurial ventures, 
              and institutional contributions of Ethiopian Defence University graduates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-[#0F284E] p-3.5 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Overall Employment</span>
              <span className="text-3xl font-extrabold text-emerald-400 mt-1">{employmentRate}%</span>
            </div>
            <div className="bg-[#0F284E] p-3.5 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Defence Absorption</span>
              <span className="text-3xl font-extrabold text-amber-400 mt-1">{defenceAbsorptionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracer Key Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Salaried Employed</span>
          </div>
          <p className="text-2xl font-bold text-white">{employedList.length}</p>
          <span className="text-[10px] text-slate-400">{Math.round((employedList.length / (total || 1)) * 100)}% of tracked alumni</span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <Building className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Self-Employed / Enterprises</span>
          </div>
          <p className="text-2xl font-bold text-white">{selfEmployedList.length}</p>
          <span className="text-[10px] text-slate-400">Entrepreneurs & Consultancies</span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Strategic Sector Role</span>
          </div>
          <p className="text-2xl font-bold text-white">{defenceAbsorbed.length}</p>
          <span className="text-[10px] text-slate-400">ENDF, DEIC, Air Force, INSA</span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Advanced Further Study</span>
          </div>
          <p className="text-2xl font-bold text-white">{advancedStudyAlumni.length}</p>
          <span className="text-[10px] text-slate-400">Postgraduate degrees / Specializations</span>
        </div>
      </div>

      {/* Visual Analytics Row: Sector Distribution & Top Employers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sector Breakdown Chart */}
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Employment Sector Distribution</h3>
              <p className="text-[11px] text-slate-400">Where Ethiopian Defence University graduates serve</p>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {sectorChartData.length} Sectors
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderColor: '#D4AF37' }} />
                <Bar dataKey="count" name="Alumni" fill="#14B8A6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Institutional Employers List */}
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Top 10 Institutional Employers</h3>
              <span className="text-[10px] text-amber-400 font-semibold">Track Record Verified</span>
            </div>
            <p className="text-[11px] text-slate-400">Leading organizations employing university graduates</p>
          </div>

          <div className="space-y-2 mt-2">
            {topEmployersList.map((emp, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F284E] border border-slate-700/60 hover:border-amber-400/40 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-semibold text-white">{emp.name}</h5>
                    <span className="text-[10px] text-slate-400">{emp.sector}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">{emp.count} Alumni</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leadership & Command Cohort Strip */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Leadership & Strategic Progression Highlights</span>
            </h3>
            <p className="text-xs text-slate-400">Notable commanders, deans, director generals, and senior specialists</p>
          </div>
          <span className="text-xs text-amber-400 font-medium">{seniorOfficers.length} Tracked Leaders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seniorOfficers.slice(0, 6).map((leader) => (
            <div key={leader.id} className="p-3.5 rounded-xl bg-[#0F284E] border border-slate-700/70 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{leader.fullName}</h4>
                  <p className="text-[11px] text-amber-300 font-medium">{leader.currentPosition}</p>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] rounded bg-slate-800 text-slate-300 font-mono">
                  {leader.graduationYear}
                </span>
              </div>
              <p className="text-[10px] text-slate-300">{leader.currentEmployer}</p>
              {leader.furtherEducation && (
                <p className="text-[9px] text-slate-400 italic">Edu: {leader.furtherEducation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

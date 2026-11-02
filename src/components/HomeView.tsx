/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UniversityLogo } from './UniversityLogo';
import { DashboardMetrics } from '../utils/statisticsCalculator';
import { NavTab } from './Navbar';
import { downloadAlumniTemplate } from '../utils/exportUtils';
import { SocialAndConnectBar } from './SocialAndConnectBar';
import { 
  BarChart3, 
  GraduationCap, 
  UploadCloud, 
  FileSpreadsheet, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Activity, 
  History,
  Download
} from 'lucide-react';

interface HomeViewProps {
  metrics: DashboardMetrics;
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ metrics, onNavigate }) => {
  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Institutional Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071326] via-[#0A192F] to-[#122B55] border border-amber-500/30 shadow-2xl p-8 sm:p-12 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <UniversityLogo size="md" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Official Institutional Track Record System • Est. 1999</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
                የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
              </h1>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
                ETHIOPIAN DEFENCE UNIVERSITY
              </h2>
              <h3 className="text-base sm:text-xl font-serif font-semibold text-amber-400 tracking-wide pt-1">
                ALUMNI TRACK RECORD DATABASE (EDU-ATRD) • የተመራቂዎች የትራክ ሪከርድ ዳታቤዝ
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl border-l-2 border-amber-400/80 pl-4 py-1">
              &ldquo;Connecting Graduate Achievements, Monitoring Career Progression, and Supporting Institutional Excellence.&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              A centralized digital repository and analytical intelligence dashboard designed to monitor,
              analyze, and present the educational and professional track records of graduates across
              the College of Engineering, College of Health Sciences, and College of Business & Social Studies,
              beginning from the historic 1999 inaugural Diploma batch, the 2002 inaugural Degree batch, through to subsequent and future cohorts.
            </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm tracking-wide transition shadow-lg shadow-amber-500/20"
            >
              <span>Explore Alumni Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0F284E] hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition"
            >
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Upload Alumni Dataset</span>
            </button>

            <button
              onClick={() => downloadAlumniTemplate('xlsx')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-amber-500/30 text-xs font-medium transition"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Excel Template</span>
            </button>
          </div>
        </div>

        {/* Right-hand side Official Insignia Showcase Card (Desktop) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0F284E]/90 border border-amber-400/40 shadow-2xl backdrop-blur-sm text-center shrink-0 w-72 space-y-3">
          <UniversityLogo size="2xl" standaloneImage={true} />
          <div className="space-y-1">
            <p className="font-serif font-bold text-sm text-amber-400">የኢትዮጵያ መከላከያ ዩኒቨርሲቲ</p>
            <p className="text-[11px] text-slate-200 font-semibold tracking-wide">ETHIOPIAN DEFENCE UNIVERSITY</p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-center gap-2 text-[10px] text-slate-300">
              <span className="font-mono text-amber-300">፲፱፻፺፩</span>
              <span>•</span>
              <span className="font-bold text-white">EST. 1999 / 2001</span>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Live Institutional Indicators Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Registered</p>
          <p className="text-2xl font-bold text-white mt-1">{metrics.totalAlumni.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-medium">100% Dynamic DB</span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Engineering</p>
          <p className="text-2xl font-bold text-white mt-1">{metrics.totalEngineering.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">
            {metrics.totalAlumni > 0 ? Math.round((metrics.totalEngineering / metrics.totalAlumni) * 100) : 0}% of alumni
          </span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Health Sciences</p>
          <p className="text-2xl font-bold text-white mt-1">{metrics.totalHealthSciences.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">
            {metrics.totalAlumni > 0 ? Math.round((metrics.totalHealthSciences / metrics.totalAlumni) * 100) : 0}% of alumni
          </span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Business & Social</p>
          <p className="text-2xl font-bold text-white mt-1">{metrics.totalBusinessSocial.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">
            {metrics.totalAlumni > 0 ? Math.round((metrics.totalBusinessSocial / metrics.totalAlumni) * 100) : 0}% of alumni
          </span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Historical Cohorts</p>
          <p className="text-xl font-bold text-white mt-1">{metrics.totalDiploma} Dip / {metrics.totalBachelors} Deg</p>
          <span className="text-[10px] text-amber-400/90 font-medium">1999 Dip • 2002 Deg 1st Batches</span>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-slate-800 shadow-md">
          <p className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">Employed / Active</p>
          <p className="text-2xl font-bold text-white mt-1">
            {(metrics.totalEmployed + metrics.totalSelfEmployed).toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">
            {metrics.employmentDataCoverageRate}% Coverage
          </span>
        </div>
      </section>

      {/* Three Institutional Colleges Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Three Main Colleges</h3>
            <p className="text-xs text-slate-400">Institutional structure organizing all academic programs and graduate batches</p>
          </div>
          <button
            onClick={() => onNavigate('colleges')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>View Dedicated College Dashboards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Engineering */}
          <div 
            onClick={() => onNavigate('colleges')}
            className="group cursor-pointer bg-[#0A192F] hover:bg-[#0E2448] border border-blue-900/50 hover:border-blue-500/50 rounded-xl p-6 transition duration-300 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                College of Engineering
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aeronautical & Aerospace, Combat Vehicles, Cyber Defence, Munitions Technology, and Military Electronics.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Established 1999</span>
              <span className="font-semibold text-blue-400">{metrics.totalEngineering} Graduates</span>
            </div>
          </div>

          {/* Health Sciences */}
          <div 
            onClick={() => onNavigate('colleges')}
            className="group cursor-pointer bg-[#0A192F] hover:bg-[#0E2448] border border-emerald-900/50 hover:border-emerald-500/50 rounded-xl p-6 transition duration-300 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                College of Health Sciences
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Military Medicine & Trauma Surgery, Field Emergency Care, Public Health, Pharmacy, and Diagnostics.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Established 2003</span>
              <span className="font-semibold text-emerald-400">{metrics.totalHealthSciences} Graduates</span>
            </div>
          </div>

          {/* Business & Social Studies */}
          <div 
            onClick={() => onNavigate('colleges')}
            className="group cursor-pointer bg-[#0A192F] hover:bg-[#0E2448] border border-amber-900/50 hover:border-amber-500/50 rounded-xl p-6 transition duration-300 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                College of Business & Social Studies
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strategic Defence Leadership, Military Logistics & Procurement, Defence Finance, and International Peace Studies.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Established 1999</span>
              <span className="font-semibold text-amber-400">{metrics.totalBusinessSocial} Graduates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Features */}
      <section className="bg-[#0A192F]/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <h3 className="text-lg font-serif font-bold text-white">System Capabilities & Modules</h3>
          <p className="text-xs text-slate-400 mt-1">
            Engineered for high institutional reliability, auditability, data privacy, and executive decision support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('upload')}
            className="p-4 rounded-xl bg-[#0F284E]/70 hover:bg-[#133363] border border-slate-700/60 cursor-pointer transition"
          >
            <FileSpreadsheet className="w-6 h-6 text-amber-400 mb-2" />
            <h5 className="text-sm font-semibold text-white">Excel & CSV Ingestion</h5>
            <p className="text-xs text-slate-400 mt-1">
              7-step pipeline with preview, intelligent column mapping, inline validation, and duplicate reconciliations.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('graduation-stats')}
            className="p-4 rounded-xl bg-[#0F284E]/70 hover:bg-[#133363] border border-slate-700/60 cursor-pointer transition"
          >
            <History className="w-6 h-6 text-blue-400 mb-2" />
            <h5 className="text-sm font-semibold text-white">1999–Present Cohorts</h5>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic multi-year comparative analytics starting from the first Diploma batch without hardcoded limits.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('employment')}
            className="p-4 rounded-xl bg-[#0F284E]/70 hover:bg-[#133363] border border-slate-700/60 cursor-pointer transition"
          >
            <BarChart3 className="w-6 h-6 text-emerald-400 mb-2" />
            <h5 className="text-sm font-semibold text-white">Graduate Tracer Studies</h5>
            <p className="text-xs text-slate-400 mt-1">
              Employment status, sector absorption (military vs civil vs private), and leadership progression tracking.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('about')}
            className="p-4 rounded-xl bg-[#0F284E]/70 hover:bg-[#133363] border border-slate-700/60 cursor-pointer transition"
          >
            <ShieldCheck className="w-6 h-6 text-amber-400 mb-2" />
            <h5 className="text-sm font-semibold text-white">Portal Integration Hub</h5>
            <p className="text-xs text-slate-400 mt-1">
              Ready for Subdomain (alumni.edu.et), responsive iframe embed, and secure REST API endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* Online Services, Real Mailto, Google Chat, Social Media & Real Visitors Counter */}
      <SocialAndConnectBar />

      {/* Official Copyright & Institutional Legal Section */}
      <footer className="pt-8 pb-4 border-t border-slate-800/80 text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm font-serif font-bold text-slate-300">
          <span>Copyright © {new Date().getFullYear()}</span>
          <span className="text-amber-400">የኢትዮጵያ መከላከያ ዩኒቨርሲቲ</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400">ETHIOPIAN DEFENCE UNIVERSITY</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-sans font-normal text-xs">All Rights Reserved.</span>
        </div>
        <p className="text-[11px] sm:text-xs text-amber-300/80 font-medium tracking-wide">
          Office of the Registrar & Alumni Affairs Directorate • የሬጅስትራርና ምሩቃን ጉዲይ ፅ/ቤት ዲይሬክተር
        </p>
        <p className="text-[10px] text-slate-400">
          Alumni Track Record Database (EDU-ATRD) • Official Institutional Repository • Established 1999 (፲፱፻፺፩) • Bishoftu & Addis Ababa, Ethiopia
        </p>
      </footer>

    </div>
  );
};

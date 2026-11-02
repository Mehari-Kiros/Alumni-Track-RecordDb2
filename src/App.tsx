/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Alumnus, ImportHistoryItem, AuditLog, UserRole, CollegeType } from './types/alumni';
import { INITIAL_ALUMNI_DATA, INITIAL_IMPORT_HISTORY, INITIAL_AUDIT_LOGS } from './data/initialAlumniData';
import { calculateDashboardMetrics } from './utils/statisticsCalculator';

// Components
import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MainDashboardView } from './components/MainDashboardView';
import { CollegesView } from './components/CollegesView';
import { GraduationStatsView } from './components/GraduationStatsView';
import { EmploymentTrackingView } from './components/EmploymentTrackingView';
import { AlumniDirectoryView } from './components/AlumniDirectoryView';
import { DataUploadModule } from './components/DataUploadModule';
import { ReportsAnalyticsView } from './components/ReportsAnalyticsView';
import { AdministrationView } from './components/AdministrationView';
import { AboutSystemView } from './components/AboutSystemView';
import { SocialAndConnectBar } from './components/SocialAndConnectBar';

const STORAGE_KEYS = {
  ALUMNI: 'edu_atrd_alumni_data_v3',
  HISTORY: 'edu_atrd_import_history_v3',
  AUDIT: 'edu_atrd_audit_logs_v3',
  ROLE: 'edu_atrd_user_role_v1'
};

export default function App() {
  // Database State with LocalStorage Persistence
  const [alumni, setAlumni] = useState<Alumnus[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALUMNI);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored alumni data:', e);
    }
    return INITIAL_ALUMNI_DATA;
  });

  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_IMPORT_HISTORY;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (stored) return stored as UserRole;
    } catch {}
    return 'system_admin';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCollegeForTab, setSelectedCollegeForTab] = useState<CollegeType>('College of Engineering');
  const [searchQueryForDirectory, setSearchQueryForDirectory] = useState<string>('');

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(alumni));
    } catch (e) {
      console.warn('LocalStorage save failed for alumni:', e);
    }
  }, [alumni]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(importHistory));
    } catch {}
  }, [importHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch {}
  }, [currentRole]);

  // Dynamic Dashboard Metrics
  const metrics = calculateDashboardMetrics(alumni);

  // Helper to add audit log
  const logAuditEvent = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: currentRole === 'system_admin' ? 'Col. Tsegaye Haile (System Admin)' : 'Active User',
      role: currentRole,
      action,
      details,
      ip: '10.12.4.15'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Actions
  const handleCommitImport = (newRecords: Alumnus[], importItem: ImportHistoryItem, auditDetails: string) => {
    // Avoid duplicate IDs
    const existingIds = new Set(alumni.map(a => a.alumniId));
    const merged = [...alumni];

    newRecords.forEach(rec => {
      const idx = merged.findIndex(a => a.alumniId === rec.alumniId);
      if (idx !== -1) {
        merged[idx] = rec; // Update
      } else {
        merged.push(rec); // Insert
      }
    });

    setAlumni(merged);
    setImportHistory(prev => [importItem, ...prev]);
    logAuditEvent('BULK_IMPORT', auditDetails);
  };

  const handleRollbackImport = (importId: string) => {
    setImportHistory(prev => prev.map(item => 
      item.id === importId ? { ...item, status: 'Rolled Back' } : item
    ));
    logAuditEvent('ROLLBACK_IMPORT', `Rolled back dataset batch ID: ${importId}`);
    alert('Import marked as Rolled Back in audit history.');
  };

  const handleAddAlumnus = (newRecord: Alumnus) => {
    setAlumni(prev => [newRecord, ...prev]);
    logAuditEvent('CREATE_RECORD', `Registered new alumnus: ${newRecord.fullName} (${newRecord.alumniId}), College: ${newRecord.college}`);
  };

  const handleUpdateAlumnus = (updated: Alumnus) => {
    setAlumni(prev => prev.map(a => a.id === updated.id ? updated : a));
    logAuditEvent('UPDATE_RECORD', `Updated track record for Alumnus ID: ${updated.alumniId} (${updated.fullName})`);
  };

  const handleDeleteAlumnus = (id: string, reason: string) => {
    const target = alumni.find(a => a.id === id);
    if (!target) return;
    setAlumni(prev => prev.filter(a => a.id !== id));
    logAuditEvent('DELETE_RECORD', `Deleted record for ${target.fullName} (${target.alumniId}). Reason: ${reason}`);
  };

  const handleRestoreDatabase = (restored: Alumnus[]) => {
    setAlumni(restored);
    logAuditEvent('SYSTEM_RESTORE', `Restored database snapshot containing ${restored.length} records.`);
  };

  const handleGlobalSearch = (query: string) => {
    setSearchQueryForDirectory(query);
    setActiveTab('directory');
  };

  const handleCollegeNav = (college: CollegeType) => {
    setSelectedCollegeForTab(college);
    setActiveTab('colleges');
  };

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Institutional Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        totalAlumniCount={alumni.length}
        onSearchSubmit={handleGlobalSearch}
        onOpenPrintDialog={() => setActiveTab('reports')}
      />

      {/* 2. 10-Item Institutional Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCollege={selectedCollegeForTab}
        onSelectCollege={handleCollegeNav}
      />

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            metrics={metrics}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <MainDashboardView
            alumni={alumni}
            onSelectCollege={handleCollegeNav}
          />
        )}

        {activeTab === 'colleges' && (
          <CollegesView
            alumni={alumni}
            initialCollege={selectedCollegeForTab}
          />
        )}

        {activeTab === 'graduation-stats' && (
          <GraduationStatsView
            alumni={alumni}
          />
        )}

        {activeTab === 'employment' && (
          <EmploymentTrackingView
            alumni={alumni}
          />
        )}

        {activeTab === 'directory' && (
          <AlumniDirectoryView
            alumni={alumni}
            currentRole={currentRole}
            onAddAlumnus={handleAddAlumnus}
            onUpdateAlumnus={handleUpdateAlumnus}
            onDeleteAlumnus={handleDeleteAlumnus}
            initialSearchQuery={searchQueryForDirectory}
          />
        )}

        {activeTab === 'upload' && (
          <DataUploadModule
            existingAlumni={alumni}
            onCommitImport={handleCommitImport}
            importHistory={importHistory}
            currentRole={currentRole}
            onRollbackImport={handleRollbackImport}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAnalyticsView
            alumni={alumni}
          />
        )}

        {activeTab === 'admin' && (
          <AdministrationView
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            auditLogs={auditLogs}
            alumni={alumni}
            onRestoreDatabase={handleRestoreDatabase}
          />
        )}

        {activeTab === 'about' && (
          <AboutSystemView />
        )}
      </main>

      {/* 4. Institutional Footer */}
      <footer className="bg-[#050D1A] border-t border-slate-800/80 text-slate-400 text-xs py-8 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Online Services, Real Mailto, Google Chat, Verified Social Channels & Real Visitors Counter */}
          <SocialAndConnectBar variant="footer" className="mb-6" />

          {/* Copyright & Directorate Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span>Copyright © {new Date().getFullYear()}</span>
              <span className="font-serif font-bold text-amber-400">
                የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
              </span>
              <span className="text-amber-500/50 font-bold">•</span>
              <span className="font-serif font-bold text-amber-400">
                ETHIOPIAN DEFENCE UNIVERSITY
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-300">Alumni Track Record Database (EDU-ATRD)</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="text-amber-300/90 font-medium">
                የሬጅስትራርና ምሩቃን ጉዲይ ፅ/ቤት ዲይሬክተር
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                OFFICE OF THE REGISTRAR & ALUMNI AFFAIRS DIRECTORATE
              </span>
            </div>
          </div>

          {/* Historical Baseline Metadata & Reset */}
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span>Historical Milestones: <strong>1999 (1st Diploma Batch)</strong> • <strong>2002 (1st Degree Batch)</strong></span>
              <span>•</span>
              <span>Accredited Tri-College Structure</span>
              <span>•</span>
              <span>Bishoftu & Addis Ababa, Ethiopia</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset database to pristine historical baseline seed data (1999 1st Diploma, 2002 1st Degree)?')) {
                  localStorage.removeItem(STORAGE_KEYS.ALUMNI);
                  localStorage.removeItem(STORAGE_KEYS.HISTORY);
                  localStorage.removeItem(STORAGE_KEYS.AUDIT);
                  window.location.reload();
                }
              }}
              className="text-amber-400/80 hover:text-amber-300 underline"
            >
              Reset to Initial Baseline
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}

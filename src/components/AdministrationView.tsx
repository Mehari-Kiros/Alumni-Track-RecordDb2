/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Alumnus, AuditLog, UserRole } from '../types/alumni';
import { POSTGRESQL_DDL_SCHEMA, POSTGRESQL_MIGRATIONS } from '../data/databaseSchema';
import { downloadTextFile } from '../utils/exportUtils';
import { 
  ShieldCheck, 
  Users, 
  FileCode, 
  Database, 
  History, 
  Download, 
  Sliders, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface AdministrationViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  auditLogs: AuditLog[];
  alumni: Alumnus[];
  onRestoreDatabase: (restored: Alumnus[]) => void;
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  currentRole,
  onRoleChange,
  auditLogs,
  alumni,
  onRestoreDatabase
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'rbac' | 'audit' | 'schema' | 'backup' | 'config'>('rbac');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [copiedMigrations, setCopiedMigrations] = useState<boolean>(false);

  const canAdmin = currentRole === 'system_admin';

  // Role permissions matrix
  const rolesInfo = [
    {
      role: 'system_admin' as UserRole,
      title: 'System Administrator',
      desc: 'Full administrative access: user management, schema administration, bulk dataset uploads, record deletions, security audit logs.',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      role: 'data_admin' as UserRole,
      title: 'Data Administrator',
      desc: 'Upload alumni datasets, validate records, perform inline data corrections, generate reports, and update employment records.',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    {
      role: 'management' as UserRole,
      title: 'Management / Decision Makers',
      desc: 'Executive access to university-wide dashboards, college comparisons, graduate tracer studies, and institutional reports.',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      role: 'public' as UserRole,
      title: 'Public Website Visitor',
      desc: 'Access aggregated statistical dashboards and institutional visualizations. Sensitive personal details (phone, email) are protected.',
      badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40'
    }
  ];

  // Download SQL
  const handleDownloadSchemaSql = () => {
    downloadTextFile(POSTGRESQL_DDL_SCHEMA, 'edu_atrd_postgresql_schema.sql', 'application/sql');
  };

  const handleDownloadMigrationsSql = () => {
    downloadTextFile(POSTGRESQL_MIGRATIONS, 'edu_atrd_migrations.sql', 'application/sql');
  };

  // Backup JSON
  const handleDownloadBackup = () => {
    const backupData = {
      system: 'Ethiopian Defence University Alumni Track Record Database (EDU-ATRD)',
      exportedAt: new Date().toISOString(),
      recordCount: alumni.length,
      records: alumni
    };
    downloadTextFile(JSON.stringify(backupData, null, 2), `EDU_Alumni_DB_Backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  // Restore JSON
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.records)) {
          onRestoreDatabase(parsed.records);
          alert(`Database successfully restored with ${parsed.records.length} records.`);
        } else {
          alert('Invalid backup file format. Expected a JSON object with records array.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Title Header */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <span>Administration & System Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Role-based authorization, immutable audit trail, PostgreSQL database schema, migrations, and system backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Active Role:</span>
          <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase">
            {currentRole.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'rbac', label: 'Roles & Access Control (RBAC)', icon: <Users className="w-4 h-4" /> },
          { id: 'audit', label: 'Security Audit Trail', icon: <History className="w-4 h-4" /> },
          { id: 'schema', label: 'PostgreSQL Relational Schema & DDL', icon: <FileCode className="w-4 h-4" /> },
          { id: 'backup', label: 'Database Backup & Restore', icon: <Database className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white bg-[#0F284E] border border-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: RBAC */}
      {activeAdminTab === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Role-Based Access Control Architecture</h3>
              <p className="text-xs text-slate-400">
                Switch roles instantly to test permissions and verify that sensitive alumni contact details remain masked for unauthorized personas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesInfo.map((r) => {
                const isActive = currentRole === r.role;
                return (
                  <div 
                    key={r.role}
                    className={`p-5 rounded-xl border transition flex flex-col justify-between ${
                      isActive 
                        ? 'bg-[#0F284E] border-amber-400 shadow-lg' 
                        : 'bg-[#0A192F] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${r.badge}`}>
                          {r.title}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Active Persona</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-2">
                        {r.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => onRoleChange(r.role)}
                        disabled={isActive}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          isActive
                            ? 'bg-amber-400/20 text-amber-300 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        }`}
                      >
                        {isActive ? 'Current Active Role' : 'Switch to this Role'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeAdminTab === 'audit' && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>Security Audit Trail & Governance Log</span>
              </h3>
              <p className="text-xs text-slate-400">
                Immutable event stream tracking bulk uploads, record modifications, and administrative operations.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Audit Details</th>
                  <th className="p-3">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50">
                    <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-semibold text-white">{log.user}</div>
                      <span className="text-[10px] text-amber-400">{log.role}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0F284E] text-slate-200 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-md">{log.details}</td>
                    <td className="p-3 font-mono text-slate-500">{log.ip || '10.12.4.15'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: POSTGRESQL SCHEMA & MIGRATIONS */}
      {activeAdminTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>Production PostgreSQL Relational Schema (3NF Architecture)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Fully normalized schema supporting all 15 university entities, foreign keys, and indexes from 1999 onward.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSchemaSql}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download DDL Schema (.sql)</span>
                </button>
                <button
                  onClick={handleDownloadMigrationsSql}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download Migrations (.sql)</span>
                </button>
              </div>
            </div>

            {/* Code viewer */}
            <div className="bg-[#050B14] p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-emerald-400">
              <pre className="whitespace-pre">{POSTGRESQL_DDL_SCHEMA}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTORE */}
      {activeAdminTab === 'backup' && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Database Snapshot & Disaster Recovery</span>
            </h3>
            <p className="text-xs text-slate-400">
              Export a complete verifiable JSON snapshot of all active alumni records or restore from a previous archive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#0F284E] rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-white">Full Snapshot Backup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates a timestamped JSON file containing all {alumni.length} alumni records, career progression histories, and audit data.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Database Snapshot</span>
              </button>
            </div>

            <div className="p-5 bg-[#0F284E] rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-white">Restore from Backup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Restore database state from an existing verified JSON backup file. Replaces current active session records safely.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg cursor-pointer border border-slate-600 transition">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Select Backup JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

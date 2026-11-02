/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UniversityLogo } from './UniversityLogo';
import { UserRole } from '../types/alumni';
import { Shield, UserCheck, Eye, Database, Printer, Search } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  totalAlumniCount: number;
  onSearchSubmit?: (query: string) => void;
  onOpenPrintDialog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  totalAlumniCount,
  onSearchSubmit,
  onOpenPrintDialog
}) => {
  const [searchVal, setSearchVal] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchVal);
    }
  };

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'system_admin':
        return {
          label: 'System Administrator',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Shield className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'data_admin':
        return {
          label: 'Data Administrator',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        };
      case 'management':
        return {
          label: 'Management / Executive',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <Database className="w-3.5 h-3.5 text-emerald-400" />
        };
      default:
        return {
          label: 'Public Website Visitor',
          color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          icon: <Eye className="w-3.5 h-3.5 text-slate-400" />
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="bg-[#0A192F] text-white border-b border-amber-500/30 sticky top-0 z-40 shadow-xl">
      {/* Top micro bar with national colors */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-rose-600" />



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Crest */}
          <div className="flex items-center gap-3">
            <UniversityLogo size="md" />
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <h1 className="font-serif tracking-wide font-bold text-sm sm:text-base text-amber-400">
                  የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
                </h1>
                <span className="hidden sm:inline text-amber-500/50 font-bold">•</span>
                <h2 className="font-serif tracking-wider font-bold text-sm sm:text-base text-amber-400">
                  ETHIOPIAN DEFENCE UNIVERSITY
                </h2>
                <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  EST. 1999
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
                <span>Alumni Track Record Database (EDU-ATRD)</span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline">የትራክ ሪከርድ ዳታቤዝ</span>
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search alumni, ID, employer..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0F284E] text-xs text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            </form>
          </div>

          {/* Role Switcher & System Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Database indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0F284E] border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">{totalAlumniCount}</span>
              <span className="text-slate-400 text-[11px]">Active Records</span>
            </div>

            {/* Print action */}
            {onOpenPrintDialog && (
              <button
                onClick={onOpenPrintDialog}
                title="Print Official Institutional Report"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#0F284E] hover:bg-slate-800 rounded-lg border border-slate-700 transition"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print</span>
              </button>
            )}

            {/* RBAC Role Selector */}
            <div className="flex items-center gap-2 bg-[#0F284E] p-1 rounded-lg border border-amber-500/20">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${badge.color}`}>
                {badge.icon}
                <span className="hidden xl:inline">{badge.label}</span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-200 font-medium py-1 px-1 rounded focus:outline-none cursor-pointer"
                aria-label="User Role"
              >
                <option value="system_admin" className="bg-[#0A192F] text-white">System Admin</option>
                <option value="data_admin" className="bg-[#0A192F] text-white">Data Admin</option>
                <option value="management" className="bg-[#0A192F] text-white">Management</option>
                <option value="public" className="bg-[#0A192F] text-white">Public Visitor</option>
              </select>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

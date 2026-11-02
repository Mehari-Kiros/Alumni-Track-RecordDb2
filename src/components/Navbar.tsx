/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  Briefcase, 
  Users, 
  UploadCloud, 
  FileText, 
  Sliders, 
  Info,
  ChevronDown
} from 'lucide-react';
import { CollegeType } from '../types/alumni';

export type NavTab = 
  | 'home'
  | 'dashboard'
  | 'colleges'
  | 'graduation-stats'
  | 'employment'
  | 'directory'
  | 'upload'
  | 'reports'
  | 'admin'
  | 'about';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  selectedCollege?: CollegeType | 'All';
  onSelectCollege?: (college: CollegeType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onSelectCollege
}) => {
  const [collegesDropdownOpen, setCollegesDropdownOpen] = React.useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; hasDropdown?: boolean }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Alumni Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'colleges', label: 'Colleges', icon: <GraduationCap className="w-4 h-4" />, hasDropdown: true },
    { id: 'graduation-stats', label: 'Graduation Statistics', icon: <Calendar className="w-4 h-4" /> },
    { id: 'employment', label: 'Employment Tracking', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'directory', label: 'Alumni Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'upload', label: 'Data Upload', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <FileText className="w-4 h-4" /> },
    { id: 'admin', label: 'Administration', icon: <Sliders className="w-4 h-4" /> },
    { id: 'about', label: 'About the System', icon: <Info className="w-4 h-4" /> },
  ];

  const collegesList: CollegeType[] = [
    'College of Engineering',
    'College of Health Sciences',
    'College of Business and Social Studies'
  ];

  return (
    <nav className="bg-[#0D2140] border-b border-slate-700/80 text-slate-300 relative shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto no-scrollbar py-1 gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            
            if (item.hasDropdown) {
              return (
                <div key={item.id} className="relative inline-block shrink-0">
                  <button
                    onClick={() => {
                      onTabChange('colleges');
                      setCollegesDropdownOpen(!collegesDropdownOpen);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border-b-2 border-amber-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {collegesDropdownOpen && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-64 bg-[#0A192F] border border-amber-500/30 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1"
                      onMouseLeave={() => setCollegesDropdownOpen(false)}
                    >
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-400 border-b border-slate-700/60 uppercase tracking-wider">
                        Select Dedicated College
                      </div>
                      {collegesList.map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            if (onSelectCollege) onSelectCollege(col);
                            onTabChange('colleges');
                            setCollegesDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#152e5a] hover:text-amber-300 transition flex items-center justify-between"
                        >
                          <span>{col}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border-b-2 border-amber-400 font-semibold shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

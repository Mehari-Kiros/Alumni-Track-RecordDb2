/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Alumnus, UserRole, CollegeType, QualificationLevel, EmploymentStatus, EmploymentSector, Gender } from '../types/alumni';
import { exportAlumniData } from '../utils/exportUtils';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  X,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface AlumniDirectoryViewProps {
  alumni: Alumnus[];
  currentRole: UserRole;
  onAddAlumnus: (newRecord: Alumnus) => void;
  onUpdateAlumnus: (updated: Alumnus) => void;
  onDeleteAlumnus: (id: string, reason: string) => void;
  initialSearchQuery?: string;
}

export const AlumniDirectoryView: React.FC<AlumniDirectoryViewProps> = ({
  alumni,
  currentRole,
  onAddAlumnus,
  onUpdateAlumnus,
  onDeleteAlumnus,
  initialSearchQuery = ''
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchQuery);
  const [filterCollege, setFilterCollege] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterQualification, setFilterQualification] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterSector, setFilterSector] = useState<string>('All');

  // Modals state
  const [activeProfile, setActiveProfile] = useState<Alumnus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingAlumnus, setEditingAlumnus] = useState<Alumnus | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const isPublic = currentRole === 'public';
  const canManage = currentRole === 'system_admin' || currentRole === 'data_admin';
  const canDelete = currentRole === 'system_admin';

  // Available Years
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    set.add(1999);
    alumni.forEach(a => set.add(a.graduationYear));
    return Array.from(set).sort((a, b) => b - a);
  }, [alumni]);

  // Filtered dataset
  const filteredList = useMemo(() => {
    return alumni.filter((a) => {
      // Search
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase().trim();
        const matchesName = a.fullName.toLowerCase().includes(q);
        const matchesId = a.alumniId.toLowerCase().includes(q);
        const matchesEmployer = a.currentEmployer?.toLowerCase().includes(q);
        const matchesDept = a.department?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesEmployer && !matchesDept) return false;
      }

      if (filterCollege !== 'All' && a.college !== filterCollege) return false;
      if (filterYear !== 'All' && a.graduationYear !== parseInt(filterYear, 10)) return false;
      if (filterQualification !== 'All' && a.qualification !== filterQualification) return false;
      if (filterStatus !== 'All' && a.employmentStatus !== filterStatus) return false;
      if (filterSector !== 'All' && a.employmentSector !== filterSector) return false;

      return true;
    });
  }, [alumni, searchTerm, filterCollege, filterYear, filterQualification, filterStatus, filterSector]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCollege('All');
    setFilterYear('All');
    setFilterQualification('All');
    setFilterStatus('All');
    setFilterSector('All');
    setCurrentPage(1);
  };

  const handleExport = (format: 'xlsx' | 'csv') => {
    exportAlumniData(filteredList, `EDU_Alumni_Directory_Export_${new Date().toISOString().split('T')[0]}`, format);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      onDeleteAlumnus(deletingId, deleteReason || 'Administrative Record Cleanup');
      setDeletingId(null);
      setDeleteReason('');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner and Quick Actions */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Alumni Records Directory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {filteredList.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, view comprehensive profiles, and export validated graduate track records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Record</span>
            </button>
          )}

          <button
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0A192F] p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by Name, Alumni ID, Employer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-[#0F284E] text-xs text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* College Filter */}
          <div>
            <select
              value={filterCollege}
              onChange={(e) => { setFilterCollege(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0F284E] text-xs text-slate-200 rounded-lg border border-slate-700 py-2 px-2.5 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Colleges</option>
              <option value="College of Engineering">College of Engineering</option>
              <option value="College of Health Sciences">College of Health Sciences</option>
              <option value="College of Business and Social Studies">College of Business & Social Studies</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={filterYear}
              onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0F284E] text-xs text-slate-200 rounded-lg border border-slate-700 py-2 px-2.5 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Graduation Years</option>
              {availableYears.map(yr => {
                let badge = '';
                if (yr === 1999) badge = ' (1st Diploma Batch)';
                else if (yr === 2000) badge = ' (2nd Diploma Batch)';
                else if (yr === 2001) badge = ' (3rd Diploma Batch)';
                else if (yr === 2002) badge = ' (1st Degree Batch)';
                else if (yr === 2003) badge = ' (2nd Degree Batch)';
                else if (yr === 2004) badge = ' (3rd Degree Batch)';
                else if (yr === 2026) badge = ' (25th Degree Batch / Senior)';
                else if (yr >= 2005 && yr <= 2025) badge = ` (${yr - 2001}th Degree Batch)`;
                return (
                  <option key={yr} value={yr.toString()}>{yr}{badge}</option>
                );
              })}
            </select>
          </div>

          {/* Qualification Filter */}
          <div>
            <select
              value={filterQualification}
              onChange={(e) => { setFilterQualification(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0F284E] text-xs text-slate-200 rounded-lg border border-slate-700 py-2 px-2.5 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Qualifications</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* Employment Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0F284E] text-xs text-slate-200 rounded-lg border border-slate-700 py-2 px-2.5 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Statuses</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Unknown">Unknown Status</option>
            </select>
          </div>

        </div>

        {/* Reset button if active */}
        {(searchTerm || filterCollege !== 'All' || filterYear !== 'All' || filterQualification !== 'All' || filterStatus !== 'All') && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-400">Found {filteredList.length} records matching current criteria</span>
            <button
              onClick={resetFilters}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Directory Table */}
      <div className="bg-[#0A192F] rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Alumni ID</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">College</th>
                <th className="p-3.5">Qualification & Year</th>
                <th className="p-3.5">Employer & Position</th>
                <th className="p-3.5">Sector</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedList.length > 0 ? (
                paginatedList.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-850/60 transition">
                    <td className="p-3.5 font-mono font-medium text-amber-400 whitespace-nowrap">
                      {a.alumniId}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{a.fullName}</div>
                      <div className="text-[10px] text-slate-400">{a.gender} • {a.region}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium">{a.college}</div>
                      <div className="text-[10px] text-slate-400">{a.department}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-slate-200">{a.qualification}</span>
                      <div className="text-[10px] text-amber-400/90 font-mono">Class of {a.graduationYear}</div>
                    </td>
                    <td className="p-3.5 max-w-[200px]">
                      <div className="font-medium text-slate-200 truncate">{a.currentEmployer}</div>
                      <div className="text-[10px] text-slate-400 truncate">{a.currentPosition}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0F284E] border border-slate-700 text-slate-300 whitespace-nowrap">
                        {a.employmentSector}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                        a.employmentStatus === 'Employed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        a.employmentStatus === 'Self-Employed' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                        a.employmentStatus === 'Unemployed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-slate-700/50 text-slate-400 border border-slate-600'
                      }`}>
                        {a.employmentStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveProfile(a)}
                          title="View Profile"
                          className="p-1.5 rounded-lg bg-[#0F284E] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                        </button>

                        {canManage && (
                          <button
                            onClick={() => setEditingAlumnus(a)}
                            title="Edit Record"
                            className="p-1.5 rounded-lg bg-[#0F284E] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => setDeletingId(a.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg bg-[#0F284E] hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No alumni records matched your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {currentPage} of {totalPages} ({filteredList.length} total records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-[#0F284E] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-[#0F284E] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* INDIVIDUAL ALUMNI PROFILE MODAL */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                    {activeProfile.alumniId}
                  </span>
                  {activeProfile.isVerified && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Record</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {activeProfile.fullName}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeProfile.currentPosition} • {activeProfile.currentEmployer}
                </p>
              </div>
              <button
                onClick={() => setActiveProfile(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Track Record</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#0F284E] p-4 rounded-xl border border-slate-700">
                <div>
                  <span className="text-slate-400 block">College</span>
                  <span className="font-semibold text-white">{activeProfile.college}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-white">{activeProfile.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Academic Program</span>
                  <span className="font-semibold text-white">{activeProfile.academicProgram}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Qualification & Year</span>
                  <span className="font-semibold text-white">
                    {activeProfile.qualification} (Batch of {activeProfile.graduationYear})
                  </span>
                </div>
              </div>
            </div>

            {/* Career & Employment */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Employment & Professional Status</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#0F284E] p-4 rounded-xl border border-slate-700">
                <div>
                  <span className="text-slate-400 block">Employment Status</span>
                  <span className="font-semibold text-white">{activeProfile.employmentStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Employment Sector</span>
                  <span className="font-semibold text-white">{activeProfile.employmentSector}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Employer</span>
                  <span className="font-semibold text-white">{activeProfile.currentEmployer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Position / Role</span>
                  <span className="font-semibold text-white">{activeProfile.currentPosition}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-semibold text-white">{activeProfile.region}, {activeProfile.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Last Record Update</span>
                  <span className="font-semibold text-slate-300">{activeProfile.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Further Education & Achievements */}
            {(activeProfile.furtherEducation || activeProfile.achievements) && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Further Education & Achievements
                </h4>
                <div className="text-xs bg-[#0F284E] p-4 rounded-xl border border-slate-700 space-y-2">
                  {activeProfile.furtherEducation && (
                    <div>
                      <span className="text-slate-400 block">Postgraduate / Higher Study:</span>
                      <p className="font-medium text-slate-200">{activeProfile.furtherEducation}</p>
                    </div>
                  )}
                  {activeProfile.achievements && (
                    <div>
                      <span className="text-slate-400 block">Key Contribution / Milestone:</span>
                      <p className="font-medium text-slate-200">{activeProfile.achievements}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Details (Masked if Public Role!) */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact & Verification Info:
              </span>
              {isPublic ? (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Personal contact details (Phone & Email) are protected for public visitors. Sign in as Administrator or Management to access.
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeProfile.phone || 'Not recorded'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeProfile.email || 'Not recorded'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveProfile(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-white"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT RECORD MODAL */}
      {(isAddModalOpen || editingAlumnus) && (
        <AlumniFormModal
          existing={editingAlumnus}
          onClose={() => { setIsAddModalOpen(false); setEditingAlumnus(null); }}
          onSave={(data) => {
            if (editingAlumnus) {
              onUpdateAlumnus(data);
            } else {
              onAddAlumnus(data);
            }
            setIsAddModalOpen(false);
            setEditingAlumnus(null);
          }}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-rose-400">Authorize Record Deletion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action permanently deletes the alumnus record from the central database. An immutable security audit log entry will be created.
            </p>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Reason for Deletion:</label>
              <input
                type="text"
                placeholder="e.g. Duplicate erroneous entry"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800 text-xs rounded-lg text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold rounded-lg text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Form modal component for Add and Edit
interface AlumniFormModalProps {
  existing: Alumnus | null;
  onClose: () => void;
  onSave: (alumnus: Alumnus) => void;
}

const AlumniFormModal: React.FC<AlumniFormModalProps> = ({ existing, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Alumnus>>(
    existing || {
      fullName: '',
      alumniId: `EDU/ENG/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      gender: 'Male',
      college: 'College of Engineering',
      department: 'Combat Vehicle & Mechanical Engineering',
      academicProgram: 'BSc in Mechanical & Vehicle Engineering',
      qualification: "Bachelor's Degree",
      graduationYear: new Date().getFullYear(),
      employmentStatus: 'Employed',
      currentEmployer: 'Ethiopian National Defence Force (ENDF)',
      currentPosition: 'Specialist Officer',
      employmentSector: 'Military & Defence',
      country: 'Ethiopia',
      region: 'Addis Ababa',
      phone: '+251 9',
      email: '',
      furtherEducation: '',
      isVerified: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.graduationYear) {
      alert('Full Name and Graduation Year are mandatory.');
      return;
    }
    const record: Alumnus = {
      ...(formData as Alumnus),
      id: existing?.id || `rec-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSave(record);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0A192F] border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-serif font-bold text-amber-400">
            {existing ? 'Edit Alumni Record' : 'Register New Alumnus'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alumni ID *</label>
              <input
                type="text"
                required
                value={formData.alumniId}
                onChange={(e) => setFormData({ ...formData, alumniId: e.target.value })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">College *</label>
              <select
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value as CollegeType })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              >
                <option value="College of Engineering">College of Engineering</option>
                <option value="College of Health Sciences">College of Health Sciences</option>
                <option value="College of Business and Social Studies">College of Business and Social Studies</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Qualification Level *</label>
              <select
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value as QualificationLevel })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              >
                <option value="Diploma">Diploma (from 1999)</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Graduation Year (&gt;= 1999) *</label>
              <input
                type="number"
                min={1999}
                max={2035}
                required
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Academic Program</label>
              <input
                type="text"
                value={formData.academicProgram}
                onChange={(e) => setFormData({ ...formData, academicProgram: e.target.value })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Employment Status</label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as EmploymentStatus })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              >
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Employment Sector</label>
              <select
                value={formData.employmentSector}
                onChange={(e) => setFormData({ ...formData, employmentSector: e.target.value as EmploymentSector })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              >
                <option value="Military & Defence">Military & Defence</option>
                <option value="State Enterprise / Parastatal">State Enterprise / Parastatal</option>
                <option value="Public / Civil Service">Public / Civil Service</option>
                <option value="Private Sector">Private Sector</option>
                <option value="NGO / International">NGO / International</option>
                <option value="Academic & Research">Academic & Research</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Current Employer</label>
              <input
                type="text"
                value={formData.currentEmployer}
                onChange={(e) => setFormData({ ...formData, currentEmployer: e.target.value })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Current Position</label>
              <input
                type="text"
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                className="w-full p-2 bg-[#0F284E] border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

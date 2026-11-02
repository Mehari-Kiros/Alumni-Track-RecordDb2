/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Alumnus, ImportHistoryItem, UserRole } from '../types/alumni';
import { 
  parseFileToRawJson, 
  autoDetectColumnMapping, 
  validateAndMapRows, 
  ColumnMapping, 
  ParsedRow, 
  STANDARD_FIELDS 
} from '../utils/fileParser';
import { downloadAlumniTemplate } from '../utils/exportUtils';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Database, 
  History, 
  Download, 
  RefreshCw, 
  Check, 
  X, 
  Edit3, 
  FileText
} from 'lucide-react';

interface DataUploadModuleProps {
  existingAlumni: Alumnus[];
  onCommitImport: (newRecords: Alumnus[], importItem: ImportHistoryItem, auditDetails: string) => void;
  importHistory: ImportHistoryItem[];
  currentRole: UserRole;
  onRollbackImport?: (importId: string) => void;
}

export const DataUploadModule: React.FC<DataUploadModuleProps> = ({
  existingAlumni,
  onCommitImport,
  importHistory,
  currentRole,
  onRollbackImport
}) => {
  // Step state (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validatedRows, setValidatedRows] = useState<ParsedRow[]>([]);
  const [duplicateStrategy, setDuplicateStrategy] = useState<'skip' | 'update' | 'new'>('skip');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importCompleted, setImportCompleted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // STEP 1: Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const processSelectedFile = async (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      alert('Please upload a supported Microsoft Excel (.xlsx, .xls) or CSV (.csv) file.');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const { headers, rows } = await parseFileToRawJson(file);
      if (rows.length === 0) {
        alert('The uploaded file appears to be empty. Please verify the content.');
        setIsProcessing(false);
        return;
      }

      setRawHeaders(headers);
      setRawRows(rows);

      // Automatically map columns
      const detected = autoDetectColumnMapping(headers);
      setColumnMappings(detected);

      // Pre-validate rows
      const validated = validateAndMapRows(rows, detected, existingAlumni);
      setValidatedRows(validated);

      // Advance to Preview (Step 2)
      setCurrentStep(2);
    } catch (err) {
      alert('Error parsing uploaded file. Please verify it is a valid Excel or CSV spreadsheet.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run validation whenever mappings change
  const handleMappingChange = (fileHeader: string, newTarget: any) => {
    const updatedMappings = columnMappings.map(m => 
      m.fileHeader === fileHeader ? { ...m, mappedField: newTarget } : m
    );
    setColumnMappings(updatedMappings);
    const revalidated = validateAndMapRows(rawRows, updatedMappings, existingAlumni);
    setValidatedRows(revalidated);
  };

  // Inline correction for Step 5
  const handleInlineCorrect = (index: number, field: keyof Alumnus, value: any) => {
    const updated = [...validatedRows];
    const target = updated[index];
    (target.mapped as any)[field] = value;
    
    // Quick re-check row
    const errors: string[] = [];
    if (!target.mapped.fullName || String(target.mapped.fullName).trim() === '') {
      errors.push('Full name is missing');
    }
    const yr = Number(target.mapped.graduationYear);
    if (!yr || isNaN(yr) || yr < 1999) {
      errors.push('Valid year >= 1999 required');
    }
    target.isValid = errors.length === 0;
    target.errors = errors;

    setValidatedRows(updated);
  };

  // STEP 7: Commit to Central Database
  const handleCommitDatabaseUpdate = () => {
    const validRowsToImport = validatedRows.filter(r => r.isValid);
    if (validRowsToImport.length === 0) {
      alert('No valid records to import. Please correct errors before proceeding.');
      return;
    }

    const recordsToSave: Alumnus[] = [];
    let duplicatesResolved = 0;

    validRowsToImport.forEach(row => {
      const data = row.mapped as Alumnus;
      if (row.isDuplicate) {
        duplicatesResolved++;
        if (duplicateStrategy === 'skip') {
          return; // Skip duplicate
        } else if (duplicateStrategy === 'update') {
          recordsToSave.push(data);
        } else {
          // 'new': append random salt to make unique
          recordsToSave.push({
            ...data,
            id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            alumniId: `${data.alumniId}-NEW`
          });
        }
      } else {
        recordsToSave.push(data);
      }
    });

    const newHistoryItem: ImportHistoryItem = {
      id: `imp-${Date.now()}`,
      uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      administrator: currentRole === 'system_admin' ? 'Col. Tsegaye Haile (System Admin)' : 'Data Administrator',
      filename: selectedFile?.name || 'Uploaded_Dataset.xlsx',
      totalRecords: validatedRows.length,
      validRecords: validRowsToImport.length,
      duplicatesCount: validatedRows.filter(r => r.isDuplicate).length,
      correctionsCount: validatedRows.filter(r => !r.isValid).length,
      status: 'Completed'
    };

    onCommitImport(
      recordsToSave, 
      newHistoryItem, 
      `Successfully imported ${recordsToSave.length} alumni records from file: ${selectedFile?.name}. Duplicate strategy: ${duplicateStrategy}.`
    );

    setImportCompleted(true);
    setCurrentStep(7);
  };

  const resetWizard = () => {
    setSelectedFile(null);
    setRawHeaders([]);
    setRawRows([]);
    setValidatedRows([]);
    setImportCompleted(false);
    setCurrentStep(1);
  };

  // Counts for Step 6 summary
  const totalIdentified = validatedRows.length;
  const validCount = validatedRows.filter(r => r.isValid).length;
  const duplicateCount = validatedRows.filter(r => r.isDuplicate).length;
  const errorCount = validatedRows.filter(r => !r.isValid).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Module Title Banner */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Alumni Data Upload & Ingestion Module</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Excel (.xlsx, .xls) & CSV
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            7-stage validation pipeline: ingest, preview, auto-map columns, validate integrity (1999+), correct inline, and update central database.
          </p>
        </div>

        {/* Download Template Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadAlumniTemplate('xlsx')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Excel Template</span>
          </button>
          <button
            onClick={() => downloadAlumniTemplate('csv')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0F284E] hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV Template</span>
          </button>
        </div>
      </div>

      {/* 7-Step Progress Stepper */}
      <div className="bg-[#0A192F] p-4 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-[700px] justify-between">
          {[
            { step: 1, label: '1. Upload' },
            { step: 2, label: '2. Preview' },
            { step: 3, label: '3. Column Mapping' },
            { step: 4, label: '4. Validation' },
            { step: 5, label: '5. Correction' },
            { step: 6, label: '6. Confirmation' },
            { step: 7, label: '7. Database Update' },
          ].map((s, idx) => {
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <div key={s.step} className="flex items-center gap-2">
                <button
                  disabled={currentStep < s.step && !selectedFile}
                  onClick={() => selectedFile && setCurrentStep(s.step)}
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold shadow'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 bg-slate-800/40'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {isCompleted ? <Check className="w-3 h-3 text-emerald-400" /> : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < 6 && <div className="h-0.5 w-4 bg-slate-800" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD FILE */}
      {currentStep === 1 && (
        <div className="bg-[#0A192F] p-8 rounded-2xl border-2 border-dashed border-amber-500/40 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-serif font-bold text-white">
              Upload Alumni Spreadsheet File
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag and drop your graduate records file or click to browse. Supports Excel (.xlsx, .xls) and CSV (.csv).
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              Browse Local File
            </button>
            <button
              onClick={() => downloadAlumniTemplate('xlsx')}
              className="px-4 py-3 bg-[#0F284E] text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              Need the Standard Template?
            </button>
          </div>

          {/* Supported format badges */}
          <div className="pt-4 flex items-center justify-center gap-3 text-[11px] text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1">✓ Microsoft Excel (.xlsx)</span>
            <span className="flex items-center gap-1">✓ Excel 97–2003 (.xls)</span>
            <span className="flex items-center gap-1">✓ Delimited (.csv)</span>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW RAW DATA */}
      {currentStep === 2 && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Step 2: Preview Uploaded Raw Data</h3>
              <p className="text-xs text-slate-400">
                File: <strong className="text-amber-400">{selectedFile?.name}</strong> • Identified {rawRows.length} rows and {rawHeaders.length} columns.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Change File
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                <span>Continue to Column Mapping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-96">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider sticky top-0">
                <tr>
                  <th className="p-3">#</th>
                  {rawHeaders.map((h, i) => (
                    <th key={i} className="p-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rawRows.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                    {rawHeaders.map((h, i) => (
                      <td key={i} className="p-3 whitespace-nowrap">{String(row[h] || '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rawRows.length > 10 && (
            <p className="text-[11px] text-slate-400 text-center">
              Showing first 10 of {rawRows.length} rows for preview.
            </p>
          )}
        </div>
      )}

      {/* STEP 3: AUTOMATIC & MANUAL COLUMN MAPPING */}
      {currentStep === 3 && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Step 3: Column Mapping & Verification</h3>
              <p className="text-xs text-slate-400">
                Headers have been automatically matched. You may manually reassign any column below.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                <span>Proceed to Data Validation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columnMappings.map((m, idx) => (
              <div key={idx} className="p-3.5 bg-[#0F284E] rounded-xl border border-slate-700/70 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  File Header:
                </span>
                <p className="text-xs font-bold text-amber-400 truncate">&ldquo;{m.fileHeader}&rdquo;</p>
                
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mt-2">
                  Maps to System Field:
                </span>
                <select
                  value={m.mappedField}
                  onChange={(e) => handleMappingChange(m.fileHeader, e.target.value)}
                  className="w-full p-2 bg-[#0A192F] text-xs text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400"
                >
                  <option value="skip">-- Skip / Ignore Column --</option>
                  {STANDARD_FIELDS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label} {f.mandatory ? '*' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: DATA VALIDATION */}
      {currentStep === 4 && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Step 4: Automated Data Validation</h3>
              <p className="text-xs text-slate-400">
                Integrity audit checked for required fields, graduation years (&gt;= 1999), college normalization, and duplicate alumni IDs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                <span>Continue to Correction / Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Validation Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Ingested</span>
              <span className="text-2xl font-bold text-white mt-1">{totalIdentified}</span>
            </div>
            <div className="bg-[#0F284E] p-4 rounded-xl border border-emerald-900/60">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Valid & Ready</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1">{validCount}</span>
            </div>
            <div className="bg-[#0F284E] p-4 rounded-xl border border-amber-900/60">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Duplicates Detected</span>
              <span className="text-2xl font-bold text-amber-400 mt-1">{duplicateCount}</span>
            </div>
            <div className="bg-[#0F284E] p-4 rounded-xl border border-rose-900/60">
              <span className="text-[10px] text-rose-400 uppercase tracking-wider block">Errors / Needs Review</span>
              <span className="text-2xl font-bold text-rose-400 mt-1">{errorCount}</span>
            </div>
          </div>

          <div className="bg-[#0F284E]/70 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">Validation Rules Enforced:</p>
            <p>• Mandatory fields: Full Name, College, Qualification, Graduation Year (&gt;= 1999 inaugural batch).</p>
            <p>• Questionable records are NOT automatically discarded; administrators can fix values in Step 5.</p>
          </div>
        </div>
      )}

      {/* STEP 5: DATA CORRECTION (INLINE EDITING) */}
      {currentStep === 5 && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Step 5: Inline Record Correction</h3>
              <p className="text-xs text-slate-400">
                You can directly edit fields in the table below to resolve validation errors before importing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                <span>Proceed to Summary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-96">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider sticky top-0">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Full Name *</th>
                  <th className="p-3">Alumni ID</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Year (&gt;= 1999) *</th>
                  <th className="p-3">Qualification</th>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Validation Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {validatedRows.map((row, idx) => (
                  <tr key={idx} className={row.isValid ? 'hover:bg-slate-850/50' : 'bg-rose-950/20'}>
                    <td className="p-3">
                      {row.isValid ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.mapped.fullName || ''}
                        onChange={(e) => handleInlineCorrect(idx, 'fullName', e.target.value)}
                        className="bg-[#0A192F] text-xs text-white p-1.5 rounded border border-slate-700 w-36"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.mapped.alumniId || ''}
                        onChange={(e) => handleInlineCorrect(idx, 'alumniId', e.target.value)}
                        className="bg-[#0A192F] text-xs text-amber-400 font-mono p-1.5 rounded border border-slate-700 w-32"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.mapped.college}
                        onChange={(e) => handleInlineCorrect(idx, 'college', e.target.value)}
                        className="bg-[#0A192F] text-xs text-white p-1.5 rounded border border-slate-700"
                      >
                        <option value="College of Engineering">College of Engineering</option>
                        <option value="College of Health Sciences">College of Health Sciences</option>
                        <option value="College of Business and Social Studies">College of Business and Social Studies</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1999}
                        max={2035}
                        value={row.mapped.graduationYear || 1999}
                        onChange={(e) => handleInlineCorrect(idx, 'graduationYear', parseInt(e.target.value, 10))}
                        className="bg-[#0A192F] text-xs text-white p-1.5 rounded border border-slate-700 w-20"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.mapped.qualification}
                        onChange={(e) => handleInlineCorrect(idx, 'qualification', e.target.value)}
                        className="bg-[#0A192F] text-xs text-white p-1.5 rounded border border-slate-700"
                      >
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.mapped.currentEmployer || ''}
                        onChange={(e) => handleInlineCorrect(idx, 'currentEmployer', e.target.value)}
                        className="bg-[#0A192F] text-xs text-white p-1.5 rounded border border-slate-700 w-36"
                      />
                    </td>
                    <td className="p-3">
                      {row.errors.length > 0 ? (
                        <span className="text-[10px] text-rose-400 font-medium">
                          {row.errors.join('; ')}
                        </span>
                      ) : row.isDuplicate ? (
                        <span className="text-[10px] text-amber-400 font-medium">Duplicate ID detected</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium">Validated OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 6: IMPORT CONFIRMATION SUMMARY */}
      {currentStep === 6 && (
        <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Step 6: Import Confirmation Summary</h3>
              <p className="text-xs text-slate-400">
                Review batch statistics and select duplicate resolution strategy before updating the central database.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300"
            >
              Back to Corrections
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Ingested</span>
              <span className="text-3xl font-extrabold text-white mt-1">{totalIdentified}</span>
            </div>
            <div className="bg-[#0F284E] p-4 rounded-xl border border-emerald-900/60">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Valid to Import</span>
              <span className="text-3xl font-extrabold text-emerald-400 mt-1">{validCount}</span>
            </div>
            <div className="bg-[#0F284E] p-4 rounded-xl border border-amber-900/60">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Duplicates</span>
              <span className="text-3xl font-extrabold text-amber-400 mt-1">{duplicateCount}</span>
            </div>
            <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unresolved Errors</span>
              <span className="text-3xl font-extrabold text-slate-300 mt-1">{errorCount}</span>
            </div>
          </div>

          {/* Duplicate Strategy Option */}
          <div className="bg-[#0F284E] p-5 rounded-xl border border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Duplicate Handling Strategy (for existing Alumni IDs):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg bg-[#0A192F] border border-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="dupStrategy"
                  checked={duplicateStrategy === 'skip'}
                  onChange={() => setDuplicateStrategy('skip')}
                />
                <span className="text-xs text-slate-200">Skip Duplicates (Recommended)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg bg-[#0A192F] border border-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="dupStrategy"
                  checked={duplicateStrategy === 'update'}
                  onChange={() => setDuplicateStrategy('update')}
                />
                <span className="text-xs text-slate-200">Update Existing Records</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg bg-[#0A192F] border border-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="dupStrategy"
                  checked={duplicateStrategy === 'new'}
                  onChange={() => setDuplicateStrategy('new')}
                />
                <span className="text-xs text-slate-200">Import As Distinct New ID</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCommitDatabaseUpdate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              <Database className="w-4 h-4" />
              <span>Commit & Update Central Database</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: DATABASE UPDATE SUCCESS */}
      {currentStep === 7 && (
        <div className="bg-[#0A192F] p-8 rounded-2xl border border-emerald-500/40 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl font-serif font-bold text-white">
              Database Successfully Updated!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              New graduate records have been safely imported into the central alumni database. Dashboards, reports, and search indices have been recalculated dynamically.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={resetWizard}
              className="px-5 py-2.5 bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}

      {/* HISTORICAL UPLOAD AUDIT TRAIL LOG */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Dataset Import History & Audit Log</span>
          </h3>
          <span className="text-xs text-slate-400">{importHistory.length} Recorded Batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0F284E] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Upload Date</th>
                <th className="p-3">Administrator</th>
                <th className="p-3">Filename</th>
                <th className="p-3">Total Ingested</th>
                <th className="p-3">Valid Imported</th>
                <th className="p-3">Duplicates</th>
                <th className="p-3">Status</th>
                {onRollbackImport && currentRole === 'system_admin' && (
                  <th className="p-3 text-right">Rollback</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {importHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50">
                  <td className="p-3 font-mono text-slate-400">{item.uploadDate}</td>
                  <td className="p-3 font-medium text-white">{item.administrator}</td>
                  <td className="p-3 font-mono text-amber-300">{item.filename}</td>
                  <td className="p-3">{item.totalRecords}</td>
                  <td className="p-3 font-semibold text-emerald-400">{item.validRecords}</td>
                  <td className="p-3 text-slate-400">{item.duplicatesCount}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {item.status}
                    </span>
                  </td>
                  {onRollbackImport && currentRole === 'system_admin' && (
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onRollbackImport(item.id)}
                        className="text-rose-400 hover:text-rose-300 text-[11px] font-medium"
                      >
                        Rollback
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

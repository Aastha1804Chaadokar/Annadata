'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile } from '@/types/farmer';
import {
  getSoilReports,
  getLatestSoilReport,
  uploadSoilReportFile,
  verifyAndSaveSoilReport,
  getSoilTrends,
  deleteSoilReport,
} from '@/lib/soilService';
import {
  SoilReportRecord,
  SoilPositionSummary,
  SoilParameterStatus,
  SoilReportInput,
  SoilTrendPoint,
  DocumentUploadExtractionResult,
} from '@/types/soil';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  History,
  Calendar,
  Sparkles,
  HelpCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Edit3,
  X,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Trash2,
  ExternalLink,
  Layers,
  Leaf,
  Info,
} from 'lucide-react';

function SoilHealthContent() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [reports, setReports] = useState<SoilReportRecord[]>([]);
  const [latestReport, setLatestReport] = useState<SoilReportRecord | null>(null);
  const [selectedReport, setSelectedReport] = useState<SoilReportRecord | null>(null);
  const [trends, setTrends] = useState<SoilTrendPoint[]>([]);

  // UI Views: 'overview' | 'upload_flow' | 'manual_entry' | 'report_details'
  const [viewMode, setViewMode] = useState<'overview' | 'upload_flow' | 'manual_entry' | 'report_details'>('overview');

  // File Upload & Processing State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'extracting' | 'analyzing' | 'review'>('idle');
  const [extractionResult, setExtractionResult] = useState<DocumentUploadExtractionResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Review & Verification Form State
  const [reviewPh, setReviewPh] = useState<string>('6.5');
  const [reviewOc, setReviewOc] = useState<string>('0.55');
  const [reviewN, setReviewN] = useState<string>('240');
  const [reviewP, setReviewP] = useState<string>('18');
  const [reviewK, setReviewK] = useState<string>('210');
  const [reviewEc, setReviewEc] = useState<string>('0.8');
  const [reviewS, setReviewS] = useState<string>('');
  const [reviewZn, setReviewZn] = useState<string>('');
  const [reviewFe, setReviewFe] = useState<string>('');
  const [reviewFarmerName, setReviewFarmerName] = useState<string>('');
  const [reviewSampleId, setReviewSampleId] = useState<string>('');
  const [reviewSoilType, setReviewSoilType] = useState<string>('Alluvial');
  const [reviewIrrigation, setReviewIrrigation] = useState<string>('Rain-fed');
  const [reviewTestDate, setReviewTestDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Expanded parameter detail card in Current Position
  const [expandedParamCode, setExpandedParamCode] = useState<string | null>(null);

  // Success Notification Toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load farmer and soil data on mount
  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);

    loadReportsData();
  }, []);

  const loadReportsData = () => {
    const allReports = getSoilReports();
    setReports(allReports);
    const latest = getLatestSoilReport();
    setLatestReport(latest);
    if (latest && !selectedReport) {
      setSelectedReport(latest);
    }
    const tr = getSoilTrends();
    setTrends(tr);
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Process and Upload Document
  const processSelectedFile = async (file: File) => {
    setUploadError(null);

    // 1. Validate File Type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const hasValidExt = /\.(pdf|jpe?g|png|webp)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setUploadError('Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG soil report.');
      return;
    }

    // 2. Validate Size (Max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15MB limit. Please upload a smaller document or photo.');
      return;
    }

    setUploadFile(file);
    setViewMode('upload_flow');
    setUploadStage('uploading');

    try {
      // Step: Uploading
      await new Promise((r) => setTimeout(r, 600));
      setUploadStage('extracting');

      // Upload and trigger backend OCR / text extraction
      const result = await uploadSoilReportFile(file);
      setExtractionResult(result);

      // Step: Analyzing
      setUploadStage('analyzing');
      await new Promise((r) => setTimeout(r, 500));

      // Populate review form with extracted values or clean defaults
      const params = result.extraction?.parameters || {};
      const meta = result.extraction?.metadata || {};

      setReviewPh(params.ph?.value !== undefined ? String(params.ph.value) : '6.5');
      setReviewN(params.nitrogen?.value !== undefined ? String(params.nitrogen.value) : '240');
      setReviewP(params.phosphorus?.value !== undefined ? String(params.phosphorus.value) : '18');
      setReviewK(params.potassium?.value !== undefined ? String(params.potassium.value) : '210');
      setReviewOc(params.organicCarbon?.value !== undefined ? String(params.organicCarbon.value) : '0.55');
      setReviewEc(params.electricalConductivity?.value !== undefined ? String(params.electricalConductivity.value) : '0.8');
      setReviewS(params.sulfur?.value !== undefined ? String(params.sulfur.value) : '');
      setReviewZn(params.zinc?.value !== undefined ? String(params.zinc.value) : '');
      setReviewFe(params.iron?.value !== undefined ? String(params.iron.value) : '');

      setReviewFarmerName(meta.farmerName || profile?.name || '');
      setReviewSampleId(meta.sampleId || '');
      setReviewSoilType(meta.soilType || profile?.soilType || 'Alluvial');
      setReviewIrrigation(profile?.irrigation || 'Rain-fed');
      if (meta.reportDate) {
        setReviewTestDate(meta.reportDate);
      }

      setUploadStage('review');
    } catch (err: any) {
      console.error('Extraction failure:', err);
      setUploadError(
        err.message ||
          "We couldn't reliably read this report. Please upload a clearer image/PDF or enter the values manually."
      );
      setUploadStage('idle');
    }
  };

  // Confirm Verified Report
  const handleConfirmReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const phVal = parseFloat(reviewPh);
    const nVal = parseFloat(reviewN);
    const pVal = parseFloat(reviewP);
    const kVal = parseFloat(reviewK);
    const ocVal = parseFloat(reviewOc);
    const ecVal = reviewEc ? parseFloat(reviewEc) : undefined;
    const sVal = reviewS ? parseFloat(reviewS) : undefined;
    const znVal = reviewZn ? parseFloat(reviewZn) : undefined;
    const feVal = reviewFe ? parseFloat(reviewFe) : undefined;

    if (isNaN(phVal) || phVal < 0 || phVal > 14) {
      setUploadError('Please specify a valid soil pH value between 0 and 14.');
      return;
    }
    if (isNaN(nVal) || nVal < 0) {
      setUploadError('Please specify a valid available Nitrogen (N) value.');
      return;
    }
    if (isNaN(pVal) || pVal < 0) {
      setUploadError('Please specify a valid available Phosphorus (P) value.');
      return;
    }
    if (isNaN(kVal) || kVal < 0) {
      setUploadError('Please specify a valid available Potassium (K) value.');
      return;
    }
    if (isNaN(ocVal) || ocVal < 0) {
      setUploadError('Please specify a valid Organic Carbon (OC) percentage.');
      return;
    }

    try {
      const input: SoilReportInput = {
        farmerName: reviewFarmerName || profile?.name,
        sampleId: reviewSampleId,
        soilType: reviewSoilType,
        irrigationType: reviewIrrigation,
        testDate: reviewTestDate,
        ph: phVal,
        nitrogen: { value: nVal, unit: 'kg/ha', source: 'ocr_extracted' },
        phosphorus: { value: pVal, unit: 'kg/ha', source: 'ocr_extracted' },
        potassium: { value: kVal, unit: 'kg/ha', source: 'ocr_extracted' },
        organicCarbon: { value: ocVal, unit: '%', source: 'ocr_extracted' },
        electricalConductivity: ecVal !== undefined ? { value: ecVal, unit: 'dS/m' } : undefined,
        sulfur: sVal !== undefined ? { value: sVal, unit: 'ppm' } : undefined,
        zinc: znVal !== undefined ? { value: znVal, unit: 'ppm' } : undefined,
        iron: feVal !== undefined ? { value: feVal, unit: 'ppm' } : undefined,
        source: uploadFile ? 'report_upload' : 'manual_entry',
        isVerified: true,
        reportFile: extractionResult?.fileInfo
          ? {
              fileName: extractionResult.fileInfo.fileName,
              originalName: extractionResult.fileInfo.originalName,
              mimeType: extractionResult.fileInfo.mimeType,
              fileSize: extractionResult.fileInfo.fileSize,
              fileUrl: extractionResult.fileInfo.fileUrl,
              storageStatus: 'Stored locally & verified',
            }
          : undefined,
      };

      const saved = await verifyAndSaveSoilReport(input);
      loadReportsData();
      setSelectedReport(saved);
      setViewMode('overview');
      setUploadStage('idle');
      setUploadFile(null);
      setSuccessToast('Your soil report has been verified and saved. Current Soil Position updated!');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setUploadError('Failed to save verified report. Please check input parameters.');
    }
  };

  // Delete a report
  const handleDeleteReport = (id: string) => {
    if (confirm('Are you sure you want to delete this soil report?')) {
      deleteSoilReport(id);
      loadReportsData();
      if (selectedReport?.id === id) {
        setSelectedReport(getLatestSoilReport());
      }
    }
  };

  const activePosition: SoilPositionSummary | undefined =
    selectedReport?.interpretation || latestReport?.interpretation;

  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto w-full">
          
          {/* Notification Toast */}
          {successToast && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successToast}</span>
              </div>
              <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= EDITORIAL HERO SECTION ================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#173F2A]/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF5E8] text-[#173F2A] text-xs font-bold uppercase tracking-widest border border-[#173F2A]/10">
                <Sprout className="w-3.5 h-3.5 text-[#3F7D3A]" />
                <span>PRECISION AGRONOMY & SOIL HEALTH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#173F2A] tracking-tight">
                Know what lies beneath your crop.
              </h1>
              <p className="text-sm text-[#5F6F62] max-w-2xl font-normal leading-relaxed">
                Upload your latest certified laboratory soil test or Soil Health Card report. Annadata extracts, verifies, and translates your soil parameters into actionable crop guidance.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  setViewMode('upload_flow');
                  setUploadStage('idle');
                  setTimeout(() => fileInputRef.current?.click(), 50);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#173F2A] text-white text-xs font-extrabold shadow-md hover:bg-[#285C32] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D8B45A]" />
                <span>Upload Soil Report</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  setViewMode('manual_entry');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white border border-[#173F2A]/20 text-[#173F2A] text-xs font-bold hover:bg-[#F8FAF3] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#3F7D3A]" />
                <span>Manual Entry</span>
              </button>
            </div>
          </div>

          {/* ================= UPLOAD & VERIFICATION MODAL / VIEW ================= */}
          {viewMode === 'upload_flow' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#173F2A]/15 shadow-xl space-y-6 animate-in fade-in zoom-in-98 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#173F2A]">
                      {uploadStage === 'review' ? 'Review Your Soil Report' : 'Upload Soil Health Report'}
                    </h2>
                    <p className="text-xs text-[#5F6F62]">
                      {uploadStage === 'review'
                        ? 'Verify the extracted values from your document. You can adjust any parameter before finalizing.'
                        : 'Upload your latest laboratory soil test report in PDF, JPG, JPEG, or PNG format.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('overview');
                    setUploadStage('idle');
                    setUploadFile(null);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="space-y-1">
                    <span>{uploadError}</span>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="underline text-amber-800 hover:text-amber-950 font-extrabold"
                      >
                        Try with another file
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadError(null);
                          setViewMode('manual_entry');
                        }}
                        className="underline text-amber-800 hover:text-amber-950 font-extrabold"
                      >
                        Enter values manually
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 1: Dropzone File Selection */}
              {uploadStage === 'idle' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-10 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDragOver
                      ? 'border-[#3F7D3A] bg-[#EEF5E8]/50'
                      : 'border-stone-300 bg-[#F8FAF3] hover:border-[#3F7D3A]/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-[#3F7D3A] mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-black text-[#173F2A] mb-1">
                    Click to browse or drag & drop your Soil Report
                  </h3>
                  <p className="text-xs text-[#5F6F62] mb-3">
                    Supports <strong>PDF, JPG, JPEG, PNG</strong> documents (Max 15MB)
                  </p>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-600 font-semibold">
                    Indian Soil Health Card & certified laboratory sheets supported
                  </span>
                </div>
              )}

              {/* STAGE 2: Processing Progress Animation */}
              {(uploadStage === 'uploading' || uploadStage === 'extracting' || uploadStage === 'analyzing') && (
                <div className="p-12 rounded-3xl bg-[#F8FAF3] border border-stone-200 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#EEF5E8] flex items-center justify-center mx-auto text-[#3F7D3A] shadow-inner">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#3F7D3A]" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg font-black text-[#173F2A]">
                      {uploadStage === 'uploading' && 'Uploading document...'}
                      {uploadStage === 'extracting' && 'Extracting soil parameters via OCR...'}
                      {uploadStage === 'analyzing' && 'Analyzing soil condition and benchmarks...'}
                    </h3>
                    <p className="text-xs text-[#5F6F62]">
                      Reading chemical parameters, pH reaction, and primary nutrients from {uploadFile?.name}...
                    </p>
                  </div>

                  {/* Visual Progress Steps */}
                  <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-[11px] font-bold">
                    <div className={`p-2 rounded-xl text-center ${uploadStage === 'uploading' ? 'bg-[#173F2A] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      1. Upload
                    </div>
                    <div className={`p-2 rounded-xl text-center ${uploadStage === 'extracting' ? 'bg-[#173F2A] text-white' : uploadStage === 'analyzing' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'}`}>
                      2. OCR Extract
                    </div>
                    <div className={`p-2 rounded-xl text-center ${uploadStage === 'analyzing' ? 'bg-[#173F2A] text-white' : 'bg-stone-200 text-stone-500'}`}>
                      3. Analyze
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: Review & Verification Screen */}
              {uploadStage === 'review' && (
                <form onSubmit={handleConfirmReport} className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#173F2A] font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#3F7D3A]" />
                      <span>Document Extracted: {uploadFile?.name}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-[#3F7D3A] font-extrabold border border-[#DCECCF]">
                      {extractionResult?.extraction?.overallConfidence || 90}% Confidence
                    </span>
                  </div>

                  {/* Primary Parameters Grid */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#3F7D3A] mb-3">
                      Primary Soil Parameters (Required)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                      {/* pH */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Soil Reaction (pH) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="14"
                          required
                          value={reviewPh}
                          onChange={(e) => setReviewPh(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                        <span className="text-[10px] text-stone-500 block">Optimal benchmark: 6.0 - 7.5</span>
                      </div>

                      {/* Organic Carbon */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Organic Carbon (OC %) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={reviewOc}
                          onChange={(e) => setReviewOc(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                        <span className="text-[10px] text-stone-500 block">Optimal benchmark: &gt; 0.75 %</span>
                      </div>

                      {/* Available Nitrogen */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Available Nitrogen (N kg/ha) *</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          required
                          value={reviewN}
                          onChange={(e) => setReviewN(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                        <span className="text-[10px] text-stone-500 block">Benchmark: 280 - 560 kg/ha</span>
                      </div>

                      {/* Available Phosphorus */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Available Phosphorus (P kg/ha) *</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          required
                          value={reviewP}
                          onChange={(e) => setReviewP(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                        <span className="text-[10px] text-stone-500 block">Benchmark: 10 - 25 kg/ha</span>
                      </div>

                      {/* Available Potassium */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Available Potassium (K kg/ha) *</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          required
                          value={reviewK}
                          onChange={(e) => setReviewK(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                        <span className="text-[10px] text-stone-500 block">Benchmark: 108 - 280 kg/ha</span>
                      </div>

                      {/* EC */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Electrical Conductivity (EC dS/m)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={reviewEc}
                          onChange={(e) => setReviewEc(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                        <span className="text-[10px] text-stone-500 block">Normal benchmark: &lt; 1.0 dS/m</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary / Micronutrients (Optional) */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#3F7D3A] mb-3">
                      Secondary & Micronutrients (Optional)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Available Sulphur (S ppm)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Not available"
                          value={reviewS}
                          onChange={(e) => setReviewS(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Available Zinc (Zn ppm)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Not available"
                          value={reviewZn}
                          onChange={(e) => setReviewZn(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                        <label className="block text-[#173F2A] font-bold">Available Iron (Fe ppm)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Not available"
                          value={reviewFe}
                          onChange={(e) => setReviewFe(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setViewMode('overview');
                        setUploadStage('idle');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Confirm & Save Soil Report
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================= MANUAL ENTRY FALLBACK ================= */}
          {viewMode === 'manual_entry' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#173F2A]/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-[#EEF5E8] text-[#3F7D3A]">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#173F2A]">Manual Soil Report Entry</h2>
                    <p className="text-xs text-[#5F6F62]">
                      Directly enter verified values from your physical laboratory report.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmReport} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[#173F2A] font-bold">Soil Test Date *</label>
                    <input
                      type="date"
                      required
                      value={reviewTestDate}
                      onChange={(e) => setReviewTestDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#173F2A] font-bold">Sample / Lab ID</label>
                    <input
                      type="text"
                      placeholder="e.g. SHC-2026-MP"
                      value={reviewSampleId}
                      onChange={(e) => setReviewSampleId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#173F2A] font-bold">Soil Type</label>
                    <select
                      value={reviewSoilType}
                      onChange={(e) => setReviewSoilType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#173F2A]"
                    >
                      <option value="Alluvial">Alluvial (जलोढ़)</option>
                      <option value="Black">Black Soil (काली मिट्टी)</option>
                      <option value="Red">Red Soil (लाल मिट्टी)</option>
                      <option value="Laterite">Laterite (लैटेराइट)</option>
                      <option value="Arid / Desert">Arid / Desert</option>
                      <option value="Mountain / Forest">Mountain / Forest</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                    <label className="block text-[#173F2A] font-bold">Soil pH *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={reviewPh}
                      onChange={(e) => setReviewPh(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                    <label className="block text-[#173F2A] font-bold">Organic Carbon (OC %) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={reviewOc}
                      onChange={(e) => setReviewOc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                    <label className="block text-[#173F2A] font-bold">Nitrogen (N kg/ha) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={reviewN}
                      onChange={(e) => setReviewN(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                    <label className="block text-[#173F2A] font-bold">Phosphorus (P kg/ha) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={reviewP}
                      onChange={(e) => setReviewP(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                    <label className="block text-[#173F2A] font-bold">Potassium (K kg/ha) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={reviewK}
                      onChange={(e) => setReviewK(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1.5">
                    <label className="block text-[#173F2A] font-bold">Electrical Conductivity (EC dS/m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={reviewEc}
                      onChange={(e) => setReviewEc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#173F2A]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                  <Button type="button" variant="outline" size="md" onClick={() => setViewMode('overview')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" icon={<CheckCircle2 className="w-4 h-4" />}>
                    Save Soil Report
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ================= CURRENT SOIL POSITION ================= */}
          {selectedReport && activePosition ? (
            <div className="space-y-6">
              {/* Position Header Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#173F2A]/15 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#3F7D3A]">
                      CURRENT SOIL POSITION
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#173F2A]">
                      Your Soil at a Glance
                    </h2>
                    <p className="text-xs font-semibold text-[#5F6F62] flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3F7D3A]" />
                      <span>Last Tested: <strong>{new Date(selectedReport.testDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                      <span>•</span>
                      <span>Source: <strong>{selectedReport.source === 'report_upload' ? 'Uploaded Test Report' : 'Manual Entry'}</strong></span>
                      {selectedReport.sampleId && <span>• Sample ID: <strong>{selectedReport.sampleId}</strong></span>}
                    </p>
                  </div>

                  {/* Overall Status Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wide border shadow-sm ${
                        activePosition.overallStatus === 'GOOD'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : activePosition.overallStatus === 'NEEDS ATTENTION'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}
                    >
                      {activePosition.overallStatus === 'GOOD'
                        ? '● OPTIMAL / BALANCED'
                        : activePosition.overallStatus === 'NEEDS ATTENTION'
                        ? '▲ NEEDS ATTENTION'
                        : '✕ CRITICAL DEFICIENCIES'}
                    </span>
                  </div>
                </div>

                {/* Grounded Explanation Box */}
                <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 text-xs font-medium text-[#285C32] leading-relaxed">
                  <strong>Agronomic Assessment: </strong>
                  {activePosition.summaryExplanation}
                </div>

                {/* Nutrient By Nutrient Parameter Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activePosition.parameters.map((param) => {
                    const isExpanded = expandedParamCode === param.code;
                    const isLowOrDeficient = ['LOW', 'DEFICIENT', 'NEEDS ATTENTION'].includes(param.status);
                    const isOptimal = ['OPTIMAL', 'NORMAL'].includes(param.status);

                    return (
                      <div
                        key={param.code}
                        onClick={() => setExpandedParamCode(isExpanded ? null : param.code)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-3 ${
                          isExpanded
                            ? 'bg-[#EEF5E8] border-[#3F7D3A] shadow-md ring-2 ring-[#3F7D3A]/20'
                            : 'bg-white border-stone-200 hover:border-[#3F7D3A]/60 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#173F2A]">
                            {param.parameter}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              isOptimal
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isLowOrDeficient
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-stone-50 text-stone-700 border-stone-200'
                            }`}
                          >
                            {param.status}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-[#173F2A]">
                            {param.value} <span className="text-xs font-bold text-stone-500">{param.unit}</span>
                          </span>
                          <span className="text-[11px] text-stone-500 font-medium">
                            Benchmark: {param.benchmark}
                          </span>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-[#173F2A]/10 text-xs space-y-2 animate-in fade-in">
                            <p className="text-[#5F6F62] leading-relaxed">
                              <strong>What this means: </strong>
                              {param.explanation}
                            </p>
                            {param.managementGuidance && (
                              <p className="text-[#285C32] font-semibold leading-relaxed">
                                <strong>Management Direction: </strong>
                                {param.managementGuidance}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#3F7D3A] font-bold pt-1">
                          <span>{isExpanded ? 'Hide details' : 'Click to explore guidance'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= PRACTICAL SOIL MANAGEMENT GUIDANCE ================= */}
              {activePosition.practicalGuidance && activePosition.practicalGuidance.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#EEF5E8] to-[#FFF8E8] border border-[#DCECCF] shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-[#3F7D3A]" />
                    <h3 className="text-lg font-black text-[#173F2A]">
                      Suggested Soil Management Practices
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activePosition.practicalGuidance.map((guide, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-[#DCECCF] text-xs font-semibold text-[#285C32] flex items-start gap-2.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#3F7D3A] shrink-0 mt-0.5" />
                        <span>{guide}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= HISTORICAL SOIL TRENDS ================= */}
              {trends.length > 1 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#173F2A]/10 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <TrendingUp className="w-5 h-5 text-[#3F7D3A]" />
                    <div>
                      <h3 className="text-lg font-black text-[#173F2A]">Soil Health Progression & Trends</h3>
                      <p className="text-xs text-[#5F6F62]">
                        Tracking parameter evolution across {trends.length} recorded soil tests.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* pH Trend */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200">
                      <span className="text-stone-500 font-bold block text-[10px] uppercase">Soil pH Trend</span>
                      <strong className="text-base text-[#173F2A] block mt-1">
                        {trends.map((t) => t.ph).join(' → ')}
                      </strong>
                    </div>

                    {/* OC Trend */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200">
                      <span className="text-stone-500 font-bold block text-[10px] uppercase">Organic Carbon (OC %)</span>
                      <strong className="text-base text-[#173F2A] block mt-1">
                        {trends.map((t) => `${t.oc || 0}%`).join(' → ')}
                      </strong>
                    </div>

                    {/* Nitrogen Trend */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200">
                      <span className="text-stone-500 font-bold block text-[10px] uppercase">Nitrogen (N kg/ha)</span>
                      <strong className="text-base text-[#173F2A] block mt-1">
                        {trends.map((t) => t.n || 0).join(' → ')}
                      </strong>
                    </div>

                    {/* Phosphorus Trend */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200">
                      <span className="text-stone-500 font-bold block text-[10px] uppercase">Phosphorus (P kg/ha)</span>
                      <strong className="text-base text-[#173F2A] block mt-1">
                        {trends.map((t) => t.p || 0).join(' → ')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= EMPTY STATE ================= */
            <div className="p-12 rounded-3xl bg-white border border-[#173F2A]/10 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#EEF5E8] text-[#3F7D3A] flex items-center justify-center mx-auto shadow-inner">
                <Sprout className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-black text-[#173F2A]">
                  Your soil health starts with your latest test.
                </h2>
                <p className="text-xs text-[#5F6F62] leading-relaxed">
                  Upload a certified soil test report or Soil Health Card to unlock pH interpretation, NPK nutrient balance, and hyper-local crop recommendations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewMode('upload_flow');
                  setTimeout(() => fileInputRef.current?.click(), 50);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#173F2A] text-white text-xs font-extrabold shadow hover:bg-[#3F7D3A] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#D8B45A]" />
                <span>Upload Soil Report</span>
              </button>
            </div>
          )}

          {/* ================= SOIL REPORT HISTORY ================= */}
          {reports.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#173F2A]/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-[#3F7D3A]" />
                  <div>
                    <h3 className="text-lg font-black text-[#173F2A]">Soil Report History</h3>
                    <p className="text-xs text-[#5F6F62]">
                      {reports.length} verified laboratory records stored.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {reports.map((rep) => {
                  const isCurrent = rep.id === selectedReport?.id;
                  return (
                    <div
                      key={rep.id}
                      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isCurrent ? 'bg-[#F8FAF3] px-4 rounded-2xl' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#EEF5E8] text-[#3F7D3A]">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-[#173F2A]">
                              {new Date(rep.testDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </strong>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
                              {rep.source === 'report_upload' ? 'Report Upload' : 'Manual Entry'}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#173F2A] text-white font-extrabold">
                                Active View
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            pH: <strong>{rep.ph}</strong> • N: <strong>{rep.nitrogen?.value}</strong> • P: <strong>{rep.phosphorus?.value}</strong> • K: <strong>{rep.potassium?.value}</strong>
                            {rep.sampleId && ` • Ref: ${rep.sampleId}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {rep.reportFile?.fileUrl && (
                          <a
                            href={rep.reportFile.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 text-[#173F2A] text-xs font-bold hover:bg-stone-200 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Original</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3 py-1.5 rounded-xl bg-[#EEF5E8] text-[#285C32] text-xs font-bold hover:bg-[#DCECCF] transition-colors"
                        >
                          View Analysis
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReport(rep.id)}
                          className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function SoilHealthPage() {
  return (
    <ProtectedRoute>
      <SoilHealthContent />
    </ProtectedRoute>
  );
}

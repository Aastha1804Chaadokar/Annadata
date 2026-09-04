'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getFarmerProfile } from '@/lib/farmerService';
import { FarmerProfile } from '@/types/farmer';
import {
  getSoilReports,
  saveSoilReport,
} from '@/lib/soilService';
import { SoilReportInput, SoilReportRecord, SoilTypeOption } from '@/types/soil';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Upload,
  FileText,
  AlertTriangle,
  Check,
  Plus,
  History,
  Calendar,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';

const SOIL_TYPE_OPTIONS: SoilTypeOption[] = [
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Arid / Desert',
  'Mountain / Forest',
  'Other',
  "I don't know",
];

const IRRIGATION_TYPES = ['Rain-fed', 'Borewell', 'Canal', 'Drip', 'Other'];

function SoilHealthContent() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [reports, setReports] = useState<SoilReportRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<SoilReportRecord | null>(null);

  // Input Mode: 'dashboard' | 'form' | 'upload'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'upload'>('dashboard');

  // Form State (Option A)
  const [ph, setPh] = useState<string>('6.5');
  const [nVal, setNVal] = useState<string>('240');
  const [nUnit, setNUnit] = useState<string>('kg/ha');
  const [pVal, setPVal] = useState<string>('18');
  const [pUnit, setPUnit] = useState<string>('kg/ha');
  const [kVal, setKVal] = useState<string>('310');
  const [kUnit, setKUnit] = useState<string>('kg/ha');
  const [ocVal, setOcVal] = useState<string>('0.55');
  const [ocUnit, setOcUnit] = useState<string>('%');
  const [ecVal, setEcVal] = useState<string>('0.8');
  const [ecUnit, setEcUnit] = useState<string>('dS/m');
  const [soilType, setSoilType] = useState<SoilTypeOption>('Black');
  const [irrigationType, setIrrigationType] = useState<string>('Rain-fed');
  const [testDate, setTestDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Upload State (Option B)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Error & Status State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const p = getFarmerProfile();
    setProfile(p);
    if (p && p.irrigation) {
      setIrrigationType(p.irrigation);
    }
    const storedReports = getSoilReports();
    setReports(storedReports);
    if (storedReports.length > 0) {
      setSelectedReport(storedReports[0]);
    } else {
      setActiveTab('form');
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const numericPh = parseFloat(ph);
    const numericN = parseFloat(nVal);
    const numericP = parseFloat(pVal);
    const numericK = parseFloat(kVal);
    const numericOc = parseFloat(ocVal);
    const numericEc = ecVal ? parseFloat(ecVal) : undefined;

    if (isNaN(numericPh) || numericPh < 0 || numericPh > 14) {
      setErrorMessage('Please enter a valid pH value between 0 and 14.');
      return;
    }
    if (isNaN(numericN) || numericN < 0) {
      setErrorMessage('Please enter a valid Nitrogen (N) value.');
      return;
    }
    if (isNaN(numericP) || numericP < 0) {
      setErrorMessage('Please enter a valid Phosphorus (P) value.');
      return;
    }
    if (isNaN(numericK) || numericK < 0) {
      setErrorMessage('Please enter a valid Potassium (K) value.');
      return;
    }
    if (isNaN(numericOc) || numericOc < 0) {
      setErrorMessage('Please enter a valid Organic Carbon value.');
      return;
    }

    setIsSubmitting(true);

    try {
      const input: SoilReportInput = {
        ph: numericPh,
        nitrogen: { value: numericN, unit: nUnit },
        phosphorus: { value: numericP, unit: pUnit },
        potassium: { value: numericK, unit: kUnit },
        organicCarbon: { value: numericOc, unit: ocUnit },
        electricalConductivity:
          numericEc !== undefined ? { value: numericEc, unit: ecUnit } : undefined,
        soilType: soilType === "I don't know" ? 'Unknown' : soilType,
        irrigationType,
        testDate,
        source: 'manual_entry',
      };

      const saved = await saveSoilReport(input);
      const updatedReports = getSoilReports();
      setReports(updatedReports);
      setSelectedReport(saved);
      setSuccessMessage('Your soil information has been saved.');
      setActiveTab('dashboard');
    } catch (err: any) {
      setErrorMessage('We couldn\'t save your soil information. Please check fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select a PDF, JPG, JPEG, or PNG soil report file to upload.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const input: SoilReportInput = {
      ph: parseFloat(ph) || 6.5,
      nitrogen: { value: parseFloat(nVal) || 240, unit: nUnit },
      phosphorus: { value: parseFloat(pVal) || 18, unit: pUnit },
      potassium: { value: parseFloat(kVal) || 310, unit: kUnit },
      organicCarbon: { value: parseFloat(ocVal) || 0.55, unit: ocUnit },
      soilType: soilType === "I don't know" ? 'Unknown' : soilType,
      irrigationType,
      testDate,
      source: 'report_upload',
      reportFile: {
        fileName: selectedFile.name,
        originalName: selectedFile.name,
        mimeType: selectedFile.type,
        storageStatus: 'File storage integration pending',
      },
    };

    const saved = await saveSoilReport(input);
    const updatedReports = getSoilReports();
    setReports(updatedReports);
    setSelectedReport(saved);
    setSuccessMessage('Your soil information has been saved.');
    setActiveTab('dashboard');
    setIsSubmitting(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF3] flex flex-col">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl">
          {/* Header & Subtitle */}
          <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] text-xs font-bold border border-[#DCECCF] mb-2">
                <Sprout className="w-3.5 h-3.5" /> {t('soil.moduleName', 'Soil Intelligence Module')}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#285C32]">
                {t('soil.mainTitle', 'SOIL HEALTH')}
              </h1>
              <p className="text-sm font-semibold text-[#4F5E52] mt-1">
                {t('soil.subtitle', 'Understand the health of your soil before choosing your crop.')}
              </p>
            </div>

            {/* Action Mode Toggle */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#3F7D3A] text-white shadow-sm'
                    : 'text-[#667267] hover:bg-[#EEF5E8]'
                }`}
              >
                {t('soil.tabProfile', 'Soil Profile')}
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'form'
                    ? 'bg-[#3F7D3A] text-white shadow-sm'
                    : 'text-[#667267] hover:bg-[#EEF5E8]'
                }`}
              >
                {t('soil.tabEnterDetails', '+ Enter Test Details')}
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-[#3F7D3A] text-white shadow-sm'
                    : 'text-[#667267] hover:bg-[#EEF5E8]'
                }`}
              >
                {t('soil.tabUploadReport', 'Upload Report')}
              </button>
            </div>
          </div>

          {/* CRITICAL SOIL ACCURACY RULE BANNER */}
          <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/40 text-xs text-[#667267] flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-[#E8B94A] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#285C32] block text-sm mb-0.5">
                {t('soil.accuracyNoticeTitle', 'Soil Testing Accuracy Requirement')}
              </strong>
              <span>
                {t('soil.accuracyNoticeDesc', 'A normal photograph of soil cannot accurately measure pH, Nitrogen, Phosphorus, Potassium, or Organic Carbon. For accurate nutrient values, use a certified Soil Health Card or laboratory soil test report.')}
              </span>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
              <Link href="/app/crop-recommendation">
                <Button size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  {t('dashboard.findSuitableCrops', 'Find Suitable Crops')}
                </Button>
              </Link>
            </div>
          )}

          {/* TAB 1: OPTION A — ENTER SOIL TEST DETAILS FORM */}
          {activeTab === 'form' && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-black text-[#285C32]">
                    {t('soil.optionATitle', 'OPTION A: Enter Soil Test Details')}
                  </h2>
                  <p className="text-xs text-[#667267]">
                    {t('soil.optionASubtitle', 'Fill parameters directly from your Soil Health Card or lab certificate.')}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#3F7D3A] bg-[#EEF5E8] px-3 py-1 rounded-full border border-[#DCECCF]">
                  {t('soil.unitsSpecified', 'Units Explicitly Specified')}
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* pH */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.ph', 'Soil pH')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      required
                      value={ph}
                      onChange={(e) => setPh(e.target.value)}
                      placeholder="e.g. 6.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                    />
                    <span className="text-[11px] text-[#667267] block">{t('soil.phRangeHelp', 'pH range 0 (acidic) to 14 (alkaline). Optimal 6.0 - 7.5.')}</span>
                  </div>

                  {/* Nitrogen (N) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.nitrogen', 'Nitrogen (N)')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        required
                        value={nVal}
                        onChange={(e) => setNVal(e.target.value)}
                        placeholder="e.g. 280"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                      />
                      <select
                        value={nUnit}
                        onChange={(e) => setNUnit(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:outline-none"
                      >
                        <option value="kg/ha">kg/ha</option>
                        <option value="ppm">ppm</option>
                        <option value="mg/kg">mg/kg</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                  </div>

                  {/* Phosphorus (P) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.phosphorus', 'Phosphorus (P)')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        required
                        value={pVal}
                        onChange={(e) => setPVal(e.target.value)}
                        placeholder="e.g. 18"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                      />
                      <select
                        value={pUnit}
                        onChange={(e) => setPUnit(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:outline-none"
                      >
                        <option value="kg/ha">kg/ha</option>
                        <option value="ppm">ppm</option>
                        <option value="mg/kg">mg/kg</option>
                      </select>
                    </div>
                  </div>

                  {/* Potassium (K) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.potassium', 'Potassium (K)')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        required
                        value={kVal}
                        onChange={(e) => setKVal(e.target.value)}
                        placeholder="e.g. 310"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                      />
                      <select
                        value={kUnit}
                        onChange={(e) => setKUnit(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:outline-none"
                      >
                        <option value="kg/ha">kg/ha</option>
                        <option value="ppm">ppm</option>
                        <option value="mg/kg">mg/kg</option>
                      </select>
                    </div>
                  </div>

                  {/* Organic Carbon */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.organicCarbon', 'Organic Carbon')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={ocVal}
                        onChange={(e) => setOcVal(e.target.value)}
                        placeholder="e.g. 0.55"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                      />
                      <select
                        value={ocUnit}
                        onChange={(e) => setOcUnit(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:outline-none"
                      >
                        <option value="%">%</option>
                        <option value="g/kg">g/kg</option>
                      </select>
                    </div>
                  </div>

                  {/* Electrical Conductivity (Optional) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.ecLabel', 'Electrical Conductivity (EC)')} <span className="text-stone-400 font-normal">{t('soil.optional', '(Optional)')}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={ecVal}
                        onChange={(e) => setEcVal(e.target.value)}
                        placeholder="e.g. 0.8"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                      />
                      <select
                        value={ecUnit}
                        onChange={(e) => setEcUnit(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-stone-50 focus:outline-none"
                      >
                        <option value="dS/m">dS/m</option>
                        <option value="mhos/cm">mhos/cm</option>
                      </select>
                    </div>
                  </div>

                  {/* Soil Type Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.soilTypeLabel', 'Soil Type')}
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value as SoilTypeOption)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm font-medium"
                    >
                      {SOIL_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Irrigation Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.irrigationTypeLabel', 'Irrigation Type')}
                    </label>
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm font-medium"
                    >
                      {IRRIGATION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Last Tested Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#285C32]">
                      {t('soil.lastTestedDateLabel', 'Last Tested Date')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                  {reports.length > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setActiveTab('dashboard')}
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('soil.savingBtn', 'Saving Soil Test...') : t('soil.saveSoilTestBtn', 'Save Soil Test Report')}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: OPTION B — UPLOAD SOIL HEALTH CARD */}
          {activeTab === 'upload' && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-black text-[#285C32]">
                    {t('soil.optionBTitle', 'OPTION B: Upload Soil Health Card / Lab Report')}
                  </h2>
                  <p className="text-xs text-[#667267]">
                    {t('soil.optionBSubtitle', 'Upload certified PDF or photo document from your soil testing laboratory.')}
                  </p>
                </div>
              </div>

              {/* Upload Architecture Notice */}
              <div className="p-4 rounded-2xl bg-[#EEF5E8] border border-[#DCECCF] text-xs text-[#285C32] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3F7D3A]" />
                  <span>
                    <strong>{t('soil.storageNoticeTitle', 'File Storage Status:')}</strong> {t('soil.storageNoticeActive', 'File upload reference architecture active.')}
                  </span>
                </div>
                <span className="px-3 py-1 bg-white text-[#3F7D3A] text-xs font-extrabold rounded-full border border-[#DCECCF]">
                  {t('soil.storagePending', 'File storage integration pending')}
                </span>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {/* Upload drop zone */}
                <div className="border-2 border-dashed border-[#3F7D3A]/30 rounded-3xl p-8 text-center bg-[#F8FAF3] hover:bg-[#EEF5E8]/40 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    id="soil-file-input"
                    className="hidden"
                  />
                  <label htmlFor="soil-file-input" className="cursor-pointer space-y-3 block">
                    <div className="w-12 h-12 rounded-full bg-[#EEF5E8] text-[#3F7D3A] mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-[#285C32] block">
                        {t('soil.clickToSelectFile', 'Click to select Soil Report File')}
                      </span>
                      <span className="text-xs text-[#667267] block">
                        {t('soil.fileTypesSupported', 'Supports PDF, JPG, JPEG, or PNG formats')}
                      </span>
                    </div>
                  </label>
                </div>

                {/* File Preview */}
                {selectedFile && (
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-[#3F7D3A]" />
                      <div>
                        <span className="font-bold text-[#285C32] block">{selectedFile.name}</span>
                        <span className="text-[#667267]">{Math.round(selectedFile.size / 1024)} KB</span>
                      </div>
                    </div>
                    {filePreview && (
                      <img src={filePreview} alt="Soil Report Preview" className="h-12 w-12 object-cover rounded-lg border" />
                    )}
                  </div>
                )}

                {/* Base Parameters for parsed report */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <span className="text-xs font-bold text-[#285C32] block">
                    {t('soil.confirmKeyParams', 'Confirm Key Parameters from Document:')}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-[#667267] block">pH</label>
                      <input
                        type="number"
                        step="0.1"
                        value={ph}
                        onChange={(e) => setPh(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border bg-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#667267] block">N ({nUnit})</label>
                      <input
                        type="number"
                        value={nVal}
                        onChange={(e) => setNVal(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border bg-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#667267] block">P ({pUnit})</label>
                      <input
                        type="number"
                        value={pVal}
                        onChange={(e) => setPVal(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border bg-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#667267] block">K ({kUnit})</label>
                      <input
                        type="number"
                        value={kVal}
                        onChange={(e) => setKVal(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border bg-white text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="submit" disabled={isSubmitting || !selectedFile}>
                    {isSubmitting ? t('soil.savingBtn', 'Saving Soil Test...') : t('soil.saveSoilTestBtn', 'Save Soil Test Report')}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: DASHBOARD — SOIL HEALTH PROFILE & HISTORY */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {reports.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-[#3F7D3A]/15 space-y-4">
                  <Sprout className="w-12 h-12 text-[#3F7D3A]/40 mx-auto" />
                  <h2 className="text-xl font-black text-[#285C32]">{t('dashboard.soilNotAdded', 'No Soil Report Added Yet')}</h2>
                  <p className="text-xs text-[#667267] max-w-md mx-auto">
                    {t('soil.subtitle', 'Understand the health of your soil before choosing your crop.')}
                  </p>
                  <Button onClick={() => setActiveTab('form')} icon={<Plus className="w-4 h-4" />}>
                    {t('soil.addSoilInfo', 'Add Soil Test Details')}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Current Active Soil Profile Summary */}
                  {selectedReport && (
                    <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/20 shadow-sm space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-[#EEF5E8] text-[#3F7D3A] border border-[#DCECCF]">
                              {selectedReport.interpretation?.overallHealth || 'Active Report'}
                            </span>
                            <span className="text-xs text-[#667267] flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Last Tested: {selectedReport.testDate}
                            </span>
                          </div>
                          <h2 className="text-2xl font-black text-[#285C32]">
                            {t('dashboard.soilStatus', 'Soil Health Profile')}
                          </h2>
                        </div>

                        <Link href={`/app/soil/${selectedReport.id}`}>
                          <Button variant="secondary" size="sm" icon={<Eye className="w-4 h-4" />}>
                            {t('soil.viewDetail', 'View Detail')}
                          </Button>
                        </Link>
                      </div>

                      {/* Soil Parameters Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* pH */}
                        <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-1">
                          <span className="text-xs font-bold text-[#667267] block">{t('soil.ph', 'Soil pH')}</span>
                          <span className="text-2xl font-black text-[#285C32] block">
                            {selectedReport.ph}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold uppercase">
                            {selectedReport.interpretation?.parameters.find((p) => p.parameter === 'pH')?.status || 'Suitable'}
                          </span>
                        </div>

                        {/* Nitrogen */}
                        <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-1">
                          <span className="text-xs font-bold text-[#667267] block">{t('soil.nitrogen', 'Nitrogen (N)')}</span>
                          <span className="text-2xl font-black text-[#285C32] block">
                            {selectedReport.nitrogen.value} <span className="text-xs text-[#667267] font-normal">{selectedReport.nitrogen.unit}</span>
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase border border-amber-200">
                            {selectedReport.interpretation?.parameters.find((p) => p.parameter.includes('Nitrogen'))?.status || 'Medium'}
                          </span>
                        </div>

                        {/* Phosphorus */}
                        <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-1">
                          <span className="text-xs font-bold text-[#667267] block">{t('soil.phosphorus', 'Phosphorus (P)')}</span>
                          <span className="text-2xl font-black text-[#285C32] block">
                            {selectedReport.phosphorus.value} <span className="text-xs text-[#667267] font-normal">{selectedReport.phosphorus.unit}</span>
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold uppercase">
                            {selectedReport.interpretation?.parameters.find((p) => p.parameter.includes('Phosphorus'))?.status || 'High'}
                          </span>
                        </div>

                        {/* Potassium */}
                        <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-1">
                          <span className="text-xs font-bold text-[#667267] block">{t('soil.potassium', 'Potassium (K)')}</span>
                          <span className="text-2xl font-black text-[#285C32] block">
                            {selectedReport.potassium.value} <span className="text-xs text-[#667267] font-normal">{selectedReport.potassium.unit}</span>
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EEF5E8] text-[#3F7D3A] text-[10px] font-extrabold uppercase">
                            {selectedReport.interpretation?.parameters.find((p) => p.parameter.includes('Potassium'))?.status || 'Medium'}
                          </span>
                        </div>

                        {/* Organic Carbon */}
                        <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-[#3F7D3A]/15 space-y-1">
                          <span className="text-xs font-bold text-[#667267] block">{t('soil.organicCarbon', 'Organic Carbon')}</span>
                          <span className="text-2xl font-black text-[#285C32] block">
                            {selectedReport.organicCarbon.value} <span className="text-xs text-[#667267] font-normal">{selectedReport.organicCarbon.unit}</span>
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase border border-amber-200">
                            {selectedReport.interpretation?.parameters.find((p) => p.parameter.includes('Organic'))?.status || 'Medium'}
                          </span>
                        </div>
                      </div>

                      {/* Soil Type & Irrigation Summary */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs">
                        <div className="flex items-center gap-4 text-[#667267]">
                          <span>{t('soil.soilTypeLabel', 'Soil Type')}: <strong className="text-[#285C32]">{selectedReport.soilType}</strong></span>
                          <span>•</span>
                          <span>{t('soil.irrigationTypeLabel', 'Irrigation Type')}: <strong className="text-[#285C32]">{selectedReport.irrigationType}</strong></span>
                        </div>
                        <Link href="/app/crop-recommendation">
                          <Button size="sm" icon={<Sparkles className="w-4 h-4" />}>
                            {t('dashboard.getRecommendations', 'Get Crop Recommendations')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Simple Explanation Section: "How should I understand this?" */}
                  <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#3F7D3A]" />
                      <h3 className="text-lg font-black text-[#285C32]">
                        {t('soil.howToUnderstand', 'How should I understand this?')}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                        <span className="text-xs font-extrabold text-[#285C32] block">{t('soil.ph', 'Soil pH')}</span>
                        <p className="text-xs text-[#667267] leading-relaxed">
                          Shows how acidic or alkaline the soil is.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                        <span className="text-xs font-extrabold text-[#285C32] block">{t('soil.nitrogen', 'Nitrogen (N)')}</span>
                        <p className="text-xs text-[#667267] leading-relaxed">
                          Important for plant growth and leaf development.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                        <span className="text-xs font-extrabold text-[#285C32] block">{t('soil.phosphorus', 'Phosphorus (P)')}</span>
                        <p className="text-xs text-[#667267] leading-relaxed">
                          Helps root development, flowering, and seed growth.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                        <span className="text-xs font-extrabold text-[#285C32] block">{t('soil.potassium', 'Potassium (K)')}</span>
                        <p className="text-xs text-[#667267] leading-relaxed">
                          Improves disease resistance, grain weight, and stamina.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                        <span className="text-xs font-extrabold text-[#285C32] block">{t('soil.organicCarbon', 'Organic Carbon')}</span>
                        <p className="text-xs text-[#667267] leading-relaxed">
                          Measures soil fertility, organic matter, and moisture retention.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#F8FAF3] border border-stone-200 space-y-1">
                        <span className="text-xs font-extrabold text-[#285C32] block">{t('soil.ecLabel', 'Electrical Conductivity (EC)')}</span>
                        <p className="text-xs text-[#667267] leading-relaxed">
                          Measures soluble salt concentration in field soil.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SOIL HISTORY SECTION */}
                  <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#3F7D3A]/15 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-[#3F7D3A]" />
                        <h3 className="text-lg font-black text-[#285C32]">
                          {t('soil.testHistory', 'Soil Test History')} ({reports.length})
                        </h3>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveTab('form')}
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        {t('soil.addNewTest', 'Add New Test')}
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-[#F8FAF3] text-[#667267] font-bold border-b border-stone-200">
                            <th className="p-3">{t('soil.tableDate', 'Test Date')}</th>
                            <th className="p-3">{t('soil.tablePh', 'pH')}</th>
                            <th className="p-3">{t('soil.tableN', 'Nitrogen (N)')}</th>
                            <th className="p-3">{t('soil.tableP', 'Phosphorus (P)')}</th>
                            <th className="p-3">{t('soil.tableK', 'Potassium (K)')}</th>
                            <th className="p-3">{t('soil.tableOc', 'Organic Carbon')}</th>
                            <th className="p-3">{t('soil.tableSoilType', 'Soil Type')}</th>
                            <th className="p-3 text-right">{t('soil.tableAction', 'Action')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {reports.map((rep) => (
                            <tr key={rep.id} className="hover:bg-[#F8FAF3] transition-colors">
                              <td className="p-3 font-extrabold text-[#285C32]">{rep.testDate}</td>
                              <td className="p-3 font-semibold">{rep.ph}</td>
                              <td className="p-3 font-semibold">{rep.nitrogen.value} {rep.nitrogen.unit}</td>
                              <td className="p-3 font-semibold">{rep.phosphorus.value} {rep.phosphorus.unit}</td>
                              <td className="p-3 font-semibold">{rep.potassium.value} {rep.potassium.unit}</td>
                              <td className="p-3 font-semibold">{rep.organicCarbon.value} {rep.organicCarbon.unit}</td>
                              <td className="p-3 text-[#667267]">{rep.soilType}</td>
                              <td className="p-3 text-right">
                                <Link
                                  href={`/app/soil/${rep.id}`}
                                  className="font-bold text-[#3F7D3A] hover:underline"
                                >
                                  {t('soil.viewDetail', 'View Detail')}
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { ProtectedRoute } from '@/components/app/ProtectedRoute';

export default function SoilHealthPage() {
  return (
    <ProtectedRoute>
      <SoilHealthContent />
    </ProtectedRoute>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CURRENT_CROP_DATASET, CurrentCropOption, CROP_CATEGORIES } from '@/lib/cropDataset';
import { CurrentCropData } from '@/types/farmer';
import { Search, ChevronDown, Check, Sprout } from 'lucide-react';

interface CropSelectProps {
  value?: CurrentCropData;
  onChange: (crop: CurrentCropData) => void;
  required?: boolean;
  language?: string;
  error?: string;
}

export const CropSelect: React.FC<CropSelectProps> = ({
  value,
  onChange,
  required = true,
  language,
  error,
}) => {
  const isHindi = language?.toLowerCase().includes('hindi') || false;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom crop name input state if cropId === 'other'
  const [customCropName, setCustomCropName] = useState(value?.customCropName || '');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter crops by search query
  const filteredDataset = CURRENT_CROP_DATASET.filter((crop) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      crop.cropName.toLowerCase().includes(q) ||
      crop.cropNameHi.toLowerCase().includes(q) ||
      crop.category.toLowerCase().includes(q)
    );
  });

  const handleSelectOption = (opt: CurrentCropOption) => {
    if (opt.cropId === 'other') {
      const updated: CurrentCropData = {
        cropId: 'other',
        cropName: 'Other',
        cropNameHi: 'अन्य',
        category: 'OTHER',
        customCropName: customCropName || '',
      };
      onChange(updated);
    } else {
      const updated: CurrentCropData = {
        cropId: opt.cropId,
        cropName: opt.cropName,
        cropNameHi: opt.cropNameHi,
        category: opt.category,
      };
      onChange(updated);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCustomNameChange = (name: string) => {
    setCustomCropName(name);
    onChange({
      cropId: 'other',
      cropName: 'Other',
      cropNameHi: 'अन्य',
      category: 'OTHER',
      customCropName: name,
    });
  };

  // Determine label string
  const selectedLabel = value
    ? value.cropId === 'other'
      ? value.customCropName
        ? `${value.customCropName} (Other / अन्य)`
        : 'Other / अन्य'
      : `${value.cropName} (${value.cropNameHi})`
    : '';

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#285C32]">
          {isHindi ? 'Current Crop / वर्तमान फसल *' : 'Current Crop / वर्तमान फसल *'}
        </label>

        <div className="relative" ref={dropdownRef}>
          {/* Main Select Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all bg-white text-sm ${
              error
                ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                : 'border-[#D7E4D1] hover:border-[#3F7D3A] focus:ring-2 focus:ring-[#3F7D3A]'
            }`}
          >
            {selectedLabel ? (
              <span className="font-bold text-[#285C32] flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#3F7D3A]" />
                <span>{selectedLabel}</span>
              </span>
            ) : (
              <span className="text-[#667267] font-medium">
                {isHindi ? 'अपनी वर्तमान फसल चुनें (Select your current crop)' : 'Select your current crop'}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-[#667267] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Searchable Dropdown Popup */}
          {isOpen && (
            <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-[#DCECCF] p-2 space-y-2 max-h-80 overflow-y-auto animate-in fade-in duration-150">
              {/* Search Box */}
              <div className="relative sticky top-0 bg-white pt-1 pb-2 border-b border-stone-100 z-10">
                <Search className="w-4 h-4 text-[#667267] absolute left-3 top-3.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder={isHindi ? 'फसल खोजें... (e.g. Soybean, गेहूं)' : 'Search crop... (e.g. soybean or गेहूं)'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAF3] border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3F7D3A]"
                />
              </div>

              {/* Categorized Options */}
              <div className="space-y-3">
                {filteredDataset.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#667267]">
                    No crop matches found. Try searching by English or Hindi name.
                  </div>
                ) : (
                  CROP_CATEGORIES.map((cat) => {
                    const categoryCrops = filteredDataset.filter((c) => c.category === cat);
                    if (categoryCrops.length === 0) return null;

                    return (
                      <div key={cat} className="space-y-1">
                        <div className="text-[10px] font-black uppercase text-[#3F7D3A] tracking-wider px-2 pt-1">
                          {cat}
                        </div>
                        <div className="space-y-0.5">
                          {categoryCrops.map((crop) => {
                            const isSelected = value?.cropId === crop.cropId;
                            return (
                              <button
                                key={crop.cropId}
                                type="button"
                                onClick={() => handleSelectOption(crop)}
                                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-[#EEF5E8] text-[#3F7D3A]'
                                    : 'hover:bg-[#F8FAF3] text-[#285C32]'
                                }`}
                              >
                                <span>
                                  {crop.cropName} ({crop.cropNameHi})
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#3F7D3A]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADDITIONAL INPUT IF 'OTHER' IS SELECTED */}
      {value?.cropId === 'other' && (
        <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E8B94A]/40 space-y-2 animate-in fade-in duration-200">
          <label className="block text-xs font-bold text-[#285C32]">
            {isHindi ? 'Enter crop name / फसल का नाम *' : 'Enter crop name / फसल का नाम *'}
          </label>
          <input
            type="text"
            required
            placeholder={isHindi ? 'जैसे: सरसों का साग / Jute' : 'e.g. Jute, Medicinal herbs'}
            value={customCropName}
            onChange={(e) => handleCustomNameChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] bg-white"
          />
        </div>
      )}

      {error && <span className="text-[11px] font-bold text-red-600 block">{error}</span>}
    </div>
  );
};

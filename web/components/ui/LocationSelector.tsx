'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ALL_INDIAN_STATES, 
  getDistrictsForState, 
  searchStates, 
  searchDistricts,
  searchAllDistricts,
  getStateForDistrict,
  DistrictEntry
} from '@/lib/locations/indiaLocations';
import { MapPin, Search, ChevronDown, Check, X, AlertCircle } from 'lucide-react';

interface LocationSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  stateLabel?: string;
  districtLabel?: string;
  statePlaceholder?: string;
  districtPlaceholder?: string;
  stateRequired?: boolean;
  districtRequired?: boolean;
  disabled?: boolean;
  layout?: 'row' | 'col';
  className?: string;
  error?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
  stateLabel = 'State *',
  districtLabel = 'District *',
  statePlaceholder = 'Select State',
  districtPlaceholder = 'Select District',
  stateRequired = true,
  districtRequired = true,
  disabled = false,
  layout = 'row',
  className = '',
  error,
}) => {
  // Popover open states
  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  // Search input queries
  const [stateQuery, setStateQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');

  const stateContainerRef = useRef<HTMLDivElement>(null);
  const districtContainerRef = useRef<HTMLDivElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);
  const districtInputRef = useRef<HTMLInputElement>(null);

  // Memoized filtered states
  const filteredStates = useMemo(() => {
    return searchStates(stateQuery);
  }, [stateQuery]);

  // Memoized filtered districts:
  // If state is selected -> filter that state's districts
  // If no state is selected -> allow searching all districts across India with auto-state detection
  const availableDistrictsForState = useMemo(() => {
    if (!selectedState) return [];
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  const stateFilteredDistricts = useMemo(() => {
    if (!selectedState) return [];
    return searchDistricts(selectedState, districtQuery);
  }, [selectedState, districtQuery]);

  const allIndiaFilteredDistricts = useMemo(() => {
    if (selectedState) return [];
    return searchAllDistricts(districtQuery).slice(0, 100); // Top 100 for smooth scrolling
  }, [selectedState, districtQuery]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        stateContainerRef.current &&
        !stateContainerRef.current.contains(e.target as Node)
      ) {
        setStateOpen(false);
      }
      if (
        districtContainerRef.current &&
        !districtContainerRef.current.contains(e.target as Node)
      ) {
        setDistrictOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search inputs on open
  useEffect(() => {
    if (stateOpen) {
      setTimeout(() => stateInputRef.current?.focus(), 50);
    } else {
      setStateQuery('');
    }
  }, [stateOpen]);

  useEffect(() => {
    if (districtOpen) {
      setTimeout(() => districtInputRef.current?.focus(), 50);
    } else {
      setDistrictQuery('');
    }
  }, [districtOpen]);

  // Handle State Selection
  const handleSelectState = (st: string) => {
    if (st !== selectedState) {
      onStateChange(st);
      onDistrictChange(''); // Automatic reset of district on state change
    }
    setStateOpen(false);
  };

  // Handle District Selection (when state is already chosen)
  const handleSelectDistrict = (dist: string) => {
    onDistrictChange(dist);
    setDistrictOpen(false);
  };

  // Handle District Selection (from all-India search when no state was chosen yet)
  const handleSelectDistrictWithState = (entry: DistrictEntry) => {
    onStateChange(entry.state);
    onDistrictChange(entry.district);
    setDistrictOpen(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={
          layout === 'row'
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            : 'flex flex-col space-y-4'
        }
      >
        {/* ================= STATE DROPDOWN ================= */}
        <div ref={stateContainerRef} className="space-y-1.5">
          <label className="block text-xs font-bold text-[#285C32]">
            {stateLabel} {stateRequired && !stateLabel.includes('*') && '*'}
          </label>

          <div className="relative">
            {/* Location Pin Icon properly aligned inside input container */}
            <MapPin className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5 pointer-events-none z-10" />

            {/* Trigger Button */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setStateOpen(!stateOpen);
                  setDistrictOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] ${
                stateOpen
                  ? 'border-[#285C32] ring-2 ring-[#3F7D3A]/30 bg-white'
                  : 'border-[#D7E4D1] bg-white hover:border-[#3F7D3A]/60'
              } ${disabled ? 'opacity-60 cursor-not-allowed bg-stone-50' : 'cursor-pointer'}`}
            >
              <span
                className={`truncate font-medium ${
                  selectedState ? 'text-[#173F2A] font-bold' : 'text-stone-400'
                }`}
              >
                {selectedState || statePlaceholder}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#667267] transition-transform duration-200 ${
                  stateOpen ? 'rotate-180 text-[#285C32]' : ''
                }`}
              />
            </button>

            {/* Searchable State Dropdown Popover */}
            {stateOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-[#D7E4D1] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar */}
                <div className="p-2.5 border-b border-stone-100 bg-[#F8FAF3]">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      ref={stateInputRef}
                      type="text"
                      placeholder="Search 36 States & UTs..."
                      value={stateQuery}
                      onChange={(e) => setStateQuery(e.target.value)}
                      className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-[#173F2A] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#3F7D3A]"
                    />
                    {stateQuery && (
                      <button
                        type="button"
                        onClick={() => setStateQuery('')}
                        className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* States List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-50 p-1">
                  {filteredStates.length > 0 ? (
                    filteredStates.map((st) => {
                      const isSelected = selectedState === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleSelectState(st)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#EEF5E8] text-[#173F2A] font-black'
                              : 'text-[#334155] hover:bg-[#F8FAF3] hover:text-[#173F2A]'
                          }`}
                        >
                          <span>{st}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#3F7D3A]" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-400 font-medium">
                      No state matching &quot;{stateQuery}&quot;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= DISTRICT DROPDOWN ================= */}
        <div ref={districtContainerRef} className="space-y-1.5">
          <label className="block text-xs font-bold text-[#285C32]">
            {districtLabel} {districtRequired && !districtLabel.includes('*') && '*'}
          </label>

          <div className="relative">
            {/* Location Pin Icon properly aligned inside input container */}
            <MapPin className="w-4 h-4 text-[#667267] absolute left-3.5 top-3.5 pointer-events-none z-10" />

            {/* Trigger Button - Always enabled and clickable */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setDistrictOpen(!districtOpen);
                  setStateOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#3F7D3A] ${
                districtOpen
                  ? 'border-[#285C32] ring-2 ring-[#3F7D3A]/30 bg-white'
                  : 'border-[#D7E4D1] bg-white hover:border-[#3F7D3A]/60'
              } ${disabled ? 'opacity-60 cursor-not-allowed bg-stone-50' : 'cursor-pointer'}`}
            >
              <span
                className={`truncate font-medium ${
                  selectedDistrict
                    ? 'text-[#173F2A] font-bold'
                    : 'text-stone-400'
                }`}
              >
                {selectedDistrict || districtPlaceholder}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#667267] transition-transform duration-200 ${
                  districtOpen ? 'rotate-180 text-[#285C32]' : ''
                }`}
              />
            </button>

            {/* Searchable District Dropdown Popover */}
            {districtOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-[#D7E4D1] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar */}
                <div className="p-2.5 border-b border-stone-100 bg-[#F8FAF3]">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      ref={districtInputRef}
                      type="text"
                      placeholder={
                        selectedState
                          ? `Search ${availableDistrictsForState.length} districts in ${selectedState}...`
                          : 'Search any district in India...'
                      }
                      value={districtQuery}
                      onChange={(e) => setDistrictQuery(e.target.value)}
                      className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-[#173F2A] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#3F7D3A]"
                    />
                    {districtQuery && (
                      <button
                        type="button"
                        onClick={() => setDistrictQuery('')}
                        className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Districts List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-50 p-1">
                  {selectedState ? (
                    // When State is selected: show filtered districts of that state
                    stateFilteredDistricts.length > 0 ? (
                      stateFilteredDistricts.map((dist) => {
                        const isSelected = selectedDistrict === dist;
                        return (
                          <button
                            key={dist}
                            type="button"
                            onClick={() => handleSelectDistrict(dist)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-[#EEF5E8] text-[#173F2A] font-black'
                                : 'text-[#334155] hover:bg-[#F8FAF3] hover:text-[#173F2A]'
                            }`}
                          >
                            <span>{dist}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#3F7D3A]" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-stone-400 font-medium">
                        No district matching &quot;{districtQuery}&quot; in {selectedState}
                      </div>
                    )
                  ) : (
                    // When No State is selected yet: show searchable all-India districts with state tag
                    allIndiaFilteredDistricts.length > 0 ? (
                      allIndiaFilteredDistricts.map((entry) => {
                        const isSelected = selectedDistrict === entry.district && selectedState === entry.state;
                        return (
                          <button
                            key={`${entry.state}-${entry.district}`}
                            type="button"
                            onClick={() => handleSelectDistrictWithState(entry)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-[#EEF5E8] text-[#173F2A] font-black'
                                : 'text-[#334155] hover:bg-[#F8FAF3] hover:text-[#173F2A]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#173F2A]">{entry.district}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-medium">
                                {entry.state}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#3F7D3A]" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-stone-400 font-medium">
                        No district matching &quot;{districtQuery}&quot;
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

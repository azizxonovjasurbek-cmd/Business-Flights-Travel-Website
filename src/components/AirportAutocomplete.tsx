'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Airport, searchAirports } from '@/data/airports';

interface AirportAutocompleteProps {
  label: string;
  placeholder?: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  error?: string;
}

export default function AirportAutocomplete({
  label,
  placeholder = 'City or airport',
  value,
  onChange,
  error,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.length > 0 ? searchAirports(query, 8) : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (airport: Airport) => {
    onChange(airport);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const clear = () => {
    onChange(null);
    setQuery('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && suggestions[highlight]) {
      e.preventDefault();
      select(suggestions[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
        {label}
      </label>

      {value ? (
        <div className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 flex items-center justify-between hover:border-neutral-400 transition-colors">
          <div className="flex items-start gap-3 min-w-0">
            <MapPin className="w-4 h-4 mt-1 text-[#b91c1c] flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-neutral-900 font-medium text-sm truncate">
                <span className="font-semibold text-[#b91c1c]">{value.iata}</span>
                <span className="mx-1.5 text-neutral-400">·</span>
                {value.city}, {value.country}
              </div>
              <div className="text-[11px] text-neutral-500 truncate">{value.name}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0 ml-2"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
        />
      )}

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

      {open && !value && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {suggestions.map((a, i) => (
            <button
              key={a.iata}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                select(a);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-neutral-100 last:border-0 transition-colors ${
                highlight === i ? 'bg-neutral-50' : 'hover:bg-neutral-50'
              }`}
            >
              <MapPin className="w-4 h-4 mt-1 text-neutral-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-[#b91c1c] font-mono tracking-wider">
                    {a.iata}
                  </span>
                  <span className="text-neutral-900 text-sm font-medium truncate">
                    {a.city}, {a.country}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 truncate">{a.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && !value && query.length > 0 && suggestions.length === 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl p-4 text-sm text-neutral-500 text-center">
          No airports found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

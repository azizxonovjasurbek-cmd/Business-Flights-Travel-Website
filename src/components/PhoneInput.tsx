'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryCode {
  name: string;
  dial: string;
  code: string;
  flag: string;
}

const countries: CountryCode[] = [
  { name: 'United States', dial: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'Canada', dial: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'United Kingdom', dial: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Australia', dial: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', dial: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'France', dial: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Italy', dial: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Spain', dial: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Netherlands', dial: '+31', code: 'NL', flag: '🇳🇱' },
  { name: 'Belgium', dial: '+32', code: 'BE', flag: '🇧🇪' },
  { name: 'Switzerland', dial: '+41', code: 'CH', flag: '🇨🇭' },
  { name: 'Austria', dial: '+43', code: 'AT', flag: '🇦🇹' },
  { name: 'Sweden', dial: '+46', code: 'SE', flag: '🇸🇪' },
  { name: 'Norway', dial: '+47', code: 'NO', flag: '🇳🇴' },
  { name: 'Denmark', dial: '+45', code: 'DK', flag: '🇩🇰' },
  { name: 'Finland', dial: '+358', code: 'FI', flag: '🇫🇮' },
  { name: 'Iceland', dial: '+354', code: 'IS', flag: '🇮🇸' },
  { name: 'Ireland', dial: '+353', code: 'IE', flag: '🇮🇪' },
  { name: 'Portugal', dial: '+351', code: 'PT', flag: '🇵🇹' },
  { name: 'Greece', dial: '+30', code: 'GR', flag: '🇬🇷' },
  { name: 'Poland', dial: '+48', code: 'PL', flag: '🇵🇱' },
  { name: 'Czech Republic', dial: '+420', code: 'CZ', flag: '🇨🇿' },
  { name: 'Hungary', dial: '+36', code: 'HU', flag: '🇭🇺' },
  { name: 'Romania', dial: '+40', code: 'RO', flag: '🇷🇴' },
  { name: 'Croatia', dial: '+385', code: 'HR', flag: '🇭🇷' },
  { name: 'Serbia', dial: '+381', code: 'RS', flag: '🇷🇸' },
  { name: 'Bulgaria', dial: '+359', code: 'BG', flag: '🇧🇬' },
  { name: 'Slovenia', dial: '+386', code: 'SI', flag: '🇸🇮' },
  { name: 'Slovakia', dial: '+421', code: 'SK', flag: '🇸🇰' },
  { name: 'Lithuania', dial: '+370', code: 'LT', flag: '🇱🇹' },
  { name: 'Latvia', dial: '+371', code: 'LV', flag: '🇱🇻' },
  { name: 'Estonia', dial: '+372', code: 'EE', flag: '🇪🇪' },
  { name: 'Turkey', dial: '+90', code: 'TR', flag: '🇹🇷' },
  { name: 'Russia', dial: '+7', code: 'RU', flag: '🇷🇺' },
  { name: 'Ukraine', dial: '+380', code: 'UA', flag: '🇺🇦' },
  { name: 'Japan', dial: '+81', code: 'JP', flag: '🇯🇵' },
  { name: 'South Korea', dial: '+82', code: 'KR', flag: '🇰🇷' },
  { name: 'China', dial: '+86', code: 'CN', flag: '🇨🇳' },
  { name: 'Hong Kong', dial: '+852', code: 'HK', flag: '🇭🇰' },
  { name: 'Taiwan', dial: '+886', code: 'TW', flag: '🇹🇼' },
  { name: 'Singapore', dial: '+65', code: 'SG', flag: '🇸🇬' },
  { name: 'Malaysia', dial: '+60', code: 'MY', flag: '🇲🇾' },
  { name: 'Thailand', dial: '+66', code: 'TH', flag: '🇹🇭' },
  { name: 'Vietnam', dial: '+84', code: 'VN', flag: '🇻🇳' },
  { name: 'Philippines', dial: '+63', code: 'PH', flag: '🇵🇭' },
  { name: 'Indonesia', dial: '+62', code: 'ID', flag: '🇮🇩' },
  { name: 'India', dial: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'Pakistan', dial: '+92', code: 'PK', flag: '🇵🇰' },
  { name: 'Bangladesh', dial: '+880', code: 'BD', flag: '🇧🇩' },
  { name: 'Sri Lanka', dial: '+94', code: 'LK', flag: '🇱🇰' },
  { name: 'Nepal', dial: '+977', code: 'NP', flag: '🇳🇵' },
  { name: 'Maldives', dial: '+960', code: 'MV', flag: '🇲🇻' },
  { name: 'UAE', dial: '+971', code: 'AE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', dial: '+966', code: 'SA', flag: '🇸🇦' },
  { name: 'Qatar', dial: '+974', code: 'QA', flag: '🇶🇦' },
  { name: 'Kuwait', dial: '+965', code: 'KW', flag: '🇰🇼' },
  { name: 'Bahrain', dial: '+973', code: 'BH', flag: '🇧🇭' },
  { name: 'Oman', dial: '+968', code: 'OM', flag: '🇴🇲' },
  { name: 'Jordan', dial: '+962', code: 'JO', flag: '🇯🇴' },
  { name: 'Lebanon', dial: '+961', code: 'LB', flag: '🇱🇧' },
  { name: 'Israel', dial: '+972', code: 'IL', flag: '🇮🇱' },
  { name: 'Iran', dial: '+98', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', dial: '+964', code: 'IQ', flag: '🇮🇶' },
  { name: 'Egypt', dial: '+20', code: 'EG', flag: '🇪🇬' },
  { name: 'Morocco', dial: '+212', code: 'MA', flag: '🇲🇦' },
  { name: 'Tunisia', dial: '+216', code: 'TN', flag: '🇹🇳' },
  { name: 'Algeria', dial: '+213', code: 'DZ', flag: '🇩🇿' },
  { name: 'South Africa', dial: '+27', code: 'ZA', flag: '🇿🇦' },
  { name: 'Nigeria', dial: '+234', code: 'NG', flag: '🇳🇬' },
  { name: 'Ghana', dial: '+233', code: 'GH', flag: '🇬🇭' },
  { name: 'Kenya', dial: '+254', code: 'KE', flag: '🇰🇪' },
  { name: 'Tanzania', dial: '+255', code: 'TZ', flag: '🇹🇿' },
  { name: 'Ethiopia', dial: '+251', code: 'ET', flag: '🇪🇹' },
  { name: 'Uganda', dial: '+256', code: 'UG', flag: '🇺🇬' },
  { name: 'Rwanda', dial: '+250', code: 'RW', flag: '🇷🇼' },
  { name: 'Senegal', dial: '+221', code: 'SN', flag: '🇸🇳' },
  { name: 'Ivory Coast', dial: '+225', code: 'CI', flag: '🇨🇮' },
  { name: 'Cameroon', dial: '+237', code: 'CM', flag: '🇨🇲' },
  { name: 'Mozambique', dial: '+258', code: 'MZ', flag: '🇲🇿' },
  { name: 'Zambia', dial: '+260', code: 'ZM', flag: '🇿🇲' },
  { name: 'Zimbabwe', dial: '+263', code: 'ZW', flag: '🇿🇼' },
  { name: 'Botswana', dial: '+267', code: 'BW', flag: '🇧🇼' },
  { name: 'Namibia', dial: '+264', code: 'NA', flag: '🇳🇦' },
  { name: 'Mauritius', dial: '+230', code: 'MU', flag: '🇲🇺' },
  { name: 'Madagascar', dial: '+261', code: 'MG', flag: '🇲🇬' },
  { name: 'Mexico', dial: '+52', code: 'MX', flag: '🇲🇽' },
  { name: 'Brazil', dial: '+55', code: 'BR', flag: '🇧🇷' },
  { name: 'Argentina', dial: '+54', code: 'AR', flag: '🇦🇷' },
  { name: 'Chile', dial: '+56', code: 'CL', flag: '🇨🇱' },
  { name: 'Colombia', dial: '+57', code: 'CO', flag: '🇨🇴' },
  { name: 'Peru', dial: '+51', code: 'PE', flag: '🇵🇪' },
  { name: 'Ecuador', dial: '+593', code: 'EC', flag: '🇪🇨' },
  { name: 'Venezuela', dial: '+58', code: 'VE', flag: '🇻🇪' },
  { name: 'Bolivia', dial: '+591', code: 'BO', flag: '🇧🇴' },
  { name: 'Paraguay', dial: '+595', code: 'PY', flag: '🇵🇾' },
  { name: 'Uruguay', dial: '+598', code: 'UY', flag: '🇺🇾' },
  { name: 'Costa Rica', dial: '+506', code: 'CR', flag: '🇨🇷' },
  { name: 'Panama', dial: '+507', code: 'PA', flag: '🇵🇦' },
  { name: 'Guatemala', dial: '+502', code: 'GT', flag: '🇬🇹' },
  { name: 'Dominican Rep.', dial: '+1', code: 'DO', flag: '🇩🇴' },
  { name: 'Jamaica', dial: '+1', code: 'JM', flag: '🇯🇲' },
  { name: 'Puerto Rico', dial: '+1', code: 'PR', flag: '🇵🇷' },
  { name: 'Cuba', dial: '+53', code: 'CU', flag: '🇨🇺' },
  { name: 'New Zealand', dial: '+64', code: 'NZ', flag: '🇳🇿' },
  { name: 'Fiji', dial: '+679', code: 'FJ', flag: '🇫🇯' },
  { name: 'Georgia', dial: '+995', code: 'GE', flag: '🇬🇪' },
  { name: 'Armenia', dial: '+374', code: 'AM', flag: '🇦🇲' },
  { name: 'Azerbaijan', dial: '+994', code: 'AZ', flag: '🇦🇿' },
  { name: 'Kazakhstan', dial: '+7', code: 'KZ', flag: '🇰🇿' },
  { name: 'Uzbekistan', dial: '+998', code: 'UZ', flag: '🇺🇿' },
  { name: 'Kyrgyzstan', dial: '+996', code: 'KG', flag: '🇰🇬' },
  { name: 'Mongolia', dial: '+976', code: 'MN', flag: '🇲🇳' },
  { name: 'Cambodia', dial: '+855', code: 'KH', flag: '🇰🇭' },
  { name: 'Laos', dial: '+856', code: 'LA', flag: '🇱🇦' },
  { name: 'Myanmar', dial: '+95', code: 'MM', flag: '🇲🇲' },
  { name: 'Brunei', dial: '+673', code: 'BN', flag: '🇧🇳' },
  { name: 'Afghanistan', dial: '+93', code: 'AF', flag: '🇦🇫' },
  { name: 'Bhutan', dial: '+975', code: 'BT', flag: '🇧🇹' },
  { name: 'Luxembourg', dial: '+352', code: 'LU', flag: '🇱🇺' },
  { name: 'Malta', dial: '+356', code: 'MT', flag: '🇲🇹' },
  { name: 'Cyprus', dial: '+357', code: 'CY', flag: '🇨🇾' },
  { name: 'Albania', dial: '+355', code: 'AL', flag: '🇦🇱' },
  { name: 'North Macedonia', dial: '+389', code: 'MK', flag: '🇲🇰' },
  { name: 'Montenegro', dial: '+382', code: 'ME', flag: '🇲🇪' },
  { name: 'Bosnia', dial: '+387', code: 'BA', flag: '🇧🇦' },
  { name: 'Moldova', dial: '+373', code: 'MD', flag: '🇲🇩' },
  { name: 'Belarus', dial: '+375', code: 'BY', flag: '🇧🇾' },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullPhone: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countries[0]);
  const [localNumber, setLocalNumber] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // On mount, try to parse existing value
  useEffect(() => {
    if (value && !localNumber) {
      // Check if value starts with a dial code
      const match = countries.find((c) => value.startsWith(c.dial));
      if (match) {
        setSelectedCountry(match);
        setLocalNumber(value.slice(match.dial.length).trim());
      } else {
        setLocalNumber(value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setOpen(false);
    const full = `${country.dial} ${localNumber}`.trim();
    onChange(full);
  };

  const handleNumberChange = (num: string) => {
    setLocalNumber(num);
    const full = `${selectedCountry.dial} ${num}`.trim();
    onChange(full);
  };

  const filtered = search.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
        Phone
      </label>
      <div ref={wrapperRef} className="relative flex">
        {/* Country code button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1.5 bg-white border border-r-0 rounded-l-lg h-14 px-3 text-sm hover:bg-neutral-50 transition-colors flex-shrink-0 ${
            open
              ? 'border-[#b91c1c] ring-2 ring-[#b91c1c]/10 z-10'
              : 'border-neutral-200'
          }`}
        >
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span className="text-neutral-700 font-semibold text-xs">
            {selectedCountry.dial}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Phone number input */}
        <input
          type="tel"
          value={localNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="Phone number"
          className={`flex-1 bg-white border rounded-r-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none transition-all min-w-0 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
              : 'border-neutral-200 focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10'
          }`}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-2xl shadow-black/15 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-neutral-100">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]/10"
              />
            </div>
            {/* List */}
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                  No countries found
                </div>
              )}
              {filtered.map((c) => (
                <button
                  key={`${c.code}-${c.dial}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(c);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-neutral-50 transition-colors ${
                    selectedCountry.code === c.code && selectedCountry.dial === c.dial
                      ? 'bg-red-50 text-[#b91c1c]'
                      : 'text-neutral-800'
                  }`}
                >
                  <span className="text-xl leading-none">{c.flag}</span>
                  <span className="flex-1 truncate font-medium">{c.name}</span>
                  <span className="text-neutral-500 text-xs font-mono">{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

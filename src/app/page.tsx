'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Award,
  Clock,
  ArrowRight,
  Phone,
  Shield,
  CheckCircle2,
  Sparkles,
  Menu,
  X as XIcon,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';
import AirportAutocomplete from '@/components/AirportAutocomplete';
import PhoneInput from '@/components/PhoneInput';
import type { Airport } from '@/data/airports';

type TripType = 'roundtrip' | 'oneway' | 'multi';
type TravelClass = 'economy' | 'premium' | 'business' | 'first';

interface FlightSegment {
  from: Airport | null;
  to: Airport | null;
  depart: string;
}

const defaultDepart = () =>
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0];
const defaultReturn = () =>
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().split('T')[0];

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [travelClass, setTravelClass] = useState<TravelClass>('business');
  const [travelers, setTravelers] = useState(1);

  const [segments, setSegments] = useState<FlightSegment[]>([
    { from: null, to: null, depart: defaultDepart() },
  ]);
  const [returnDate, setReturnDate] = useState(defaultReturn());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateSegment = (idx: number, patch: Partial<FlightSegment>) => {
    setSegments((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const addSegment = () => {
    if (segments.length >= 5) return;
    const lastDepart = segments[segments.length - 1]?.depart || defaultDepart();
    const nextDepart = new Date(
      new Date(lastDepart).getTime() + 1000 * 60 * 60 * 24 * 3
    )
      .toISOString()
      .split('T')[0];
    setSegments((prev) => [
      ...prev,
      { from: null, to: null, depart: nextDepart },
    ]);
  };

  const removeSegment = (idx: number) => {
    if (segments.length <= 1) return;
    setSegments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTripTypeChange = (t: TripType) => {
    setTripType(t);
    if (t !== 'multi' && segments.length > 1) {
      setSegments([segments[0]]);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    segments.forEach((seg, i) => {
      if (!seg.from) errors[`from-${i}`] = 'Select a departure airport';
      if (!seg.to) errors[`to-${i}`] = 'Select an arrival airport';
      if (seg.from && seg.to && seg.from.iata === seg.to.iata) {
        errors[`to-${i}`] = 'Departure and arrival must differ';
      }
      if (!seg.depart) errors[`depart-${i}`] = 'Select a date';
    });

    if (tripType === 'roundtrip' && !returnDate) {
      errors.returnDate = 'Select a return date';
    }
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      errors.phone = 'Enter a valid phone number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) {
      // Scroll to first error
      const first = document.querySelector('[data-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        tripType,
        travelClass,
        travelers,
        segments: segments.map((s) => ({
          from: s.from
            ? { iata: s.from.iata, name: s.from.name, city: s.from.city, country: s.from.country }
            : null,
          to: s.to
            ? { iata: s.to.iata, name: s.to.name, city: s.to.city, country: s.to.country }
            : null,
          depart: s.depart,
        })),
        returnDate: tripType === 'roundtrip' ? returnDate : null,
        firstName,
        lastName,
        email,
        phone,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Redirect to dedicated thank-you page
      router.push('/thank-you');
      return;
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Network error. Please try again in a moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#deals', label: 'Deals' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#quote', label: 'Get a Quote' },
  ];

  return (
    <div className="bg-white text-neutral-900 font-sans">
      {/* TOP BAR */}
      <div className="bg-neutral-950 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-6 text-neutral-300">
            <span className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-[#dc2626]" />
              IATA Accredited Agency
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-3 h-3 text-[#dc2626]" />
              4.9/5 Client Rated
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              +1 (800) 123-4567
            </a>
            <span className="hidden md:inline text-neutral-500">|</span>
            <span className="hidden md:inline">Available 24/7</span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <div className="relative w-11 h-11">
              <Image
                src="/logo.png"
                alt="Elite Flights Travel"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-xl tracking-tight text-neutral-900">
                ELITE FLIGHTS
              </div>
              <div className="text-[10px] tracking-[3px] text-[#b91c1c] font-medium">
                TRAVEL
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-700">
            {navLinks.slice(0, 5).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#b91c1c] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#quote"
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#b91c1c] transition-all text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md shadow-red-500/20"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden p-2 -mr-2"
              aria-label="Menu"
            >
              {menuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-2 text-neutral-800 hover:text-[#b91c1c] transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2000&auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Copy */}
          <div className="lg:col-span-6 lg:pt-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#f87171] text-[11px] uppercase tracking-[3px] px-4 py-2 rounded-full mb-6 font-medium">
              <Sparkles className="w-3 h-3" />
              Business & First Class Specialists
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-6">
              Fly <span className="italic text-[#f87171]">First Class.</span>
              <br />
              Pay less than you think.
            </h1>

            <p className="text-lg text-neutral-300 max-w-xl mb-10 leading-relaxed">
              Elite Flights Travel unlocks exclusive unpublished fares on the world&apos;s
              most luxurious airlines — saving discerning travelers up to 60% on
              premium cabins.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              {[
                { n: '60%', l: 'Avg. Savings' },
                { n: '10k+', l: 'Happy Clients' },
                { n: '24/7', l: 'Concierge' },
                { n: '100+', l: 'Airlines' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-3xl text-[#f87171]">{s.n}</div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="tel:+18001234567"
              className="inline-flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#dc2626] flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[3px] text-[#f87171] font-medium">
                  Call our experts now
                </div>
                <div className="text-2xl font-light">+1 (800) 123-4567</div>
              </div>
            </a>
          </div>

          {/* RIGHT: Quote form */}
          <div id="quote" className="lg:col-span-6 lg:pt-2">
            <div className="bg-white text-neutral-900 rounded-2xl shadow-2xl shadow-black/30 border border-neutral-100 overflow-hidden">
              {(
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[3px] text-[#b91c1c] font-semibold mb-2">
                      Request a private quote
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-neutral-900">
                      Where would you like to go?
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Our senior travel advisors reply within 30 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Trip type toggle */}
                    <div className="inline-flex bg-neutral-100 rounded-full p-1 text-sm">
                      {(
                        [
                          { v: 'roundtrip', l: 'Round Trip' },
                          { v: 'oneway', l: 'One Way' },
                          { v: 'multi', l: 'Multi-city' },
                        ] as { v: TripType; l: string }[]
                      ).map((t) => (
                        <button
                          key={t.v}
                          type="button"
                          onClick={() => handleTripTypeChange(t.v)}
                          className={`px-5 py-2 rounded-full font-medium transition-all ${
                            tripType === t.v
                              ? 'bg-neutral-950 text-white shadow'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          {t.l}
                        </button>
                      ))}
                    </div>

                    {/* Flight segments */}
                    <div className="space-y-4">
                      {segments.map((seg, i) => (
                        <div
                          key={i}
                          className={`relative ${
                            tripType === 'multi'
                              ? 'p-4 rounded-xl bg-neutral-50 border border-neutral-200'
                              : ''
                          }`}
                        >
                          {tripType === 'multi' && (
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[11px] uppercase tracking-[2px] font-semibold text-neutral-600">
                                Flight {i + 1}
                              </span>
                              {segments.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSegment(i)}
                                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium text-neutral-500 hover:text-red-600 transition-colors"
                                  aria-label={`Remove flight ${i + 1}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove
                                </button>
                              )}
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-4">
                            <div data-error={!!fieldErrors[`from-${i}`]}>
                              <AirportAutocomplete
                                label="From"
                                placeholder="Departure city or airport"
                                value={seg.from}
                                onChange={(a) => updateSegment(i, { from: a })}
                                error={fieldErrors[`from-${i}`]}
                              />
                            </div>
                            <div data-error={!!fieldErrors[`to-${i}`]}>
                              <AirportAutocomplete
                                label="To"
                                placeholder="Destination city or airport"
                                value={seg.to}
                                onChange={(a) => updateSegment(i, { to: a })}
                                error={fieldErrors[`to-${i}`]}
                              />
                            </div>
                          </div>

                          <div className={`grid gap-4 mt-4 ${
                            tripType === 'roundtrip' && i === 0
                              ? 'md:grid-cols-2'
                              : 'md:grid-cols-1'
                          }`}>
                            <div>
                              <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                                Depart
                              </label>
                              <input
                                type="date"
                                value={seg.depart}
                                onChange={(e) =>
                                  updateSegment(i, { depart: e.target.value })
                                }
                                className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
                              />
                              {fieldErrors[`depart-${i}`] && (
                                <p className="text-red-600 text-xs mt-1">
                                  {fieldErrors[`depart-${i}`]}
                                </p>
                              )}
                            </div>

                            {tripType === 'roundtrip' && i === 0 && (
                              <div>
                                <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                                  Return
                                </label>
                                <input
                                  type="date"
                                  value={returnDate}
                                  onChange={(e) => setReturnDate(e.target.value)}
                                  className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
                                />
                                {fieldErrors.returnDate && (
                                  <p className="text-red-600 text-xs mt-1">
                                    {fieldErrors.returnDate}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {tripType === 'multi' && (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={addSegment}
                            disabled={segments.length >= 5}
                            className="inline-flex items-center gap-2 border-2 border-dashed border-neutral-300 hover:border-[#b91c1c] hover:text-[#b91c1c] text-neutral-600 rounded-lg px-5 py-3 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                            Add another flight
                          </button>
                          {segments.length >= 5 && (
                            <span className="text-xs text-neutral-500">
                              Maximum of 5 segments.
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Class & travelers */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                          Cabin class
                        </label>
                        <select
                          value={travelClass}
                          onChange={(e) =>
                            setTravelClass(e.target.value as TravelClass)
                          }
                          className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
                        >
                          <option value="economy">Economy</option>
                          <option value="premium">Premium Economy</option>
                          <option value="business">Business Class</option>
                          <option value="first">First Class</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                          Travelers
                        </label>
                        <div className="flex items-center bg-white border border-neutral-200 rounded-lg h-14 px-3">
                          <button
                            type="button"
                            onClick={() =>
                              setTravelers((v) => Math.max(1, v - 1))
                            }
                            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-lg font-light flex items-center justify-center text-neutral-600 transition-colors"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <div className="flex-1 text-center text-neutral-900 text-sm font-medium">
                            {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setTravelers((v) => Math.min(9, v + 1))
                            }
                            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-lg font-light flex items-center justify-center text-neutral-600 transition-colors"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div data-error={!!fieldErrors.firstName}>
                        <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                          First name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
                        />
                        {fieldErrors.firstName && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div data-error={!!fieldErrors.lastName}>
                        <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                          Last name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
                        />
                        {fieldErrors.lastName && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div data-error={!!fieldErrors.email}>
                        <label className="block text-[10px] uppercase tracking-[2px] text-neutral-500 mb-2 font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-lg h-14 px-4 text-neutral-900 text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-2 focus:ring-[#b91c1c]/10 transition-all"
                        />
                        {fieldErrors.email && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                      <div data-error={!!fieldErrors.phone}>
                        <PhoneInput
                          value={phone}
                          onChange={(val) => setPhone(val)}
                          error={fieldErrors.phone}
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#b91c1c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-500/20"
                    >
                      {isSubmitting ? (
                        <>Sending your request...</>
                      ) : (
                        <>
                          Request my private quote
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
                      Your information is confidential. A senior travel advisor will
                      contact you shortly.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* /form wrapper */}

        {/* Trust bar */}
        <div className="relative border-t border-white/10 bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] uppercase tracking-[3px] text-neutral-400">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#dc2626]" />
              IATA Accredited
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#dc2626]" />
              Trustpilot 4.9/5
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#dc2626]" />
              24/7 Concierge Support
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#dc2626]" />
              Best Price Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section
        id="about"
        className="py-20 lg:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[3px] text-[#b91c1c] font-semibold mb-4">
              Why Elite Flights Travel
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-neutral-900">
              Why smart travelers <em className="text-[#b91c1c]">book with us</em>
            </h2>
            <p className="mt-6 text-neutral-600 leading-relaxed">
              Most people don&apos;t realize that business and first-class tickets sold
              by airlines directly are marked up by hundreds — sometimes thousands — of
              dollars. At Elite Flights Travel we have access to consolidator fares,
              unpublished rates, and exclusive inventory that simply isn&apos;t
              available on any booking website.
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              We&apos;re not a search engine. We are a team of dedicated travel
              experts who personally negotiate, research, and hand-pick the best
              available fares for every single client. You tell us where you&apos;re
              going — we handle everything else.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {[
              {
                n: '01',
                t: 'Access to unpublished fares',
                d: 'Consolidator rates that are never listed publicly — first-class seats at prices that seem impossible.',
              },
              {
                n: '02',
                t: 'A personal agent, every time',
                d: 'No bots. No call centers. A real dedicated agent who knows your preferences and is available 24/7.',
              },
              {
                n: '03',
                t: 'Save 40–60% vs. retail',
                d: 'Our clients consistently save thousands per trip — without sacrificing lie-flat seats, gourmet dining, and lounge access.',
              },
            ].map((item) => (
              <div
                key={item.n}
                className="group flex gap-6 p-6 md:p-8 rounded-xl border border-neutral-200 hover:border-[#b91c1c]/40 hover:shadow-lg hover:shadow-red-500/5 transition-all bg-white"
              >
                <div className="font-serif text-4xl text-neutral-200 group-hover:text-[#b91c1c]/30 transition-colors flex-shrink-0">
                  {item.n}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-neutral-900 mb-2">
                    {item.t}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[11px] uppercase tracking-[3px] text-[#b91c1c] font-semibold mb-3">
              How it works
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-neutral-900">
              Simple, discreet, and <em className="text-[#b91c1c]">effortless</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: '1',
                t: 'Request a quote',
                d: 'Tell us where you want to fly. Just the basics — we handle the details.',
              },
              {
                n: '2',
                t: 'Receive private fares',
                d: 'Within 30 minutes, an advisor sends 2–3 hand-picked options with detailed pricing.',
              },
              {
                n: '3',
                t: 'Book & fly',
                d: 'Confirm your choice. We handle payment, ticketing, and 24/7 support until you land.',
              },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#b91c1c] to-[#dc2626] flex items-center justify-center text-white font-serif text-2xl shadow-lg shadow-red-500/20 mb-6">
                  {s.n}
                </div>
                <h3 className="font-serif text-2xl text-neutral-900 mb-3">{s.t}</h3>
                <p className="text-neutral-600 leading-relaxed max-w-xs mx-auto">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEALS */}
      <section id="deals" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[3px] text-[#b91c1c] font-semibold mb-3">
                Featured routes
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-neutral-900">
                Exclusive <em className="text-[#b91c1c]">deals</em> available now
              </h2>
            </div>
            <a
              href="#quote"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-[#b91c1c] transition-colors"
            >
              Request custom quote
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                dest: 'Europe',
                cities: 'London · Paris · Rome · Frankfurt',
                img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',
                save: 'Save up to 58%',
              },
              {
                dest: 'Asia',
                cities: 'Tokyo · Singapore · Bangkok · Seoul',
                img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
                save: 'Save up to 62%',
              },
              {
                dest: 'Middle East',
                cities: 'Dubai · Doha · Abu Dhabi',
                img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
                save: 'Save up to 55%',
              },
              {
                dest: 'Australia',
                cities: 'Sydney · Melbourne · Brisbane',
                img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&auto=format&fit=crop&q=80',
                save: 'Save up to 50%',
              },
              {
                dest: 'Africa',
                cities: 'Cape Town · Nairobi · Kilimanjaro',
                img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=80',
                save: 'Save up to 60%',
              },
              {
                dest: 'South America',
                cities: 'Rio · Buenos Aires · Lima',
                img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80',
                save: 'Save up to 45%',
              },
            ].map((d) => (
              <a
                key={d.dest}
                href="#quote"
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${d.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/95 text-neutral-900 text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full">
                  Business Class
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="font-serif text-3xl mb-1">{d.dest}</div>
                  <div className="text-sm text-white/80 mb-4">{d.cities}</div>
                  <div className="inline-flex items-center gap-2 text-[#fca5a5] text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {d.save}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-20 lg:py-28 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[11px] uppercase tracking-[3px] text-[#f87171] font-semibold mb-3">
              Client testimonials
            </div>
            <h2 className="font-serif text-4xl md:text-5xl">
              Trusted by <em className="text-[#f87171]">discerning travelers</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: "I flew business class to Dubai for $2,800 round trip. The same ticket on the airline site was $8,900. The service from quote to landing was impeccable.",
                n: 'Michael Thompson',
                t: 'CEO · Repeat Client',
              },
              {
                q: "My family of 5 flew first class to Tokyo. The savings paid for our entire 5-star hotel stay. We will never book any other way again.",
                n: 'Jennifer Williams',
                t: 'Family Traveler · Dallas',
              },
              {
                q: "My advisor handled everything — including a last-minute date change — with zero stress on my end. Truly a first-class experience.",
                n: 'David Anderson',
                t: 'Executive · New York',
              },
              {
                q: "I've used them for three international trips now. Every time the price is better than anywhere online, and the service is genuinely personal.",
                n: 'Sarah Johnson',
                t: 'Verified Client · Chicago',
              },
              {
                q: "Booked a complicated multi-city trip through Asia. My agent found routings I didn't even know were possible, at half the retail price.",
                n: 'Robert Martinez',
                t: 'Business Traveler · Los Angeles',
              },
              {
                q: "The concierge follow-through is what sets them apart. Someone actually answers the phone at 2am when you need them. Highly recommend.",
                n: 'Emily Davis',
                t: 'Repeat Client · Miami',
              },
            ].map((r) => (
              <div
                key={r.n}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur"
              >
                <div className="flex gap-1 text-[#f87171] mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 leading-relaxed mb-6">&ldquo;{r.q}&rdquo;</p>
                <div>
                  <div className="font-semibold">{r.n}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest mt-1">
                    {r.t}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-br from-[#b91c1c] via-[#dc2626] to-[#991b1b] text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="text-[11px] uppercase tracking-[4px] font-semibold text-white/80 mb-4">
            Start your journey
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Ready for a first-class experience at a fraction of the price?
          </h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10">
            Our senior travel advisors are standing by. Submit a quote request or
            call us directly and we&apos;ll put together the perfect trip.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-black text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:+18001234567"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors backdrop-blur"
            >
              <Phone className="w-4 h-4" />
              Call +1 (800) 123-4567
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 text-neutral-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Elite Flights Travel"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-serif text-xl text-white">ELITE FLIGHTS</div>
                <div className="text-[10px] tracking-[3px] text-[#f87171]">TRAVEL</div>
              </div>
            </div>
            <p className="text-neutral-400 leading-relaxed max-w-md">
              Private, personalized service specializing in premium long-haul travel.
              Business and first-class fares at prices you won&apos;t find anywhere
              else.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold uppercase text-xs tracking-widest mb-4">
              Company
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold uppercase text-xs tracking-widest mb-4">
              Contact
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+18001234567"
                  className="hover:text-white transition-colors"
                >
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="text-neutral-500">Available 24/7</li>
              <li>
                <a href="#quote" className="hover:text-white transition-colors">
                  Request a Quote
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
            <div>
              © {new Date().getFullYear()} Elite Flights Travel. All rights
              reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>IATA Accredited Agency</span>
              <span className="text-neutral-700">|</span>
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

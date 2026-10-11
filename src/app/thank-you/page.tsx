'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Clock, Phone, Plane, ArrowLeft, Mail, Shield } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex flex-col">
      {/* NAV */}
      <nav className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-full p-1">
              <Image
                src="/logo.png"
                alt="Elite Flights Travel"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-xl tracking-tight text-white">
                ELITE FLIGHTS
              </div>
              <div className="text-[10px] tracking-[3px] text-[#f87171] font-medium">
                TRAVEL
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to homepage
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 flex items-center py-16 px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#b91c1c22,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative max-w-3xl mx-auto w-full">
          {/* Success card */}
          <div className="bg-white text-neutral-900 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-12 text-center text-white">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-5 border-4 border-white/30">
                <CheckCircle2 className="w-11 h-11 text-white" />
              </div>
              <div className="text-[11px] uppercase tracking-[4px] font-semibold text-white/90 mb-3">
                Request Received
              </div>
              <h1 className="font-serif text-4xl md:text-5xl mb-3">
                Thank you!
              </h1>
              <p className="text-white/90 text-lg max-w-lg mx-auto leading-relaxed">
                Your flight request has been successfully submitted. A senior travel
                advisor will be in touch shortly with hand-picked premium options.
              </p>
            </div>

            {/* Body */}
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <div className="text-[11px] uppercase tracking-[3px] text-[#b91c1c] font-semibold mb-2">
                  What happens next
                </div>
                <h2 className="font-serif text-2xl text-neutral-900">
                  Three simple steps to your first-class experience
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    n: '1',
                    icon: <Mail className="w-5 h-5" />,
                    title: 'We review your request',
                    desc: 'Your dedicated advisor reviews your requirements and searches consolidator fares, unpublished rates, and exclusive inventory.',
                  },
                  {
                    n: '2',
                    icon: <Clock className="w-5 h-5" />,
                    title: 'You receive private fares (within 30 minutes)',
                    desc: 'We\u2019ll send you 2\u20133 hand-picked premium options by phone or email, along with detailed pricing and cabin recommendations.',
                  },
                  {
                    n: '3',
                    icon: <Plane className="w-5 h-5" />,
                    title: 'You choose \u2014 we handle everything else',
                    desc: 'Once you confirm, we take care of ticketing, payment, and 24/7 concierge support until you safely land at your destination.',
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex gap-5 p-5 rounded-xl bg-neutral-50 border border-neutral-200"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#dc2626] text-white font-serif text-xl flex items-center justify-center shadow-md shadow-red-500/20">
                      {step.n}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="text-[#b91c1c]">{step.icon}</div>
                        <h3 className="font-semibold text-neutral-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-neutral-200" />

              {/* Contact CTA */}
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-[3px] text-neutral-500 font-semibold mb-3">
                  Need immediate assistance?
                </div>
                <p className="text-neutral-700 mb-5 max-w-md mx-auto">
                  Our concierge line is open 24/7. Call us directly to speak with an
                  advisor now.
                </p>
                <a
                  href="tel:+18001234567"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#b91c1c] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-red-500/20 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  +1 (800) 123-4567
                </a>
              </div>
            </div>

            {/* Footer of card */}
            <div className="bg-neutral-50 border-t border-neutral-200 px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#b91c1c]" />
                Your information is confidential and IATA-compliant
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[#b91c1c] hover:text-[#991b1b] font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to homepage
              </Link>
            </div>
          </div>

          {/* Additional info below card */}
          <div className="mt-8 text-center text-neutral-400 text-sm">
            A confirmation copy has been logged with our team. If you don&apos;t hear
            back within 30 minutes, please call the number above.
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Elite Flights Travel. All rights reserved.
      </footer>
    </div>
  );
}

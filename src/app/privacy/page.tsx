import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-xl tracking-tight">ELITE FLIGHTS</div>
              <div className="text-[10px] tracking-[3px] text-[#b91c1c]">TRAVEL</div>
            </div>
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
        <div className="prose prose-neutral max-w-none space-y-6 text-neutral-600">
          <p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
          <h2 className="text-xl font-bold text-neutral-900">1. Information We Collect</h2>
          <p>We collect information such as your name, email address, phone number, and travel preferences when you submit a quote request form.</p>
          <h2 className="text-xl font-bold text-neutral-900">2. How We Use Your Information</h2>
          <p>We use your information specifically to research flight options and contact you regarding your travel requests. We do not sell your data to third parties.</p>
          <h2 className="text-xl font-bold text-neutral-900">3. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your details.</p>
          <h2 className="text-xl font-bold text-neutral-900">4. Cookies</h2>
          <p>We may use cookies to understand and save your preferences for future visits.</p>
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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
        <h1 className="font-serif text-4xl mb-8">Terms and Conditions</h1>
        <div className="prose prose-neutral max-w-none space-y-6 text-neutral-600">
          <p>Welcome to Elite Flights Travel. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
          <h2 className="text-xl font-bold text-neutral-900">1. Services</h2>
          <p>Elite Flights Travel acts as an agent for airlines and other travel service providers. We do not own or operate any airlines. All bookings are subject to the terms and conditions of the respective carrier.</p>
          <h2 className="text-xl font-bold text-neutral-900">2. Quotes</h2>
          <p>All quotes provided are subject to availability and can change without notice until ticketing is complete and payment is received.</p>
          <h2 className="text-xl font-bold text-neutral-900">3. Cancellations and Changes</h2>
          <p>Cancellations and change fees depend on the airline's policy. Most unpublished and consolidator fares carry strict restricted rules regarding refunds.</p>
          <h2 className="text-xl font-bold text-neutral-900">4. Liability</h2>
          <p>We are not liable for any injury, loss, claim, damage, or any special, exemplary, punitive, indirect, incidental or consequential damages of any kind which arises out of or is in any way connected with any travel arrangements.</p>
        </div>
      </main>
    </div>
  );
}

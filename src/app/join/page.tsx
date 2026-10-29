import type { Metadata } from 'next'
import JoinForm from '@/components/join/JoinForm'

export const metadata: Metadata = {
  title: 'Work with us — Gennoor Tech',
  description: 'Trainers, engineers and others who want to work with Gennoor Tech, freelance or full-time. Send a short note and your resume.',
  alternates: { canonical: 'https://gennoor.com/join' },
}

const SPECS: { title: string; items: string[]; note?: string }[] = [
  {
    title: 'Computer',
    items: [
      'Desktop or laptop only. Tablets, Windows netbooks, smart devices, Windows mini PCs, Chromebooks, virtual machines, Android systems, and VPNs or proxies are not compatible.',
      'Operating system: Windows 11 (no virtual machines), or macOS 14 or newer.',
      'Processor: dual core, 4 GHz or better.',
      'RAM: 8 GB or more. Hard drive: 20 GB or more free.',
      'All peripherals wired. Wireless keyboards, mice and headsets are not allowed.',
      'Dual monitors, at least 19 inches, recommended.',
      'Antivirus: the full version of Windows Defender or Essentials.',
    ],
  },
  {
    title: 'Internet',
    items: [
      'Speed: 20 MB download and 20 MB upload.',
      'A stable provider with no packet loss and latency under 100 ms.',
      'Cable or broadband, or fiber optic only. Wi-Fi, WiMAX, satellite, dial-up, 5G or other mobile and wireless connections, and hotspots are not allowed.',
      'Home router wired to the PC.',
    ],
    note: 'During scheduled work hours, Gennoor Tech requires that the home internet is used only for work. Reliable internet is each team member’s responsibility. It is a critical requirement, and not meeting it can lead to removal.',
  },
  {
    title: 'Headset',
    items: [
      'A fully wired USB headset with a built-in microphone and noise cancellation.',
      'Recommended Poly or HP corded USB headsets: Poly Blackwire 3210 / 3220 (standard), Poly Blackwire 5210 / 5220 (premium), Poly Blackwire 8225 (active noise cancellation).',
      'Choose the correct connector: USB-A or USB-C.',
    ],
  },
]

export default function JoinPage() {
  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-16 lg:pt-[100px] pb-10 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Join Gennoor.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[600px] mx-auto mt-6">
          We work with trainers and engineers, freelance or full-time. Tell us a little about you and send your resume.
        </p>
      </section>
      <section id="technical-specs" className="bg-white px-6 py-16 lg:py-[80px]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="display-section text-center">Technical specs.</h2>
          <p className="lede mt-3.5 max-w-[560px] mx-auto text-center">What you need to work with us. Please check your setup before you apply.</p>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {SPECS.map(g => (
              <div key={g.title} className="rounded-[18px] border border-[#e8e8ed] p-6">
                <h3 className="font-heading text-[19px] font-bold text-gray-900">{g.title}</h3>
                <ul className="mt-4 space-y-3 text-[14.5px] leading-[1.55] text-[#3a3a3f] list-disc pl-5">
                  {g.items.map(i => <li key={i}>{i}</li>)}
                </ul>
                {g.note && <p className="mt-4 text-[13.5px] leading-[1.55] text-[#6e6e73]">{g.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f5f5f7] px-6 py-16">
        <div className="max-w-[720px] mx-auto bg-white rounded-3xl p-7 sm:p-10">
          <JoinForm />
        </div>
      </section>
    </main>
  )
}

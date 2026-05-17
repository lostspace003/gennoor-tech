import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Download, Linkedin, Share2, ShieldCheck, Calendar, Award, ExternalLink } from 'lucide-react'
import {
  getCertificate,
  buildLinkedInAddToProfileUrl,
  buildLinkedInShareUrl,
  buildPdfDownloadUrl,
  buildVerifyUrl,
} from '@/lib/certificates'
import ScrollReveal from '@/components/ScrollReveal'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ certId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certId } = await params
  const cert = await getCertificate(certId).catch(() => null)
  if (!cert) {
    return {
      title: 'Certificate Not Found',
      description: 'The certificate ID could not be verified.',
      robots: { index: false, follow: false },
    }
  }
  const title = `Verified: ${cert.recipientName} — ${cert.workshopTitle}`
  const description = `${cert.recipientName} completed the ${cert.workshopTitle} (${cert.workshopSubtitle}) on ${formatDate(cert.workshopDate)}, issued by Gennoor Tech. Credential ID: ${cert.certId}.`
  return {
    title,
    description,
    alternates: { canonical: buildVerifyUrl(cert.certId) },
    openGraph: {
      title,
      description,
      url: buildVerifyUrl(cert.certId),
      type: 'profile',
    },
    robots: { index: true, follow: true },
  }
}

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDuration(minutes: number) {
  if (!minutes || minutes < 1) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export default async function VerifyPage({ params }: Props) {
  const { certId } = await params
  const cert = await getCertificate(certId).catch(() => null)

  if (!cert) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-white to-[#fff8f0] flex items-center justify-center px-4 py-20">
        <ScrollReveal>
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-red-100">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-red-500" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1B2845] mb-3">Certificate Not Found</h1>
            <p className="text-[#5C6784] mb-8 leading-relaxed">
              The credential ID <span className="font-mono font-semibold text-[#1B2845]">{certId}</span> could not be verified. Please check the ID and try again, or contact us if you believe this is an error.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1B2845] text-white font-semibold hover:bg-[#2a3960] transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact Support
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#1B2845] text-[#1B2845] font-semibold hover:bg-[#1B2845] hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
    )
  }

  const linkedInAddUrl = buildLinkedInAddToProfileUrl(cert)
  const linkedInShareUrl = buildLinkedInShareUrl(cert)
  const pdfUrl = buildPdfDownloadUrl(cert.certId)
  const durationLabel = formatDuration(cert.durationMinutes)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-white to-[#fff8f0] py-12 sm:py-20 px-4 scroll-smooth">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />
            <span className="text-sm font-bold text-green-700 tracking-wide">VERIFIED CREDENTIAL</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e6dfd4]">
            {/* Top band */}
            <div className="bg-[#1B2845] px-8 sm:px-12 py-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD23F]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6B35]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-[#FFD23F] text-[#1B2845] px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest mb-4">
                  <Award className="w-4 h-4" strokeWidth={2.5} />
                  GENNOOR TECH · CERTIFICATE OF COMPLETION
                </div>
                <p className="text-[#FFD23F] text-sm font-semibold tracking-widest mb-3">THIS IS TO CERTIFY THAT</p>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
                  {cert.recipientName}
                </h1>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                  has successfully completed the
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFD23F] mt-3 mb-1">
                  {cert.workshopTitle}
                </h2>
                <p className="text-white/70 text-sm sm:text-base italic">
                  {cert.workshopSubtitle}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="px-8 sm:px-12 py-10">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#FF6B35]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#5C6784] font-bold mb-1">Issue Date</p>
                    <p className="text-[#1B2845] font-semibold">{formatDate(cert.workshopDate)}</p>
                    {durationLabel && (
                      <p className="text-sm text-[#5C6784] mt-0.5">Duration attended: {durationLabel}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#FF6B35]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#5C6784] font-bold mb-1">Credential ID</p>
                    <p className="font-mono font-semibold text-[#1B2845] break-all">{cert.certId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#FF6B35]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#5C6784] font-bold mb-1">Issued By</p>
                    <p className="text-[#1B2845] font-semibold">{cert.issuerName}</p>
                    <a
                      href="https://gennoor.com"
                      className="text-sm text-[#FF6B35] hover:underline inline-flex items-center gap-1"
                    >
                      gennoor.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#5C6784] font-bold mb-1">Status</p>
                    <p className="text-green-700 font-semibold">Verified & Active</p>
                    {cert.trainerName && (
                      <p className="text-sm text-[#5C6784] mt-0.5">Trainer: {cert.trainerName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-[#e6dfd4] pt-8">
                <h3 className="text-lg font-extrabold text-[#1B2845] mb-4">Share & Download</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={linkedInAddUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0A66C2] text-white font-semibold hover:bg-[#084d92] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    <Linkedin className="w-5 h-5" />
                    Add to LinkedIn Profile
                  </a>
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border-2 border-[#0A66C2] text-[#0A66C2] font-semibold hover:bg-[#0A66C2] hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Share2 className="w-5 h-5" />
                    Share on LinkedIn
                  </a>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF6B35] text-white font-semibold hover:bg-[#e55a25] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                </div>
                <p className="text-xs text-[#5C6784] mt-4 leading-relaxed">
                  Clicking <strong>Add to LinkedIn Profile</strong> opens LinkedIn with the certificate details pre-filled. Sign in, review, and click <strong>Save</strong> to add it to your profile.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#FFF8F0] px-8 sm:px-12 py-6 border-t border-[#e6dfd4]">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="text-xs text-[#5C6784] mb-1">This page is the public, tamper-resistant record of credential</p>
                  <p className="text-sm font-mono font-semibold text-[#1B2845] break-all">{buildVerifyUrl(cert.certId)}</p>
                </div>
                <Link
                  href="/"
                  className="text-sm text-[#FF6B35] font-semibold hover:underline whitespace-nowrap"
                >
                  Visit Gennoor Tech →
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#5C6784]">
              Issued via <Link href="/workshops/claude-cowork" className="text-[#FF6B35] font-semibold hover:underline">Claude Cowork Workshop</Link> · Trained by{' '}
              <Link href="/about/founder" className="text-[#FF6B35] font-semibold hover:underline">{cert.trainerName || 'Jalal Khan'}</Link>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </main>
  )
}

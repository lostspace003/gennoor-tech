import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  FileText,
  Lock,
  Database,
  Globe,
  Building2,
  Users,
  AlertTriangle,
  Layers,
  ScrollText,
  KeyRound,
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Trust & Security — Gennoor Tech',
  description:
    'Procurement-ready overview of how Gennoor Tech handles data, IP, contracts, and security across engagements. NDA & MSA, regional compliance (DPDP, PDPL, GDPR), sub-processors, stack, and incident response.',
  keywords: [
    'Gennoor Tech security',
    'AI consultant data handling',
    'AI vendor NDA MSA',
    'India DPDP compliance',
    'Saudi PDPL compliance',
    'UAE PDPL compliance',
    'AI sub-processors',
    'AI consultant procurement',
  ],
  alternates: { canonical: 'https://gennoor.com/about/trust-and-security' },
  openGraph: {
    title: 'Trust & Security — Gennoor Tech',
    description:
      'How we handle data, IP, contracts, and security across engagements. Procurement-ready reference.',
    url: 'https://gennoor.com/about/trust-and-security',
  },
}

const updatedDate = '2026-05-19'

// ────────────────────────────────────────────────────────────────────────────
// DATA HANDLING
// ────────────────────────────────────────────────────────────────────────────

const dataPractices = [
  {
    icon: Database,
    title: 'Data stays in your environment',
    detail:
      'Client data — code, models, prompts, training datasets, production traffic — lives in your Azure subscription, AWS account, GCP project, or on-premise infrastructure. Gennoor Tech does not store client data on our infrastructure.',
  },
  {
    icon: Lock,
    title: 'We access through your controls',
    detail:
      'During an engagement, our practitioners access your environment through your identity provider, your RBAC, your conditional access policies, and your audit logging. We do not maintain shadow credentials.',
  },
  {
    icon: KeyRound,
    title: 'Access ends with the engagement',
    detail:
      'Engagement closure includes credential revocation, removal from your tenant, and a written attestation of off-boarding. We do not retain access "in case you need us later."',
  },
  {
    icon: ScrollText,
    title: 'Documentation retention is bounded',
    detail:
      'Engagement documentation (scopes, plans, deliverables, decision logs) is retained for contract duration + 90 days unless your contract specifies a different period. Deletion-on-request honored within 30 days.',
  },
  {
    icon: ShieldCheck,
    title: 'Telemetry is opt-in and aggregated',
    detail:
      'Anonymized engagement telemetry (e.g., aggregated prompt-volume metrics for our internal improvement) is opt-in only and never includes client content. Default is opt-out.',
  },
  {
    icon: AlertTriangle,
    title: 'No data shared between clients',
    detail:
      'Insights, patterns, and learnings developed during one client engagement are not transferred — explicitly or implicitly — to another client. Reusable IP refers to non-client-specific frameworks only.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// IP OWNERSHIP — explicit table
// ────────────────────────────────────────────────────────────────────────────

const ipTable = [
  { artifact: 'Source code (production)', client: true, gennoor: false, note: 'In your repository from day one' },
  { artifact: 'Source code (PoC / pilot)', client: true, gennoor: false, note: 'Same — your repo from commit 1' },
  { artifact: 'Fine-tuned model weights', client: true, gennoor: false, note: 'Stored in your subscription / artifact registry' },
  { artifact: 'Prompts (production)', client: true, gennoor: false, note: 'Versioned in your repository' },
  { artifact: 'Training & evaluation data', client: true, gennoor: false, note: 'Never copied to our infrastructure' },
  { artifact: 'Architecture documentation', client: true, gennoor: false, note: 'Yours; we retain a redacted copy' },
  { artifact: 'Engagement deliverables (reports, dashboards, runbooks)', client: true, gennoor: false, note: 'Yours; we retain copies per Section 1' },
  {
    artifact: 'Gennoor methodology (the Gennoor Way framework)',
    client: false,
    gennoor: true,
    note: 'Non-confidential; listed in SOW as reusable IP',
  },
  {
    artifact: 'Gennoor evaluation harnesses (templates)',
    client: false,
    gennoor: true,
    note: 'Re-implementable; not proprietary lock-in',
  },
  {
    artifact: 'Gennoor course content (PDFs, slides, scripts)',
    client: false,
    gennoor: true,
    note: 'Licensed to client cohorts for the engagement period',
  },
  {
    artifact: 'Custom course content (co-authored with client)',
    client: true,
    gennoor: false,
    note: 'When developed using your scenarios, yours',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// CONTRACTS
// ────────────────────────────────────────────────────────────────────────────

const contractItems = [
  {
    title: 'Mutual NDA',
    description:
      'Mutual non-disclosure agreement available before any data conversation. We work with your standard NDA template or provide ours. Typical exchange: 2–5 working days.',
  },
  {
    title: 'MSA (Master Services Agreement)',
    description:
      'We accept client-provided MSAs as our default position. Standard exchange: 2–4 weeks of legal review. We also offer a Gennoor MSA template for organizations that prefer to start from a vendor template.',
  },
  {
    title: 'SOW per engagement',
    description:
      'Each phase of work is a separate Statement of Work with explicit acceptance criteria, fixed pricing for Diagnose / Train / Innovate, and milestone deliverables. SOWs reference the MSA for boilerplate terms.',
  },
  {
    title: 'IP assignment',
    description:
      'Standard work-product clause: all client-specific work product is assigned to client upon delivery and payment. Gennoor retains rights only to clearly-listed reusable IP (frameworks, methodology, course content).',
  },
  {
    title: 'IP indemnification',
    description:
      'Indemnification against third-party IP claims arising from Gennoor-delivered work, subject to commercially reasonable caps. Specific limits negotiated per engagement size.',
  },
  {
    title: 'Termination & exit',
    description:
      'Per-phase termination available at each phase gate. On termination, all client materials, code, and documentation are handed over within 10 working days; credentials revoked within 5.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// REGIONAL COMPLIANCE
// ────────────────────────────────────────────────────────────────────────────

const regionalCompliance = [
  {
    region: 'India',
    regulation: 'Digital Personal Data Protection Act (DPDP), 2023',
    posture:
      'Gennoor Tech Private Limited is registered in India and operates under DPDP. We handle Indian-jurisdiction client data within India where contractually required. Data Fiduciary obligations are honored when we process personal data on client behalf.',
  },
  {
    region: 'Saudi Arabia',
    regulation: 'Personal Data Protection Law (PDPL), enforced by SDAIA',
    posture:
      'For KSA-resident workloads we deploy on KSA-region cloud or on-premise infrastructure. We honor data residency requirements and do not transfer personal data out of KSA without consent and contractual authorization. Aligned with SDAIA enforcement priorities.',
  },
  {
    region: 'United Arab Emirates',
    regulation: 'Federal Data Protection Law (PDPL) + DIFC + ADGM regimes',
    posture:
      'We deliver into UAE workloads with deployment in UAE-region infrastructure. Familiar with DIFC and ADGM-specific regimes for financial-services clients. Cross-border transfers handled per the applicable regime.',
  },
  {
    region: 'European Union',
    regulation: 'GDPR · EU AI Act',
    posture:
      'For engagements involving EU data subjects, we operate under DPA terms with explicit lawful-basis documentation. EU AI Act risk classification incorporated into our governance assessments where applicable.',
  },
  {
    region: 'East Africa',
    regulation: 'Tanzania Data Protection Act, Kenya Data Protection Act',
    posture:
      'On-the-ground delivery experience in Tanzania and Kenya. We respect cross-border transfer restrictions and work with client legal teams on jurisdictional specifics.',
  },
  {
    region: 'Air-gapped / Sovereign',
    regulation: 'Defense, government, regulated finance, healthcare',
    posture:
      'Reference patterns for fully air-gapped deployment using open-source LLMs (Llama, Mistral, Phi) on private infrastructure via Ollama or vLLM. No internet egress, no public-API dependencies. Suitable for sovereign and classified workloads.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// SUB-PROCESSORS
// ────────────────────────────────────────────────────────────────────────────

const subProcessors = [
  {
    vendor: 'Microsoft Azure',
    purpose: 'Cloud infrastructure for client engagements (only when client uses Azure)',
    dataShared: 'Client data — but in CLIENT subscription, not ours',
    location: 'Client-selected region',
  },
  {
    vendor: 'AWS',
    purpose: 'Cloud infrastructure for client engagements (only when client uses AWS)',
    dataShared: 'Client data — but in CLIENT account, not ours',
    location: 'Client-selected region',
  },
  {
    vendor: 'Google Cloud Platform',
    purpose: 'Cloud infrastructure for client engagements (only when client uses GCP)',
    dataShared: 'Client data — but in CLIENT project, not ours',
    location: 'Client-selected region',
  },
  {
    vendor: 'GitHub',
    purpose: 'Source code hosting (only when client uses GitHub; otherwise Azure DevOps / GitLab / Bitbucket)',
    dataShared: 'Source code — in CLIENT organization, not ours',
    location: 'GitHub global',
  },
  {
    vendor: 'Microsoft 365',
    purpose: 'Internal Gennoor email, document collaboration, calendar — for our own operations only',
    dataShared: 'No client production data. Engagement documents and meeting notes only.',
    location: 'Microsoft global with EU and India regional availability',
  },
  {
    vendor: 'Stripe / payment processor',
    purpose: 'Invoice payment processing for international engagements',
    dataShared: 'Billing data only. No engagement content.',
    location: 'PCI-compliant provider',
  },
  {
    vendor: 'Notion or similar',
    purpose: 'Internal Gennoor project management and knowledge base',
    dataShared: 'Engagement metadata and internal-only notes. No client production data.',
    location: 'Provider global',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// STACK — what we deploy on (parallel to doc 07)
// ────────────────────────────────────────────────────────────────────────────

const stack = [
  {
    layer: 'LLM (cloud)',
    primary: 'Azure OpenAI (GPT-4o, GPT-4o-mini)',
    alternates: 'AWS Bedrock (Claude, Llama, Titan), Google Vertex (Gemini), Anthropic API direct',
  },
  {
    layer: 'LLM (open-source / self-hosted)',
    primary: 'Llama 3.x, Mistral, Phi, Qwen',
    alternates: 'Self-hosted via Ollama, vLLM, Azure ML private endpoints',
  },
  {
    layer: 'Agent frameworks',
    primary: 'Microsoft Copilot Studio, Semantic Kernel, LangGraph',
    alternates: 'CrewAI, AutoGen, Microsoft Agent Framework',
  },
  {
    layer: 'RAG / search',
    primary: 'Azure AI Search (hybrid: keyword + vector + semantic ranking)',
    alternates: 'Pinecone, Weaviate, pgvector, Elasticsearch',
  },
  {
    layer: 'Orchestration',
    primary: 'Azure Functions, Azure Logic Apps',
    alternates: 'n8n, Temporal, AWS Step Functions',
  },
  {
    layer: 'Data platforms',
    primary: 'Microsoft Fabric, Azure ML',
    alternates: 'Databricks, Snowflake, BigQuery',
  },
  {
    layer: 'Evaluation',
    primary: 'MLflow, Azure AI Evaluation',
    alternates: 'Promptfoo, Ragas, LangSmith',
  },
  {
    layer: 'Observability',
    primary: 'Application Insights, MLflow Tracing',
    alternates: 'LangSmith, Arize, Datadog',
  },
  {
    layer: 'Source control',
    primary: 'GitHub, Azure DevOps',
    alternates: 'GitLab, Bitbucket',
  },
  {
    layer: 'CI/CD',
    primary: 'GitHub Actions, Azure Pipelines',
    alternates: 'GitLab CI, Jenkins, CircleCI',
  },
  {
    layer: 'Front-end (when needed)',
    primary: 'Next.js, Power Apps',
    alternates: 'React, Streamlit, Gradio',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// SECURITY PRACTICES
// ────────────────────────────────────────────────────────────────────────────

const securityPractices = [
  {
    title: 'Encryption',
    practice:
      'At-rest and in-transit encryption is the responsibility of the client environment we deploy into. We do not introduce un-encrypted data paths. For our internal communications, we use TLS-protected channels.',
  },
  {
    title: 'Secret management',
    practice:
      'Never plaintext. We use Azure Key Vault, AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault — depending on client environment. Secrets never enter source code or chat.',
  },
  {
    title: 'Role-based access control',
    practice:
      'During engagement, our access is governed by your IAM. Principle of least privilege. Time-bound access where supported. No shared accounts.',
  },
  {
    title: 'Source code custody',
    practice:
      'All source code in your repository from commit 1. We do not maintain "client-X-private" repos on our infrastructure.',
  },
  {
    title: 'Endpoint security',
    practice:
      'Gennoor practitioners operate on managed devices with disk encryption, password managers, MFA, and screen-lock policies. We provide a security attestation on request.',
  },
  {
    title: 'Background checks',
    practice:
      'Senior practitioners undergo background verification appropriate to the engagement (basic for commercial, enhanced for regulated finance, full clearance for defense / government when required). Documentation provided per engagement.',
  },
  {
    title: 'NDAs across the delivery team',
    practice:
      'Every practitioner involved in your engagement is covered by an NDA back-to-back with your client NDA. Reusable practitioners-NDA-on-file model means no per-engagement delay for our team to start.',
  },
  {
    title: 'Logging & monitoring',
    practice:
      'In your environment, we use your logging and monitoring stack. We do not exfiltrate logs. For our internal ops, audit logging is enabled on all administrative actions.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// INCIDENT RESPONSE
// ────────────────────────────────────────────────────────────────────────────

const incidentSlas = [
  { severity: 'Sev-1 — production-impacting', response: 'Senior practitioner reachable within 4 hours', notification: 'Written notification within 24 hours of awareness' },
  { severity: 'Sev-2 — degraded service', response: 'Senior practitioner engaged within 1 business day', notification: 'Notification within 48 hours' },
  { severity: 'Sev-3 — minor / cosmetic', response: 'Acknowledged within 2 business days', notification: 'Tracked through standard support cadence' },
  { severity: 'Suspected data incident', response: 'Senior + client legal contact within 4 hours', notification: 'Per applicable breach notification law (DPDP / PDPL / GDPR)' },
]

// ────────────────────────────────────────────────────────────────────────────
// COMPLIANCE FRAMEWORKS
// ────────────────────────────────────────────────────────────────────────────

const complianceAlignment = [
  {
    framework: 'NIST AI Risk Management Framework',
    posture:
      'Active alignment. Risk assessments delivered in E1 Strategic Diagnostic are structured against NIST AI RMF categories (Govern, Map, Measure, Manage).',
  },
  {
    framework: 'EU AI Act',
    posture:
      'Awareness and incorporation. For clients with EU exposure, AI systems are classified per the Act\'s risk categories during the Diagnose phase, and high-risk systems carry additional documentation per the Act\'s requirements.',
  },
  {
    framework: 'ISO 27001 controls',
    posture:
      'Aligned, not certified. We follow ISO 27001 principles for information security management. Formal certification is on our roadmap but not currently held.',
  },
  {
    framework: 'SOC 2',
    posture: 'Not certified. We work with SOC 2 clients by aligning to their controls where applicable.',
  },
  {
    framework: 'CAIQ / CSA STAR',
    posture:
      'CAIQ-style questionnaires answered within 5–10 working days of request. Custom security questionnaires honored on the same SLA.',
  },
  {
    framework: 'OWASP for LLMs',
    posture:
      'OWASP Top 10 for LLM Applications considered during architecture review on every E3 Pilot and E4 Build engagement. Prompt-injection mitigations standard.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// FAQ
// ────────────────────────────────────────────────────────────────────────────

const trustFaqs = [
  {
    question: 'Do you store our data on Gennoor infrastructure?',
    answer:
      'No. Client data lives in your environment — your cloud subscription, your tenant, your on-prem infrastructure. Engagement documents (scopes, plans, redacted deliverables) are retained on our internal systems for contract duration + 90 days.',
  },
  {
    question: 'Can we use our MSA template, or do we have to use yours?',
    answer:
      'We accept client MSA templates as the default. We also have a Gennoor MSA template available for organizations that prefer to start from a vendor template. Typical legal exchange: 2–4 weeks, which we begin in parallel with scoping conversations.',
  },
  {
    question: 'How do you handle a data breach in a system you built?',
    answer:
      'Per Sev-1 incident response: senior practitioner reachable within 4 hours, written notification to client within 24 hours of awareness, breach-notification cooperation per applicable law (DPDP / PDPL / GDPR / sector regulators). Post-incident review with root cause and remediation within 10 working days.',
  },
  {
    question: 'Are you SOC 2 / ISO 27001 certified?',
    answer:
      'Not currently. We are aligned to ISO 27001 principles and operate ISO-27001-style controls (encryption, access management, change management, incident response). Formal certification is on our roadmap. For clients who require certified vendors, we work alongside certified system integrators as the AI specialist partner.',
  },
  {
    question: 'Can you sign our security questionnaire?',
    answer:
      'Yes. Standard CAIQ-style and client-custom security questionnaires are answered within 5–10 working days of receipt. Request the questionnaire to contact@gennoor.com (security subject line) and we route to the senior practitioner who handles security review.',
  },
  {
    question: 'Who owns the code, prompts, and models we build together?',
    answer:
      'You do. The IP table on this page lists every artifact and its ownership explicitly. Client-specific code, prompts, fine-tuned models, training data, and deliverables are 100% yours. Gennoor retains rights only to clearly-listed reusable IP (methodology framework, evaluation templates, generic course content).',
  },
  {
    question: 'Can you work air-gapped for our sovereign / classified workloads?',
    answer:
      'Yes. Open-source LLMs (Llama, Mistral, Phi, Qwen) deployed on private infrastructure via Ollama or vLLM is one of our reference patterns. Zero internet egress, no public-API dependencies. We have delivered air-gapped builds in defense-adjacent and government contexts.',
  },
  {
    question: 'How is our data isolated from other Gennoor clients?',
    answer:
      'Three layers: (1) Engagement data lives in your tenant — physically separated from other clients. (2) Internal engagement documents are stored in client-keyed folders with access restricted to the engagement team. (3) Insights from one engagement are explicitly never transferred to another — our reusable IP is non-client-specific by design.',
  },
  {
    question: 'What happens to our access when the engagement ends?',
    answer:
      'Credentials revoked within 5 working days of engagement close. Off-boarding attestation provided in writing. Documentation retained per the retention period in your MSA (default: contract duration + 90 days). Deletion-on-request honored within 30 days.',
  },
  {
    question: 'Do you carry professional liability / errors and omissions insurance?',
    answer:
      'Yes. Limits available on request and adjustable by engagement size. Certificate of insurance issued to clients as part of MSA execution.',
  },
  {
    question: 'How do you handle PII / PHI / sensitive personal data?',
    answer:
      'For engagements involving regulated data, we default to private-deployment patterns (open-source LLM, on-prem or VPC-only infra), tokenization or de-identification before model inputs where possible, and explicit DPA terms in the MSA. Healthcare PHI engagements include additional HIPAA-equivalent controls.',
  },
  {
    question: 'Can your practitioners be background-checked?',
    answer:
      'Yes. Senior practitioners are subject to background verification appropriate to the engagement. For regulated finance, enhanced verification (employment history, criminal record check). For defense / government, full clearance support where required.',
  },
  {
    question: 'Do you accept right-to-audit clauses in the MSA?',
    answer:
      'Yes. Reasonable audit rights are standard. We typically agree to one client audit per year on 30 days written notice, plus regulator-mandated audits as required. Scope is the work we performed and the documentation we retained for it.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function TrustAndSecurityPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'About', url: 'https://gennoor.com/about' },
          { name: 'Trust & Security', url: 'https://gennoor.com/about/trust-and-security' },
        ]}
      />
      <FAQJsonLd faqs={trustFaqs} />

      {/* HERO — short, factual */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              For Procurement · Legal · Security · Audit
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5 leading-[1.1]">
              Trust &amp; Security
            </h1>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed max-w-3xl">
              A direct reference for the questions your procurement, legal, security, and audit
              teams will ask before any contract is signed. Data handling, IP, contractual
              terms, regional compliance, sub-processors, the stack we deploy on, security
              practices, and incident response — in one place, without marketing language.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                Last updated: {updatedDate}
              </span>
              <span className="text-gray-300">·</span>
              <a
                href="mailto:contact@gennoor.com?subject=Security%20Questionnaire%20Request"
                className="inline-flex items-center gap-1.5 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Request security questionnaire
              </a>
            </div>
          </div>

          {/* On-page TOC */}
          <nav className="mt-12 max-w-4xl mx-auto rounded-2xl p-5 glass-card">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
              On this page
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
              {[
                ['1. Data handling', 'data-handling'],
                ['2. IP ownership', 'ip-ownership'],
                ['3. Contracts (NDA / MSA / SOW)', 'contracts'],
                ['4. Regional compliance', 'regional-compliance'],
                ['5. Sub-processors', 'sub-processors'],
                ['6. Our delivery stack', 'stack'],
                ['7. Security practices', 'security-practices'],
                ['8. Incident response', 'incident-response'],
                ['9. Compliance alignment', 'compliance-alignment'],
                ['10. Corporate & insurance', 'corporate'],
                ['11. FAQ', 'faq'],
                ['12. Contact', 'contact'],
              ].map(([label, anchor]) => (
                <li key={anchor}>
                  <a
                    href={`#${anchor}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* 1. DATA HANDLING */}
      <Section id="data-handling" eyebrow="01 · Data Handling" title="Where your data lives.">
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          The single most important principle: <strong className="text-gray-900">your data
          does not leave your environment</strong>. We are configured around this assumption
          on every engagement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl">
          {dataPractices.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="rounded-2xl p-6 glass-card">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/15">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">{p.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{p.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 2. IP OWNERSHIP */}
      <Section id="ip-ownership" eyebrow="02 · IP Ownership" title="Who owns what — explicitly.">
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Most consulting engagements bury IP terms in 60 pages of MSA. We surface the table
          here so there are no surprises. The MSA references this; the SOW references the MSA.
        </p>
        <div className="overflow-x-auto max-w-6xl">
          <table className="w-full text-sm rounded-2xl overflow-hidden glass-card">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Artifact
                </th>
                <th className="text-center px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Client owns
                </th>
                <th className="text-center px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Gennoor owns
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {ipTable.map((row) => (
                <tr key={row.artifact} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{row.artifact}</td>
                  <td className="px-5 py-3.5 text-center">
                    {row.client ? (
                      <CheckCircle2 className="w-5 h-5 text-primary-500 inline" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300 inline" />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {row.gennoor ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-500 inline" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300 inline" />
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 3. CONTRACTS */}
      <Section
        id="contracts"
        eyebrow="03 · Contracts"
        title="NDA, MSA, SOW, IP, indemnification, termination."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Our default contractual posture. We accept client templates and standard enterprise
          terms; we do not require unusual carve-outs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl">
          {contractItems.map((item) => (
            <div key={item.title} className="rounded-2xl p-6 glass-card">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. REGIONAL COMPLIANCE */}
      <Section
        id="regional-compliance"
        eyebrow="04 · Regional Compliance"
        title="Data protection and AI regulation across our regions."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          We operate primarily across GCC, India, Africa, and SEA, with engagements into the
          EU and US. Our default posture is data residency in the client&apos;s region; we
          accommodate sovereign and air-gapped requirements where mandated.
        </p>
        <div className="space-y-4 max-w-6xl">
          {regionalCompliance.map((r) => (
            <div key={r.region} className="rounded-2xl p-6 glass-card">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-48 flex-shrink-0">
                  <div className="inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary-500" />
                    <h3 className="text-base font-bold text-gray-900">{r.region}</h3>
                  </div>
                  <p className="text-xs font-semibold text-primary-600 mt-1">{r.regulation}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{r.posture}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. SUB-PROCESSORS */}
      <Section
        id="sub-processors"
        eyebrow="05 · Sub-Processors"
        title="The vendors involved in our operations."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          The complete list of third-party vendors involved in Gennoor&apos;s operations and
          (where applicable) in client engagements. Cloud-vendor exposure depends on your stack
          choice — Azure / AWS / GCP / on-prem.
        </p>
        <div className="overflow-x-auto max-w-6xl">
          <table className="w-full text-sm rounded-2xl overflow-hidden glass-card">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Vendor
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Purpose
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Data shared
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {subProcessors.map((sp) => (
                <tr key={sp.vendor} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{sp.vendor}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 leading-relaxed">{sp.purpose}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 leading-relaxed">{sp.dataShared}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{sp.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. STACK */}
      <Section
        id="stack"
        eyebrow="06 · Our Delivery Stack"
        title="What we deploy on — by layer."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Stack-flexible by design. We default to Microsoft technologies where the client
          already uses Microsoft 365 or Azure, but we deliver natively on AWS, GCP, and
          open-source self-hosted stacks. Selection per engagement is documented in a Stack
          Fit Assessment.
        </p>
        <div className="overflow-x-auto max-w-6xl">
          <table className="w-full text-sm rounded-2xl overflow-hidden glass-card">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Layer
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Primary
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Alternates we use
                </th>
              </tr>
            </thead>
            <tbody>
              {stack.map((row) => (
                <tr key={row.layer} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                    <div className="inline-flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-primary-500" />
                      {row.layer}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 leading-relaxed">{row.primary}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 leading-relaxed">
                    {row.alternates}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 7. SECURITY PRACTICES */}
      <Section
        id="security-practices"
        eyebrow="07 · Security Practices"
        title="Controls we operate."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Our internal controls and how they interact with your environment. Where you have
          stricter controls than ours, yours apply; we adopt them on entry.
        </p>
        <div className="space-y-3 max-w-6xl">
          {securityPractices.map((s) => (
            <div key={s.title} className="rounded-2xl p-5 glass-card">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.practice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. INCIDENT RESPONSE */}
      <Section
        id="incident-response"
        eyebrow="08 · Incident Response"
        title="How we respond, by severity."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Senior practitioner availability and notification timelines. SLAs apply during
          active engagement (Build, Sustain). Discovery-only engagements use a separate cadence
          spelled out in the SOW.
        </p>
        <div className="overflow-x-auto max-w-6xl">
          <table className="w-full text-sm rounded-2xl overflow-hidden glass-card">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Severity
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Response
                </th>
                <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Notification
                </th>
              </tr>
            </thead>
            <tbody>
              {incidentSlas.map((row) => (
                <tr key={row.severity} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{row.severity}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 leading-relaxed">{row.response}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 leading-relaxed">
                    {row.notification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9. COMPLIANCE ALIGNMENT */}
      <Section
        id="compliance-alignment"
        eyebrow="09 · Compliance Alignment"
        title="Frameworks we operate against."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          What we are aligned to, what we are certified to (and what we&apos;re not), and how we
          handle security questionnaires. Honest about gaps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl">
          {complianceAlignment.map((c) => (
            <div key={c.framework} className="rounded-2xl p-6 glass-card">
              <h3 className="text-base font-bold text-gray-900 mb-2">{c.framework}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{c.posture}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. CORPORATE & INSURANCE */}
      <Section
        id="corporate"
        eyebrow="10 · Corporate &amp; Insurance"
        title="Entity, governance, insurance."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl">
          <div className="rounded-2xl p-6 glass-card">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Legal entity</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Gennoor Tech Private Limited — registered in India. GST-compliant invoicing
                  for Indian clients. International invoicing supported (USD, EUR, SAR, AED).
                  Detailed entity documentation provided during MSA exchange.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Insurance</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Professional liability and errors-and-omissions insurance carried. Limits
                  available on request and adjustable by engagement size. Certificate of
                  insurance issued as part of MSA execution.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Delivery model</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Senior-only delivery. Active engagements capped per quarter to maintain
                  quality. For larger programs (E4 Transformation), the senior lead is paired
                  with mid-senior practitioners; the lead remains the accountable point of
                  contact end-to-end.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <div className="flex items-start gap-3">
              <ScrollText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Audit rights</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Reasonable client audit rights accepted as standard MSA terms. One client
                  audit per year on 30-days written notice; regulator-mandated audits
                  accommodated as required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. FAQ */}
      <Section
        id="faq"
        eyebrow="11 · Procurement &amp; Security FAQ"
        title="Direct answers to the questions you&rsquo;re about to ask."
      >
        <div className="space-y-3 max-w-4xl">
          {trustFaqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl p-5 glass-card transition-all duration-300"
            >
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                <h3 className="text-sm font-semibold text-gray-900">{faq.question}</h3>
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* 12. CONTACT */}
      <section id="contact" className="py-20 lg:py-24 relative overflow-hidden">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              12 · Contact
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
              For procurement, legal, security, or audit questions.
            </h2>
            <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-3xl">
              Send the questionnaire, contract, or specific question to the email below — we
              route it to the senior practitioner who handles security and procurement
              review. We respond within five working days for security questionnaires and
              within two working days for general contract questions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              <a
                href="mailto:contact@gennoor.com?subject=Security%20Questionnaire%20Request"
                className="group rounded-2xl p-6 glass-card glow-border transition-all duration-300 hover:-translate-y-1"
              >
                <Mail className="w-6 h-6 text-primary-500 mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Security questionnaire
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  CAIQ-style or your custom questionnaire — answered in 5–10 working days.
                </p>
                <span className="inline-flex items-center text-sm text-primary-600 font-semibold">
                  contact@gennoor.com
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <Link
                href="/contact"
                className="group rounded-2xl p-6 glass-card glow-border transition-all duration-300 hover:-translate-y-1"
              >
                <FileText className="w-6 h-6 text-primary-500 mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Scoping conversation
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Engagement scoping — typically followed by MSA / NDA exchange within a week.
                </p>
                <span className="inline-flex items-center text-sm text-primary-600 font-semibold">
                  Request a call
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Section wrapper — consistent across the page
// ────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 lg:py-20 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
            {eyebrow}
          </p>
          <h2
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {children}
        </div>
      </div>
    </section>
  )
}
